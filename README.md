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
