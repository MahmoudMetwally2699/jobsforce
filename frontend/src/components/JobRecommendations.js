import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

function JobRecommendations() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/jobs/recommendations?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [page]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Recommended Jobs</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {jobs.map(job => (
            <div key={job._id} className="border p-4 rounded">
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-gray-600">{job.company}</p>
              <p className="mt-2">{job.description}</p>
              <div className="mt-2 flex gap-2">
                {job.skills.map(skill => (
                  <span key={skill} className="bg-blue-100 px-2 py-1 rounded text-sm">
                    {skill}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-gray-500">Match Score: {Math.round(job.score * 100)}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobRecommendations;
