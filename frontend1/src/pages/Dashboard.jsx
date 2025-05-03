// Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const resumeAvailable = localStorage.getItem('studentHelp_quizProgress');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome, test 👋</h1>
        <p className="mb-6 text-gray-600">Choose what you'd like to do:</p>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/select-quiz')}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Start New Quiz
          </button>

          {resumeAvailable && (
            <button
              onClick={() => navigate('/quiz')}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Resume Previous Attempt
            </button>
          )}

          <button
            onClick={handleLogout}
            className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
