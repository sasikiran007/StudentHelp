// QuizQuestion.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const QuizQuestion = ({ chapterId = 1 }) => {
  const [questionData, setQuestionData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`http://10.201.217.99:3001/questions?chapterId=${chapterId}`);
        if (res.data.length > 0) {
          const q = res.data[0];
          const choices = q.options.map((text, index) => ({
            id: String.fromCharCode(65 + index),
            text
          }));
          setQuestionData({
            question: q.question_text,
            choices,
            chartImagePath: q.image_url || null
          });
        }
      } catch (err) {
        console.error('Failed to load question:', err);
      }
    };
    fetchQuestion();
  }, [chapterId]);

  if (!questionData) return <div className="p-6">Loading question...</div>;

  const { question, choices, chartImagePath } = questionData;

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Question Content */}
      <div className="flex flex-col md:flex-row">
        {/* Optional Chart Image */}
        {chartImagePath && (
          <div className="w-full md:w-1/2 p-4 md:border-r border-gray-200">
            <div className="flex justify-center">
              <img
                src={chartImagePath}
                alt="Question Illustration"
                className="max-w-full h-auto"
              />
            </div>
          </div>
        )}

        {/* Question and choices */}
        <div className="w-full md:w-1/2 p-6">
          <p className="text-gray-800 mb-8">{question}</p>

          <div className="space-y-4">
            {choices.map((choice) => (
              <div
                key={choice.id}
                className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                  selectedAnswer === choice.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedAnswer(choice.id)}
              >
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                    selectedAnswer === choice.id
                      ? 'border-blue-500 text-blue-500'
                      : 'border-gray-300 text-gray-400'
                  }`}
                >
                  {choice.id}
                </div>
                <div className="text-gray-700">{choice.text}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-gray-600 text-sm">
            Select one answer choice.
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;
