const express = require('express');
const pool = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get all hostels
router.get('/', authenticateToken, async (req, res) => {
    try {
        const query = `
            SELECT h.*, 
                   COUNT(hr.room_id) as total_rooms_count,
                   COUNT(CASE WHEN hr.is_available = true THEN 1 END) as available_rooms
            FROM hostels h
            LEFT JOIN hostel_rooms hr ON h.hostel_id = hr.hostel_id
            GROUP BY h.hostel_id
            ORDER BY h.hostel_name
        `;
        
        const result = await pool.query(query);
        res.json({ hostels: result.rows });
    } catch (error) {
        console.error('Error fetching hostels:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get available rooms in a hostel
router.get('/:hostelId/rooms', authenticateToken, async (req, res) => {
    const { hostelId } = req.params;
    
    try {
        const query = `
            SELECT hr.*, h.hostel_name
            FROM hostel_rooms hr
            JOIN hostels h ON hr.hostel_id = h.hostel_id
            WHERE hr.hostel_id = $1 AND hr.is_available = true
            ORDER BY hr.room_number
        `;
        
        const result = await pool.query(query, [hostelId]);
        res.json({ rooms: result.rows });
    } catch (error) {
        console.error('Error fetching hostel rooms:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get student's hostel allocation
router.get('/allocation/:studentId', authenticateToken, async (req, res) => {
    const { studentId } = req.params;
    
    try {
        const query = `
            SELECT ha.*, hr.room_number, hr.room_type, hr.monthly_fee,
                   h.hostel_name, h.warden_name, h.contact_number
            FROM hostel_allocations ha
            JOIN hostel_rooms hr ON ha.room_id = hr.room_id
            JOIN hostels h ON hr.hostel_id = h.hostel_id
            WHERE ha.student_id = $1 AND ha.status = 'active'
        `;
        
        const result = await pool.query(query, [studentId]);
        res.json({ allocation: result.rows[0] || null });
    } catch (error) {
        console.error('Error fetching hostel allocation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Apply for hostel room
router.post('/apply', authenticateToken, async (req, res) => {
    const { student_id, room_id, academic_year } = req.body;
    
    try {
        await pool.query('BEGIN');
        
        // Check if room is available
        const roomCheck = await pool.query(
            'SELECT capacity, current_occupancy FROM hostel_rooms WHERE room_id = $1 AND is_available = true',
            [room_id]
        );
        
        if (roomCheck.rows.length === 0 || roomCheck.rows[0].current_occupancy >= roomCheck.rows[0].capacity) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ error: 'Room not available' });
        }
        
        // Check if student already has allocation for this year
        const existingAllocation = await pool.query(
            'SELECT allocation_id FROM hostel_allocations WHERE student_id = $1 AND academic_year = $2 AND status = $3',
            [student_id, academic_year, 'active']
        );
        
        if (existingAllocation.rows.length > 0) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ error: 'Student already has hostel allocation for this year' });
        }
        
        // Allocate room
        const allocationQuery = `
            INSERT INTO hostel_allocations (student_id, room_id, academic_year)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const allocationResult = await pool.query(allocationQuery, [student_id, room_id, academic_year]);
        
        // Update room occupancy
        await pool.query(
            'UPDATE hostel_rooms SET current_occupancy = current_occupancy + 1 WHERE room_id = $1',
            [room_id]
        );
        
        // Update room availability if full
        const updatedRoom = await pool.query(
            'SELECT capacity, current_occupancy FROM hostel_rooms WHERE room_id = $1',
            [room_id]
        );
        
        if (updatedRoom.rows[0].current_occupancy >= updatedRoom.rows[0].capacity) {
            await pool.query(
                'UPDATE hostel_rooms SET is_available = false WHERE room_id = $1',
                [room_id]
            );
        }
        
        await pool.query('COMMIT');
        
        res.status(201).json({
            message: 'Hostel room allocated successfully',
            allocation: allocationResult.rows[0]
        });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error allocating hostel room:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
