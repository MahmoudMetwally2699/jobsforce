import React from 'react';
import { Link } from 'react-router-dom';

function RoleSelect() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl w-full p-8">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Welcome to <span className="text-blue-600">JobsForce</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-8 px-4">
          <Link
            to="/login?role=user"
            className="transform hover:scale-105 transition-all duration-300"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl">
              <div className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Job Seeker</h3>
                <p className="text-gray-600 mb-6">Find your dream job with AI-powered recommendations tailored to your skills.</p>
                <div className="flex items-center text-blue-600">
                  <span>Get Started</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          <Link
            to="/login?role=recruiter"
            className="transform hover:scale-105 transition-all duration-300"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl">
              <div className="p-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Recruiter</h3>
                <p className="text-gray-600 mb-6">Post jobs and find the perfect candidates with our intelligent matching system.</p>
                <div className="flex items-center text-indigo-600">
                  <span>Get Started</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RoleSelect;
