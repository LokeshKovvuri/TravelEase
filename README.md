# 🌍 TravelEase

> A modern full-stack travel and hotel booking platform built with React, FastAPI, PostgreSQL, and SQLAlchemy.

---

## 📖 Overview

**TravelEase** is a modern full-stack travel booking platform designed to help users discover hotels, search destinations, check room availability, and manage travel bookings.

The project consists of a **React frontend** and a **FastAPI backend**, with **PostgreSQL** as the primary database.

The backend follows a clean layered architecture using API routes, schemas, services, SQLAlchemy models, and database sessions.

The frontend provides a modern, responsive travel experience with a premium dark UI, hotel discovery, search, filters, authentication, protected routes, and animated hotel cards.

The project is currently under active development. Hotel and flight search,
authenticated bookings, payment checkout, invoices, and travel inventory are
implemented; production deployment still requires configuring a payment
provider and SMTP credentials.

## Run locally

The quickest full-stack option is Docker Compose:

```powershell
Copy-Item backend/.env.example backend/.env
docker compose up --build
```

Open `http://localhost:8080`. The API is available at `http://localhost:8000`
and its interactive documentation is at `/docs`.

For manual development, copy both environment examples, start PostgreSQL, then:

```powershell
cd backend
..\venv\Scripts\python.exe -m pip install -r requirements.txt
alembic upgrade head
..\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

```powershell
cd frontend
npm ci
npm run dev
```

Run backend service checks with:

```powershell
cd backend
..\venv\Scripts\python.exe -m unittest discover -s tests -v
```

## Quality pipeline

The **Verify TravelEase** GitHub Actions workflow checks the frontend build,
backend compilation and tests, migration graph, and Docker Compose
configuration on every pull request and push to `main`. See
[the pipeline guide](docs/PIPELINES.md) for the stage diagram, local commands,
and where to view runs in GitHub Actions.

## AI trip planner

`/ai-planner` recommends hotels from the current TravelEase catalogue. It works
without third-party credentials using a local ranking mode. To enable
OpenAI-generated advice, set `OPENAI_API_KEY` and optionally `OPENAI_MODEL`
in `backend/.env`; the key stays on the backend and is never sent to the
browser.

## Security and checkout

- Hotel, room, flight, bus, train, and cab write APIs require an `ADMIN` role.
- Hotel availability is calculated for the requested dates with a short-lived
  payment hold; flight seats are released when an abandoned payment hold
  expires.
- `PAYMENT_PROVIDER=stripe` uses hosted Stripe Checkout. Booking confirmation
  occurs only after Stripe sends a verified webhook to
  `/api/v1/payments/webhooks/stripe`.
- `PAYMENT_PROVIDER=mock` is for local development only and requires
  `DEBUG=true` or `ALLOW_MOCK_PAYMENTS=true`. Never enable it in production.

---

# ✨ Features

## 🔐 Authentication

- JWT Authentication
- Secure Password Hashing
- User Registration
- User Login
- User Logout
- Authentication Context
- Protected Routes
- Authentication State Management
- User Roles
- Protected API Foundation

---

## 👤 User Management

- User Registration
- User Login
- First Name
- Last Name
- Email
- Password
- User Role
- Authentication State

---

## 🏨 Hotel Management

- Add Hotels
- Update Hotels
- Delete Hotels
- Get All Hotels
- Get Hotel by ID
- Search Hotels
- Filter by City
- Filter by Country
- Filter by Price
- Filter by Rating
- Pagination
- Hotel Images
- Hotel Descriptions
- Hotel Location
- Hotel Ratings
- Hotel Pricing
- Room Availability

---

## 🛏️ Room Management

The backend architecture includes room management support.

- Room Model
- Room Availability
- Room Capacity
- Room Management Foundation
- Booking Relationship

### Planned

- Add Rooms
- Update Rooms
- Delete Rooms
- Room Selection
- Room Booking

---

## 📅 Booking Management

Booking architecture has been created as part of the backend project structure.

### Planned / In Development

- Create Booking
- View Bookings
- Update Booking
- Cancel Booking
- Room Availability Update
- Booking Validation
- Booking Confirmation
- Booking History

---

## 💳 Payment Management

Payment architecture is included in the backend database design.

### Planned

- Payment Records
- Booking Payment Mapping
- Payment Status
- Payment Gateway
- Payment Confirmation
- Payment History

---

## ⭐ Reviews

Review functionality is included in the backend architecture.

### Planned

- Add Reviews
- Update Reviews
- Delete Reviews
- Hotel Ratings
- Average Rating Calculation
- Review Listing

---

## ❤️ Wishlist

Wishlist functionality is included in the application architecture.

### Planned

- Add Favourite Hotels
- Remove Favourite Hotels
- Wishlist Page
- Duplicate Prevention
- Persistent Wishlist

---

## 🔎 Hotel Search

The frontend currently provides a hotel search interface with:

- Destination
- Check-in
- Check-out
- Guests
- Search button

The backend supports:

- City
- Country
- Minimum Price
- Maximum Price
- Rating
- Pagination
- Result Limit

---

## 🎛️ Hotel Filters

The TravelEase hotel discovery page includes a filter interface.

Current filtering architecture supports:

- Price filtering
- Rating filtering
- Destination filtering
- Mobile filter controls

---

## 🏨 Hotel Cards

The hotel listing interface displays:

- Hotel Image
- Hotel Name
- Location
- Rating
- Description
- Amenities
- Price per Night
- Room Availability
- Favourite Button
- View Hotel Button

Example availability:

```text
12 rooms available

When unavailable:

No rooms currently available
```

🎨 Modern UI

TravelEase uses a premium dark travel interface.

Dark Theme
Purple Gradients
Cyan Highlights
Glass-style Cards
Rounded Components
Modern Icons
Responsive Layout
Smooth Animations
Hotel Images
Interactive Search
Animated Hotel Cards
🛠 Technology Stack
Category	Technology
Frontend Language	JavaScript
Frontend Framework	React
Build Tool	Vite
UI Framework	Material UI
Routing	React Router
HTTP Client	Axios
Animation	Framer Motion
Icons	React Icons / Material Icons
Font	Poppins
Backend Language	Python
Backend Framework	FastAPI
Server	Uvicorn
Database	PostgreSQL
ORM	SQLAlchemy
Migration	Alembic
Validation	Pydantic
Authentication	JWT
Password Security	Password Hashing
API Testing	Swagger UI / OpenAPI
Version Control	Git & GitHub
📂 Project Structure
TravelEase/
│
├── backend/
│   │
│   ├── alembic/
│   │
│   ├── app/
│   │   │
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── auth.py
│   │   │       ├── hotels.py
│   │   │       └── ...
│   │   │
│   │   ├── core/
│   │   │   └── security.py
│   │   │
│   │   ├── database/
│   │   │   └── session.py
│   │   │
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── hotel.py
│   │   │   ├── room.py
│   │   │   ├── booking.py
│   │   │   ├── payment.py
│   │   │   ├── review.py
│   │   │   └── wishlist.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   ├── hotel.py
│   │   │   └── ...
│   │   │
│   │   ├── services/
│   │   │   ├── hotel_service.py
│   │   │   └── ...
│   │   │
│   │   └── main.py
│   │
│   ├── .env
│   ├── .gitignore
│   ├── alembic.ini
│   ├── requirements.txt
│   └── seed.py
│
│
├── frontend/
│   │
│   ├── src/
│   │   │
│   │   ├── components/
│   │   │   ├── hotel/
│   │   │   │   ├── HotelSearch.jsx
│   │   │   │   ├── HotelFilters.jsx
│   │   │   │   └── HotelCard.jsx
│   │   │   │
│   │   │   ├── home/
│   │   │   └── layout/
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   └── Dashboard.jsx
│   │   │   │
│   │   │   ├── Hotels.jsx
│   │   │   └── Booking.jsx
│   │   │
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── authService.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── theme.js
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── LICENSE
🗄️ Database Modules

The TravelEase database architecture includes:

Users
Hotels
Rooms
Bookings
Payments
Reviews
Wishlist
Entity Relationship
User
 │
 ├──────────► Booking
 │
 ├──────────► Review
 │
 └──────────► Wishlist

Hotel
 │
 ├──────────► Room
 │
 ├──────────► Booking
 │
 └──────────► Review

Booking
 │
 └──────────► Payment
📚 API Modules
Module	Status
Authentication	✅
Users	✅
Hotels	✅
Hotel Search	✅
Hotel Filters	✅
Rooms	🟡 Foundation
Bookings	🟡 In Development
Payments	🟡 Foundation
Reviews	🟡 Foundation
Wishlist	🟡 Foundation
Profile	🟡 Foundation
Email Notifications	🔵 Planned
PDF Invoice	🔵 Planned
Status Legend
✅ Completed
🟡 Foundation / In Development
🔵 Planned
🔌 Hotel API Endpoints

Base URL:

/api/v1/hotels
Get Hotels
GET /api/v1/hotels/
Create Hotel
POST /api/v1/hotels/
Get Hotel
GET /api/v1/hotels/{hotel_id}
Update Hotel
PUT /api/v1/hotels/{hotel_id}
Delete Hotel
DELETE /api/v1/hotels/{hotel_id}
Hotel Search

Hotel search supports parameters such as:

city
country
min_price
max_price
rating
page
limit

Example:

/api/v1/hotels/?city=Goa&country=India&min_price=1000&max_price=10000&rating=4&page=1&limit=10
🔐 Authentication Flow
                 User
                   │
                   ▼
          Login / Registration
                   │
                   ▼
             React Frontend
                   │
                   ▼
             AuthContext
                   │
                   ▼
           FastAPI Auth API
                   │
                   ▼
          Password Verification
                   │
                   ▼
              JWT Token
                   │
                   ▼
         Authentication State
                   │
                   ▼
            Protected Routes
🏗️ Architecture

TravelEase follows a layered backend architecture.

                  Client
                    │
                    ▼
             FastAPI Routes
                    │
                    ▼
             Pydantic Schemas
                    │
                    ▼
              Service Layer
                    │
                    ▼
             SQLAlchemy ORM
                    │
                    ▼
             PostgreSQL

Frontend architecture:

                 React UI
                    │
          ┌─────────┴─────────┐
          │                   │
     Authentication       Hotel Discovery
          │                   │
     AuthContext          HotelSearch
          │               HotelFilters
     ProtectedRoute        HotelCard
          │                   │
          └─────────┬─────────┘
                    │
                    ▼
                  Axios
                    │
                    ▼
              FastAPI API
🌐 Frontend Routes
Route	Page	Access
/	Login	Public
/register	Register	Public
/home	Hotels	Protected
/hotels	Hotels	Protected
/hotels/:id/booking	Booking	Protected
/dashboard	Dashboard	Protected
🔒 Protected Routes

TravelEase uses:

AuthContext
ProtectedRoute

Protected routes verify the user's authentication state before rendering the page.

User
 │
 ▼
ProtectedRoute
 │
 ├── Authenticated ──► Page
 │
 └── Not Authenticated
             │
             ▼
           Login
🌐 API Client

The frontend communicates with the FastAPI backend using Axios.

import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
🗃️ Environment Variables

Create a .env file inside:

backend/.env

Example:

DATABASE_URL=postgresql://username:password@localhost:5432/travelease

SECRET_KEY=your_secret_key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60

Never commit your real .env file to GitHub.

🚀 Installation
Clone Repository
git clone https://github.com/LokeshKovvuri/TravelEase.git
Navigate to Project
cd TravelEase
🐍 Backend Setup

Navigate to backend:

cd backend

Create virtual environment:

python -m venv venv
Windows
venv\Scripts\activate
Linux / macOS
source venv/bin/activate

Install dependencies:

pip install -r requirements.txt
🗄️ Database Setup

Make sure PostgreSQL is running.

Configure:

backend/.env

Then run migrations:

alembic upgrade head
🌱 Seed Database

TravelEase includes a development seed script.

Run:

python seed.py
▶️ Run Backend

From the backend directory:

python -m uvicorn app.main:app --reload

Backend:

http://127.0.0.1:8000
📖 API Documentation
Swagger UI
http://127.0.0.1:8000/docs
ReDoc
http://127.0.0.1:8000/redoc
⚛️ Frontend Setup

Open another terminal.

Navigate to:

cd TravelEase/frontend

Install dependencies:

npm install

Run development server:

npm run dev

Frontend:

http://localhost:5173
📦 Frontend Dependencies

Main dependencies include:

React
React DOM
React Router DOM
Material UI
Material UI Icons
Axios
Framer Motion
React Icons
Poppins
🧪 Development Tools
Tool	Purpose
VS Code	Development
Git	Version Control
GitHub	Repository
PowerShell	Windows Terminal
PostgreSQL	Database
DBeaver	Database Management
Swagger	API Testing
Vite	Frontend Development
🔐 Security

TravelEase implements security practices including:

JWT Authentication
Password Hashing
Protected APIs
Protected Frontend Routes
Environment Variables
Database Authentication
Secure Secret Management
Input Validation using Pydantic
📈 Development Progress
Phase 1 — Project Foundation
 Project repository
 Backend structure
 Frontend structure
 PostgreSQL
 SQLAlchemy
 Alembic
 Environment configuration
Phase 2 — Authentication
 User model
 Password hashing
 JWT authentication
 Registration
 Login
 Logout
 AuthContext
 ProtectedRoute
 Protected pages
Phase 3 — Hotel Backend
 Hotel model
 Hotel schema
 Hotel service
 Create hotel API
 Get hotels API
 Get hotel API
 Update hotel API
 Delete hotel API
 Hotel search
 City filtering
 Country filtering
 Price filtering
 Rating filtering
 Pagination
 Room availability
Phase 4 — Hotel Frontend
 Hotels page
 Hotel search UI
 Hotel filters
 Hotel cards
 Hotel images
 Hotel locations
 Hotel ratings
 Hotel prices
 Hotel descriptions
 Amenities
 Room availability
 Responsive UI
 Dark theme
 Animations
Phase 5 — Hotel Details
 Hotel details page
 Image gallery
 Full hotel information
 Room listing
 Room selection
 Amenities details
 Reviews section
Phase 6 — Booking
 Booking form
 Guest information
 Room selection
 Booking API integration
 Booking validation
 Booking confirmation
 Booking history
 Booking cancellation
Phase 7 — Wishlist
 Add favourite hotel
 Remove favourite hotel
 Wishlist page
 Persistent wishlist
 Duplicate prevention
Phase 8 — Reviews
 Add review
 Update review
 Delete review
 Rating system
 Average rating
 Review listing
Phase 9 — Payments
 Payment gateway
 Payment creation
 Payment verification
 Payment status
 Payment confirmation
 Payment history
Phase 10 — Notifications
 Booking confirmation email
 Payment confirmation email
 Booking cancellation email
 Travel reminders
 Notification system
📈 Future Enhancements
Admin Dashboard
Role-Based Access Control (RBAC)
Flight Booking
Train Booking
Bus Booking
Cab Booking
Trip Planner
AI Travel Assistant
Payment Gateway Integration
Stripe Integration
Razorpay Integration
Docker
Docker Compose
CI/CD Pipeline
AWS Deployment
Cloud Monitoring
Application Logging
Production Security
Performance Optimization
🗺️ Future Travel Platform

The long-term TravelEase ecosystem will include:

                 🌍 TravelEase
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
    🏨 Hotels       ✈️ Flights       🚆 Trains
       │               │               │
       └───────────────┼───────────────┘
                       │
                       ▼
                 🧳 Trip Planner
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
          💳 Payments       ❤️ Wishlist
              │                 │
              └────────┬────────┘
                       │
                       ▼
                  ⭐ Reviews
                       │
                       ▼
                🤖 AI Assistant
👨‍💻 Author

Lokesh Kovvuri

DevOps Engineer | Backend Developer | Cloud Engineer

GitHub:

https://github.com/LokeshKovvuri

📄 License

This project is currently under active development.

License and contribution guidelines will be finalized before the production release.

⭐ TravelEase

Discover. Explore. Book. Travel.

🌍 TravelEase — Your journey starts here.


### One correction I deliberately made

I did **not** mark Gmail SMTP, PDF invoice generation, payment gateway, email notifications, or full booking as completed because, based on what we've actually implemented together so far, those are **not yet completed end-to-end**.

I marked them as `🟡 Foundation / In Development` or `🔵 Planned`, which keeps your GitHub README accurate rather than claiming functionality that isn't working yet.

After you paste it into VS Code:

```powershell
git add README.md
git commit -m "docs: update TravelEase documentation"
git push
