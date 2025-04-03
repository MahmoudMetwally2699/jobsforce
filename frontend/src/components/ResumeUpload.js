import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [loadingLinkedin, setLoadingLinkedin] = useState(false);
  const { token } = useAuth();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccess('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/resumes/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSkills(response.data.skills);
      setSuccess('Resume uploaded successfully!');
      setFile(null);
      // Reset file input
      e.target.reset();
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleLinkedinSubmit = async (e) => {
    e.preventDefault();
    if (!linkedinUrl) return;

    setLoadingLinkedin(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/resumes/linkedin', {
        url: linkedinUrl,
        saveToProfile: true // Add this flag to save to user profile
      });

      if (response.data.skills.length === 0) {
        setError('No skills found in the LinkedIn profile');
        return;
      }

      setSkills(prevSkills => {
        const allSkills = [...prevSkills, ...response.data.skills];
        return [...new Set(allSkills)]; // Remove duplicates
      });

      setSuccess('Skills successfully extracted from LinkedIn!');
      setLinkedinUrl('');
    } catch (error) {
      setError(error?.response?.data?.error ||
        'Failed to extract skills from LinkedIn. Please check the URL and try again.');
    } finally {
      setLoadingLinkedin(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Upload Resume</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Upload Resume File</h3>
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
      </div>

      <div className="border-t pt-8 mt-8">
        <h3 className="text-lg font-semibold mb-4">Extract Skills from LinkedIn</h3>
        <form onSubmit={handleLinkedinSubmit} className="max-w-md">
          <div className="flex gap-2">
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="Enter LinkedIn profile URL"
              className="flex-1 p-2 border rounded"
              required
              pattern="https?:\/\/(www\.)?linkedin\.com\/in\/.*"
            />
            <button
              type="submit"
              disabled={loadingLinkedin || !linkedinUrl}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loadingLinkedin ? 'Extracting...' : 'Extract Skills'}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Example: https://www.linkedin.com/in/username
          </p>
        </form>
      </div>

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
