const express = require('express');
const pool = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get all examinations
router.get('/', authenticateToken, async (req, res) => {
    try {
        const query = `
            SELECT * FROM examinations 
            WHERE is_active = true 
            ORDER BY academic_year DESC, start_date DESC
        `;
        const result = await pool.query(query);
        res.json({ examinations: result.rows });
    } catch (error) {
        console.error('Error fetching examinations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new examination
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const {
        exam_name, exam_type, semester_type, academic_year,
        start_date, end_date, registration_start, registration_end, exam_fee
    } = req.body;
    
    try {
        const query = `
            INSERT INTO examinations 
            (exam_name, exam_type, semester_type, academic_year, start_date, end_date, registration_start, registration_end, exam_fee)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        const values = [exam_name, exam_type, semester_type, academic_year, start_date, end_date, registration_start, registration_end, exam_fee];
        const result = await pool.query(query, values);
        
        res.status(201).json({
            message: 'Examination created successfully',
            examination: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating examination:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Register student for examination
router.post('/:examId/register', authenticateToken, async (req, res) => {
    const { examId } = req.params;
    const { student_id, course_id, exam_type } = req.body;
    
    try {
        // Use the stored procedure
        await pool.query(
            'CALL register_student_for_exam($1, $2, $3, $4)',
            [student_id, examId, course_id, exam_type]
        );
        
        res.json({ message: 'Student registered for examination successfully' });
    } catch (error) {
        console.error('Error registering for examination:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

// Get exam registrations for a student
router.get('/registrations/:studentId', authenticateToken, async (req, res) => {
    const { studentId } = req.params;
    
    try {
        const query = `
            SELECT er.*, e.exam_name, e.start_date, e.end_date, c.course_name, c.course_code
            FROM exam_registrations er
            JOIN examinations e ON er.exam_id = e.exam_id
            JOIN courses c ON er.course_id = c.course_id
            WHERE er.student_id = $1
            ORDER BY e.start_date DESC
        `;
        const result = await pool.query(query, [studentId]);
        
        res.json({ registrations: result.rows });
    } catch (error) {
        console.error('Error fetching exam registrations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
