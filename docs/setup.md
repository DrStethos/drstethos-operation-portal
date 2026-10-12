# Doctor Stethos Hospital Operations Portal - Setup & Running Guide

## Prerequisites
- **Node.js**: v18 or higher (LTS recommended)
- **MongoDB Atlas** or a running local MongoDB instance (v6.0+)
- **SMTP Server / Credentials** for sending emails

---

## Directory Structure
```
hospital-operations-portal/
├── backend/            # Express, Mongoose, Auth, Modules & Email
├── frontend/           # React, Vite, Tailwind CSS, Lucide
├── docs/               # Architecture, API & Setup Documentation
└── README.md
```

---

## Backend Setup

1. **Navigate to backend**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Set your configuration in `.env`:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/drstethos
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   EMAIL_PROVIDER=smtp
   SMTP_HOST=outlook.office365.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=support@trizenventures.com
   SMTP_PASS=your_smtp_password
   EMAIL_FROM_ADDRESS=support@trizenventures.com
   EMAIL_FROM_NAME="Doctor Stethos Operations"
   EMAIL_REPLY_TO=support@trizenventures.com
   FRONTEND_URL=http://localhost:5173
   ```

3. **Seed the Initial Super Admin**:
   ```bash
   npm run seed
   ```
   This creates a default Super Admin account:
   - Email: `admin@drstethos.com`
   - Password: `AdminPassword123!`

4. **Start Backend in Development Mode**:
   ```bash
   npm run dev
   ```
   The backend server runs on `http://localhost:5000`.

---

## Frontend Setup

1. **Navigate to frontend**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start Frontend Development Server**:
   ```bash
   npm run dev
   ```
   The portal UI runs on `http://localhost:5173`.

---

## Testing the Application

1. Open `http://localhost:5173` in your browser.
2. Log in using:
   - Email: `admin@drstethos.com`
   - Password: `AdminPassword123!`
3. Manage hospitals, send team invitations, and upload hospital Excel sheets.

