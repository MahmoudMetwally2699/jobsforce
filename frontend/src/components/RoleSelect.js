import React from 'react';
import { Link } from 'react-router-dom';

function RoleSelect() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6">
        <h2 className="text-3xl font-bold text-center mb-8">Join JobsForce as</h2>
        <div className="space-y-4">
          <Link
            to="/login?role=user"
            className="block w-full p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">Job Seeker</h3>
            <p className="text-gray-600">Find personalized job recommendations</p>
          </Link>

          <Link
            to="/login?role=recruiter"
            className="block w-full p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">Recruiter</h3>
            <p className="text-gray-600">Post jobs and manage applications</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RoleSelect;
