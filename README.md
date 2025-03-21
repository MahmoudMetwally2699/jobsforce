# JobsForce - Job Recommendation System

A full-stack job recommendation system that uses AI to match resumes with job listings.

## Live Demo
- Frontend: https://jobsforcesfront.vercel.app
- Backend API: https://jobsforces.vercel.app

## Technologies Used

### Backend
- Node.js & Express
- MongoDB (Atlas)
- JWT Authentication
- Cloudinary for resume storage
- Natural.js for skill matching
- PDF Parser & Mammoth for resume parsing
- Deployed on Vercel

### Frontend
- React 18
- React Router v6
- TailwindCSS
- Axios for API calls
- Deployed on Vercel

## Features

### Authentication
- User signup/login with JWT
- Protected routes
- Token-based session management

### Resume Management
- Upload PDF/DOCX resumes
- Automatic skill extraction
- Cloud storage using Cloudinary
- File type validation
- Size limit enforcement (5MB)

### Job Recommendations
- AI-powered job matching
- Skill similarity scoring
- Content-based filtering
- Pagination for job listings
- Real-time match percentage

### Job Scraping
- Automated job scraping from remote job boards
- Skill detection in job descriptions
- Regular database updates
- Error handling and retries

## API Endpoints

### Authentication
```bash
POST /api/auth/signup - Create new account
POST /api/auth/login - User login
```

### Resume Management
```bash
POST /api/resumes/upload - Upload resume
```

### Jobs
```bash
GET /api/jobs/recommendations - Get personalized job recommendations
GET /api/jobs - Get all jobs
POST /api/jobs - Add new job (admin only)
```

## Environment Setup

### Backend (.env)
```bash
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env)
```bash
REACT_APP_API_URL=your_backend_url
```

## Deployment

### Backend
- Hosted on Vercel
- Serverless functions
- Auto deployments from main branch
- CORS configured for frontend domain
- Environment variables set in Vercel dashboard

### Frontend
- Hosted on Vercel
- Auto deployments from main branch
- Build optimizations enabled
- Environment variables configured

## Third-Party Services

### Cloudinary
- Used for resume storage
- Automatic file type detection
- Secure URL generation
- Cloud-based file management

### Vercel
- Production hosting
- Automatic SSL
- CI/CD pipeline
- Environment management
- Edge network deployment

## Local Development

1. Clone repository
```bash
git clone https://github.com/yourusername/jobsforce.git
```

2. Install dependencies
```bash
# Backend
cd jobsforce
npm install

# Frontend
cd frontend
npm install
```

3. Start development servers
```bash
# Backend
npm run dev

# Frontend
npm start
```

Visit http://localhost:3000 for frontend and http://localhost:5000 for backend.

# JobsForce Deployment Guide

## AWS EC2 Setup

1. Launch EC2 Instance
   - Ubuntu 20.04 LTS
   - t2.micro (free tier) or larger
   - Configure security group:
     - HTTP (80)
     - HTTPS (443)
     - SSH (22)

2. Configure Domain & DNS
   - Point domain to EC2 IP
   - Update nginx config with domain

3. Setup SSL (Optional)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

4. Initial Deployment
```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Clone repository
git clone https://github.com/yourusername/jobsforce.git
cd jobsforce

# Run setup script
chmod +x deploy/setup.sh
./deploy/setup.sh
```

5. Setup GitHub Secrets
   - EC2_HOST: Your EC2 IP/domain
   - EC2_USERNAME: ubuntu
   - EC2_PRIVATE_KEY: Your SSH private key

## Manual Deployment
```bash
git pull
npm ci
pm2 restart all
```

## Environment Variables
Copy `.env.production` to `.env` and update values:
- JWT_SECRET
- AWS credentials
- Domain name

## Monitoring
```bash
pm2 status
pm2 logs
```
