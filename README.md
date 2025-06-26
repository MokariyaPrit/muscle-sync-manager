# 🏋️‍♂️ FitZone Pro – Gym Management System

Welcome to **FitZone Pro**, a modern, full-featured gym management system built with React, Firebase, and Razorpay. This app supports multi-role access for Admins, Managers, and Customers, with real-time data, class booking, membership plans, profile management, and more.

## ✨ Features

- 🔐 **Authentication** with Firebase (Email/Password)
- 🧑‍🤝‍🧑 **Role-Based Access**: Admin, Manager, Customer
- 📅 **Book Classes** by region and availability
- 💳 **Membership Plans** (Basic, Pro, Elite) with Razorpay integration
- 📦 **Cloudinary Profile Uploads** and Updates
- 📊 **Dashboard** for Admins and Managers
- 📁 **Firestore + Firebase Storage** backend
- 🔍 Search, filtering, badges, and responsive UI

---

## 🚀 Getting Started
npm run dev

### 🔧 Prerequisites

- Node.js 18+
- Firebase project setup
- Cloudinary account
- Razorpay account

---

### 🔑 Environment Setup

Create a `.env` file in the root and add:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_RAZORPAY_KEY_ID=your_razorpay_key

VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=unsigned_profiles
