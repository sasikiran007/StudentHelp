// routes/quizResults.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/quiz/submit
router.post('/', async (req, res) => {
  const { user, started_at, submitted_at, answers } = req.body;

  if (!user || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Invalid quiz submission format' });
  }

  const total = answers.length;
  const score = answers.filter(a => a.is_correct).length;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const sessionResult = await client.query(
      `INSERT INTO quiz_sessions (user_id, started_at, submitted_at, score, total)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [user, started_at, submitted_at, score, total]
    );

    const sessionId = sessionResult.rows[0].id;

    for (const ans of answers) {
      await client.query(
        `INSERT INTO quiz_answers (session_id, question_id, selected_idx, is_correct, time_taken)
         VALUES ($1, $2, $3, $4, $5)`,
        [sessionId, ans.question_id, ans.selected_idx, ans.is_correct, ans.time_taken]
      );

      // Determine chapter ID for the question
      const chapterResult = await client.query(
        `SELECT chapter_id FROM questions WHERE id = $1 LIMIT 1`,
        [ans.question_id]
      );     


      const chapterId = chapterResult.rows[0].chapter_id;

      // Update or insert user_chapter_progress
      console.log(`Progress update: user=${user}, chapter=${chapterId}, question=${ans.question_id}`);
      try {
          await client.query(
            `INSERT INTO user_chapter_progress
            (user_id, chapter_id, question_id, is_correct, attempt_count, avg_time_taken, last_attempt_at)
            VALUES ($1, $2, $3, $4, 1, $5, NOW())
            ON CONFLICT (user_id, chapter_id, question_id)
            DO UPDATE SET
              is_correct = EXCLUDED.is_correct,
              attempt_count = user_chapter_progress.attempt_count + 1,
              avg_time_taken = (
                user_chapter_progress.avg_time_taken * user_chapter_progress.attempt_count + EXCLUDED.avg_time_taken
              ) / (user_chapter_progress.attempt_count + 1),
              last_attempt_at = NOW()`,
            [user, chapterId, ans.question_id, ans.is_correct, ans.time_taken]
          );
      } catch (err) {
          console.error('Failed to update user_chapter_progress:', err);
      }
      
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Quiz results saved successfully', sessionId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saving quiz results:', error);
    res.status(500).json({ error: 'Failed to save quiz results' });
  } finally {
    client.release();
  }
});

module.exports = router;
