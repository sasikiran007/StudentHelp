// routes/chapters.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Add a new chapter
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO chapters (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error while adding chapter' });
  }
});

// Get all chapters
router.get('/', async (req, res) => {
  const subjectId = req.query.subjectId
  if(!subjectId){
    return res.status(400).json({ error: 'subjectId is required' });
  }
  try {
    const result = await pool.query('SELECT * FROM chapters WHERE subject_id = $1',
      [subjectId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error while fetching chapters' });
  }
});

module.exports = router;
