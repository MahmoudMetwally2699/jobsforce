import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ResumeUpload from './components/ResumeUpload';
import JobRecommendations from './components/JobRecommendations';
import Signup from './components/Signup';
import RoleSelect from './components/RoleSelect';
import PostJob from './components/PostJob';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={<PrivateRoute><Dashboard /></PrivateRoute>}
          >
            <Route
              path="upload"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <ResumeUpload />
                </PrivateRoute>
              }
            />
            <Route
              path="recommendations"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <JobRecommendations />
                </PrivateRoute>
              }
            />
            <Route
              path="post-job"
              element={
                <PrivateRoute allowedRoles={['recruiter']}>
                  <PostJob />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
