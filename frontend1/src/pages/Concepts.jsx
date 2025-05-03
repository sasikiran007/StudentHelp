  // src/pages/Concepts.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Concepts() {
  const [chapters, setChapters] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [chapterId, setChapterId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const fetchChapters = async () => {
    const res = await axios.get('http://10.201.217.99:3001/chapters');
    setChapters(res.data);
  };

  const fetchConcepts = async (id) => {
    const res = await axios.get(`http://10.201.217.99:3001/concepts?chapterId=${id}`);
    setConcepts(res.data);
  };

  const handleChapterChange = (e) => {
    const id = e.target.value;
    setChapterId(id);
    fetchConcepts(id);
  };

  const handleImageUpload = async () => {
    if (!image) return null;
    const formData = new FormData();
    formData.append('image', image);
    const res = await axios.post('http://10.201.217.99:3001/upload', formData);
    return res.data.imageUrl;
  };

  const handleAddConcept = async (e) => {
    e.preventDefault();
    try {
      const imageUrl = await handleImageUpload();
      await axios.post('http://10.201.217.99:3001/concepts', {
        chapter_id: chapterId,
        title,
        content,
        image_url: imageUrl || null,
      });
      setTitle('');
      setContent('');
      setImage(null);
      fetchConcepts(chapterId);
    } catch (error) {
      console.error('Error saving concept:', error);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🧠 Add Concept</h2>

      <form onSubmit={handleAddConcept} className="space-y-4 max-w-xl">
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

        <input
          type="text"
          placeholder="Concept Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          placeholder="Concept Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          ➕ Add Concept
        </button>
      </form>

      {concepts.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-2">Concepts for Selected Chapter</h3>
          <ul className="space-y-3">
            {concepts.map((c) => (
              <li key={c.id} className="bg-white shadow p-3 rounded">
                <h4 className="font-bold">{c.title}</h4>
                <p>{c.content}</p>
                {c.image_url && (
                  <img src={c.image_url} alt="Concept" className="mt-2 max-w-xs" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}