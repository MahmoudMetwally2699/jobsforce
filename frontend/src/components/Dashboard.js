import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold">JobsForce</span>
              </div>
              <div className="ml-6 flex space-x-8">
                {role === 'user' ? (
                  <>
                    <Link
                      to="/upload"
                      className="inline-flex items-center px-1 pt-1 text-gray-900"
                    >
                      Upload Resume
                    </Link>
                    <Link
                      to="/recommendations"
                      className="inline-flex items-center px-1 pt-1 text-gray-900"
                    >
                      Job Recommendations
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/post-job"
                    className="inline-flex items-center px-1 pt-1 text-gray-900"
                  >
                    Post Job
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-gray-600">
                {role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
