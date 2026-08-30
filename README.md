# Neela Sathwik — Personal Portfolio Website

A personal portfolio website for **Sathwik Neela** (Graphic Designer, Cinematic Video Editor & AI Prompt Engineer).

---

## 🏗️ Architecture Overview

The repository is organized with a clear separation of frontend and backend:

```text
Neela-Sathwik-website/
│
├── [FRONTEND] — Static Web App (Deploy to Vercel)
│   ├── index.html
│   ├── about.html
│   ├── portfolio.html
│   ├── services.html
│   ├── testimonials.html
│   ├── contact.html
│   ├── creative-flyers.html
│   ├── logos.html
│   ├── motion-graphics.html
│   ├── websites.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── config.js       # Frontend API configuration
│   │   └── script.js       # UI interactions & form handlers
│   ├── images/             # Visual portfolio assets
│   ├── Videos/             # Portfolio video previews
│   ├── My image/           # Profile images
│   ├── Resume/             # PDF resume file
│   ├── Clinet logos/       # Client logo assets
│   ├── vercel.json         # Vercel deployment config
│   └── old_version/        # Previous iteration backup
│
├── [BACKEND] — Node.js / Express API (Deploy to Render)
│   └── backend/
│       ├── server.js               # Main Express entry point
│       ├── package.json            # Node.js dependencies & scripts
│       ├── routes/
│       │   └── contact.js          # Contact & quote API routes
│       ├── controllers/
│       │   └── contactController.js# Form submission controller
│       ├── services/
│       │   └── googleScriptService.js # Google Apps Script forwarder
│       ├── middleware/
│       │   └── validation.js       # Payload validation & sanitization
│       ├── .env.example            # Environment variables template
│       └── README.md               # Backend documentation
│
└── .gitignore                      # Git ignore file (node_modules, .env)
```

---

## 🚀 Deployment Guide

### Part 1: Deploy Backend to Render (Web Service)

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service**.
2. Connect your GitHub repository: `Neela-Sathwik-website`.
3. Configure the following settings:
   - **Name**: `neela-sathwik-backend` (or your preferred name)
   - **Region**: Nearest to your audience (e.g., Singapore / Oregon / Frankfurt)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add **Environment Variables** in Render:
   - `PORT`: `5000` (optional, Render provides this automatically)
   - `FRONTEND_URL`: `https://<your-vercel-domain>.vercel.app`
   - `GOOGLE_SCRIPT_URL`: `https://script.google.com/macros/s/AKfycbxpsmKj8r6Qr-x6iDdOWo4sbss5qQJrC1PZKVpDzmzyQmOjvtIEBBQVcL5qrVDC3rvhEA/exec`
5. Click **Create Web Service**.
6. Once deployed, copy your Render URL (e.g., `https://neela-sathwik-backend.onrender.com`).

---

### Part 2: Connect Frontend & Deploy to Vercel

1. In `js/config.js`, update the `RENDER_API_URL` variable with your live Render backend URL:
   ```javascript
   const RENDER_API_URL = 'https://neela-sathwik-backend.onrender.com';
   ```
2. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Update Render API URL in config"
   git push origin main
   ```
3. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** → **Project**.
4. Import your GitHub repository: `Neela-Sathwik-website`.
5. Configure Vercel settings:
   - **Framework Preset**: `Other`
   - **Root Directory**: `./` (leave default)
   - **Build Command**: (leave empty / default)
   - **Output Directory**: (leave empty / default)
6. Click **Deploy**.

---

## 🧪 Local Testing

### 1. Test Backend Locally
```bash
cd backend
npm install
npm start
```
Verify health:
- Visit `http://localhost:5000/api/health` in your browser.

### 2. Test Frontend Locally
Open `index.html` with VS Code Live Server (or `npx serve .`):
- Test navigating across all pages.
- Submit the contact form on `contact.html` or quote forms on `services.html`.
- Confirm submissions appear in your Google Sheet and open WhatsApp.
