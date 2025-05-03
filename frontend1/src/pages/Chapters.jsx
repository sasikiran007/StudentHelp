// src/pages/Chapters.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Chapters() {
  const [chapters, setChapters] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchChapters = async () => {
    const res = await axios.get('http://10.201.217.99:3001/chapters');
    setChapters(res.data);
  };

  const handleAddOrUpdateChapter = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://10.201.217.99:3001/chapters/${editingId}`, { title, description });
      } else {
        await axios.post('http://10.201.217.99:3001/chapters', { title, description });
      }
      setTitle('');
      setDescription('');
      setEditingId(null);
      fetchChapters();
    } catch (error) {
      console.error('Error saving chapter:', error);
    }
  };

  const handleEdit = (chapter) => {
    setTitle(chapter.title);
    setDescription(chapter.description);
    setEditingId(chapter.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      try {
        await axios.delete(`http://10.201.217.99:3001/chapters/${id}`);
        fetchChapters();
      } catch (error) {
        console.error('Error deleting chapter:', error);
      }
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📚 {editingId ? 'Edit Chapter' : 'Add New Chapter'}</h2>
      <form onSubmit={handleAddOrUpdateChapter} className="space-y-3 max-w-lg">
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
        <div className="flex gap-3">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? 'Update' : 'Add'} Chapter
          </button>
          {editingId && (
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => {
                setTitle('');
                setDescription('');
                setEditingId(null);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className="text-xl font-semibold mt-10 mb-2">Existing Chapters</h3>
      <ul className="space-y-2">
        {chapters.map((chapter) => (
          <li key={chapter.id} className="border p-3 rounded bg-white shadow">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-lg">{chapter.title}</h4>
                <p className="text-gray-700">{chapter.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-sm bg-yellow-400 text-white px-3 py-1 rounded"
                  onClick={() => handleEdit(chapter)}
                >
                  Edit
                </button>
                <button
                  className="text-sm bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(chapter.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}