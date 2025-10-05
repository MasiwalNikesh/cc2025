# Deployment Guide for AWS Lightsail

This guide provides step-by-step instructions for deploying the CORCON 2025 website to AWS Lightsail Node.js server.

## Production Details

- **Domain**: webappindia.in
- **Server IP**: 13.200.253.158
- **Git Repository**: https://github.com/MasiwalNikesh/cc2025.git
- **Server**: AWS Lightsail Node.js Instance

## Documentation Overview

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **[QUICK-REFERENCE.md](./QUICK-REFERENCE.md)** | Architecture diagram, essential commands, checklist | Start here for overview |
| **[CLOUDFLARE-SETUP.md](./CLOUDFLARE-SETUP.md)** | Complete step-by-step deployment with Cloudflare | Follow for first deployment |
| **[ALTERNATIVE-DEPLOYMENT.md](./ALTERNATIVE-DEPLOYMENT.md)** | Systemd, Forever, other PM2 alternatives | If PM2 doesn't work or you prefer systemd |
| **[DEPENDENCY-NOTES.md](./DEPENDENCY-NOTES.md)** | React 19 peer dependency explanation | If you see npm warnings |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | This file - overview and Let's Encrypt option | General reference |

---

## Quick Start

### Step 1: Install Prerequisites (If not already done)

```bash
# SSH to your server
ssh ubuntu@13.200.253.158

# Option A: Automated installation (Recommended)
wget https://raw.githubusercontent.com/MasiwalNikesh/cc2025/main/server-setup.sh
bash server-setup.sh

# Option B: Manual installation
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt install nginx git -y
sudo npm install -g pm2
```

### Step 2: Deploy Application

**Prerequisites:** Ubuntu instance at 13.200.253.158 with Node.js 18, Nginx, and PM2 installed

```bash
# 1. SSH to server (if not already connected)
ssh ubuntu@13.200.253.158

# 2. Clone repository
cd /home/ubuntu
git clone https://github.com/MasiwalNikesh/cc2025.git
cd cc2025

# 3. Install dependencies and build
npm install --legacy-peer-deps
npm run build

# 4. Configure Nginx
sudo cp nginx-cloudflare.conf /etc/nginx/sites-available/webappindia.in
sudo ln -s /etc/nginx/sites-available/webappindia.in /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

# 5. Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

**Need detailed installation instructions?** See [CLOUDFLARE-SETUP.md](./CLOUDFLARE-SETUP.md)

**PM2 not working?** See [ALTERNATIVE-DEPLOYMENT.md](./ALTERNATIVE-DEPLOYMENT.md)

---

## Deployment Options

### Option 1: Cloudflare SSL (Recommended) ⭐

**For deployment with Cloudflare DNS and SSL**, please follow the comprehensive guide:

📘 **[CLOUDFLARE-SETUP.md](./CLOUDFLARE-SETUP.md)**

This complete guide includes:
- ✅ Cloudflare DNS and SSL configuration
- ✅ Server setup on 13.200.253.158
- ✅ Nginx configuration optimized for Cloudflare
- ✅ Performance and caching optimization
- ✅ Security best practices
- ✅ Comprehensive troubleshooting
- ✅ Future deployment workflows

**Use this option if:**
- You're using Cloudflare for DNS
- You want Cloudflare's CDN and DDoS protection
- You prefer simplified SSL management

### Option 2: Let's Encrypt SSL (Alternative)

If you prefer to use Let's Encrypt instead of Cloudflare, follow the instructions below:

## Prerequisites

- AWS Lightsail instance running Node.js (version 18+ recommended)
- SSH access to the Lightsail instance
- Domain configured and pointing to Lightsail instance IP
- Git installed on the server
- Node.js and npm installed on the server

## Initial Server Setup

### 1. Connect to Your Lightsail Instance

```bash
ssh -i /path/to/your-key.pem ubuntu@your-lightsail-ip
```

Or use the browser-based SSH from AWS Lightsail console.

### 2. Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Install Node.js (if not already installed)

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 4. Install PM2 Process Manager

```bash
sudo npm install -g pm2
```

### 5. Install Nginx (for reverse proxy)

```bash
sudo apt install nginx -y
```

## Project Deployment

### 1. Clone the Repository

```bash
cd /home/ubuntu
git clone https://github.com/MasiwalNikesh/cc2025.git
cd cc2025
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
nano .env
```

Update the following variables in `.env`:

```env
NODE_ENV=production
PORT=3000

# Supabase Configuration
VITE_SUPABASE_URL=your_actual_supabase_url
VITE_SUPABASE_ANON_KEY=your_actual_supabase_key

# Resend Email Service
RESEND_API_KEY=your_actual_resend_api_key

# App Configuration
VITE_APP_NAME=CORCON 2025
VITE_APP_URL=https://webappindia.in

# API Endpoints
VITE_API_BASE_URL=https://webappindia.in/api
```

### 4. Build the Application

```bash
npm run build
```

### 5. Start the Application with PM2

```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

Follow the instructions from `pm2 startup` to enable PM2 to start on system boot.

## Nginx Configuration

### 1. Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/webappindia.in
```

Add the following configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name webappindia.in www.webappindia.in;

    # Redirect HTTP to HTTPS (after SSL setup)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2. Enable the Configuration

```bash
sudo ln -s /etc/nginx/sites-available/webappindia.in /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## SSL/HTTPS Setup with Let's Encrypt

### 1. Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Obtain SSL Certificate

```bash
sudo certbot --nginx -d webappindia.in -d www.webappindia.in
```

Follow the prompts to configure SSL. Certbot will automatically update your Nginx configuration.

### 3. Update Ecosystem Configuration

Edit `ecosystem.config.js` and change the production port from 80 to 3000 (since Nginx will handle port 80/443):

```bash
nano ecosystem.config.js
```

Ensure `env_production.PORT` is set to `3000`.

## Deployment Script Usage

For future deployments, use the automated deployment script:

```bash
cd /home/ubuntu/cc2025
./deploy.sh
```

This script will:
1. Pull latest changes from Git
2. Install dependencies
3. Build the project
4. Restart the application with PM2

## Useful PM2 Commands

```bash
# View application status
pm2 status

# View logs
pm2 logs corcon2025

# View only error logs
pm2 logs corcon2025 --err

# Restart application
pm2 restart corcon2025

# Stop application
pm2 stop corcon2025

# Monitor application
pm2 monit

# Delete application from PM2
pm2 delete corcon2025
```

## Firewall Configuration

Ensure your AWS Lightsail firewall allows:
- HTTP (port 80)
- HTTPS (port 443)
- SSH (port 22)

Configure in AWS Lightsail console under Networking tab.

## Troubleshooting

### Application Not Starting

1. Check PM2 logs:
   ```bash
   pm2 logs corcon2025
   ```

2. Verify environment variables:
   ```bash
   cat .env
   ```

3. Check if port 3000 is available:
   ```bash
   sudo lsof -i :3000
   ```

### Nginx Issues

1. Check Nginx error logs:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

2. Test Nginx configuration:
   ```bash
   sudo nginx -t
   ```

3. Restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

### Build Failures

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Check Node.js version:
   ```bash
   node --version  # Should be 18+
   ```

## Monitoring and Maintenance

### Set Up PM2 Monitoring (Optional)

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Automatic Updates

Set up a cron job for automatic deployments (optional):

```bash
crontab -e
```

Add (for daily deployment at 2 AM):
```
0 2 * * * cd /home/ubuntu/cc2025 && ./deploy.sh >> /home/ubuntu/deploy.log 2>&1
```

## Backup Strategy

### Database Backup (if using local DB)

Set up automated backups for your database.

### Application Backup

```bash
# Backup project files
tar -czf ~/backup-$(date +%Y%m%d).tar.gz /home/ubuntu/cc2025

# Keep only last 7 days of backups
find ~/backup-*.tar.gz -mtime +7 -delete
```

## Performance Optimization

### Enable Nginx Caching

Add to your Nginx server block:

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf)$ {
    proxy_pass http://localhost:3000;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### PM2 Cluster Mode

For better performance, use cluster mode in `ecosystem.config.js`:

```javascript
instances: 'max',  // Use all available CPUs
exec_mode: 'cluster'
```

## Support

For issues or questions:
- Check application logs: `pm2 logs corcon2025`
- Check server logs: `sudo journalctl -u nginx`
- Verify environment configuration
- Ensure all services are running: `pm2 status`, `sudo systemctl status nginx`
