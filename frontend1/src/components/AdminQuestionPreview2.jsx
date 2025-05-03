// AdminQuestionPreview.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

const renderLatex = (latexString) => {
  const unescaped = latexString.replace(/\\\\/g, '\\');
  const isLatex = /\\(frac|sum|sqrt|int|overrightarrow|left|right|begin|end|vec|cdot|times|pm)/.test(unescaped);
  return isLatex ? `\\(${unescaped}\\)` : unescaped;
};

const AdminQuestionPreview = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await axios.get('http://10.201.217.99:3001/questions?chapterId=1');
      setQuestions(res.data);
    };
    fetchQuestions();
  }, []);

  return (
    <MathJaxContext>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">📄 Admin Question Preview</h2>
        {questions.map((q, index) => (
          <div key={q.id} className="border p-4 rounded mb-6 shadow">
            <div className="text-lg font-semibold mb-2">
              Q{index + 1}. <MathJax inline dynamic>{renderLatex(q.question_text)}</MathJax>
            </div>
            {q.image_url && (
              <img src={`http://10.201.217.99:3001${q.image_url}`} alt="Question" className="h-32 mb-3" />
            )}
            <ul className="list-disc ml-5">
              {q.options.map((opt, i) => (
                <li key={i} className={q.correct_flags[i] ? 'text-green-600' : ''}>
                  <MathJax inline dynamic>{renderLatex(opt)}</MathJax>
                </li>
              ))}
            </ul>
            <div className="text-sm text-gray-500 mt-2">
              Linked Concept IDs: {q.concept_ids.filter(Boolean).join(', ')}
            </div>
          </div>
        ))}
      </div>
    </MathJaxContext>
  );
};

export default AdminQuestionPreview;

