🌐 AWS Route 53 Clone

A full-stack AWS Route 53 Clone that recreates core DNS management functionality through a modern AWS-inspired interface.

🚀 Live Demo

Frontend: https://dns-route-53.vercel.app/

Backend API: https://aws-route-53-clone-production.up.railway.app/

Health Check: https://aws-route-53-clone-production.up.railway.app/health

✨ Features

🔐 User authentication

📊 AWS-style dashboard

🌐 Hosted zone management

📄 DNS record management

❤️ Health checks

🔎 DNS resolver interface

🚦 Traffic policies

👤 User profile functionality

🔗 Frontend and backend API integration

🛠️ Tech Stack

Frontend

Next.js

React

TypeScript

CSS

Backend

FastAPI

Python

SQLAlchemy

Pydantic

Database

SQLite

Deployment

Frontend: Vercel

Backend: Railway

Version Control: GitHub

📁 Project Structure

AWS-Route-53-Clone/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── database.py
│   │   └── main.py
│   └── route53.db
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── health-checks/
│   │   ├── hosted-zones/
│   │   ├── login/
│   │   ├── profiles/
│   │   ├── resolver/
│   │   └── traffic-policies/
│   ├── components/
│   ├── lib/
│   └── public/
└── README.md

⚙️ Run Locally

1. Clone the Repository

git clone https://github.com/Nishikakansal/AWS-Route-53-Clone-.git
cd AWS-Route-53-Clone-

🖥️ Backend Setup

cd backend
python -m venv venv

Windows activation

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Run the server:

uvicorn app.main:app --reload

Backend:

http://localhost:8000

API documentation:

http://localhost:8000/docs

🎨 Frontend Setup

cd frontend
npm install

Create .env.local:

NEXT_PUBLIC_API_URL=http://localhost:8000

Run:

npm run dev

Open:

http://localhost:3000

🔗 API Integration

For production, configure:

NEXT_PUBLIC_API_URL=https://aws-route-53-clone-production.up.railway.app

The frontend API client should use:

const API_URL = process.env.NEXT_PUBLIC_API_URL;

🗄️ Database

The project uses SQLite with SQLAlchemy.

DATABASE_URL = "sqlite:///./route53.db"

Database tables are created when the backend starts:

Base.metadata.create_all(bind=engine)

🩺 Health Check

Endpoint:

GET /health

Example response:

{
  "status": "Backend is running"
}

Production:

https://aws-route-53-clone-production.up.railway.app/health

🌍 Deployment Architecture

User Browser
     │
     ▼
Vercel (Next.js Frontend)
     │
     │ API Requests
     ▼
Railway (FastAPI Backend)
     │
     ▼
SQLite Database

🚀 Deployment

Frontend – Vercel

Live application:

https://dns-route-53.vercel.app/

Root Directory:

frontend

Environment Variable:

NEXT_PUBLIC_API_URL=https://aws-route-53-clone-production.up.railway.app

Backend – Railway

Production API:

https://aws-route-53-clone-production.up.railway.app/

🔒 CORS

For production, configure the backend environment variable:

FRONTEND_URL=https://dns-route-53.vercel.app

🎯 Future Improvements

PostgreSQL integration

Password hashing and improved authentication

Advanced DNS record validation

Real AWS Route 53 API integration

Advanced health monitoring

Role-based access control

Docker support

🧠 What I Learned

Full-stack development

Next.js and React

FastAPI and REST APIs

SQLAlchemy ORM

Database integration

Frontend-backend communication

CORS configuration

Environment variables

Vercel deployment

Railway deployment

Git and GitHub workflows

👩‍💻 Author

Nishika Kansal

CSE Student | Aspiring Software Development Engineer | AI/ML Enthusiast

GitHub: https://github.com/Nishikakansal

📄 License

This project was built for educational and learning purposes.

It is inspired by Amazon Route 53 concepts and is not affiliated with or endorsed by Amazon Web Services (AWS).