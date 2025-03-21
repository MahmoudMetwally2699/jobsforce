import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [skills, setSkills] = useState([]);
  const { token } = useAuth();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    try {
      const response = await api.post('/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setSkills(response.data.skills);
    } catch (error) {
      console.error('Upload failed:', error);
    }
    setUploading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Upload Resume</h2>
      <form onSubmit={handleUpload} className="max-w-md">
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          className="mb-4"
        />
        <button
          type="submit"
          disabled={!file || uploading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {skills.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Extracted Skills:</h3>
          <div className="flex gap-2 mt-2">
            {skills.map(skill => (
              <span key={skill} className="bg-green-100 px-2 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;
