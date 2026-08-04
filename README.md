# 🌍 TravelEase

![Python](https://img.shields.io/badge/Python-3.13-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Framework-009688)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-ORM-red)
![License](https://img.shields.io/badge/License-MIT-green)

## 📖 Overview

**TravelEase** is a modern travel booking platform built with **FastAPI** and **PostgreSQL**. It follows a clean layered architecture using the **Repository-Service Pattern** and provides secure authentication, hotel booking, payment management, email notifications, and PDF invoice generation.

The project is designed with scalability in mind and serves as a strong backend portfolio project demonstrating production-ready development practices.

---

# ✨ Features

## 🔐 Authentication
- JWT Authentication
- Secure Password Hashing (bcrypt)
- Protected APIs
- User Login & Registration

## 👤 User Profile
- View Profile
- Update Profile
- Phone Number
- Gender
- Date of Birth
- Profile Image

## 🏨 Hotel Management
- Add Hotels
- Update Hotels
- Delete Hotels
- Search Hotels
- Filter by City
- Filter by Country
- Filter by Price
- Filter by Rating
- Pagination

## 🛏 Room Management
- Add Rooms
- Update Rooms
- Delete Rooms
- Room Availability
- Capacity Validation

## 📅 Booking Management
- Create Booking
- View Bookings
- Update Booking
- Cancel Booking
- Automatic Room Availability Update
- Booking Validation

## 💳 Payment Management
- Payment Records
- Booking Payment Mapping
- Payment Status Tracking

## ⭐ Reviews
- Add Reviews
- Update Reviews
- Delete Reviews
- Hotel Ratings

## ❤️ Wishlist
- Add Favourite Hotels
- Remove Hotels
- Duplicate Prevention

## 📧 Email Notification
- Gmail SMTP Integration
- Booking Confirmation Email
- Background Email Processing

## 📄 PDF Invoice
- Generate Booking Invoice
- Download Invoice as PDF

---

# 🛠 Technology Stack

| Category | Technology |
|-----------|------------|
| Language | Python 3.13 |
| Framework | FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Migration | Alembic |
| Authentication | JWT |
| Validation | Pydantic |
| Email | Gmail SMTP |
| PDF | ReportLab |
| API Testing | Swagger UI |
| Version Control | Git & GitHub |

---

# 📂 Project Structure

```
TravelEase/
│
├── alembic/
├── app/
│   ├── api/
│   ├── core/
│   ├── database/
│   ├── models/
│   ├── repositories/
│   ├── schemas/
│   ├── services/
│   ├── utils/
│   └── main.py
│
├── requirements.txt
├── alembic.ini
├── README.md
├── LICENSE
└── .env.example
```

---

# 🗄 Database Modules

- Users
- Hotels
- Rooms
- Bookings
- Payments
- Reviews
- Wishlist

---

# 📚 API Modules

| Module | Status |
|----------|--------|
| Authentication | ✅ |
| Users | ✅ |
| Hotels | ✅ |
| Rooms | ✅ |
| Bookings | ✅ |
| Payments | ✅ |
| Reviews | ✅ |
| Profile | ✅ |
| Wishlist | ✅ |
| Email Notifications | ✅ |
| PDF Invoice | ✅ |

---

# 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/LokeshKovvuri/TravelEase.git
```

### Navigate

```bash
cd TravelEase/backend
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate

Windows

```bash
venv\Scripts\activate
```

Linux/Mac

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create `.env`

```env
DATABASE_URL=
SECRET_KEY=
ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=

SMTP_SERVER=
SMTP_PORT=
EMAIL_USERNAME=
EMAIL_PASSWORD=
EMAIL_FROM=
```

### Run Database Migration

```bash
alembic upgrade head
```

### Run Server

```bash
uvicorn app.main:app --reload
```

---

# 📖 API Documentation

Swagger UI

```
http://127.0.0.1:8000/docs
```

ReDoc

```
http://127.0.0.1:8000/redoc
```

---

# 🏗 Architecture

```
                Client

                   │

                   ▼

            FastAPI Routes

                   │

                   ▼

          Service Layer

                   │

                   ▼

        Repository Layer

                   │

                   ▼

          PostgreSQL Database
```

---

# 🔐 Security

- JWT Authentication
- Password Hashing
- Environment Variables
- Protected Endpoints
- Secure SMTP Authentication

---

# 📈 Future Enhancements

- Admin Dashboard
- Role-Based Access Control (RBAC)
- Flight Booking
- Train Booking
- Bus Booking
- Cab Booking
- Trip Planner
- Payment Gateway Integration (Stripe/Razorpay)
- Docker
- Docker Compose
- CI/CD Pipeline
- AWS Deployment
- React Frontend
- AI Travel Assistant

---

# 👨‍💻 Author

**Lokesh Kovvuri**

DevOps Engineer | Backend Developer

GitHub

https://github.com/LokeshKovvuri

---

# 📄 License

This project is licensed under the **MIT License**.
