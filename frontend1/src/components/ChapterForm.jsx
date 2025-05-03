// ChapterForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChapterForm = () => {
  const [chapters, setChapters] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchChapters = async () => {
    const res = await axios.get('http://10.201.217.99:3001/chapters');
    setChapters(res.data);
  };

  const addChapter = async (e) => {
    e.preventDefault();
    await axios.post('http://10.201.217.99:3001/chapters', {
      title,
      description,
    });
    setTitle('');
    setDescription('');
    fetchChapters();
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📘 Add Chapter</h1>
      <form onSubmit={addChapter} className="space-y-3">
        <input
          type="text"
          placeholder="Chapter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Chapter
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-8">📚 Chapters</h2>
      <ul className="mt-4 space-y-2">
        {chapters.map((c) => (
          <li key={c.id} className="border p-3 rounded shadow">
            <h3 className="font-bold">{c.title}</h3>
            <p>{c.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChapterForm;
