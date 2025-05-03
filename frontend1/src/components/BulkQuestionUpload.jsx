// sample CSV columns:
// Question,Option A,Option B,Option C,Option D,Correct Option,Concept IDs (comma separated),Image Filename
// What is g on Earth?,10 m/s²,9.8 m/s²,5 m/s²,0,B,"1,2",g.png

import React, { useState } from 'react';
import axios from 'axios';

const BulkQuestionUpload = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [imageZip, setImageZip] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!csvFile) return alert('Please upload a CSV file');

    const formData = new FormData();
    formData.append('csv', csvFile);
    if (imageZip) formData.append('images', imageZip);

    try {
      const res = await axios.post('http://10.201.217.99:3001/questions/bulk', formData);
      alert('Upload successful: ' + res.data.message);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">📥 Bulk Question Upload (CSV + Images)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files[0])}
          required
        />
        <input
          type="file"
          accept=".zip"
          onChange={(e) => setImageZip(e.target.files[0])}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-2">
        ✅ Format: Question, Option A, Option B, Option C, Option D, Correct Option (A/B/C/D), Concept IDs (e.g., 1,2), Image Filename
      </p>
    </div>
  );
};

export default BulkQuestionUpload;

