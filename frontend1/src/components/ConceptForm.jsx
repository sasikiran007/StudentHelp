// ConceptForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConceptForm = () => {
  const [chapters, setChapters] = useState([]);
  const [chapterId, setChapterId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    axios.get('http://10.201.217.99:3001/chapters')
      .then(res => setChapters(res.data));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = null;
    if (image) {
      const formData = new FormData();
      formData.append('image', image);
      const uploadRes = await axios.post('http://10.201.217.99:3001/upload', formData);
      imageUrl = uploadRes.data.imageUrl;
    }

    await axios.post('http://10.201.217.99:3001/concepts', {
      chapter_id: chapterId,
      title,
      content,
      image_url: imageUrl
    });

    // Reset form
    setTitle('');
    setContent('');
    setImage(null);
    setPreviewUrl('');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🧠 Add Concept</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select value={chapterId} onChange={(e) => setChapterId(e.target.value)} required className="w-full p-2 border rounded">
          <option value="">Select Chapter</option>
          {chapters.map(ch => <option key={ch.id} value={ch.id}>{ch.title}</option>)}
        </select>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Concept Title"
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Concept Content"
          className="w-full p-2 border rounded"
          rows={5}
        />

        <input type="file" onChange={handleImageChange} accept="image/*" />
        {previewUrl && <img src={previewUrl} alt="preview" className="h-32 mt-2" />}

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Save Concept
        </button>
      </form>
    </div>
  );
};

export default ConceptForm;
