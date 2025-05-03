// routes/questions/bulk.js
const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const unzipper = require('unzipper');
const fs = require('fs');
const path = require('path');
const pool = require('../../db');
const { Readable } = require('stream');

const router = express.Router();

// Multer setup for CSV + ZIP
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint: POST /questions/bulk
router.post('/bulk', upload.fields([{ name: 'csv' }, { name: 'images' }]), async (req, res) => {
  if (!req.files['csv']) return res.status(400).json({ error: 'CSV file required' });

  const csvBuffer = req.files['csv'][0].buffer;
  const imageMap = {};
  const errors = [];
  const successes = [];

  // Unzip and save images (if provided)
  if (req.files['images']) {
    const zipStream = req.files['images'][0].buffer;
    const extractPath = path.join(__dirname, '../../uploads');

    await new Promise((resolve, reject) => {
      const zip = unzipper.Parse();
      zip.on('entry', (entry) => {
        const fileName = entry.path;
        const dest = path.join(extractPath, fileName);
        entry.pipe(fs.createWriteStream(dest));
        imageMap[fileName] = `/uploads/${fileName}`;
      });
      zip.on('close', resolve);
      zip.on('error', reject);
      zip.end(zipStream);
    });
  }

  const stream = Readable.from(csvBuffer);
  const rows = [];

  stream
    .pipe(csvParser())
    .on('data', (data) => rows.push(data))
    .on('end', async () => {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        let question_text = row['Question'] || '';
        const a = row['Option A'] || '', b = row['Option B'] || '', c = row['Option C'] || '', d = row['Option D'] || '';
        const correct = row['Correct Option'];
        const conceptStr = row['Concept IDs'];
        const imageFile = row['Image Filename'];

        const correctIndex = ['A', 'B', 'C', 'D'].indexOf(correct.trim().toUpperCase());
        if (correctIndex === -1) {
          errors.push({ question: question_text, reason: 'Invalid correct option letter' });
          continue;
        }

        const concept_ids = conceptStr
          .split(',')
          .map(id => parseInt(id.trim()))
          .filter(id => !isNaN(id));
        if (!concept_ids.length) {
          errors.push({ question: question_text, reason: 'Invalid or missing concept IDs' });
          continue;
        }

        const image_url = imageFile ? imageMap[imageFile.trim()] || null : null;

        // Replace {{IMAGE}} in question text with actual image HTML if found
        if (question_text.includes('{{IMAGE}}') && image_url) {
          question_text = question_text.replace('{{IMAGE}}', `<img src='http://10.201.217.99:3001${image_url}' style='max-height: 150px; display: block; margin-top: 10px;' />`);
	 // question_text = question_text.replace('{{IMAGE}}', `<img src='${image_url}' />`);

        }

        try {
          const conceptCheck = await pool.query(
            'SELECT id FROM concepts WHERE id = ANY($1)',
            [concept_ids]
          );
          const existingIds = conceptCheck.rows.map(row => row.id);
          const missing = concept_ids.filter(id => !existingIds.includes(id));
          if (missing.length) {
            errors.push({ question: question_text, reason: `Concept ID(s) not found: ${missing.join(', ')}` });
            continue;
          }
        } catch (checkErr) {
          errors.push({ question: question_text, reason: 'Concept validation query failed' });
          continue;
        }

        try {
          const client = await pool.connect();
          await client.query('BEGIN');

          const qres = await client.query(
            'INSERT INTO questions (chapter_id, question_text, image_url) VALUES ($1, $2, $3) RETURNING id',
            [1, question_text, image_url]
          );
          const qid = qres.rows[0].id;

          const options = [a, b, c, d];
          for (let j = 0; j < options.length; j++) {
            await client.query(
              'INSERT INTO options (question_id, option_text, is_correct) VALUES ($1, $2, $3)',
              [qid, options[j], j === correctIndex]
            );
          }

          for (let cid of concept_ids) {
            await client.query(
              'INSERT INTO question_concepts (question_id, concept_id) VALUES ($1, $2)',
              [qid, cid]
            );
          }

          await client.query('COMMIT');
          client.release();
          successes.push(question_text);
        } catch (err) {
          errors.push({ question: question_text, reason: 'Database error' });
          console.error('Error inserting question:', err);
        }
      }

      res.status(200).json({
        message: `${successes.length} questions uploaded successfully`,
        errors,
        total: rows.length,
        successCount: successes.length,
        errorCount: errors.length
      });
    });
});

module.exports = router;

