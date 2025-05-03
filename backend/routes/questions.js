// routes/questions.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Add a new question with options and concept links
router.post('/', async (req, res) => {
  const { chapter_id, question_text, image_url, options, concept_ids } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insert the question
    const questionResult = await client.query(
      'INSERT INTO questions (chapter_id, question_text, image_url) VALUES ($1, $2, $3) RETURNING id',
      [chapter_id, question_text, image_url]
    );
    const questionId = questionResult.rows[0].id;

    // Insert options
    for (const option of options) {
      await client.query(
        'INSERT INTO options (question_id, option_text, is_correct) VALUES ($1, $2, $3)',
        [questionId, option.option_text, option.is_correct]
      );
    }

    // Link question to concepts
    for (const conceptId of concept_ids) {
      await client.query(
        'INSERT INTO question_concepts (question_id, concept_id) VALUES ($1, $2)',
        [questionId, conceptId]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Question added successfully', question_id: questionId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Database error while adding question' });
  } finally {
    client.release();
  }
});

// Get questions by chapter ID
router.get('/', async (req, res) => {
  const chapterId = req.query.chapterId;
  if (!chapterId) {
    return res.status(400).json({ error: 'chapterId is required' });
  }
  try {
    const result = await pool.query(
      `SELECT
        q.id,
        q.question_text,
        q.image_url,
        array_agg(DISTINCT o.option_text) AS options,
        array_agg(DISTINCT o.is_correct) AS correct_flags,
        array_agg(DISTINCT qc.concept_id) AS concept_ids
      FROM questions q
      JOIN options o ON q.id = o.question_id
      LEFT JOIN question_concepts qc ON q.id = qc.question_id
      WHERE q.chapter_id = $1
      GROUP BY q.id;`,
      [chapterId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error while fetching questions' });
  }
});

module.exports = router;
