# Quick Reference Guide

## Architecture Overview

```
┌─────────────┐
│   Internet  │
└──────┬──────┘
       │
       ↓
┌──────────────────┐
│   Cloudflare     │ ← DNS + SSL/TLS + CDN + DDoS Protection
└──────┬───────────┘
       │ (HTTPS)
       ↓
┌──────────────────────────────────────┐
│  AWS Lightsail (13.200.253.158)      │
│  ┌────────────────────────────────┐  │
│  │  Nginx (Port 80/443)           │  │ ← Reverse Proxy
│  │  - Receives HTTP/HTTPS traffic │  │
│  │  - Forwards to port 3000       │  │
│  └────────────┬───────────────────┘  │
│               ↓                      │
│  ┌────────────────────────────────┐  │
│  │  PM2 Process Manager           │  │ ← Keeps app running
│  │  - Auto-restart on crash       │  │
│  │  - Logging                     │  │
│  └────────────┬───────────────────┘  │
│               ↓                      │
│  ┌────────────────────────────────┐  │
│  │  Node.js (Port 3000)           │  │ ← Your application
│  │  - Express server              │  │
│  │  - Serves React app (dist/)    │  │
│  │  - Handles API endpoints       │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

---

## What You Need

### Lightsail Instance
- ✅ **Ubuntu 22.04 LTS** (OS Only)
- ✅ IP: **13.200.253.158**
- ✅ Firewall: Ports 22, 80, 443 open
- ❌ NOT a "Node.js" blueprint

### Software Stack (Install in this order!)

**IMPORTANT:** Install prerequisites BEFORE deploying the application.

| Software | Purpose | Status Check | Installation |
|----------|---------|--------------|--------------|
| **Node.js 18** | Run JavaScript | `node --version` | See below |
| **npm** | Package manager | `npm --version` | Installed with Node.js |
| **PM2** | Process manager | `pm2 --version` | `sudo npm install -g pm2` |
| **Nginx** | Reverse proxy | `nginx -v` | `sudo apt install nginx -y` |
| **Git** | Clone repository | `git --version` | `sudo apt install git -y` |

### Quick Install - All Prerequisites

```bash
# Option 1: Automated Script (Recommended)
wget https://raw.githubusercontent.com/MasiwalNikesh/cc2025/main/server-setup.sh
bash server-setup.sh

# Option 2: Manual Installation (Copy/paste these commands one by one)
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt install nginx -y

# Install Git
sudo apt install git -y

# Install PM2 (after Node.js is installed)
sudo npm install -g pm2

# Verify installations
echo "=== Checking Installations ==="
node --version    # Should show v18.x
npm --version     # Should show 9.x
nginx -v          # Should show nginx version
git --version     # Should show git version
pm2 --version     # Should show pm2 version

# If PM2 not found, run:
# sudo ln -s /usr/lib/node_modules/pm2/bin/pm2 /usr/bin/pm2
```

### Cloudflare
- ✅ Domain added to Cloudflare
- ✅ DNS A records → 13.200.253.158
- ✅ SSL/TLS mode: **Full**
- ✅ Proxy status: **Proxied** (🟠)

---

## File Structure on Server

```
/home/ubuntu/cc2025/
├── dist/                    # Built React app (after npm run build)
├── src/                     # React source code
├── api/                     # Original Vercel API functions
├── logs/                    # Application logs (PM2)
│   ├── err.log
│   ├── out.log
│   └── combined.log
├── server.js                # Express server (replaces Vercel functions)
├── ecosystem.config.js      # PM2 configuration
├── nginx-cloudflare.conf    # Nginx config (copy to /etc/nginx/)
├── .env                     # Environment variables (YOU CREATE THIS)
├── .env.example             # Example environment file
├── package.json             # Dependencies
└── deploy.sh                # Deployment script
```

---

## Essential Commands

### On Your Server (SSH'd into 13.200.253.158)

#### PM2 Commands
```bash
pm2 start ecosystem.config.js --env production  # Start app
pm2 status                                       # Check status
pm2 logs corcon2025                             # View logs
pm2 restart corcon2025                          # Restart app
pm2 stop corcon2025                             # Stop app
pm2 monit                                        # Monitor CPU/Memory
```

#### Nginx Commands
```bash
sudo systemctl status nginx          # Check Nginx status
sudo systemctl restart nginx         # Restart Nginx
sudo nginx -t                        # Test config
sudo tail -f /var/log/nginx/webappindia.error.log  # View errors
```

#### Deployment
```bash
cd /home/ubuntu/cc2025
./deploy.sh                          # Auto-deploy
# OR manually:
git pull origin main
npm install --legacy-peer-deps
npm run build
pm2 restart corcon2025
```

#### Troubleshooting
```bash
# Check if app is running
pm2 status

# Check if port 3000 is in use
sudo lsof -i :3000

# View application errors
pm2 logs corcon2025 --err

# Test the app locally on server
curl http://localhost:3000/api/health

# Check disk space
df -h

# Check memory
free -h

# View all processes
htop
```

---

## Environment Variables (.env file)

Location: `/home/ubuntu/cc2025/.env`

```env
NODE_ENV=production
PORT=3000

# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Resend (Email)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Analytics (Optional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# App URLs
VITE_APP_NAME=CORCON 2025
VITE_APP_URL=https://webappindia.in
VITE_API_BASE_URL=https://webappindia.in/api
```

---

## Deployment Checklist

### First Time Setup

- [ ] Lightsail instance created (Ubuntu 22.04)
- [ ] Static IP attached: 13.200.253.158
- [ ] Firewall configured (ports 22, 80, 443)
- [ ] Cloudflare DNS configured (A records)
- [ ] Cloudflare SSL/TLS set to "Full"
- [ ] SSH access working
- [ ] Node.js 18 installed
- [ ] PM2 installed
- [ ] Nginx installed
- [ ] Git installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install --legacy-peer-deps`)
- [ ] `.env` file created with actual values
- [ ] Application built (`npm run build`)
- [ ] Nginx configured (`/etc/nginx/sites-available/webappindia.in`)
- [ ] PM2 started (`pm2 start ecosystem.config.js --env production`)
- [ ] PM2 startup configured (`pm2 startup` + `pm2 save`)
- [ ] Website accessible at https://webappindia.in
- [ ] SSL certificate working (green padlock)
- [ ] Forms working (test feedback/visitor forms)
- [ ] API endpoints working (`/api/health`)

### Future Deployments

- [ ] SSH to server
- [ ] Run `./deploy.sh` OR manual steps:
  - [ ] `git pull origin main`
  - [ ] `npm install --legacy-peer-deps`
  - [ ] `npm run build`
  - [ ] `pm2 restart corcon2025`
- [ ] Verify site is working
- [ ] Check logs: `pm2 logs corcon2025`

---

## Common Issues & Solutions

### Issue: PM2 command not found

**Solution:**
```bash
# Install PM2
sudo npm install -g pm2

# If still not found
sudo ln -s /usr/lib/node_modules/pm2/bin/pm2 /usr/bin/pm2

# Verify
pm2 --version
```

See: [ALTERNATIVE-DEPLOYMENT.md](./ALTERNATIVE-DEPLOYMENT.md) for systemd alternative

### Issue: 502 Bad Gateway

**Cause:** Nginx can't connect to Node.js app

**Solution:**
```bash
# Check if app is running
pm2 status

# If not running, start it
pm2 start ecosystem.config.js --env production

# Check logs for errors
pm2 logs corcon2025

# Verify port 3000 is listening
sudo lsof -i :3000
```

### Issue: Website shows Nginx default page

**Cause:** Nginx config not enabled or incorrect

**Solution:**
```bash
# Check if config exists
ls -la /etc/nginx/sites-available/webappindia.in

# Check if enabled
ls -la /etc/nginx/sites-enabled/webappindia.in

# Enable if needed
sudo ln -s /etc/nginx/sites-available/webappindia.in /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Issue: SSL errors / "Not Secure"

**Cause:** Cloudflare SSL not configured correctly

**Solution:**
1. Check Cloudflare SSL/TLS mode is **"Full"**
2. Verify DNS is **Proxied** (orange cloud)
3. Wait 5-10 minutes for SSL to provision
4. Clear browser cache / try incognito

### Issue: Forms not submitting

**Cause:** Missing Resend API key or incorrect environment variables

**Solution:**
```bash
# Check .env file exists
cat /home/ubuntu/cc2025/.env

# Verify RESEND_API_KEY is set
grep RESEND_API_KEY /home/ubuntu/cc2025/.env

# Check API endpoint
curl http://localhost:3000/api/health

# View PM2 logs for errors
pm2 logs corcon2025 --err
```

### Issue: npm install warnings (React 19)

**Cause:** Some dependencies expect React 18

**Solution:** This is normal and safe. Use:
```bash
npm install --legacy-peer-deps
```

See: [DEPENDENCY-NOTES.md](./DEPENDENCY-NOTES.md)

---

## Important File Locations

### On Server
- Application: `/home/ubuntu/cc2025/`
- PM2 logs: `/home/ubuntu/cc2025/logs/`
- Nginx config: `/etc/nginx/sites-available/webappindia.in`
- Nginx logs: `/var/log/nginx/`
- Environment: `/home/ubuntu/cc2025/.env`

### Nginx
- Config: `/etc/nginx/sites-available/webappindia.in`
- Enabled: `/etc/nginx/sites-enabled/webappindia.in`
- Access logs: `/var/log/nginx/webappindia.access.log`
- Error logs: `/var/log/nginx/webappindia.error.log`

---

## Documentation Files

| File | Purpose |
|------|---------|
| **CLOUDFLARE-SETUP.md** | Complete step-by-step deployment guide |
| **DEPLOYMENT.md** | General deployment info + Let's Encrypt alternative |
| **ALTERNATIVE-DEPLOYMENT.md** | Systemd, Forever, other options besides PM2 |
| **DEPENDENCY-NOTES.md** | Explanation of React 19 peer dependency warnings |
| **QUICK-REFERENCE.md** | This file - quick commands and checklist |

---

## Support & Resources

- Cloudflare Docs: https://developers.cloudflare.com/
- PM2 Docs: https://pm2.keymetrics.io/
- Nginx Docs: https://nginx.org/en/docs/
- Node.js Docs: https://nodejs.org/

## Need Help?

1. Check logs: `pm2 logs corcon2025`
2. Check Nginx: `sudo tail -f /var/log/nginx/webappindia.error.log`
3. Test locally: `curl http://localhost:3000/api/health`
4. Check status: `pm2 status` and `sudo systemctl status nginx`
