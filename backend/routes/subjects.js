// routes/subjects.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Add a new subject
router.post('/', async (req, res) => {
  const { class_id, name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO subjects (class_id, name) VALUES ($1, $2) RETURNING *',
      [class_id, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error while adding subject' });
  }
});

// Get subjects by class ID
router.get('/', async (req, res) => {
  const classId = req.query.classId;
  if (!classId) {
    return res.status(400).json({ error: 'classId is required' });
  }
  try {
    const result = await pool.query(
      'SELECT * FROM subjects WHERE class_id = $1',
      [classId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error while fetching subjects' });
  }
});

module.exports = router;

