#!/bin/bash

# CORCON 2025 - Complete Server Setup Script
# Run this on your AWS Lightsail Ubuntu instance
# Usage: bash server-setup.sh

set -e  # Exit on error

echo "================================================"
echo "CORCON 2025 - Server Setup Script"
echo "================================================"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print success message
success() {
    echo "✅ $1"
}

# Function to print error message
error() {
    echo "❌ $1"
}

# Function to print info message
info() {
    echo "ℹ️  $1"
}

echo "Step 1: Updating system packages..."
echo "-----------------------------------"
sudo apt update
sudo apt upgrade -y
success "System updated"
echo ""

echo "Step 2: Installing Node.js 18..."
echo "-----------------------------------"
if command_exists node; then
    NODE_VERSION=$(node --version)
    info "Node.js already installed: $NODE_VERSION"
    read -p "Reinstall Node.js? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
else
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
success "Node.js installed: $NODE_VERSION"
success "npm installed: $NPM_VERSION"
echo ""

echo "Step 3: Installing PM2..."
echo "-----------------------------------"
if command_exists pm2; then
    PM2_VERSION=$(pm2 --version)
    info "PM2 already installed: $PM2_VERSION"
else
    sudo npm install -g pm2
    # Fix PM2 path if needed
    if ! command_exists pm2; then
        sudo ln -s /usr/lib/node_modules/pm2/bin/pm2 /usr/bin/pm2
    fi
fi

PM2_VERSION=$(pm2 --version)
success "PM2 installed: $PM2_VERSION"
echo ""

echo "Step 4: Installing Nginx..."
echo "-----------------------------------"
if command_exists nginx; then
    NGINX_VERSION=$(nginx -v 2>&1)
    info "Nginx already installed: $NGINX_VERSION"
else
    sudo apt install nginx -y
fi

NGINX_VERSION=$(nginx -v 2>&1)
success "Nginx installed: $NGINX_VERSION"
echo ""

echo "Step 5: Installing Git..."
echo "-----------------------------------"
if command_exists git; then
    GIT_VERSION=$(git --version)
    info "Git already installed: $GIT_VERSION"
else
    sudo apt install git -y
fi

GIT_VERSION=$(git --version)
success "Git installed: $GIT_VERSION"
echo ""

echo "Step 6: Installing additional tools..."
echo "-----------------------------------"
sudo apt install -y curl wget htop ufw
success "Additional tools installed"
echo ""

echo "Step 7: Configuring firewall (UFW)..."
echo "-----------------------------------"
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
echo "y" | sudo ufw enable || true
success "Firewall configured"
echo ""

echo "================================================"
echo "Installation Summary"
echo "================================================"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "PM2: $(pm2 --version)"
echo "Nginx: $(nginx -v 2>&1)"
echo "Git: $(git --version)"
echo ""
echo "✅ Server setup complete!"
echo ""
echo "Next steps:"
echo "1. Clone repository: git clone https://github.com/MasiwalNikesh/cc2025.git"
echo "2. Navigate to: cd cc2025"
echo "3. Install dependencies: npm install --legacy-peer-deps"
echo "4. Create .env file: cp .env.example .env && nano .env"
echo "5. Build application: npm run build"
echo "6. Configure Nginx: sudo cp nginx-cloudflare.conf /etc/nginx/sites-available/webappindia.in"
echo "7. Start application: pm2 start ecosystem.config.cjs --env production"
echo ""
echo "For detailed instructions, see CLOUDFLARE-SETUP.md"
echo "================================================"
