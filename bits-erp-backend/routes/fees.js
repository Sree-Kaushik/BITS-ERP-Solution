const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get fee structure for student
router.get('/structure', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.student_id || '2021A7PS001P'; // Mock for demo
    
    const query = `
      SELECT fs.*, 
             COALESCE(SUM(fp.amount_paid), 0) as paid_amount,
             CASE 
               WHEN COALESCE(SUM(fp.amount_paid), 0) >= fs.total_fee THEN 'paid'
               WHEN COALESCE(SUM(fp.amount_paid), 0) > 0 THEN 'partial'
               ELSE 'pending'
             END as status
      FROM fee_structure fs
      LEFT JOIN fee_payments fp ON fs.fee_id = fp.fee_id
      WHERE fs.campus = (SELECT campus FROM students WHERE student_id = $1)
      AND fs.branch = (SELECT branch FROM students WHERE student_id = $1)
      GROUP BY fs.fee_id
      ORDER BY fs.academic_year DESC, fs.semester DESC
    `;
    
    const result = await pool.query(query, [studentId]);
    res.json({ feeStructure: result.rows });
  } catch (error) {
    console.error('Error fetching fee structure:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get payment history
router.get('/payments', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.student_id || '2021A7PS001P'; // Mock for demo
    
    const query = `
      SELECT fp.*, fs.semester, fs.academic_year
      FROM fee_payments fp
      JOIN fee_structure fs ON fp.fee_id = fs.fee_id
      WHERE fp.student_id = $1
      ORDER BY fp.payment_date DESC
    `;
    
    const result = await pool.query(query, [studentId]);
    res.json({ payments: result.rows });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Process payment
router.post('/pay', authenticateToken, async (req, res) => {
  try {
    const { fee_id, amount, payment_method } = req.body;
    const studentId = req.user.student_id || '2021A7PS001P'; // Mock for demo
    
    await pool.query('BEGIN');
    
    // Generate transaction ID and receipt number
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const receiptNumber = `RCP${Date.now()}`;
    
    // Insert payment record
    const paymentQuery = `
      INSERT INTO fee_payments 
      (student_id, fee_id, amount_paid, payment_method, transaction_id, receipt_number, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'completed')
      RETURNING *
    `;
    
    const paymentResult = await pool.query(paymentQuery, [
      studentId, fee_id, amount, payment_method, transactionId, receiptNumber
    ]);
    
    await pool.query('COMMIT');
    
    res.status(201).json({
      message: 'Payment processed successfully',
      payment: paymentResult.rows[0]
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

module.exports = router;
