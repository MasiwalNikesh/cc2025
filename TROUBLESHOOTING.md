# Troubleshooting Guide

Common issues and solutions for CORCON 2025 deployment.

## PM2 Issues

### Error: "File ecosystem.config.js malformated - module is not defined in ES module scope"

**Full Error:**
```
[PM2][ERROR] File ecosystem.config.js malformated
ReferenceError: module is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension
and '/home/bitnami/cc2025/package.json' contains "type": "module".
```

**Cause:** The project uses ES modules (`"type": "module"` in package.json), but PM2's ecosystem config file uses CommonJS syntax (`module.exports`).

**Solution:** The file has been renamed to `ecosystem.config.cjs`. Use:

```bash
pm2 start ecosystem.config.cjs --env production
```

**Why this works:** The `.cjs` extension tells Node.js to treat this specific file as CommonJS, even when the rest of the project uses ES modules.

---

### Error: "PM2 is not managing any process, skipping save"

**Full Error:**
```
[PM2][WARN] PM2 is not managing any process, skipping save...
[PM2][WARN] To force saving use: pm2 save --force
```

**Cause:** You're trying to save PM2's process list before starting any application.

**Solution:** Start the application FIRST, then save:

```bash
# 1. Start application
pm2 start ecosystem.config.cjs --env production

# 2. Verify it's running
pm2 status

# 3. THEN save
pm2 save

# 4. Setup startup
pm2 startup
```

**Correct Order:** START → SAVE → STARTUP

---

### Error: "pm2: command not found"

**Cause:** PM2 is not installed or not in your PATH.

**Solution:**

```bash
# Install PM2 globally
sudo npm install -g pm2

# If still not found (path issue)
sudo ln -s /usr/lib/node_modules/pm2/bin/pm2 /usr/bin/pm2

# For Bitnami instances
sudo ln -s /opt/bitnami/node/lib/node_modules/pm2/bin/pm2 /usr/bin/pm2

# Verify
pm2 --version
```

---

## Nginx Issues

### Error: "nginx: command not found"

**Cause:** Nginx is not installed.

**Solution:**

```bash
sudo apt update
sudo apt install nginx -y

# Verify
nginx -v
```

---

### Error: 502 Bad Gateway

**Cause:** Nginx can't connect to your Node.js application.

**Troubleshooting:**

```bash
# 1. Check if app is running
pm2 status

# 2. If not running, start it
pm2 start ecosystem.config.cjs --env production

# 3. Check if port 3000 is listening
sudo lsof -i :3000

# 4. Check PM2 logs for errors
pm2 logs corcon2025

# 5. Test connection locally
curl http://localhost:3000/api/health

# 6. Check Nginx config
sudo nginx -t

# 7. Restart Nginx
sudo systemctl restart nginx
```

---

### Error: "Address already in use" (Port 3000)

**Cause:** Another process is using port 3000.

**Solution:**

```bash
# Find what's using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>

# Or kill all node processes
pkill node

# Start PM2 again
pm2 start ecosystem.config.cjs --env production
```

---

## Node.js & npm Issues

### Error: "node: command not found"

**Cause:** Node.js is not installed.

**Solution:**

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

---

### npm WARN: React peer dependency conflicts

**Warning:**
```
npm warn Could not resolve dependency:
npm warn peer react@"^18.2.0" from @react-email/render
```

**Cause:** Project uses React 19, some dependencies expect React 18.

**Solution:** This is **safe to ignore**. Use:

```bash
npm install --legacy-peer-deps
```

See [DEPENDENCY-NOTES.md](./DEPENDENCY-NOTES.md) for details.

---

## Build Issues

### Error: "dist/ directory not found"

**Cause:** You haven't built the application yet.

**Solution:**

```bash
npm run build
```

This creates the `dist/` directory with optimized production files.

---

### Build fails with TypeScript errors

**Solution:**

```bash
# Clear previous build
rm -rf dist/

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Try building again
npm run build
```

---

## Environment Variable Issues

### Application starts but API calls fail

**Cause:** Missing or incorrect environment variables.

**Solution:**

```bash
# Check if .env exists
ls -la .env

# If not, create it
cp .env.example .env

# Edit with your actual values
nano .env
```

Required variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `RESEND_API_KEY`

After editing `.env`, restart the application:

```bash
pm2 restart corcon2025
```

---

## Cloudflare Issues

### SSL Certificate Errors

**Symptoms:** Browser shows "Not Secure" or SSL errors

**Solution:**

1. Check Cloudflare SSL/TLS mode is **"Full"** (not Flexible)
2. Verify DNS records are **Proxied** (orange cloud icon)
3. Wait 5-10 minutes for SSL to provision
4. Clear browser cache or try incognito mode

---

### Website shows Cloudflare error page (520, 521, 522, 523, 524)

**Error 520 - Web Server Returned Unknown Error:**
- Check PM2 logs: `pm2 logs corcon2025`
- Restart application: `pm2 restart corcon2025`

**Error 521 - Web Server Is Down:**
- Check Nginx: `sudo systemctl status nginx`
- Start Nginx: `sudo systemctl start nginx`

**Error 522 - Connection Timed Out:**
- Check firewall allows ports 80, 443
- Verify Lightsail firewall settings

**Error 523 - Origin Unreachable:**
- Verify server IP in Cloudflare DNS
- Check server is running: `pm2 status`

**Error 524 - Timeout:**
- Application is slow or crashed
- Check logs: `pm2 logs corcon2025`

---

## Bitnami-Specific Issues

### Apache conflicts with Nginx

**Cause:** Bitnami instances have Apache pre-installed.

**Solution:**

```bash
# Stop Apache
sudo /opt/bitnami/ctlscript.sh stop apache

# Disable from startup
sudo systemctl disable bitnami

# Or use Apache instead - see BITNAMI-DEPLOYMENT.md
```

---

### PM2 startup command looks different

**On Bitnami:** PM2 paths are different:

```bash
# Ubuntu:
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Bitnami:
sudo env PATH=$PATH:/opt/bitnami/node/bin /opt/bitnami/node/lib/node_modules/pm2/bin/pm2 startup systemd -u bitnami --hp /home/bitnami
```

Use the exact command that `pm2 startup` outputs for your system.

---

## Permission Issues

### Error: "EACCES: permission denied"

**Cause:** Insufficient permissions.

**Solution:**

```bash
# For npm global installs
sudo npm install -g <package>

# For file operations in your project
sudo chown -R $USER:$USER ~/cc2025

# For Nginx/system files
sudo <command>
```

---

## Deployment Script Issues

### deploy.sh: Permission denied

**Cause:** Script isn't executable.

**Solution:**

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Database/Supabase Issues

### Supabase connection fails

**Troubleshooting:**

```bash
# 1. Verify .env has correct values
cat .env | grep SUPABASE

# 2. Test Supabase URL is accessible
curl https://your-project.supabase.co

# 3. Check PM2 logs for Supabase errors
pm2 logs corcon2025 | grep -i supabase
```

---

## Forms Not Submitting

### Email forms not working

**Troubleshooting:**

```bash
# 1. Check Resend API key
cat .env | grep RESEND

# 2. Test API endpoint
curl http://localhost:3000/api/health

# 3. Check PM2 logs
pm2 logs corcon2025 --err

# 4. Verify CORS settings in server.js
cat server.js | grep cors
```

---

## Performance Issues

### High memory usage

**Solution:**

```bash
# Check current usage
pm2 monit

# Restart application
pm2 restart corcon2025

# Increase max memory in ecosystem.config.cjs
nano ecosystem.config.cjs
# Change: max_memory_restart: '1G' to '2G'

pm2 restart corcon2025
```

---

### Application slow to respond

**Troubleshooting:**

```bash
# Check system resources
htop

# Check disk space
df -h

# Check network
ping google.com

# Check application logs
pm2 logs corcon2025
```

---

## Getting More Help

### Check logs

```bash
# PM2 application logs
pm2 logs corcon2025

# Nginx access logs
sudo tail -f /var/log/nginx/webappindia.access.log

# Nginx error logs
sudo tail -f /var/log/nginx/webappindia.error.log

# System logs
sudo journalctl -xe
```

### Check status

```bash
# PM2 status
pm2 status

# Nginx status
sudo systemctl status nginx

# Check listening ports
sudo netstat -tlnp

# Check processes
ps aux | grep node
ps aux | grep nginx
```

---

## Quick Diagnostic Script

Run this to get an overview of your system:

```bash
echo "=== System Info ==="
uname -a
echo ""
echo "=== Node.js ==="
node --version
npm --version
echo ""
echo "=== PM2 ==="
pm2 --version
pm2 status
echo ""
echo "=== Nginx ==="
nginx -v
sudo systemctl status nginx --no-pager
echo ""
echo "=== Ports ==="
sudo lsof -i :3000
sudo lsof -i :80
sudo lsof -i :443
echo ""
echo "=== Disk Space ==="
df -h
echo ""
echo "=== Memory ==="
free -h
```

---

## Still Having Issues?

1. Review the relevant guide:
   - [QUICK-REFERENCE.md](./QUICK-REFERENCE.md) - Commands and checklist
   - [CLOUDFLARE-SETUP.md](./CLOUDFLARE-SETUP.md) - Complete deployment
   - [BITNAMI-DEPLOYMENT.md](./BITNAMI-DEPLOYMENT.md) - Bitnami-specific

2. Check the logs systematically
3. Verify all prerequisites are installed
4. Ensure environment variables are set correctly
5. Test each component individually (Node.js → PM2 → Nginx → Cloudflare)
