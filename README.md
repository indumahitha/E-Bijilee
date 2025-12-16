# ⚡ E-Bijilee – Smart Utility Billing System

E-Bijilee is a **Smart Utility Billing System** that digitizes electricity bill generation and payment tracking through a web-based application.

The project focuses on replacing manual and paper-based electricity billing with a **secure and user-friendly digital solution**, allowing users to view their bills online while enabling administrators to manage billing efficiently.

---

## 🎯 Project Purpose

- Automate electricity bill generation
- Provide users with online access to bills and payment status
- Reduce manual errors in billing
- Demonstrate real-world frontend and backend integration

---

## 🏗️ Project Architecture

The system follows a **client–server architecture**:

Frontend (React + TypeScript)
↓ REST APIs
Backend (Authentication & Billing Logic)
↓
Database (Users & Bills)
 
 ---

## 🖥️ Frontend

### Technologies Used
- React
- TypeScript
- HTML
- CSS
- Axios

### Features
- User login and authentication
- Dashboard to view:
  - Monthly electricity bills
  - Units consumed
  - Total amount
  - Payment status (Paid / Unpaid)
- Secure API calls using authentication tokens
- Environment configuration using `.env.example`

---

## ⚙️ Backend Overview

The backend exposes **RESTful APIs** that handle application logic and security.

### Responsibilities
- User authentication using JWT
- Role-based access (Admin and User)
- Electricity bill generation based on usage
- Bill payment status updates
- Secure communication with frontend

### Sample APIs
- `POST /login`
- `GET /user/bills`
- `POST /admin/generate-bill`
- `PUT /bill/pay`

APIs were tested using **Postman** before frontend integration.

---

## 🔐 Authentication Flow

1. User logs in with credentials  
2. Backend validates credentials and generates a JWT token  
3. Token is stored on the client  
4. Token is sent in request headers for protected APIs  
5. Backend validates the token before processing requests  

---

## 🧪 API Testing

- Postman used to test all backend APIs
- Verified authentication, request validation, and responses
- Postman collection included in the repository

---

## 📂 Project Structure
E-Bijilee/
│
├── e-bijlee-frontend/
│ ├── src/
│ ├── package.json
│ ├── package-lock.json
│ ├── .env.example
│
├── Smart_Utility_Billing_System.postman_collection.json
└── README.md

