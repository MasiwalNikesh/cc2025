#!/bin/bash

# CORCON 2025 Deployment Script for AWS Lightsail
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Pull latest changes from git
echo "📥 Pulling latest changes from git..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Build the project
echo "🔨 Building the project..."
npm run build

# Create logs directory if it doesn't exist
if [ ! -d "logs" ]; then
    echo "📁 Creating logs directory..."
    mkdir -p logs
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "⚠️  PM2 is not installed. Installing PM2 globally..."
    npm install -g pm2
fi

# Restart or start the application with PM2
echo "🔄 Restarting application with PM2..."
if pm2 list | grep -q "corcon2025"; then
    pm2 restart ecosystem.config.cjs --env production
else
    pm2 start ecosystem.config.cjs --env production
fi

# Save PM2 process list
pm2 save

echo "✅ Deployment completed successfully!"
echo "📊 Application status:"
pm2 status
