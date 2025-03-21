# Deployment Guide for JobsForce

## 1. AWS Setup Prerequisites

1. Create AWS Account and Set Up:
   - Create IAM user with EC2 and S3 permissions
   - Create S3 bucket for resumes
   - Generate AWS access keys

2. Launch EC2 Instance:
   ```bash
   # Configure instance:
   - Ubuntu 20.04 LTS
   - t2.small or larger
   - 20GB SSD
   - Create/select security group with ports:
     - 22 (SSH)
     - 80 (HTTP)
     - 443 (HTTPS)
   ```

## 2. Domain Setup

1. Register domain (if needed)
2. Point domain to EC2:
   - Create A record pointing to EC2 IP
   - Add CNAME for www subdomain

## 3. Initial Server Setup

1. SSH into your instance:
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

2. Clone repository:
   ```bash
   git clone https://github.com/yourusername/jobsforce.git
   cd jobsforce
   ```

3. Set up environment:
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   nano .env
   ```

4. Run setup script:
   ```bash
   chmod +x deploy/setup.sh
   ./deploy/setup.sh
   ```

## 4. SSL Certificate

1. Install and configure SSL:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

## 5. GitHub Actions Setup

1. Add repository secrets:
   - EC2_HOST: Your EC2 IP/domain
   - EC2_USERNAME: ubuntu
   - EC2_PRIVATE_KEY: Your SSH private key
   - AWS_ACCESS_KEY_ID: Your AWS access key
   - AWS_SECRET_ACCESS_KEY: Your AWS secret key

## 6. Database Setup

1. Configure MongoDB:
   ```bash
   sudo nano /etc/mongod.conf
   # Set bindIp to 127.0.0.1
   sudo systemctl restart mongod
   ```

## 7. Monitoring

1. Check application status:
   ```bash
   pm2 status
   pm2 logs
   ```

2. Check nginx status:
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

## 8. Maintenance

1. Manual deployment:
   ```bash
   cd ~/jobsforce
   git pull
   npm ci
   pm2 restart all
   ```

2. View logs:
   ```bash
   pm2 logs
   sudo tail -f /var/log/nginx/error.log
   ```

## 9. Troubleshooting

1. Check application errors:
   ```bash
   pm2 logs --error
   ```

2. Check nginx errors:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

3. Check SSL status:
   ```bash
   sudo certbot certificates
   ```
