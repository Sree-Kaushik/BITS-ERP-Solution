const express = require('express');
const pool = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Search books
router.get('/books/search', authenticateToken, async (req, res) => {
    const { query, category, author } = req.query;
    
    try {
        let searchQuery = `
            SELECT lb.*, 
                   (lb.total_copies - lb.available_copies) as issued_copies
            FROM library_books lb 
            WHERE 1=1
        `;
        const params = [];
        
        if (query) {
            searchQuery += ` AND (LOWER(lb.title) LIKE LOWER($${params.length + 1}) 
                            OR LOWER(lb.author) LIKE LOWER($${params.length + 1})
                            OR lb.isbn LIKE $${params.length + 1})`;
            params.push(`%${query}%`);
        }
        
        if (category) {
            searchQuery += ` AND LOWER(lb.category) = LOWER($${params.length + 1})`;
            params.push(category);
        }
        
        if (author) {
            searchQuery += ` AND LOWER(lb.author) LIKE LOWER($${params.length + 1})`;
            params.push(`%${author}%`);
        }
        
        searchQuery += ` ORDER BY lb.title`;
        
        const result = await pool.query(searchQuery, params);
        res.json({ books: result.rows });
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get student's library transactions
router.get('/transactions/:studentId', authenticateToken, async (req, res) => {
    const { studentId } = req.params;
    
    try {
        const query = `
            SELECT lt.*, lb.title, lb.author, lb.isbn
            FROM library_transactions lt
            JOIN library_books lb ON lt.book_id = lb.book_id
            WHERE lt.student_id = $1
            ORDER BY lt.issue_date DESC
        `;
        
        const result = await pool.query(query, [studentId]);
        res.json({ transactions: result.rows });
    } catch (error) {
        console.error('Error fetching library transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Issue book to student
router.post('/issue', authenticateToken, authorizeRoles('admin', 'faculty'), async (req, res) => {
    const { student_id, book_id, due_date } = req.body;
    
    try {
        await pool.query('BEGIN');
        
        // Check if book is available
        const bookCheck = await pool.query(
            'SELECT available_copies FROM library_books WHERE book_id = $1',
            [book_id]
        );
        
        if (bookCheck.rows.length === 0 || bookCheck.rows[0].available_copies <= 0) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ error: 'Book not available' });
        }
        
        // Issue book
        const issueQuery = `
            INSERT INTO library_transactions (student_id, book_id, due_date)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const issueResult = await pool.query(issueQuery, [student_id, book_id, due_date]);
        
        // Update available copies
        await pool.query(
            'UPDATE library_books SET available_copies = available_copies - 1 WHERE book_id = $1',
            [book_id]
        );
        
        await pool.query('COMMIT');
        
        res.status(201).json({
            message: 'Book issued successfully',
            transaction: issueResult.rows[0]
        });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error issuing book:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Return book
router.put('/return/:transactionId', authenticateToken, async (req, res) => {
    const { transactionId } = req.params;
    
    try {
        await pool.query('BEGIN');
        
        // Get transaction details
        const transactionQuery = `
            SELECT lt.*, lb.book_id
            FROM library_transactions lt
            JOIN library_books lb ON lt.book_id = lb.book_id
            WHERE lt.transaction_id = $1 AND lt.status = 'issued'
        `;
        const transactionResult = await pool.query(transactionQuery, [transactionId]);
        
        if (transactionResult.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ error: 'Transaction not found or book already returned' });
        }
        
        const transaction = transactionResult.rows[0];
        const returnDate = new Date();
        const dueDate = new Date(transaction.due_date);
        
        // Calculate fine if overdue
        let fineAmount = 0;
        if (returnDate > dueDate) {
            const overdueDays = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
            fineAmount = overdueDays * 5; // ₹5 per day fine
        }
        
        // Update transaction
        await pool.query(
            `UPDATE library_transactions 
             SET return_date = $1, status = 'returned', fine_amount = $2
             WHERE transaction_id = $3`,
            [returnDate, fineAmount, transactionId]
        );
        
        // Update available copies
        await pool.query(
            'UPDATE library_books SET available_copies = available_copies + 1 WHERE book_id = $1',
            [transaction.book_id]
        );
        
        await pool.query('COMMIT');
        
        res.json({
            message: 'Book returned successfully',
            fine_amount: fineAmount
        });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error returning book:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
