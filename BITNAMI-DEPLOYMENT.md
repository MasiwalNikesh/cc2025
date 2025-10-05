# Bitnami Instance Deployment Guide

This guide is specifically for deploying on **AWS Lightsail Bitnami Node.js** instances.

## Bitnami vs Standard Ubuntu

You're using a **Bitnami Node.js** instance, which has some differences:

| Aspect | Standard Ubuntu | Bitnami Node.js |
|--------|----------------|-----------------|
| User | `ubuntu` | `bitnami` |
| Node.js path | `/usr/bin/node` | `/opt/bitnami/node/bin/node` |
| Pre-installed | Nothing | Node.js, npm, Apache |
| Home directory | `/home/ubuntu` | `/home/bitnami` |

## Current Issue: PM2 Not Managing Processes

You're seeing this warning:
```
[PM2][WARN] PM2 is not managing any process, skipping save...
```

**Cause:** You haven't started the application with PM2 yet!

## ✅ Correct Deployment Order

### Step 1: Verify You're in the Right Directory

```bash
cd ~/cc2025
pwd  # Should show: /home/bitnami/cc2025
ls -la  # Should show package.json, server.js, etc.
```

### Step 2: Verify Build Completed

```bash
# Check if dist directory exists
ls -la dist/

# If dist doesn't exist, build first
npm run build
```

### Step 3: Verify Environment Variables

```bash
# Check if .env exists
cat .env

# If it doesn't exist or is empty, create it
cp .env.example .env
nano .env
# Add your actual API keys
```

### Step 4: Start Application with PM2 (THIS IS WHAT YOU'RE MISSING!)

```bash
# Start the application
pm2 start ecosystem.config.cjs --env production

# Check status
pm2 status
```

You should see:
```
┌────┬────────────────┬─────────┬─────────┬─────────┬──────┐
│ id │ name           │ mode    │ status  │ cpu     │ mem  │
├────┼────────────────┼─────────┼─────────┼─────────┼──────┤
│ 0  │ corcon2025     │ cluster │ online  │ 0%      │ 50mb │
└────┴────────────────┴─────────┴─────────┴─────────┴──────┘
```

### Step 5: NOW Save PM2 Process List

```bash
pm2 save
```

You should see:
```
[PM2] Saving current process list...
[PM2] Successfully saved in /home/bitnami/.pm2/dump.pm2
```

### Step 6: Setup PM2 Startup Script

```bash
pm2 startup
```

This will output a command like:
```
sudo env PATH=$PATH:/opt/bitnami/node/bin /opt/bitnami/node/lib/node_modules/pm2/bin/pm2 startup systemd -u bitnami --hp /home/bitnami
```

**Copy and run that exact command:**

```bash
sudo env PATH=$PATH:/opt/bitnami/node/bin /opt/bitnami/node/lib/node_modules/pm2/bin/pm2 startup systemd -u bitnami --hp /home/bitnami
```

### Step 7: Verify Everything is Working

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs corcon2025

# Test the application locally
curl http://localhost:3000/api/health
```

Expected output:
```json
{"status":"ok","timestamp":"2025-01-06T..."}
```

---

## Bitnami-Specific: Apache Configuration

Bitnami instances come with **Apache** pre-installed, which might conflict with Nginx.

### Option 1: Use Nginx (Recommended)

```bash
# Stop Apache
sudo /opt/bitnami/ctlscript.sh stop apache

# Disable Apache from starting on boot
sudo systemctl disable bitnami

# Install and configure Nginx
sudo apt update
sudo apt install nginx -y

# Copy Nginx configuration
sudo cp nginx-cloudflare.conf /etc/nginx/sites-available/webappindia.in
sudo ln -s /etc/nginx/sites-available/webappindia.in /etc/nginx/sites-enabled/

# Remove default Nginx site
sudo rm /etc/nginx/sites-enabled/default

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### Option 2: Use Apache Instead of Nginx

If you prefer to use the pre-installed Apache:

```bash
# Create Apache configuration
sudo nano /opt/bitnami/apache2/conf/vhosts/webappindia.conf
```

Add this configuration:

```apache
<VirtualHost *:80>
    ServerName webappindia.in
    ServerAlias www.webappindia.in

    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    # Cloudflare Real IP
    RemoteIPHeader CF-Connecting-IP
    RemoteIPTrustedProxy 173.245.48.0/20
    RemoteIPTrustedProxy 103.21.244.0/22
    RemoteIPTrustedProxy 103.22.200.0/22
    RemoteIPTrustedProxy 103.31.4.0/22
    RemoteIPTrustedProxy 141.101.64.0/18
    RemoteIPTrustedProxy 108.162.192.0/18
    RemoteIPTrustedProxy 190.93.240.0/20
    RemoteIPTrustedProxy 188.114.96.0/20
    RemoteIPTrustedProxy 197.234.240.0/22
    RemoteIPTrustedProxy 198.41.128.0/17
    RemoteIPTrustedProxy 162.158.0.0/15
    RemoteIPTrustedProxy 104.16.0.0/13
    RemoteIPTrustedProxy 104.24.0.0/14
    RemoteIPTrustedProxy 172.64.0.0/13
    RemoteIPTrustedProxy 131.0.72.0/22

    ErrorLog /opt/bitnami/apache2/logs/webappindia-error.log
    CustomLog /opt/bitnami/apache2/logs/webappindia-access.log combined
</VirtualHost>
```

Enable required Apache modules:

```bash
sudo /opt/bitnami/apache2/bin/apachectl -M | grep proxy
# If proxy modules aren't loaded:
sudo nano /opt/bitnami/apache2/conf/httpd.conf
# Uncomment these lines:
# LoadModule proxy_module modules/mod_proxy.so
# LoadModule proxy_http_module modules/mod_proxy_http.so
# LoadModule remoteip_module modules/mod_remoteip.so

# Restart Apache
sudo /opt/bitnami/ctlscript.sh restart apache
```

---

## Complete Bitnami Deployment Commands

```bash
# 1. Navigate to your project
cd ~/cc2025

# 2. Ensure dependencies are installed
npm install --legacy-peer-deps

# 3. Create and configure .env
cp .env.example .env
nano .env
# Add your API keys

# 4. Build the application
npm run build

# 5. Start with PM2
pm2 start ecosystem.config.cjs --env production

# 6. Check it's running
pm2 status
pm2 logs corcon2025

# 7. Test locally
curl http://localhost:3000/api/health

# 8. If working, save PM2 processes
pm2 save

# 9. Setup PM2 startup
pm2 startup
# Run the command it outputs (copy/paste the sudo env PATH=... command)

# 10. Configure web server (Nginx OR Apache - choose one)

## Option A: Using Nginx
sudo /opt/bitnami/ctlscript.sh stop apache
sudo systemctl disable bitnami
sudo apt install nginx -y
sudo cp nginx-cloudflare.conf /etc/nginx/sites-available/webappindia.in
sudo ln -s /etc/nginx/sites-available/webappindia.in /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

## Option B: Using Apache (if you prefer)
# See Apache configuration above

# 11. Open firewall ports in Lightsail console
# Ensure ports 80, 443, 22 are open

# 12. Configure Cloudflare DNS
# Point webappindia.in to your Lightsail public IP
# Enable SSL/TLS (Full mode)
```

---

## PM2 File Locations on Bitnami

```bash
# PM2 configuration and logs
~/.pm2/
├── dump.pm2              # Saved process list
├── logs/
│   ├── corcon2025-error.log
│   └── corcon2025-out.log
├── pm2.log               # PM2 system log
└── pids/                 # Process ID files

# View PM2 files
ls -la ~/.pm2/

# View saved processes
cat ~/.pm2/dump.pm2

# View PM2 logs
pm2 logs corcon2025
# OR
tail -f ~/.pm2/logs/corcon2025-out.log
tail -f ~/.pm2/logs/corcon2025-error.log
```

---

## Troubleshooting on Bitnami

### Issue: Port 3000 Already in Use

```bash
# Check what's using port 3000
sudo lsof -i :3000

# If it's an old Node process
pkill -f node

# Try starting PM2 again
pm2 start ecosystem.config.cjs --env production
```

### Issue: Apache Won't Stop

```bash
# Force stop Apache
sudo /opt/bitnami/ctlscript.sh stop apache
sudo systemctl stop bitnami
sudo systemctl disable bitnami

# Check if it's still running
ps aux | grep apache
```

### Issue: PM2 Not Found After Restart

```bash
# Check PM2 location
which pm2

# Add to PATH if needed
echo 'export PATH=$PATH:/opt/bitnami/node/bin' >> ~/.bashrc
source ~/.bashrc
```

### Issue: Application Not Starting

```bash
# Check PM2 logs
pm2 logs corcon2025

# Check if .env exists and has values
cat .env

# Check if dist/ exists
ls -la dist/

# Try running manually to see errors
cd ~/cc2025
node server.js
```

---

## Differences in File Paths

| File | Standard Ubuntu | Bitnami |
|------|----------------|---------|
| Node.js | `/usr/bin/node` | `/opt/bitnami/node/bin/node` |
| npm | `/usr/bin/npm` | `/opt/bitnami/node/bin/npm` |
| PM2 | `/usr/lib/node_modules/pm2` | `/opt/bitnami/node/lib/node_modules/pm2` |
| Home | `/home/ubuntu` | `/home/bitnami` |
| Web Server | Nginx (manual install) | Apache (pre-installed) |

---

## Future Deployments on Bitnami

```bash
cd ~/cc2025
./deploy.sh

# OR manually:
git pull origin main
npm install --legacy-peer-deps
npm run build
pm2 restart corcon2025
```

---

## Summary: What You Need to Do Right Now

```bash
# You're here: ~/cc2025
# You've run: pm2 save && pm2 startup
# But PM2 says no processes are running

# Fix: Start the application FIRST!
pm2 start ecosystem.config.cjs --env production

# Then save
pm2 save

# Then setup startup
pm2 startup
# Copy and run the command it outputs

# Then configure your web server (Nginx or Apache)
```

That's it! The key was starting the app with PM2 before trying to save it.
