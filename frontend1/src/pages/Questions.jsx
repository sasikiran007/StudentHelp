// src/pages/Questions.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Questions() {
  const [chapters, setChapters] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [chapterId, setChapterId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [image, setImage] = useState(null);
  const [options, setOptions] = useState([
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false },
  ]);
  const [selectedConcepts, setSelectedConcepts] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [imageZip, setImageZip] = useState(null);

  const fetchChapters = async () => {
    const res = await axios.get('http://10.201.217.99:3001/chapters');
    setChapters(res.data);
  };

  const fetchConcepts = async (chapterId) => {
    const res = await axios.get(`http://10.201.217.99:3001/concepts?chapterId=${chapterId}`);
    setConcepts(res.data);
  };

  const fetchQuestions = async (chapterId) => {
    const res = await axios.get(`http://10.201.217.99:3001/questions?chapterId=${chapterId}`);
    setQuestions(res.data);
  };

  const handleChapterChange = (e) => {
    const id = e.target.value;
    setChapterId(id);
    fetchConcepts(id);
    fetchQuestions(id);
  };

  const handleOptionChange = (index, key, value) => {
    const updatedOptions = [...options];
    updatedOptions[index][key] = key === 'is_correct' ? value === 'true' : value;
    setOptions(updatedOptions);
  };

  const handleImageUpload = async () => {
    if (!image) return null;
    const formData = new FormData();
    formData.append('image', image);
    const res = await axios.post('http://10.201.217.99:3001/upload', formData);
    return res.data.imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageUrl = await handleImageUpload();
      await axios.post('http://10.201.217.99:3001/questions', {
        chapter_id: chapterId,
        question_text: questionText,
        image_url: imageUrl,
        options,
        concept_ids: selectedConcepts,
      });
      setQuestionText('');
      setImage(null);
      setOptions([
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
      ]);
      setSelectedConcepts([]);
      fetchQuestions(chapterId);
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) return alert('Please upload a CSV file');

    const formData = new FormData();
    formData.append('csv', csvFile);
    if (imageZip) formData.append('images', imageZip);

    try {
      const res = await axios.post('http://10.201.217.99:3001/questions/bulk', formData);
      alert('Upload successful: ' + res.data.message);
      fetchQuestions(chapterId);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">❓ Add Question</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <select
          value={chapterId}
          onChange={handleChapterChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Chapter</option>
          {chapters.map((ch) => (
            <option key={ch.id} value={ch.id}>{ch.title}</option>
          ))}
        </select>

        <textarea
          placeholder="Question Text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-full" />

        <div className="grid grid-cols-1 gap-4">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`Option ${i + 1}`}
                value={opt.option_text}
                onChange={(e) => handleOptionChange(i, 'option_text', e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <label className="text-sm flex items-center gap-1">
                <input
                  type="radio"
                  name="correct"
                  value="true"
                  checked={opt.is_correct === true}
                  onChange={() => {
                    const updated = options.map((o, idx) => ({ ...o, is_correct: idx === i }));
                    setOptions(updated);
                  }}
                />
                Correct
              </label>
            </div>
          ))}
        </div>

        <div>
          <label className="font-semibold">Related Concepts:</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {concepts.map((concept) => (
              <label key={concept.id} className="text-sm">
                <input
                  type="checkbox"
                  value={concept.id}
                  checked={selectedConcepts.includes(concept.id)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelectedConcepts((prev) =>
                      checked ? [...prev, concept.id] : prev.filter((id) => id !== concept.id)
                    );
                  }}
                />{' '}
                {concept.title}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          ➕ Submit Question
        </button>
      </form>

      <div className="mt-12 border-t pt-6">
        <h2 className="text-xl font-bold mb-4">📥 Bulk Upload (CSV + Images)</h2>
        <form onSubmit={handleBulkUpload} className="space-y-4">
          <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} required />
          <input type="file" accept=".zip" onChange={(e) => setImageZip(e.target.files[0])} />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Upload Bulk Questions
          </button>
          <p className="text-sm text-gray-500">
            Format: Question, Option A, Option B, Option C, Option D, Correct Option (A/B/C/D), Concept IDs, Image Filename
          </p>
        </form>
      </div>

      <h3 className="text-xl font-semibold mt-10 mb-2">Questions</h3>
      <ul className="space-y-4">
        {questions.map((q) => (
          <li key={q.id} className="border bg-white rounded p-4 shadow">
            <h4 className="font-bold">{q.question_text}</h4>
            {q.image_url && <img src={q.image_url} alt="Question" className="mt-2 max-w-xs" />}
            <ul className="list-disc pl-5">
              {q.options.map((opt, i) => (
                <li key={i} className={q.correct_flags[i] ? 'text-green-600 font-semibold' : ''}>{opt}</li>
              ))}
            </ul>
            <p className="text-sm text-gray-600 mt-1">Linked Concepts: {q.concept_ids.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
