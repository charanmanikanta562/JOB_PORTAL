# 🚀 Job Portal MVP  
**React · Tailwind CSS · Clerk · Supabase**

A modern, full-stack **Job Portal MVP** designed with a clean UI, secure authentication, and a scalable backend.  
This project demonstrates end-to-end product ownership—from frontend development to backend integration—and is suitable for both local development and production deployment.

![Job Portal Preview](./screenshot.png)

---

## ✨ Overview

This Job Portal enables users to browse, post, and apply for jobs through a fast, responsive, and theme-aware interface.  
The application automatically adapts to **light and dark modes** based on system preferences and follows best practices for performance, security, and maintainability.

---

## 🔑 Features

### 👤 Authentication & Authorization
- Secure authentication and user management using **Clerk**
- Protected routes and session handling
- Role-based access for job seekers and employers

### 💼 Job Management
- Browse available job listings
- Search and filter jobs by **title, company, and location**
- Employers can post new job openings
- Candidates can apply to jobs directly

### 🎨 UI & UX
- Responsive, mobile-first design
- Automatic **light/dark mode** support
- Clean, accessible UI built with Tailwind CSS

### 🗄️ Backend & Data
- Supabase for database and backend services
- Real-time job updates
- Secure and scalable data architecture

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React, Tailwind CSS |
| Authentication | Clerk |
| Backend / Database | Supabase |
| Styling | Tailwind CSS (theme-aware) |
| Deployment | Vercel / Netlify (Frontend), Supabase (Backend) |

---

## 📁 Project Structure

```bash
job-portal/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page-level components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # Supabase & API logic
│   ├── utils/          # Helper utilities
│   └── styles/         # Global styles
├── public/
├── .env.example
├── package.json
└── README.md
