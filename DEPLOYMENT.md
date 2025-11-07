# 🚀 ContriBlock Deployment Guide

This guide covers deploying ContriBlock to production environments.

## 📋 Pre-Deployment Checklist

Before deploying to production:

- [ ] All tests pass locally
- [ ] Environment variables are configured
- [ ] Database migrations are up to date
- [ ] Smart contracts are deployed to target network
- [ ] IPFS/Pinata account has sufficient quota
- [ ] EmailJS is configured and tested
- [ ] Security audit completed (for mainnet)
- [ ] Backup strategy in place
- [ ] Monitoring and logging configured
- [ ] Domain and SSL certificates ready

## 🌐 Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Prerequisites
- Docker and Docker Compose installed
- Domain name configured
- SSL certificates (Let's Encrypt recommended)

#### Steps

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/ContriBlock.git
cd ContriBlock
```

2. **Configure Environment**
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with production values

# Frontend
cp glow-contrib/.env.example glow-contrib/.env
# Edit glow-contrib/.env with production values
```

3. **Build and Deploy**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

4. **Initialize Database**
```bash
docker-compose exec backend flask db upgrade
```

5. **Create Admin User**
```bash
docker-compose exec backend python create_admin.py
```

### Option 2: Traditional Server Deployment

#### Backend Deployment (Ubuntu/Debian)

1. **Install Dependencies**
```bash
sudo apt update
sudo apt install python3.10 python3-pip python3-venv nginx postgresql
```

2. **Setup Application**
```bash
cd /var/www
git clone https://github.com/yourusername/ContriBlock.git
cd ContriBlock/backend

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn
```

3. **Configure Environment**
```bash
cp .env.example .env
nano .env  # Edit with production values
```

4. **Setup Database**
```bash
# Create PostgreSQL database
sudo -u postgres psql
CREATE DATABASE contriblock;
CREATE USER contriblock_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE contriblock TO contriblock_user;
\q

# Run migrations
flask db upgrade
```

5. **Setup Gunicorn Service**
```bash
sudo nano /etc/systemd/system/contriblock.service
```

```ini
[Unit]
Description=ContriBlock Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/ContriBlock/backend
Environment="PATH=/var/www/ContriBlock/backend/venv/bin"
ExecStart=/var/www/ContriBlock/backend/venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 wsgi:app

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl start contriblock
sudo systemctl enable contriblock
```

6. **Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/contriblock
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/contriblock /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

7. **Setup SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

#### Frontend Deployment

1. **Build Frontend**
```bash
cd /var/www/ContriBlock/glow-contrib
npm install
npm run build
```

2. **Configure Nginx for Frontend**
```bash
sudo nano /etc/nginx/sites-available/contriblock-frontend
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/ContriBlock/glow-contrib/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/contriblock-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Option 3: Cloud Platform Deployment

#### Heroku

**Backend:**
```bash
cd backend
heroku create contriblock-api
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set FLASK_SECRET_KEY=your-secret
heroku config:set JWT_SECRET=your-jwt-secret
# Set other environment variables
git push heroku main
heroku run flask db upgrade
```

**Frontend:**
```bash
cd glow-contrib
# Deploy to Vercel, Netlify, or similar
```

#### AWS

- **Backend**: Deploy to Elastic Beanstalk or ECS
- **Frontend**: Deploy to S3 + CloudFront
- **Database**: RDS PostgreSQL
- **Blockchain**: Use Infura or Alchemy for Ethereum connection

#### Google Cloud Platform

- **Backend**: Deploy to Cloud Run or App Engine
- **Frontend**: Deploy to Firebase Hosting or Cloud Storage
- **Database**: Cloud SQL PostgreSQL

#### DigitalOcean

- **Backend**: Deploy to App Platform or Droplet
- **Frontend**: Deploy to App Platform
- **Database**: Managed PostgreSQL

## 🔐 Production Environment Variables

### Backend (.env)

```env
# Production settings
FLASK_ENV=production
FLASK_DEBUG=False
FLASK_SECRET_KEY=<strong-random-secret>
JWT_SECRET=<strong-random-secret>

# Database
DATABASE_URL=postgresql://user:pass@host:5432/contriblock

# Blockchain (use mainnet or testnet)
GANACHE_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
DEPLOYER_PRIVATE_KEY=<your-private-key>
CONTRACT_ADDRESS=<deployed-contract-address>

# IPFS
PINATA_API_KEY=<your-api-key>
PINATA_SECRET_API_KEY=<your-secret-key>

# CORS
FRONTEND_ORIGIN=https://yourdomain.com
```

### Frontend (.env)

```env
VITE_API_URL=https://api.yourdomain.com
VITE_EMAILJS_SERVICE_ID=<your-service-id>
VITE_EMAILJS_TEMPLATE_ID=<your-template-id>
VITE_EMAILJS_PUBLIC_KEY=<your-public-key>
```

## 🔒 Security Best Practices

1. **Use Strong Secrets**
   - Generate random secrets: `python -c "import secrets; print(secrets.token_hex(32))"`
   - Never commit secrets to version control
   - Rotate secrets regularly

2. **Enable HTTPS**
   - Use SSL/TLS certificates (Let's Encrypt is free)
   - Redirect HTTP to HTTPS
   - Enable HSTS headers

3. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Regular backups
   - Restrict network access

4. **API Security**
   - Rate limiting
   - CORS configuration
   - Input validation
   - SQL injection prevention (SQLAlchemy handles this)

5. **File Upload Security**
   - Validate file types
   - Limit file sizes
   - Scan for malware
   - Store outside web root

6. **Blockchain Security**
   - Audit smart contracts before mainnet deployment
   - Use hardware wallet for production keys
   - Implement multi-sig for critical operations
   - Monitor contract events

## 📊 Monitoring and Logging

### Application Monitoring

```python
# Add to backend/app.py
import logging
from logging.handlers import RotatingFileHandler

if not app.debug:
    file_handler = RotatingFileHandler('logs/contriblock.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('ContriBlock startup')
```

### Recommended Monitoring Tools

- **Application**: Sentry, New Relic, DataDog
- **Infrastructure**: Prometheus + Grafana
- **Uptime**: UptimeRobot, Pingdom
- **Logs**: ELK Stack, Papertrail

## 🔄 Continuous Deployment

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Backend
        run: |
          # Your deployment script
          
      - name: Deploy Frontend
        run: |
          cd glow-contrib
          npm install
          npm run build
          # Deploy to hosting
```

## 💾 Backup Strategy

1. **Database Backups**
```bash
# Daily automated backup
0 2 * * * pg_dump contriblock > /backups/contriblock_$(date +\%Y\%m\%d).sql
```

2. **File Backups**
   - IPFS content is already decentralized
   - Backup configuration files
   - Backup smart contract ABIs

3. **Disaster Recovery**
   - Document recovery procedures
   - Test backups regularly
   - Keep backups in multiple locations

## 🚨 Troubleshooting Production Issues

### Application Won't Start
- Check logs: `journalctl -u contriblock -n 50`
- Verify environment variables
- Check database connection
- Ensure all dependencies installed

### High Memory Usage
- Increase worker processes
- Enable connection pooling
- Optimize database queries
- Add caching layer (Redis)

### Slow Performance
- Enable caching
- Optimize database indexes
- Use CDN for static assets
- Enable gzip compression

## 📞 Support

For deployment issues:
- Check logs first
- Review this guide
- Search existing issues
- Create new issue with details

---

**Remember**: Always test in a staging environment before deploying to production!

