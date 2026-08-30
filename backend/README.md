# Backend API — Sathwik Neela Portfolio

Express.js server providing API endpoints for contact form submissions, quote requests, and Google Sheets integration.

## 🚀 Local Development

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run the Server
```bash
npm start
```
Or with automatic reload (Node.js 18+):
```bash
npm run dev
```

The server will start at `http://localhost:5000`.

---

## 📡 API Endpoints

### 1. Health Check
- **`GET /`** or **`GET /api/health`**
- **Response**:
```json
{
  "success": true,
  "message": "Backend is running",
  "timestamp": "2026-08-30T12:00:00.000Z"
}
```

### 2. Contact & Quote Submission
- **`POST /api/contact`**
- **Headers**: `Content-Type: application/json`
- **Body Example**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "service": "Brand Identity",
  "business": "Acme Studio",
  "details": "Looking for brand identity and logo design."
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Message sent successfully",
  "saved": true
}
```

---

## ☁️ Render Deployment Instructions

1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Configure the following build settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables in Render Dashboard:
   - `PORT`: `5000` (or Render will assign automatically)
   - `FRONTEND_URL`: `https://your-vercel-domain.vercel.app`
   - `GOOGLE_SCRIPT_URL`: `https://script.google.com/macros/s/AKfycbxpsmKj8r6Qr-x6iDdOWo4sbss5qQJrC1PZKVpDzmzyQmOjvtIEBBQVcL5qrVDC3rvhEA/exec`
