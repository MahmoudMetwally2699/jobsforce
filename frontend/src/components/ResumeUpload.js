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
        saveToProfile: true
      });

      if (response.data.skills.length === 0) {
        setError('No skills found in the LinkedIn profile');
        return;
      }

      setSkills(prevSkills => {
        const allSkills = [...prevSkills, ...response.data.skills];
        return [...new Set(allSkills)];
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Upload Your Resume</h2>
          <p className="mt-2 text-gray-600">Upload your resume or connect your LinkedIn profile to get personalized job recommendations</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-700">{success}</span>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300">
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Upload Resume File</h3>
                <p className="mt-1 text-xs text-gray-500">PDF or DOCX up to 5MB</p>
              </div>

              <div className="mt-4">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={!file || uploading}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading...
                  </>
                ) : (
                  'Upload Resume'
                )}
              </button>
            </form>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300">
            <div className="text-center mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Import from LinkedIn</h3>
              <p className="mt-1 text-xs text-gray-500">Connect your LinkedIn profile</p>
            </div>

            <form onSubmit={handleLinkedinSubmit} className="space-y-4">
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="Enter your LinkedIn profile URL"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                pattern="https?:\/\/(www\.)?linkedin\.com\/in\/.*"
                required
              />

              <button
                type="submit"
                disabled={loadingLinkedin || !linkedinUrl}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loadingLinkedin ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Connecting...
                  </>
                ) : (
                  'Connect LinkedIn'
                )}
              </button>
            </form>
          </div>
        </div>

        {skills.length > 0 && (
          <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Extracted Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeUpload;
