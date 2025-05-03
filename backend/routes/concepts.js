// routes/concepts.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Add a new concept
router.post('/', async (req, res) => {
  const { chapter_id, title, content, image_url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO concepts (chapter_id, title, content, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [chapter_id, title, content, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error while adding concept' });
  }
});

// Get concepts by chapter ID
router.get('/', async (req, res) => {
  const chapterId = req.query.chapterId;
  if (!chapterId) {
    return res.status(400).json({ error: 'chapterId is required' });
  }
  try {
    const result = await pool.query(
      'SELECT * FROM concepts WHERE chapter_id = $1',
      [chapterId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error while fetching concepts' });
  }
});

module.exports = router;

