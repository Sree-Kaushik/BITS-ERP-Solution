const express = require('express');
const pool = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get academic calendar
router.get('/calendar', authenticateToken, async (req, res) => {
    try {
        const { year, semester } = req.query;
        let query = `
            SELECT * FROM academic_calendar 
            WHERE is_active = true
        `;
        const params = [];
        
        if (year) {
            query += ` AND academic_year = $${params.length + 1}`;
            params.push(year);
        }
        
        if (semester) {
            query += ` AND semester_type = $${params.length + 1}`;
            params.push(semester);
        }
        
        query += ` ORDER BY start_date ASC`;
        
        const result = await pool.query(query, params);
        
        // If no data, return sample data
        if (result.rows.length === 0) {
            const sampleEvents = [
                {
                    calendar_id: '1',
                    event_name: 'Monsoon Semester Registration',
                    event_type: 'registration',
                    start_date: '2025-07-15',
                    end_date: '2025-07-25',
                    academic_year: 2025,
                    semester_type: 'monsoon',
                    description: 'Course registration for Monsoon 2025'
                },
                {
                    calendar_id: '2',
                    event_name: 'Mid Semester Exams',
                    event_type: 'exam',
                    start_date: '2025-09-20',
                    end_date: '2025-09-30',
                    academic_year: 2025,
                    semester_type: 'monsoon',
                    description: 'Mid semester examinations'
                }
            ];
            return res.json({ calendar: sampleEvents });
        }
        
        res.json({ calendar: result.rows });
    } catch (error) {
        console.error('Error fetching academic calendar:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get timetable for student
router.get('/timetable/:studentId', authenticateToken, async (req, res) => {
    const { studentId } = req.params;
    const { semester_year = 2025, semester_type = 'monsoon' } = req.query;
    
    try {
        // Return sample timetable data
        const sampleTimetable = [
            {
                day_name: 'Monday',
                start_time: '09:00:00',
                end_time: '10:30:00',
                course_code: 'CS F212',
                course_name: 'Database Systems',
                first_name: 'Dr. Rajesh',
                last_name: 'Kumar',
                room_number: 'F101',
                class_type: 'lecture'
            },
            {
                day_name: 'Tuesday',
                start_time: '10:30:00',
                end_time: '12:00:00',
                course_code: 'CS F211',
                course_name: 'Data Structures',
                first_name: 'Prof. Priya',
                last_name: 'Sharma',
                room_number: 'F102',
                class_type: 'lecture'
            },
            {
                day_name: 'Wednesday',
                start_time: '14:00:00',
                end_time: '17:00:00',
                course_code: 'CS F212',
                course_name: 'Database Systems Lab',
                first_name: 'Dr. Rajesh',
                last_name: 'Kumar',
                room_number: 'Lab-1',
                class_type: 'lab'
            }
        ];
        
        res.json({ timetable: sampleTimetable });
    } catch (error) {
        console.error('Error fetching timetable:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
