# Alternative Deployment Options

If you prefer not to use PM2 or encounter issues with it, here are alternative deployment methods.

---

## Option 1: Using Systemd (Recommended Alternative)

Systemd is built into Ubuntu and doesn't require any additional installation.

### Step 1: Create Systemd Service File

```bash
sudo nano /etc/systemd/system/corcon2025.service
```

Add this content:

```ini
[Unit]
Description=CORCON 2025 Node.js Application
Documentation=https://github.com/MasiwalNikesh/cc2025
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/cc2025
Environment=NODE_ENV=production
Environment=PORT=3000
EnvironmentFile=/home/ubuntu/cc2025/.env
ExecStart=/usr/bin/node /home/ubuntu/cc2025/server.js
Restart=on-failure
RestartSec=10
StandardOutput=append:/home/ubuntu/cc2025/logs/out.log
StandardError=append:/home/ubuntu/cc2025/logs/err.log

# Security settings
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

Save and exit (Ctrl+X, Y, Enter).

### Step 2: Create Logs Directory

```bash
mkdir -p /home/ubuntu/cc2025/logs
```

### Step 3: Enable and Start Service

```bash
# Reload systemd to recognize new service
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable corcon2025

# Start the service
sudo systemctl start corcon2025

# Check status
sudo systemctl status corcon2025
```

### Step 4: Useful Systemd Commands

```bash
# Start application
sudo systemctl start corcon2025

# Stop application
sudo systemctl stop corcon2025

# Restart application
sudo systemctl restart corcon2025

# Check status
sudo systemctl status corcon2025

# View logs
sudo journalctl -u corcon2025 -f

# View last 100 lines
sudo journalctl -u corcon2025 -n 100

# View errors only
sudo journalctl -u corcon2025 -p err
```

### Deployment Script for Systemd

Update `deploy.sh` to use systemd instead of PM2:

```bash
#!/bin/bash

set -e

echo "🚀 Starting deployment process..."

if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found."
    exit 1
fi

echo "📥 Pulling latest changes from git..."
git pull origin main

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "🔨 Building the project..."
npm run build

echo "📁 Creating logs directory..."
mkdir -p logs

echo "🔄 Restarting application with systemd..."
sudo systemctl restart corcon2025

echo "✅ Deployment completed successfully!"
echo "📊 Application status:"
sudo systemctl status corcon2025 --no-pager
```

---

## Option 2: Using Forever

Forever is a simpler alternative to PM2.

### Step 1: Install Forever

```bash
sudo npm install -g forever
```

### Step 2: Start Application

```bash
cd /home/ubuntu/cc2025

# Create logs directory
mkdir -p logs

# Start with Forever
forever start \
  --uid "corcon2025" \
  -a \
  -l logs/forever.log \
  -o logs/out.log \
  -e logs/err.log \
  server.js
```

### Step 3: Useful Forever Commands

```bash
# List running apps
forever list

# Stop application
forever stop corcon2025

# Restart application
forever restart corcon2025

# View logs
tail -f logs/forever.log
```

---

## Option 3: Using Screen (Simple, Not Production-Ready)

For testing or temporary deployments.

### Start Application

```bash
cd /home/ubuntu/cc2025

# Start a screen session
screen -S corcon2025

# Inside screen, run the app
npm run prod

# Detach from screen: Press Ctrl+A, then D
```

### Reconnect to Screen

```bash
# List screen sessions
screen -ls

# Reattach to session
screen -r corcon2025
```

### Stop Application

```bash
# Reattach to screen
screen -r corcon2025

# Press Ctrl+C to stop
# Then exit screen
exit
```

**Note:** Screen doesn't auto-restart on crash or reboot. Not recommended for production.

---

## Option 4: Direct Run with Nginx (No Process Manager)

Run Node.js directly and rely on Nginx and manual restarts.

### Step 1: Start Application

```bash
cd /home/ubuntu/cc2025
nohup npm run prod > logs/app.log 2>&1 &
```

### Step 2: Get Process ID

```bash
ps aux | grep node
```

### Step 3: Stop Application

```bash
# Find PID from previous command
kill <PID>

# Or kill all node processes (careful!)
pkill -f "node server.js"
```

**Drawbacks:**
- No auto-restart on crash
- No built-in monitoring
- Manual process management

---

## Comparison Table

| Feature | PM2 | Systemd | Forever | Screen | Direct Run |
|---------|-----|---------|---------|--------|------------|
| Auto-restart | ✅ | ✅ | ✅ | ❌ | ❌ |
| Start on boot | ✅ | ✅ | ❌ | ❌ | ❌ |
| Log management | ✅ | ✅ | ✅ | ⚠️ | ⚠️ |
| Monitoring | ✅ | ⚠️ | ⚠️ | ❌ | ❌ |
| Cluster mode | ✅ | ❌ | ❌ | ❌ | ❌ |
| Built-in | ❌ | ✅ | ❌ | ✅ | ✅ |
| Production-ready | ✅ | ✅ | ⚠️ | ❌ | ❌ |

**Recommendation:**
1. **PM2** - Best for Node.js apps (feature-rich)
2. **Systemd** - Best if you want built-in Linux tools
3. **Forever** - Simple alternative to PM2
4. **Screen/Direct** - Only for testing

---

## Converting from PM2 to Systemd

If you already have PM2 installed and want to switch:

```bash
# Stop and remove from PM2
pm2 stop corcon2025
pm2 delete corcon2025
pm2 save

# Optional: Disable PM2 startup
pm2 unstartup

# Follow Systemd setup steps above
sudo nano /etc/systemd/system/corcon2025.service
# ... (create service file)
sudo systemctl daemon-reload
sudo systemctl enable corcon2025
sudo systemctl start corcon2025
```

---

## Troubleshooting

### Application Won't Start (Systemd)

```bash
# Check service status
sudo systemctl status corcon2025

# View detailed logs
sudo journalctl -u corcon2025 -n 50

# Check if port 3000 is available
sudo lsof -i :3000

# Test running manually
cd /home/ubuntu/cc2025
node server.js
```

### Application Won't Start (Forever)

```bash
# Check Forever list
forever list

# Check logs
tail -f logs/err.log

# Try running manually
node server.js
```

### Port Already in Use

```bash
# Find what's using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>

# Or kill all node processes
sudo pkill node
```

---

## Monitoring (Without PM2)

### Using Systemd

```bash
# Real-time logs
sudo journalctl -u corcon2025 -f

# Check resource usage
systemctl status corcon2025

# Or use htop
htop
```

### Using Top/Htop

```bash
# Install htop if needed
sudo apt install htop -y

# Monitor processes
htop

# Press F4 to filter, type "node"
```

### Log Files

```bash
# Application logs
tail -f /home/ubuntu/cc2025/logs/out.log
tail -f /home/ubuntu/cc2025/logs/err.log

# Nginx logs
sudo tail -f /var/log/nginx/webappindia.access.log
sudo tail -f /var/log/nginx/webappindia.error.log
```

---

## Which Should You Choose?

**Use PM2 if:**
- You want the easiest setup with most features
- You need cluster mode (multiple instances)
- You want built-in monitoring

**Use Systemd if:**
- You prefer built-in Linux tools
- You don't want additional npm packages
- You need tight OS integration

**Use Forever if:**
- You want something simpler than PM2
- You don't need cluster mode
- PM2 is giving you issues

**Don't use Screen/Direct for production** - they're only suitable for testing.
