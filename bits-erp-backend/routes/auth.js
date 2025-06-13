const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(1).max(50).required(),
  lastName: Joi.string().min(1).max(50).required(),
  role: Joi.string().valid('student', 'faculty', 'staff', 'admin').default('student'),
  studentId: Joi.string().when('role', { is: 'student', then: Joi.required() }),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
  campus: Joi.string().when('role', { is: 'student', then: Joi.required() }),
  branch: Joi.string().when('role', { is: 'student', then: Joi.required() }),
  batchYear: Joi.number().integer().min(2000).max(2030)
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

// Enhanced register endpoint
router.post('/register', async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      username, email, password, firstName, lastName, role,
      studentId, phone, campus, branch, batchYear
    } = value;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT user_id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Check if student ID already exists (for students)
    if (role === 'student' && studentId) {
      const existingStudent = await pool.query(
        'SELECT student_id FROM students WHERE student_id = $1',
        [studentId]
      );
      if (existingStudent.rows.length > 0) {
        return res.status(400).json({ error: 'Student ID already exists' });
      }
    }

    await pool.query('BEGIN');

    try {
      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Insert new user
      const newUser = await pool.query(
        'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING user_id, username, email, role',
        [username, email, passwordHash, role]
      );

      const userId = newUser.rows[0].user_id;

      // Insert role-specific data
      if (role === 'student') {
        await pool.query(
          `INSERT INTO students (student_id, user_id, first_name, last_name, phone, campus, branch, batch_year)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [studentId, userId, firstName, lastName, phone, campus, branch, batchYear]
        );
      } else if (role === 'faculty') {
        await pool.query(
          `INSERT INTO faculty (faculty_id, user_id, first_name, last_name, phone, department)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [`FAC${Date.now()}`, userId, firstName, lastName, phone, branch || 'General']
        );
      }

      await pool.query('COMMIT');

      res.status(201).json({
        message: 'User registered successfully',
        user: newUser.rows[0]
      });
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Enhanced login endpoint
router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { username, password } = value;

    // Find user (allow login with username or email)
    const userQuery = await pool.query(
      'SELECT user_id, username, email, password_hash, role, is_active FROM users WHERE username = $1 OR email = $1',
      [username]
    );

    if (userQuery.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userQuery.rows[0];

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is inactive. Please contact administrator.' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token with extended payload
    const tokenPayload = {
      userId: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Update last login
    await pool.query(
      'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE user_id = $1',
      [user.user_id]
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile with additional details
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userQuery = await pool.query(
      'SELECT user_id, username, email, role, created_at, updated_at FROM users WHERE user_id = $1',
      [req.user.user_id]
    );

    const user = userQuery.rows[0];
    let additionalData = {};

    // Get role-specific data
    if (user.role === 'student') {
      const studentQuery = await pool.query(
        'SELECT * FROM students WHERE user_id = $1',
        [user.user_id]
      );
      additionalData = studentQuery.rows[0] || {};
    } else if (user.role === 'faculty') {
      const facultyQuery = await pool.query(
        'SELECT * FROM faculty WHERE user_id = $1',
        [user.user_id]
      );
      additionalData = facultyQuery.rows[0] || {};
    }

    res.json({
      user: {
        ...user,
        ...additionalData
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;
    const userId = req.user.user_id;

    await pool.query('BEGIN');

    // Update user table
    await pool.query(
      'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE user_id = $1',
      [userId]
    );

    // Update role-specific table
    if (req.user.role === 'student') {
      await pool.query(
        'UPDATE students SET first_name = $1, last_name = $2, phone = $3, address = $4 WHERE user_id = $5',
        [firstName, lastName, phone, address, userId]
      );
    } else if (req.user.role === 'faculty') {
      await pool.query(
        'UPDATE faculty SET first_name = $1, last_name = $2, phone = $3 WHERE user_id = $4',
        [firstName, lastName, phone, userId]
      );
    }

    await pool.query('COMMIT');

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.user_id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    // Get current password hash
    const userQuery = await pool.query(
      'SELECT password_hash FROM users WHERE user_id = $1',
      [userId]
    );

    const user = userQuery.rows[0];
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
      [newPasswordHash, userId]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout (optional - mainly for logging purposes)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // You could log the logout event here
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
