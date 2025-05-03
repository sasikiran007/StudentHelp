const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const chapterRoutes = require('./routes/chapters');
const conceptRoutes = require('./routes/concepts');
const questionRoutes = require('./routes/questions');
const uploadRoutes = require('./routes/upload');
const bulkUploadRoutes = require('./routes/questions/bulk');
const quizResults = require('./routes/quizResults');
const classRoutes = require('./routes/classes')
const subjectRoutes = require('./routes/subjects')
const quizStartRoutes = require('./routes/quizStart')
const quizResultRoutes = require('./routes/quizResults')


const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/chapters', chapterRoutes);
app.use('/concepts', conceptRoutes);
app.use('/questions', questionRoutes);
app.use('/upload', uploadRoutes);
app.use('/uploads', express.static('uploads')); // to serve uploaded files
app.use('/questions', bulkUploadRoutes);
app.use('/api/quiz', quizResults);
app.use('/api/classess',classRoutes)
app.use('/api/subjects',subjectRoutes)
app.use('/api/chapters', chapterRoutes);
app.use('/api/concepts', conceptRoutes);
app.use('/api/quiz/start', quizStartRoutes);
app.use('/api/quiz/submit', quizResultRoutes);



// Health check
app.get('/', (req, res) => {
  res.send('Student Help API is running!');
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});

