# CORCON 2025 - Conference Website

Official website for CORCON 2025 conference, built with React 19, TypeScript, and Vite. Deployed on AWS Lightsail with Cloudflare SSL.

## 🚀 Quick Links

- **Live Site**: [https://webappindia.in](https://webappindia.in)
- **Server IP**: 13.200.253.158
- **Repository**: [https://github.com/MasiwalNikesh/cc2025.git](https://github.com/MasiwalNikesh/cc2025.git)

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[QUICK-REFERENCE.md](./QUICK-REFERENCE.md)** | Architecture, commands, checklist ⭐ **START HERE** |
| **[CLOUDFLARE-SETUP.md](./CLOUDFLARE-SETUP.md)** | Complete deployment guide |
| **[BITNAMI-DEPLOYMENT.md](./BITNAMI-DEPLOYMENT.md)** | Bitnami Node.js instance guide 🟠 |
| **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** | Common errors and solutions 🔧 |
| **[ALTERNATIVE-DEPLOYMENT.md](./ALTERNATIVE-DEPLOYMENT.md)** | Systemd & other PM2 alternatives |
| **[DEPENDENCY-NOTES.md](./DEPENDENCY-NOTES.md)** | React 19 compatibility notes |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | General deployment info |

## 🛠 Tech Stack

### Frontend
- **React 19.1.1** - Latest React with improved performance
- **TypeScript** - Type-safe development
- **Vite 7** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router 6** - Client-side routing

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js** - Web server framework
- **Resend** - Transactional email service

### Database & Services
- **Supabase** - Backend as a Service
- **Dexie.js** - IndexedDB wrapper for offline support

### Infrastructure
- **AWS Lightsail** - Cloud hosting (Ubuntu 22.04)
- **Nginx** - Reverse proxy & web server
- **PM2** - Process manager
- **Cloudflare** - DNS, SSL/TLS, CDN, DDoS protection

## 🏗 Architecture

```
Internet
   ↓
Cloudflare (DNS + SSL + CDN)
   ↓
AWS Lightsail (13.200.253.158)
   ├── Nginx (Port 80/443) ← Reverse Proxy
   ├── PM2 ← Process Manager
   └── Node.js (Port 3000)
       ├── Express Server
       ├── API Endpoints
       └── Static Files (React App)
```

## 🚀 Deployment

### First-Time Server Setup

```bash
# 1. SSH to your Lightsail server
ssh ubuntu@13.200.253.158

# 2. Run automated setup script (installs Node.js, Nginx, PM2, Git)
wget https://raw.githubusercontent.com/MasiwalNikesh/cc2025/main/server-setup.sh
bash server-setup.sh

# 3. Clone repository
cd /home/ubuntu
git clone https://github.com/MasiwalNikesh/cc2025.git
cd cc2025

# 4. Install dependencies
npm install --legacy-peer-deps

# 5. Create environment file
cp .env.example .env
nano .env  # Add your API keys

# 6. Build application
npm run build

# 7. Configure Nginx
sudo cp nginx-cloudflare.conf /etc/nginx/sites-available/webappindia.in
sudo ln -s /etc/nginx/sites-available/webappindia.in /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

# 8. Start application with PM2
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

### Future Deployments

```bash
# SSH to server
ssh ubuntu@13.200.253.158
cd /home/ubuntu/cc2025

# Run deployment script
./deploy.sh

# OR manually
git pull origin main
npm install --legacy-peer-deps
npm run build
pm2 restart corcon2025
```

For detailed instructions, see **[CLOUDFLARE-SETUP.md](./CLOUDFLARE-SETUP.md)**

## 💻 Local Development

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher

### Setup

```bash
# Clone repository
git clone https://github.com/MasiwalNikesh/cc2025.git
cd cc2025

# Install dependencies
npm install --legacy-peer-deps

# Copy environment file
cp .env.example .env

# Add your API keys to .env
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - RESEND_API_KEY (for email features)

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run start    # Start production server (after build)
```

## 📁 Project Structure

```
cc2025/
├── src/                    # React application source
│   ├── components/         # Reusable React components
│   ├── pages/             # Page components
│   ├── data/              # Static data
│   └── lib/               # Utilities
├── api/                   # Original Vercel API functions
├── dist/                  # Built files (generated)
├── server.js              # Express server for production
├── ecosystem.config.cjs    # PM2 configuration
├── nginx-cloudflare.conf  # Nginx configuration
├── deploy.sh             # Deployment script
├── server-setup.sh       # Server prerequisites installer
└── .env                  # Environment variables (create from .env.example)
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Server
NODE_ENV=production
PORT=3000

# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Resend (Email)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Analytics (Optional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# App Configuration
VITE_APP_NAME=CORCON 2025
VITE_APP_URL=https://webappindia.in
VITE_API_BASE_URL=https://webappindia.in/api
```

## 🐛 Troubleshooting

### Common Issues

**Issue: `npm install` warnings about React 19**
- **Solution**: Use `npm install --legacy-peer-deps` (already in `.npmrc`)
- See [DEPENDENCY-NOTES.md](./DEPENDENCY-NOTES.md) for details

**Issue: `module is not defined in ES module scope`**
- **Solution**: Use `pm2 start ecosystem.config.cjs` (not `.js`)
- See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#error-file-ecosystemconfigjs-malformated)

**Issue: `PM2 is not managing any process`**
- **Solution**: Start app first: `pm2 start ecosystem.config.cjs --env production`
- See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#error-pm2-is-not-managing-any-process)

**Issue: `nginx: command not found`**
- **Solution**: Install Nginx with `sudo apt install nginx -y`
- See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#error-nginx-command-not-found)

**Issue: `pm2: command not found`**
- **Solution**: Install PM2 with `sudo npm install -g pm2`
- See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#error-pm2-command-not-found)

**Issue: 502 Bad Gateway**
- Check if app is running: `pm2 status`
- See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#error-502-bad-gateway)

📘 **Complete troubleshooting guide**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## 📊 Monitoring

```bash
# Check application status
pm2 status

# View logs
pm2 logs corcon2025

# Monitor CPU/Memory
pm2 monit

# Check Nginx status
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/webappindia.error.log
```

## 🔒 Security

- SSL/TLS provided by Cloudflare
- Nginx reverse proxy
- Environment variables for sensitive data
- CORS configured in Express server
- Cloudflare DDoS protection

## 📝 License

Private project for CORCON 2025 conference.

## 🤝 Contributing

This is a private project. For issues or questions, contact the development team.

## 📞 Support

- Check logs: `pm2 logs corcon2025`
- Review documentation in this repository
- Verify environment variables are set correctly

---

**Built with ❤️ for CORCON 2025**
