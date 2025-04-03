# Role-Based Authentication System

## Overview
The system now supports two distinct user roles with separate authentication flows:
- Job Seekers (role: 'user')
- Recruiters (role: 'recruiter')

## Features Added

### 1. Role-Specific Authentication
- Separate login endpoints for each role
  - `/auth/user/login` - Job seeker login
  - `/auth/recruiter/login` - Recruiter login
- Role validation during authentication
- JWT tokens include user role claim

### 2. Protected Routes
- Role-based access control for routes
- Automatic redirection based on user role
- Protected dashboard features per role

### 3. User Interface Separation
- Distinct login forms for each role
- Role-specific navigation menus
- Dynamic dashboard content based on role

### 4. Role-Based Features
Job Seekers:
- Access to resume upload
- View job recommendations
- Match percentage with jobs

Recruiters:
- Post new jobs
- Company name required at signup
- Access to job posting dashboard

## Implementation Details

### Backend Changes
```javascript
// Authentication Routes
POST /api/auth/user/login     // Job seeker login
POST /api/auth/recruiter/login // Recruiter login
POST /api/auth/user/signup    // Job seeker registration
POST /api/auth/recruiter/signup // Recruiter registration
```

### Frontend Routes
```javascript
/login?role=user      // Job seeker login page
/login?role=recruiter // Recruiter login page
/signup?role=user     // Job seeker signup page
/signup?role=recruiter // Recruiter signup page
/upload              // Resume upload (job seekers only)
/recommendations     // Job listings (job seekers only)
/post-job            // Job posting (recruiters only)
```

### Security Features
- Role validation on all protected routes
- Role-specific middleware checks
- JWT token includes role information
- Frontend route guards based on user role

## Usage Example

```javascript
// Protected route example
<Route
  path="post-job"
  element={
    <PrivateRoute allowedRoles={['recruiter']}>
      <PostJob />
    </PrivateRoute>
  }
/>
```

## Future Improvements
1. Add role-specific analytics dashboard
2. Implement recruiter company profile management
3. Add job application tracking for recruiters
4. Enhanced job matching algorithms for job seekers
