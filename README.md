# 🌐 AWS Route 53 Clone

A full-stack **AWS Route 53 Clone** built with **Next.js, FastAPI, and SQLite**. The project recreates the core Route 53 user experience and workflows, including authentication, hosted zone management, DNS record management, search, pagination, and persistent storage.

## 🚀 Live Demo

- 🌐 **Frontend:** https://dns-route-53.vercel.app/
- ⚙️ **Backend API:** https://aws-route-53-clone-production.up.railway.app/
- ❤️ **Health Check:** https://aws-route-53-clone-production.up.railway.app/health

---

## ✨ Features

### 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Bearer token authentication
- Session persistence
- Protected API requests
- Logout

### 🌐 Hosted Zones

Users can:

- View hosted zones
- Search hosted zones
- Create hosted zones
- Edit hosted zones
- Delete hosted zones
- Use pagination

All hosted zone data is persisted in SQLite.

### 📄 DNS Records

Users can manage DNS records within hosted zones.

Supported record types:

- A
- AAAA
- CNAME
- TXT
- MX
- NS
- PTR
- SRV
- CAA

Users can:

- View records
- Search records
- Create records
- Edit records
- Delete records

### 🧭 Route 53 Experience

The frontend recreates the Route 53 experience with:

- AWS-inspired navigation
- Hosted zone management
- DNS record management
- Tables
- Search
- Pagination
- Forms
- Notifications

### 🚧 Mocked Sections

The following sections are included as placeholder pages:

- Dashboard
- Traffic Policies
- Health Checks
- Resolver
- Profiles

---

# 🛠️ Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- CSS

## Backend

- FastAPI
- Python
- SQLAlchemy
- Pydantic

## Database

- SQLite

## Deployment

- Frontend: Vercel
- Backend: Railway
- Version Control: GitHub

---

# 📁 Project Structure

```text
AWS-Route-53-Clone/
│
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   ├── models/
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── hosted_zones.py
│   │   │   └── records.py
│   │   ├── schemas/
│   │   ├── database.py
│   │   ├── deps.py
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── route53.db
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── health-checks/
│   │   ├── hosted-zones/
│   │   ├── login/
│   │   ├── profiles/
│   │   ├── resolver/
│   │   ├── traffic-policies/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   ├── lib/
│   │   └── api.ts
│   ├── public/
│   └── package.json
│
└── README.md
```

---

# ⚙️ Running the Project Locally

## 1. Clone the Repository

```bash
git clone https://github.com/Nishikakansal/AWS-Route-53-Clone-.git
cd AWS-Route-53-Clone-
```

---

# 🖥️ Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the FastAPI server:

```bash
uvicorn app.main:app --reload
```

The backend will run at:

```text
http://localhost:8000
```

### API Documentation

```text
http://localhost:8000/docs
```

---

# 🎨 Frontend Setup

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🔗 API Integration

For local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production:

```env
NEXT_PUBLIC_API_URL=https://aws-route-53-clone-production.up.railway.app
```

The frontend communicates with the FastAPI backend using this environment variable.

Authentication tokens are sent using:

```text
Authorization: Bearer <access_token>
```

---

# 🗄️ Database

The project uses **SQLite** with **SQLAlchemy**.

```python
DATABASE_URL = "sqlite:///./route53.db"
```

The application stores persistent data for:

- Users
- Hosted Zones
- DNS Records

Database tables are created when the application starts:

```python
Base.metadata.create_all(bind=engine)
```

---

# ❤️ Health Check

### Endpoint

```text
GET /health
```

### Example Response

```json
{
  "status": "Backend is running"
}
```

Production Health Check:

https://aws-route-53-clone-production.up.railway.app/health

---

# 🌍 Deployment Architecture

```text
                    ┌──────────────────────┐
                    │      User Browser    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Vercel         │
                    │   Next.js Frontend   │
                    └──────────┬───────────┘
                               │
                           API Requests
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Railway        │
                    │   FastAPI Backend    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   SQLite Database    │
                    └──────────────────────┘
```

---

# 🚀 Deployment

## 🌐 Frontend — Vercel

Live Application:

https://dns-route-53.vercel.app/

Root Directory:

```text
frontend
```

Environment Variable:

```env
NEXT_PUBLIC_API_URL=https://aws-route-53-clone-production.up.railway.app
```

---

## ⚙️ Backend — Railway

Production API:

https://aws-route-53-clone-production.up.railway.app/

The backend handles:

- Authentication
- Hosted Zone APIs
- DNS Record APIs
- Database operations

---

# 🔒 CORS Configuration

For production:

```env
FRONTEND_URL=https://dns-route-53.vercel.app
```

For local development:

```text
http://localhost:3000
```

---

# 📡 API Overview

## Authentication

```text
POST /auth/register
POST /auth/login
```

## Hosted Zones

```text
GET    /hosted-zones
POST   /hosted-zones
GET    /hosted-zones/{id}
PUT    /hosted-zones/{id}
DELETE /hosted-zones/{id}
```

### Search Hosted Zones

```text
GET /hosted-zones?search=example
```

### Hosted Zone Pagination

```text
GET /hosted-zones?page=1&limit=5
```

## DNS Records

```text
GET    /records
POST   /records
GET    /records/{id}
PUT    /records/{id}
DELETE /records/{id}
```

---

# 🎯 Future Improvements

- [ ] PostgreSQL integration
- [ ] Password hashing
- [ ] Advanced DNS record validation
- [ ] Import DNS records from BIND zone files
- [ ] Export hosted zones as JSON
- [ ] Export hosted zones as BIND format
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Bulk operations
- [ ] Role-based access control
- [ ] Docker support

---

# 🧠 What I Learned

- Full-stack application development
- Next.js and React
- TypeScript
- FastAPI
- REST API design
- JWT authentication
- SQLAlchemy ORM
- SQLite database management
- Frontend-backend integration
- CORS configuration
- Environment variables
- Vercel deployment
- Railway deployment
- Git and GitHub workflows

---

# 👩‍💻 Author

**Nishika Kansal**

CSE Student | Aspiring Software Development Engineer | AI/ML Enthusiast

GitHub: https://github.com/Nishikakansal

---

# 📄 License

This project was created for **educational and learning purposes**.

It is inspired by Amazon Route 53 concepts and user experience and is **not affiliated with or endorsed by Amazon Web Services (AWS)**.