# 🛡️ Sahayak Sentinel — Emergency Response Platform

A full-stack MERN application for coordinating emergency response, managing volunteers, and monitoring real-time community safety.

---

## 📁 Project Structure

```
sahayak-sentinel/
├── backend/                    # Express + MongoDB Atlas API
│   ├── config/
│   │   └── db.js               # MongoDB Atlas connection
│   ├── controllers/
│   │   ├── adminAuthController.js
│   │   ├── volunteerAuthController.js
│   │   ├── volunteerController.js
│   │   └── incidentController.js
│   ├── middleware/
│   │   └── auth.js             # JWT protect middleware
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Volunteer.js
│   │   └── Incident.js
│   ├── routes/
│   │   ├── adminAuth.js
│   │   ├── volunteerAuth.js
│   │   ├── admin.js
│   │   └── incidents.js
│   ├── .env.example            # ← copy to .env and fill in
│   ├── package.json
│   └── server.js
│
├── frontend/                   # React app
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   └── AdminLayout.jsx
│   │   │   ├── volunteer/
│   │   │   │   └── VolunteerLayout.jsx
│   │   │   └── shared/
│   │   │       └── LoadingSpinner.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── AdminLoginPage.jsx
│   │   │   │   ├── VolunteerLoginPage.jsx
│   │   │   │   └── SignupPage.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx     # Live situation map
│   │   │   │   ├── AdminVolunteers.jsx    # Volunteer directory
│   │   │   │   ├── AdminRankings.jsx      # Leaderboard
│   │   │   │   ├── AdminRoleDirectories.jsx
│   │   │   │   └── AdminNewAccounts.jsx   # Command dispatch
│   │   │   └── volunteer/
│   │   │       ├── VolunteerHome.jsx      # Map page
│   │   │       └── VolunteerSettings.jsx
│   │   ├── services/
│   │   │   └── api.js          # Axios + auto token refresh
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
├── package.json                # Root — run both servers
└── README.md
```

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd sahayak-sentinel
npm run install-all
```

### 2. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/sahayak-sentinel?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key_change_this_too_min_32_chars
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 3. Run Both Servers

From the root folder:

```bash
npm run dev
```

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

---

## 🔐 Authentication Flow

### Two separate portals:

| Portal | URL | Credentials |
|--------|-----|-------------|
| Admin Command Center | `/admin/login` | Admin ID or Email + Password |
| Volunteer Portal | `/volunteer/login` | Username/Phone + Password |

### JWT Strategy:
- **Access Token** — 15 min expiry, stored in `localStorage`
- **Refresh Token** — 7 day expiry, stored in `localStorage`, rotated on use
- **Auto-refresh** — Axios interceptor automatically refreshes expired access tokens
- **Multi-token invalidation** — All refresh tokens stored per-user in DB, logout invalidates the specific token

---

## 🌐 API Reference

### Admin Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/auth/register` | Create admin account |
| POST | `/api/admin/auth/login` | Login (email or adminId) |
| POST | `/api/admin/auth/refresh` | Refresh access token |
| POST | `/api/admin/auth/logout` | Logout (invalidate refresh token) |
| GET  | `/api/admin/auth/me` | Get current admin |

### Volunteer Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/volunteer/auth/register` | Register (status: pending) |
| POST | `/api/volunteer/auth/login` | Login (email or phone) |
| POST | `/api/volunteer/auth/refresh` | Refresh access token |
| POST | `/api/volunteer/auth/logout` | Logout |
| GET  | `/api/volunteer/auth/me` | Get current volunteer |

### Admin Operations (requires admin JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard/stats` | Dashboard statistics |
| GET | `/api/admin/volunteers` | List all volunteers (paginated, searchable) |
| GET | `/api/admin/volunteers/pending` | Pending approval requests |
| GET | `/api/admin/volunteers/rankings` | Leaderboard |
| GET | `/api/admin/volunteers/:id` | Single volunteer |
| PATCH | `/api/admin/volunteers/:id/approve` | Approve volunteer |
| PATCH | `/api/admin/volunteers/:id/reject` | Reject volunteer |

### Incidents (requires admin JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/incidents` | List incidents |
| POST | `/api/incidents` | Create incident |
| PATCH | `/api/incidents/:id` | Update incident |
| POST | `/api/incidents/:id/assign` | Assign volunteers |
| DELETE | `/api/incidents/:id` | Delete incident |

---

## 🎨 Frontend Pages

### Admin Portal
| Page | Route | Description |
|------|-------|-------------|
| Login | `/admin/login` | Command Center Login |
| Dashboard | `/admin/dashboard` | Live Situation Map + Sentinel Status |
| Volunteers | `/admin/volunteers` | Volunteer Directory |
| Role Directories | `/admin/role-directories` | Doctors, Ambulance, Medical Owners |
| Rankings | `/admin/rankings` | Volunteer Leaderboard |
| New Accounts | `/admin/new-accounts` | Command Dispatch + Approvals |

### Volunteer Portal
| Page | Route | Description |
|------|-------|-------------|
| Login | `/volunteer/login` | Sentinel Login |
| Signup | `/volunteer/signup` | Volunteer Application |
| Home/Map | `/volunteer/home` | Map + Emergency Actions |
| Settings | `/volunteer/settings` | Profile + Security Lockdown |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6 |
| Styling | Pure CSS with CSS Variables |
| HTTP Client | Axios with interceptors |
| Backend | Node.js, Express 4 |
| Database | MongoDB Atlas (Mongoose 8) |
| Auth | JWT (access + refresh tokens), bcryptjs |
| Security | helmet, cors, express-rate-limit |
| Dev | nodemon, concurrently |

---

## 🔧 Creating First Admin

Since there's no admin seeder, register via API:

```bash
curl -X POST http://localhost:5000/api/admin/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Commander Singh",
    "email": "admin@sahayak.org",
    "password": "SecurePass123",
    "sector": "Delhi Sector Alpha"
  }'
```

---

## 📦 Environment Variables Reference

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://...

# JWT (use long random strings in production)
JWT_SECRET=...
JWT_REFRESH_SECRET=...
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:3000
```

---

## 🚀 Deployment Notes

1. **MongoDB Atlas**: Whitelist your server IP in Atlas Network Access
2. **Environment**: Set `NODE_ENV=production` and use strong JWT secrets
3. **Frontend build**: Run `npm run build` in `/frontend`, serve the `build/` folder statically
4. **CORS**: Update `CLIENT_URL` to your production frontend URL

---

*© 2024 Sahayak Sentinel. Built for community resilience.*
