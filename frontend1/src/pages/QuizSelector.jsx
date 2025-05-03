// src/pages/QuizSelector.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';

const QuizSelector = () => {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [questionCount, setQuestionCount] = useState(10);

  const CLASS_ID = 1; // Assume Class 11 for test user

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch(`http://10.201.217.99:3001/api/subjects?classId=${CLASS_ID}`);
        const data = await res.json();
        setSubjects(data);
      } catch (error) {
        console.error('Failed to fetch subjects', error);
      }
    };
    fetchSubjects();
  }, []);

  const handleSubjectChange = async (e) => {
    const subjectId = e.target.value;
    setSelectedSubject(subjectId);
    setSelectedChapter('');

    try {
      const res = await fetch(`http://10.201.217.99:3001/api/chapters?subjectId=${subjectId}`);
      const data = await res.json();
      setChapters(data);
    } catch (error) {
      console.error('Failed to fetch chapters', error);
    }
  };

  const handleStartQuiz = async () => {
    if (!selectedChapter || !questionCount) return;

    try {
      // const userId = getCurrentUser();
      const userId = 1;

      const res = await fetch('http://10.201.217.99:3001/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          chapter_id: selectedChapter,
          count: questionCount
        })
      });

      const data = await res.json();

      if (data.questions && data.questions.length > 0) {
        localStorage.setItem('currentQuizQuestions', JSON.stringify(data.questions));
        navigate(`/quiz?chapterId=${selectedChapter}`);
      } else {
        alert('No questions available for this selection.');
      }
    } catch (error) {
      console.error('Failed to start quiz', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-md rounded p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Start Your Quiz</h1>

        <div className="space-y-4">
          {/* Subject Dropdown */}
          <select
            value={selectedSubject}
            onChange={handleSubjectChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>

          {/* Chapter Dropdown */}
          {chapters.length > 0 && (
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Chapter</option>
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>{chapter.title}</option>
              ))}
            </select>
          )}

          {/* Number of Questions Input */}
          {selectedChapter && (
            <input
              type="number"
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              className="w-full p-2 border rounded"
              min={5}
              max={100}
              placeholder="Enter number of questions"
            />
          )}

          {/* Start Quiz Button */}
          <button
            onClick={handleStartQuiz}
            disabled={!selectedChapter || !questionCount}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded disabled:opacity-50"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizSelector;
