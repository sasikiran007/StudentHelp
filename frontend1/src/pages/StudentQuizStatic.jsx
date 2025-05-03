// StudentQuizStatic.jsx
import React, { useState } from 'react';

const questionData = {
  questionNumber: 6,
  totalQuestions: 12,
  timer: '19:44',
  question: 'How many hours passed between the time when Sea Surface 1 was fully covered by algae and the time when Sea Surface 2 was fully covered?',
  choices: [
    { id: 'A', text: 'between 2 and 3 hours' },
    { id: 'B', text: 'between 3 and 4 hours' },
    { id: 'C', text: 'between 4 and 5 hours' },
    { id: 'D', text: 'between 5 and 6 hours' },
    { id: 'E', text: 'between 6 and 7 hours' },
  ],
  chartImagePath: '/graph.svg'
};

function StudentQuizStatic() {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-200 px-4 py-2 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-blue-500 font-semibold text-xl">evertutor</div>
          <div className="flex items-center space-x-2">
            <NavItem icon="📚" text="Vocab Path" />
            <NavItem icon="📝" text="Review a GRE Question" active />
            <NavItem icon="📋" text="Practice" />
            <NavItem icon="📊" text="Mock Tests" />
            <NavItem icon="💡" text="UniSuggest" />
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-purple-900 text-white px-3 py-1 rounded text-sm font-medium">
              <span className="flex items-center">Upgrade</span>
            </button>
            <div className="flex items-center space-x-1">
              <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center text-sm">
                <span className="text-purple-700">KS</span>
              </div>
              <span className="text-sm text-gray-700">kilari.sasi@gmail.com</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button className="text-gray-600 flex items-center">←</button>
              <span className="font-medium">Quantitative Reasoning</span>
              <span className="text-gray-500 text-sm">Questions {questionData.questionNumber}/{questionData.totalQuestions}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 p-1 px-2 rounded-md text-blue-800 flex items-center text-sm">
                <span className="mr-1">⏱️</span>
                {questionData.timer}
              </div>
              <button className="text-gray-600 hover:bg-gray-100 p-1 rounded text-sm">Hide Timer</button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-4 md:border-r border-gray-200">
              <div className="flex justify-center">
                <img src={questionData.chartImagePath} alt="Graph" className="max-w-full h-auto" />
              </div>
            </div>

            <div className="w-full md:w-1/2 p-6">
              <p className="text-gray-800 mb-8">{questionData.question}</p>
              <div className="space-y-4">
                {questionData.choices.map((choice) => (
                  <div
                    key={choice.id}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                      selectedAnswer === choice.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedAnswer(choice.id)}
                  >
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                      selectedAnswer === choice.id ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-400'
                    }`}>
                      {choice.id}
                    </div>
                    <div className="text-gray-700">{choice.text}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center text-gray-600 text-sm">Select one answer choice.</div>
            </div>
          </div>

          <div className="border-t border-gray-200 p-3 flex justify-between">
            <div className="flex space-x-2">
              <ControlButton icon="ⓘ" text="Help" />
              <ControlButton icon="🧮" text="Calculator" />
            </div>
            <div className="flex space-x-2">
              <ControlButton text="Mark" />
              <ControlButton icon="🔍" text="Review" />
              <ControlButton icon="←" text="Back" />
              <button className="bg-blue-500 text-white px-4 py-1 rounded flex items-center text-sm font-medium">
                Next <span className="ml-1">→</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, text, active }) {
  return (
    <div className={`flex items-center px-3 py-1 rounded-md cursor-pointer ${active ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>
      <span className="mr-1">{icon}</span>
      <span className="text-sm">{text}</span>
    </div>
  );
}

function ControlButton({ icon, text }) {
  return (
    <button className="border border-blue-500 text-blue-500 px-3 py-1 rounded flex items-center hover:bg-blue-50 text-sm">
      {icon && <span className="mr-1">{icon}</span>}
      {text}
    </button>
  );
}

export default StudentQuizStatic;
