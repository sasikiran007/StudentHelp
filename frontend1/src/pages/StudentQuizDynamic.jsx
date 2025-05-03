// StudentQuizDynamic.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { getCurrentUser } from '../utils/auth';
import { clearQuizProgress } from '../utils/quizStorage';

const StudentQuizDynamic = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [questionTimings, setQuestionTimings] = useState({});
  const [lastTimestamp, setLastTimestamp] = useState(Date.now());
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showOnlyUnanswered, setShowOnlyUnanswered] = useState(false);

  const [searchParams] = useSearchParams();
  const chapterId = searchParams.get('chapterId');
  const navigate = useNavigate();

  useEffect(() => {
    const storedQuestions = localStorage.getItem('currentQuizQuestions');
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
      setStartTime(new Date().toISOString());
      setLoading(false);
    } else if (chapterId) {
      fetchQuestionsFromBackend();
    }
  }, [chapterId]);

  const fetchQuestionsFromBackend = async () => {
    try {
      const res = await axios.get(`http://10.201.217.99:3001/questions?chapterId=${chapterId}`);
      setQuestions(res.data);
      setStartTime(new Date().toISOString());
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const now = Date.now();
    if (questions.length > 0 && currentIndex in questions) {
      setQuestionTimings((prev) => ({
        ...prev,
        [currentIndex]: (prev[currentIndex] || 0) + Math.floor((now - lastTimestamp) / 1000),
      }));
    }
    setLastTimestamp(now);
  }, [currentIndex]);

  const handleSelect = (index) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: index }));
  };

  const handleMarkToggle = () => {
    setMarked((prev) => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      await submitQuizResults();
      setShowResult(true);
      clearQuizProgress();
      localStorage.removeItem('currentQuizQuestions');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const calculateScore = () => {
    return questions.reduce((score, q, i) => {
      const correctIndex = q.correct_flags.findIndex(flag => flag);
      return answers[i] === correctIndex ? score + 1 : score;
    }, 0);
  };

  const submitQuizResults = async () => {
    // const user = getCurrentUser();
    const user = 1;
    const submitted_at = new Date().toISOString();

    const payload = {
      user,
      started_at: startTime,
      submitted_at,
      answers: questions.map((q, i) => {
        const correctIndex = q.correct_flags.findIndex(f => f);
        return {
          question_id: q.id,
          selected_idx: answers[i],
          is_correct: answers[i] === correctIndex,
          time_taken: questionTimings[i] || 0,
        };
      }),
    };

    try {
      await axios.post('http://10.201.217.99:3001/api/quiz/submit', payload);
      setSubmissionMessage('✅ Quiz results successfully submitted!');
    } catch (error) {
      console.error('Failed to save quiz results:', error);
      setSubmissionMessage('❌ Failed to submit quiz results. Please try again later.');
    }
  };

  if (!questions.length) return <div className="p-6">Loading questions...</div>;

  if (showResult) {
    const score = calculateScore();
    return (
      <MathJaxContext config={{ tex: { inlineMath: [['\\(', '\\)']], displayMath: [['\\[', '\\]']] } }}>
        <div className="p-6 max-w-4xl mx-auto">
           {submissionMessage && (
          <div className={`mb-4 p-3 rounded text-center ${submissionMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {submissionMessage}
          </div>
        )}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
          <h2 className="text-2xl font-bold mb-4">📊 Quiz Result</h2>
          <p className="mb-4 text-lg">You scored <strong>{score}</strong> out of <strong>{questions.length}</strong>.</p>
          <div className="space-y-4">
            {questions.map((q, i) => {
              const correctIndex = q.correct_flags.findIndex(flag => flag);
              const isCorrect = answers[i] === correctIndex;
              return (
                <div key={i} className={`border rounded p-4 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="mb-2">
                    <strong>Q{i + 1}:</strong>{' '}
                    <MathJax><span dangerouslySetInnerHTML={{ __html: q.question_text }} /></MathJax>
                  </div>
                  <ul className="list-disc ml-6">
                    {q.options.map((opt, idx) => (
                      <li
                        key={idx}
                        className={`text-sm ${idx === correctIndex ? 'text-green-700 font-semibold' : idx === answers[i] ? 'text-red-600' : 'text-gray-800'}`}
                      >
                        <MathJax><span dangerouslySetInnerHTML={{ __html: opt }} /></MathJax>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm mt-2">Your Answer: <strong>{answers[i] !== undefined ? String.fromCharCode(65 + answers[i]) : 'Not answered'}</strong></p>
                </div>
              );
            })}
          </div>
        </div>
      </MathJaxContext>
    );
  }

  const filteredIndexes = showOnlyUnanswered
? questions.map((_, idx) => idx).filter(idx => answers[idx] === undefined)
: questions.map((_, idx) => idx);

const currentFilteredIndex = filteredIndexes.indexOf(currentIndex);
const nextUnansweredIndex = filteredIndexes[currentFilteredIndex + 1];
const prevUnansweredIndex = filteredIndexes[currentFilteredIndex - 1];

const question = questions[currentIndex];
const hasImage = question.image_url && !question.question_text.includes('<img');
const selectedAnswer = answers[currentIndex];


  return (
    <MathJaxContext config={{
      tex: { inlineMath: [['\$', '\$']], displayMath: [['\\[', '\\]']] },
      startup: { typeset: false },
    }}>
    <div className="min-h-screen bg-slate-50">
    <main className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200 p-3">
          <div className="flex items-center justify-between">
              <span className="font-medium text-lg">Question {currentIndex + 1} of {questions.length}</span>
            <button
              onClick={() => setShowOnlyUnanswered(!showOnlyUnanswered)}
              className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
            >
              {showOnlyUnanswered ? 'Show All' : 'Show Only Unanswered'}
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-full text-sm font-semibold border flex items-center justify-center
                  ${idx === currentIndex ? 'bg-blue-600 text-white border-blue-600'
                    : marked[idx] ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                    : answers[idx] !== undefined ? 'bg-green-100 text-green-700 border-green-300'
                    : 'bg-gray-100 text-gray-500 border-gray-300'}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className={`flex flex-col ${hasImage ? 'md:flex-row' : ''}`}>
          {hasImage && (
            <div className="w-full md:w-1/2 p-4 md:border-r border-gray-200">
              <div className="flex justify-center">
                <img
                  src={`http://10.201.217.99:3001${question.image_url}`}
                  alt="Question"
                  className="max-w-full h-auto"
                />
              </div>
            </div>
          )}

          <div className={`w-full ${hasImage ? 'md:w-1/2' : ''} p-6`}>
            <MathJax>
              <div
                className="text-gray-800 mb-8 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: question.question_text }}
              />
            </MathJax>

            <div className="space-y-4">
              {question.options.map((opt, i) => {
                const isSelected = selectedAnswer === i;
                const isCorrect = question.correct_flags[i];
                const isAnswered = selectedAnswer !== undefined;

                return (
                  <div
                    key={i}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer
                      ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    onClick={() => handleSelect(i)}
                  >
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3
                      ${isSelected ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-400'}`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <MathJax>
                      <div dangerouslySetInnerHTML={{ __html: opt }} className="text-gray-700" />
                    </MathJax>
                  </div>
                );
              })}

              <button
                onClick={handleMarkToggle}
                className="mt-4 px-3 py-1 text-sm border rounded text-yellow-600 border-yellow-300 hover:bg-yellow-50"
              >
                {marked[currentIndex] ? 'Unmark Review' : 'Mark for Review'}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-3 flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="border border-blue-500 text-blue-500 px-4 py-1 rounded text-sm disabled:opacity-50"
          >
            ← Back
          </button>
          <span className="text-sm text-gray-600 self-center">Select one answer choice.</span>
          <button
            onClick={handleNext}
            className="bg-blue-500 text-white px-4 py-1 rounded text-sm"
          >
            {currentIndex === questions.length - 1 ? 'Finish' : 'Next →'}
          </button>
        </div>
      </div>
    </main>
    </div>
          
    </MathJaxContext>
  );
};

export default StudentQuizDynamic;

