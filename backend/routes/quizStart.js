// routes/quizStart.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

router.post('/', async (req, res) => {
  const { user_id, chapter_id, count } = req.body;

  if (!user_id || !chapter_id || !count) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await pool.connect();

  try {
    // Fetch all questions for this chapter
    // const questionsRes1 = await client.query(
    //   `SELECT q.id, q.question_text, q.options, q.correct_flags
    //    FROM questions q
    //    JOIN concepts c ON q.concept_id = c.id
    //    JOIN chapters ch ON c.chapter_id = ch.id
    //    WHERE ch.id = $1`,
    //   [chapter_id]
    // );

    const questionsRes = await pool.query(
        `SELECT q.id,q.question_text,q.image_url,
          array_agg(DISTINCT o.option_text) AS options,
          array_agg(DISTINCT o.is_correct) AS correct_flags,
          array_agg(DISTINCT qc.concept_id) AS concept_ids
        FROM questions q
        JOIN options o ON q.id = o.question_id
        LEFT JOIN question_concepts qc ON q.id = qc.question_id
        WHERE q.chapter_id = $1
        GROUP BY q.id;`,
        [chapter_id]
      );

    const allQuestions = questionsRes.rows;
    const allQuestionIds = allQuestions.map(q => q.id);

    // Fetch user's progress for these questions
    const progressRes = await client.query(
      `SELECT question_id, is_correct
       FROM user_chapter_progress
       WHERE user_id = $1 AND chapter_id = $2`,
      [user_id, chapter_id]
    );

    const progressMap = {};
    for (const row of progressRes.rows) {
      progressMap[row.question_id] = row.is_correct;
    }

    // Categorize questions
    const newQuestions = [];
    const wrongQuestions = [];
    const correctQuestions = [];

    for (const q of allQuestions) {
      if (!(q.id in progressMap)) {
        newQuestions.push(q);
      } else if (progressMap[q.id] === false) {
        wrongQuestions.push(q);
      } else if (progressMap[q.id] === true) {
        correctQuestions.push(q);
      }
    }

    const desiredWrong = Math.floor(count * 0.3);
    const desiredCorrect = Math.floor(count * 0.1);

    const pick = (arr, n) => shuffleArray([...arr]).slice(0, n);

    const selectedWrong = pick(wrongQuestions, Math.min(desiredWrong, wrongQuestions.length));
    const selectedCorrect = pick(correctQuestions, Math.min(desiredCorrect, correctQuestions.length));

    const remaining = count - (selectedWrong.length + selectedCorrect.length);
    const selectedNew = pick(newQuestions, Math.min(remaining, newQuestions.length));

    const selectedQuestions = [...selectedNew, ...selectedWrong, ...selectedCorrect];

    const finalQuestions = shuffleArray(selectedQuestions);

    res.json({ questions: finalQuestions });

  } catch (error) {
    console.error('Error starting quiz:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
});

module.exports = router;
