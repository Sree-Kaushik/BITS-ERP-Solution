const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const query = `
      SELECT n.*, 
             CASE WHEN nr.notification_id IS NOT NULL THEN true ELSE false END as is_read
      FROM notifications n
      LEFT JOIN notification_reads nr ON n.notification_id = nr.notification_id AND nr.user_id = $1
      WHERE n.target_user_id = $1 OR n.target_role = $2 OR n.is_global = true
      ORDER BY n.created_at DESC
      LIMIT 50
    `;
    
    const result = await pool.query(query, [userId, req.user.role]);
    
    const unreadCount = await pool.query(`
      SELECT COUNT(*) as count
      FROM notifications n
      LEFT JOIN notification_reads nr ON n.notification_id = nr.notification_id AND nr.user_id = $1
      WHERE (n.target_user_id = $1 OR n.target_role = $2 OR n.is_global = true)
      AND nr.notification_id IS NULL
    `, [userId, req.user.role]);
    
    res.json({
      notifications: result.rows,
      unreadCount: parseInt(unreadCount.rows[0].count)
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark notification as read
router.put('/:notificationId/read', authenticateToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.user_id;
    
    await pool.query(`
      INSERT INTO notification_reads (notification_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT (notification_id, user_id) DO NOTHING
    `, [notificationId, userId]);
    
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark all notifications as read
router.put('/mark-all-read', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    await pool.query(`
      INSERT INTO notification_reads (notification_id, user_id)
      SELECT n.notification_id, $1
      FROM notifications n
      LEFT JOIN notification_reads nr ON n.notification_id = nr.notification_id AND nr.user_id = $1
      WHERE (n.target_user_id = $1 OR n.target_role = $2 OR n.is_global = true)
      AND nr.notification_id IS NULL
    `, [userId, req.user.role]);
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
