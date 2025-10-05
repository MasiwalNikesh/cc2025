# Cloudflare Configuration Guide for webappindia.in

This guide covers the complete Cloudflare setup for deploying CORCON 2025 to AWS Lightsail with Cloudflare SSL.

## Deployment Details

- **Domain**: webappindia.in
- **Server IP**: 13.200.253.158
- **Git Repository**: https://github.com/MasiwalNikesh/cc2025.git
- **SSL Provider**: Cloudflare (Proxy + SSL)

---

## Part 1: Cloudflare DNS Configuration

### Step 1: Add Your Domain to Cloudflare

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **"Add a Site"**
3. Enter `webappindia.in` and click **Continue**
4. Select your plan (Free plan is sufficient)
5. Cloudflare will scan your existing DNS records

### Step 2: Configure DNS Records

Add the following DNS records:

| Type | Name | Content | Proxy Status | TTL |
|------|------|---------|--------------|-----|
| A | @ | 13.200.253.158 | Proxied (🟠) | Auto |
| A | www | 13.200.253.158 | Proxied (🟠) | Auto |

**Important**:
- Ensure the **Proxy status** is set to **"Proxied"** (orange cloud icon 🟠)
- This enables Cloudflare's CDN, DDoS protection, and SSL

### Step 3: Update Nameservers

1. Cloudflare will provide you with 2 nameservers (e.g., `ana.ns.cloudflare.com`, `bob.ns.cloudflare.com`)
2. Go to your domain registrar's control panel
3. Update the nameservers to the ones provided by Cloudflare
4. Wait for DNS propagation (can take 24-48 hours, usually faster)

### Step 4: Verify DNS Setup

Check DNS propagation:
```bash
# Check A record for webappindia.in
dig webappindia.in +short

# Check A record for www.webappindia.in
dig www.webappindia.in +short
```

Both should return Cloudflare IPs (not your server IP directly).

---

## Part 2: Cloudflare SSL/TLS Configuration

### Step 1: Configure SSL/TLS Mode

1. In Cloudflare Dashboard, go to **SSL/TLS** → **Overview**
2. Set encryption mode to **"Full"**
   - **Flexible**: ❌ Not secure (HTTP between Cloudflare and server)
   - **Full**: ✅ Recommended (Cloudflare uses any cert on server)
   - **Full (Strict)**: ⚠️ Requires valid SSL cert on server

**For Lightsail with Nginx**: Use **"Full"** mode (no need for origin certificate)

### Step 2: Enable Always Use HTTPS

1. Go to **SSL/TLS** → **Edge Certificates**
2. Enable **"Always Use HTTPS"** - This redirects all HTTP requests to HTTPS
3. Enable **"Automatic HTTPS Rewrites"**

### Step 3: Configure Minimum TLS Version

1. In **SSL/TLS** → **Edge Certificates**
2. Set **Minimum TLS Version** to **TLS 1.2**
3. Enable **TLS 1.3** for better performance

### Step 4: Enable HSTS (Optional but Recommended)

1. Go to **SSL/TLS** → **Edge Certificates**
2. Enable **HTTP Strict Transport Security (HSTS)**
3. Configuration:
   - Max Age Header: 6 months (15768000)
   - Apply HSTS policy to subdomains: ✅
   - Preload: ✅ (only if you're sure)

---

## Part 3: Cloudflare Performance Optimization

### Step 1: Enable Auto Minify

1. Go to **Speed** → **Optimization**
2. Enable Auto Minify for:
   - ✅ JavaScript
   - ✅ CSS
   - ✅ HTML

### Step 2: Configure Caching

1. Go to **Caching** → **Configuration**
2. Set **Caching Level** to **Standard**
3. Set **Browser Cache TTL** to **4 hours** or **1 day**

### Step 3: Enable Brotli Compression

1. Go to **Speed** → **Optimization**
2. Enable **Brotli** compression

### Step 4: Create Page Rules (Optional)

Create a page rule for caching static assets:

1. Go to **Rules** → **Page Rules**
2. Click **Create Page Rule**
3. URL Pattern: `webappindia.in/*.{jpg,jpeg,png,gif,svg,css,js,woff,woff2}`
4. Settings:
   - Cache Level: Cache Everything
   - Edge Cache TTL: 1 month
   - Browser Cache TTL: 1 month

---

## Part 4: Cloudflare Security Settings

### Step 1: Configure Firewall Rules

1. Go to **Security** → **WAF**
2. Enable **Managed Rules**
3. Set Security Level to **Medium**

### Step 2: Enable DDoS Protection

Cloudflare provides automatic DDoS protection. Verify:

1. Go to **Security** → **DDoS**
2. Ensure DDoS protection is **Active**

### Step 3: Configure Bot Fight Mode (Optional)

1. Go to **Security** → **Bots**
2. Enable **Bot Fight Mode** (Free plan)

### Step 4: Block Specific Countries (Optional)

If needed, block traffic from specific countries:

1. Go to **Security** → **WAF**
2. Create a custom rule:
   - Expression: `(ip.geoip.country eq "XX")`
   - Action: Block

---

## Part 5: Server Deployment (Lightsail)

### Step 1: Connect to Your Lightsail Instance

```bash
ssh ubuntu@13.200.253.158
```

Or use AWS Lightsail browser-based SSH.

### Step 2: Update System and Install Prerequisites

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should be v18.x or higher
npm --version

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install Git (if not already installed)
sudo apt install git -y
```

### Step 3: Clone the Repository

```bash
cd /home/ubuntu
git clone https://github.com/MasiwalNikesh/cc2025.git
cd cc2025
```

### Step 4: Install Dependencies

```bash
npm install
```

This will install all production and development dependencies.

### Step 5: Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit environment variables
nano .env
```

Update the `.env` file with your actual values:

```env
NODE_ENV=production
PORT=3000

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Resend Email Service
RESEND_API_KEY=re_your_actual_resend_api_key

# Analytics (Optional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# App Configuration
VITE_APP_NAME=CORCON 2025
VITE_APP_URL=https://webappindia.in

# API Endpoints
VITE_API_BASE_URL=https://webappindia.in/api
```

Save and exit (Ctrl+X, then Y, then Enter).

### Step 6: Build the Application

```bash
npm run build
```

This creates an optimized production build in the `dist` directory.

### Step 7: Configure Nginx

```bash
# Copy the Cloudflare-optimized Nginx config
sudo cp nginx-cloudflare.conf /etc/nginx/sites-available/webappindia.in

# Create symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/webappindia.in /etc/nginx/sites-enabled/

# Remove default Nginx site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# If test passes, restart Nginx
sudo systemctl restart nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx
```

### Step 8: Start Application with PM2

```bash
# Create logs directory
mkdir -p logs

# Start the application
pm2 start ecosystem.config.js --env production

# View application status
pm2 status

# View logs
pm2 logs corcon2025

# Save PM2 process list
pm2 save

# Configure PM2 to start on system boot
pm2 startup

# Run the command that PM2 outputs (it will be something like):
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

### Step 9: Configure Lightsail Firewall

1. Go to [AWS Lightsail Console](https://lightsail.aws.amazon.com/)
2. Click on your instance
3. Go to **Networking** tab
4. Under **Firewall**, ensure these ports are open:
   - SSH: TCP 22
   - HTTP: TCP 80
   - HTTPS: TCP 443

---

## Part 6: Verification and Testing

### Step 1: Test the Deployment

```bash
# Test locally on the server
curl http://localhost:3000/api/health

# Expected output: {"status":"ok","timestamp":"..."}
```

### Step 2: Test from Your Browser

1. Visit `http://webappindia.in` (should redirect to HTTPS automatically)
2. Visit `https://webappindia.in`
3. Check SSL certificate (click on padlock icon in browser)
4. Test all functionality:
   - Page navigation
   - Forms submission
   - API endpoints

### Step 3: Check PM2 Status

```bash
pm2 status
pm2 logs corcon2025
```

### Step 4: Check Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/webappindia.access.log

# Error logs
sudo tail -f /var/log/nginx/webappindia.error.log
```

---

## Part 7: Future Deployments

For updating the application after initial deployment:

### Option 1: Manual Deployment

```bash
cd /home/ubuntu/cc2025
git pull origin main
npm install
npm run build
pm2 restart corcon2025
```

### Option 2: Using the Deployment Script

```bash
cd /home/ubuntu/cc2025
./deploy.sh
```

The script automatically:
1. Pulls latest code from Git
2. Installs dependencies
3. Builds the application
4. Restarts PM2 process

---

## Troubleshooting

### Issue: Website Not Loading

**Check Cloudflare Status:**
```bash
# Check DNS resolution
dig webappindia.in +short
nslookup webappindia.in
```

**Check Nginx:**
```bash
sudo systemctl status nginx
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

**Check Node.js Application:**
```bash
pm2 status
pm2 logs corcon2025
```

### Issue: SSL Certificate Error

1. Check Cloudflare SSL/TLS mode (should be "Full")
2. Verify DNS is proxied through Cloudflare (orange cloud)
3. Clear browser cache and try incognito mode

### Issue: Application Crashes

```bash
# Check PM2 logs
pm2 logs corcon2025 --err

# Check if port 3000 is in use
sudo lsof -i :3000

# Restart application
pm2 restart corcon2025
```

### Issue: 502 Bad Gateway

This means Nginx cannot connect to the Node.js application:

```bash
# Check if application is running
pm2 status

# Check if port 3000 is listening
sudo netstat -tlnp | grep 3000

# Restart application
pm2 restart corcon2025

# Check application logs
pm2 logs corcon2025
```

### Issue: Real IP Not Showing

If logs show Cloudflare IPs instead of visitor IPs:

1. Verify `nginx-cloudflare.conf` is properly configured
2. Update Cloudflare IP ranges (they change occasionally)
3. Check `real_ip_header CF-Connecting-IP;` is set

### Issue: Forms Not Submitting

1. Check Resend API key is correct in `.env`
2. Verify API endpoints are working: `curl https://webappindia.in/api/health`
3. Check CORS settings in `server.js`
4. Review PM2 logs: `pm2 logs corcon2025`

---

## Useful Commands Reference

### PM2 Commands
```bash
pm2 list                    # List all processes
pm2 status                  # Show process status
pm2 logs corcon2025         # View logs
pm2 logs corcon2025 --err   # View error logs only
pm2 restart corcon2025      # Restart application
pm2 stop corcon2025         # Stop application
pm2 delete corcon2025       # Remove from PM2
pm2 monit                   # Monitor CPU/Memory
pm2 save                    # Save process list
pm2 resurrect               # Restore saved processes
```

### Nginx Commands
```bash
sudo systemctl status nginx     # Check Nginx status
sudo systemctl restart nginx    # Restart Nginx
sudo systemctl reload nginx     # Reload config without downtime
sudo nginx -t                   # Test configuration
sudo tail -f /var/log/nginx/webappindia.access.log  # View access logs
sudo tail -f /var/log/nginx/webappindia.error.log   # View error logs
```

### System Monitoring
```bash
htop                       # Interactive process viewer
df -h                      # Disk usage
free -h                    # Memory usage
netstat -tlnp              # Check listening ports
sudo lsof -i :3000         # Check what's using port 3000
journalctl -u nginx        # View Nginx system logs
```

---

## Performance Monitoring

### Enable PM2 Log Rotation

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

### Monitor Application Performance

```bash
# Real-time monitoring
pm2 monit

# Check memory usage
pm2 describe corcon2025
```

### Cloudflare Analytics

1. Go to **Analytics & Logs** in Cloudflare Dashboard
2. Monitor:
   - Requests over time
   - Bandwidth usage
   - Threats blocked
   - Cache hit ratio

---

## Security Best Practices

1. **Keep Software Updated**
   ```bash
   sudo apt update && sudo apt upgrade -y
   npm update
   ```

2. **Use Firewall (UFW)**
   ```bash
   sudo ufw allow 22/tcp    # SSH
   sudo ufw allow 80/tcp    # HTTP
   sudo ufw allow 443/tcp   # HTTPS
   sudo ufw enable
   ```

3. **Restrict SSH Access**
   - Use SSH keys instead of passwords
   - Change default SSH port (optional)
   - Limit SSH access to specific IPs

4. **Monitor Server Resources**
   - Set up alerts for high CPU/memory usage
   - Monitor disk space regularly

5. **Regular Backups**
   ```bash
   # Backup application
   tar -czf ~/backup-$(date +%Y%m%d).tar.gz /home/ubuntu/cc2025

   # Backup database (if applicable)
   # Add your database backup commands here
   ```

---

## Support and Resources

- **Cloudflare Documentation**: https://developers.cloudflare.com/
- **PM2 Documentation**: https://pm2.keymetrics.io/
- **Nginx Documentation**: https://nginx.org/en/docs/
- **AWS Lightsail**: https://lightsail.aws.amazon.com/

For issues specific to this deployment, check:
1. PM2 logs: `pm2 logs corcon2025`
2. Nginx logs: `/var/log/nginx/webappindia.error.log`
3. System logs: `journalctl -xe`

---

## Next Steps After Deployment

1. ✅ Verify SSL certificate is working
2. ✅ Test all forms and API endpoints
3. ✅ Enable Cloudflare analytics
4. ✅ Set up monitoring alerts
5. ✅ Configure automatic backups
6. ✅ Document your custom configurations
7. ✅ Set up staging environment (optional)

**Congratulations! Your site should now be live at https://webappindia.in** 🎉
