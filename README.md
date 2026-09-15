# PujaConnect 🙏

> A full-stack MERN platform connecting devotees with verified Vedic Pandits for authentic ceremony bookings, transparent pricing, and real-time schedule management.

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📑 Table of Contents

- [About the Project](#about-the-project)
- [Live Demo](#live-demo)
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Default / Demo Credentials](#default--demo-credentials)
- [Security Highlights](#security-highlights)
- [Future Enhancements](#future-enhancements)
- [Author & Acknowledgements](#author--acknowledgements)
- [License](#license)

---

## 📖 About the Project

**PujaConnect** is a specialized service-marketplace web application engineered to solve the fragmented, opaque, and manual process of organizing Hindu religious ceremonies. By bridging devotees with verified Vedic Pandits, the platform enables users to discover qualified priests, review ritual samagri (materials), check real-time calendar availability, and book ceremonies (such as Satyanarayan Katha, Griha Pravesh, and Rudrabhishek) with complete pricing transparency and guaranteed slot reservations.

---

## 🌐 Live Demo

- **Frontend Application**: `[Add deployed link here]`
- **Backend API**: `[Add deployed link here]`

---

## 📸 Screenshots

<!-- Add screenshots of Login, User Dashboard, Pandit Dashboard, Admin Dashboard here -->

| Devotee Discovery & Search | Pandit Profile & Slot Picker |
|:---:|:---:|
| ![Devotee Discovery](https://via.placeholder.com/600x350?text=Devotee+Discovery+%26+Filters) | ![Pandit Profile](https://via.placeholder.com/600x350?text=Pandit+Profile+%26+Slot+Selection) |

| Pandit Dashboard & Availability | Admin Verification & Catalog Console |
|:---:|:---:|
| ![Pandit Dashboard](https://via.placeholder.com/600x350?text=Pandit+Dashboard+%26+Availability) | ![Admin Dashboard](https://via.placeholder.com/600x350?text=Admin+Approvals+%26+Puja+Catalog) |

---

## ✨ Features

### 👤 For Devotees (Users)
- **Multi-Criteria Discovery**: Search and filter verified Pandits by city, ritual type, spoken languages, and minimum years of Vedic experience.
- **Comprehensive Pandit Profiles**: Inspect detailed bios, verified verification badges, spoken languages, and specific rituals offered with price ranges and estimated durations.
- **Interactive Calendar & Slot Booking**: Select any upcoming date to view real-time available time slots, select the ceremony venue (Home, Temple, or Online), and submit booking requests.
- **Double-Booking Prevention**: Database-level atomic slot reservation ensures no two devotees can book the same slot concurrently.
- **Booking Management Dashboard**: Real-time status tracking for all personal bookings with visual badges (`pending`, `accepted`, `rejected`, `completed`).

### 🕉️ For Pandits
- **Profile & Services Customization**: Maintain personal bio, location (city/state), languages spoken, and select supported pujas from the master catalog.
- **Dynamic Availability Management**: Add custom daily time slot blocks with start and end times, view existing schedules, and delete unbooked slots.
- **Booking Request Center**: Receive and evaluate incoming ceremony requests with devotee contact details, requested ritual, and address; accept or reject requests with automatic slot recycling.

### 🛡️ For Administrators
- **Pandit Verification Portal**: Review newly registered pandit applications, inspect qualifications, and approve or reject profiles to maintain platform authenticity.
- **Global Puja Catalog Management**: Complete CRUD operations for the master ritual directory (name, category, duration, required materials/samagri, and price range).
- **Platform-wide Booking Oversight**: Monitor all booking activity across all pandits and devotees with live status filtering.
- **User Directory**: View registered devotees and pandits, contact information, and account creation dates.

---

## 🛠️ Tech Stack

| Category | Technology | Description |
|---|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) | High-performance SPA with fast HMR |
| **Styling & UI** | [Tailwind CSS v3](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/) | Utility-first responsive design and iconography |
| **Routing & Auth** | [React Router v7](https://reactrouter.com/) | Declarative routing with client-side RBAC guards |
| **HTTP Client** | [Axios](https://axios-http.com/) | Centralized API client with interceptors for auth tokens and validation error extraction |
| **Backend Runtime** | [Node.js](https://nodejs.org/) (ES Modules) | Server-side JavaScript runtime |
| **Web Framework** | [Express.js v4](https://expressjs.com/) | RESTful API routing, controllers, and middleware |
| **Database & ODM** | [MongoDB](https://www.mongodb.com/) + [Mongoose v8](https://mongoosejs.com/) | NoSQL database with schema modeling, indexes, and validation |
| **Authentication** | [JWT (jsonwebtoken)](https://jwt.io/) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Stateless token-based auth with salted password hashing |
| **Request Validation** | [express-validator](https://express-validator.github.io/) | Schema sanitization, email normalization, and body validation |
| **Developer Tooling** | [Nodemon](https://nodemon.io/) + [Oxlint](https://oxc.rs/) | Auto-reloading backend server and ultra-fast frontend linting |

---

## 📁 Project Structure

<details>
<summary><b>Click to expand full repository structure</b></summary>

```
pujaconnect/
├── README.md
├── docs/
│   └── api.md                           # Detailed REST API documentation
├── backend/
│   ├── .env.example                     # Environment template for backend
│   ├── package.json                     # Backend scripts and dependencies
│   └── src/
│       ├── server.js                    # Server bootstrap and port listener
│       ├── app.js                       # Express app configuration & middleware
│       ├── config/
│       │   ├── db.js                    # MongoDB Mongoose connection
│       │   ├── env.js                   # Centralized environment loader
│       │   └── seed.js                  # Database seed script for Demo accounts
│       ├── controllers/
│       │   ├── admin.controller.js      # Pandit verification and user listings
│       │   ├── auth.controller.js       # Register, login, and profile controllers
│       │   ├── booking.controller.js    # Booking creation, accept/reject, history
│       │   ├── pandit.controller.js     # Pandit profiles and availability handlers
│       │   ├── puja.controller.js       # Global Puja catalog controllers
│       │   └── user.controller.js       # User profile management
│       ├── middlewares/
│       │   ├── auth.middleware.js       # JWT bearer token verification
│       │   ├── error.middleware.js      # Global error and 404 handler
│       │   ├── role.middleware.js       # Role-Based Access Control (RBAC)
│       │   └── validate.middleware.js   # express-validator result handler
│       ├── models/
│       │   ├── Availability.model.js    # Pandit daily schedule and slots
│       │   ├── Booking.model.js         # Booking records and status states
│       │   ├── Pandit.model.js          # Extended Pandit profile details
│       │   ├── Puja.model.js            # Master Puja catalog items
│       │   └── User.model.js            # User credentials, roles, and contacts
│       ├── routes/
│       │   ├── admin.routes.js          # /api/v1/admin
│       │   ├── auth.routes.js           # /api/v1/auth
│       │   ├── booking.routes.js        # /api/v1/bookings
│       │   ├── pandit.routes.js         # /api/v1/pandits
│       │   ├── puja.routes.js           # /api/v1/pujas
│       │   └── user.routes.js           # /api/v1/users
│       ├── services/
│       │   ├── availability.service.js  # Slot generation and validation logic
│       │   └── booking.service.js       # Atomic booking transaction logic
│       ├── utils/
│       │   ├── apiError.js              # Standardized API error wrapper
│       │   ├── apiResponse.js           # Standardized success response structure
│       │   ├── asyncHandler.js          # Async route wrapper
│       │   └── generateToken.js         # JWT signing helper
│       └── validators/
│           ├── auth.validator.js        # Login & registration schema validators
│           └── booking.validator.js     # Booking payload validators
└── frontend/
    ├── .env.example                     # Environment template for frontend
    ├── index.html                       # HTML entry point
    ├── package.json                     # Frontend scripts and dependencies
    ├── postcss.config.js                # PostCSS configuration
    ├── tailwind.config.js               # Tailwind CSS theme configuration
    ├── vite.config.js                   # Vite bundler configuration
    └── src/
        ├── main.jsx                     # React root mount
        ├── App.jsx                      # App root with Context & Router
        ├── api/
        │   ├── axiosInstance.js         # Configured Axios with error interceptors
        │   ├── admin.api.js             # Admin management API calls
        │   ├── auth.api.js              # Auth endpoints (login, register, me)
        │   ├── booking.api.js           # Booking endpoints (create, history, status)
        │   ├── pandit.api.js            # Pandit discovery & availability API
        │   └── puja.api.js              # Puja catalog fetcher
        ├── components/
        │   └── common/
        │       ├── Alert.jsx            # Dynamic error/success dismissible banner
        │       ├── Loader.jsx           # Loading spinner component
        │       ├── Navbar.jsx           # Global responsive navigation header
        │       └── ProtectedRoute.jsx   # Role-based route authorization guard
        ├── context/
        │   └── AuthContext.jsx          # Global auth state, login, and logout
        ├── hooks/
        │   └── useAuth.js               # Auth context consumer hook
        ├── layouts/
        │   └── UserLayout.jsx           # Master layout with Navbar & Container
        ├── pages/
        │   ├── admin/
        │   │   ├── AdminDashboard.jsx   # Admin tabbed control panel
        │   │   ├── PanditApprovals.jsx  # Pandit verification tab
        │   │   ├── PlatformBookings.jsx # All-bookings audit tab
        │   │   ├── PujaCatalog.jsx      # Master puja catalog management
        │   │   └── UsersList.jsx        # Platform user directory
        │   ├── auth/
        │   │   ├── Login.jsx            # Sign in form with live validation alerts
        │   │   └── Register.jsx         # Sign up form for Devotees & Pandits
        │   ├── pandit/
        │   │   ├── AvailabilityManager.jsx # Slot creation & schedule manager
        │   │   ├── BookingRequests.jsx  # Booking approval/rejection list
        │   │   ├── PanditDashboard.jsx  # Pandit tabbed navigation panel
        │   │   └── ProfileManager.jsx   # Bio, languages & ritual settings
        │   └── user/
        │       ├── Home.jsx             # Devotee landing page with filters
        │       ├── PanditProfile.jsx    # Pandit details & date/slot picker
        │       └── UserBookings.jsx     # Devotee personal booking history
        └── routes/
            └── AppRoutes.jsx            # Client-side route declarations
```
</details>

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) installed locally (running at `mongodb://127.0.0.1:27017`) or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection URI
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/MsrSahil/pujaconnect.git
cd pujaconnect
```

### 2. Configure Environment Variables

**Backend Configuration:**
Create a `.env` file in the `backend/` directory:
```bash
cp backend/.env.example backend/.env
```
Populate `backend/.env` with your settings:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/pujaconnect
JWT_SECRET=your_secure_jwt_random_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

**Frontend Configuration:**
Create a `.env` file in the `frontend/` directory:
```bash
cp frontend/.env.example frontend/.env
```
Populate `frontend/.env` with your API endpoint:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Seed the Database
Populate the database with master Puja rituals, verified Pandits, upcoming availability slots, and demo accounts for each role:
```bash
cd backend
npm run seed
```

### 5. Run the Application

Start both servers in separate terminal tabs:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server running at: http://localhost:5000
# Health check: http://localhost:5000/api/v1/health
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Vite client running at: http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser to explore the platform.

---

## 📡 API Documentation

Comprehensive endpoint specifications, parameters, and sample JSON responses are documented in [`docs/api.md`](./docs/api.md).

### Quick Endpoint Preview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Public | Authenticates credentials and returns a signed JWT |
| `GET` | `/api/v1/pandits` | Public | Lists verified Pandits with optional city and ritual filters |
| `POST` | `/api/v1/bookings` | User | Atomically reserves a Pandit's available time slot |
| `GET` | `/api/v1/admin/pandits/pending` | Admin | Fetches Pandit registrations pending verification |

---

## 🔑 Default / Demo Credentials

Running `npm run seed` in `backend/` automatically populates pre-configured demo credentials across all three roles:

| Role | Email | Password | Pre-configured Data & Capabilities |
|---|---|---|---|
| **Admin** | `admin@pujaconnect.com` | `Admin@123` | Full access to approve/reject Pandits, manage Puja catalog, and monitor all platform bookings |
| **Pandit** | `pandit.sharma@pujaconnect.com` | `Pandit@123` | Pre-verified Pandit with 8 days of active morning/afternoon slots; can accept/reject requests |
| **User (Devotee)** | `user@pujaconnect.com` | `User@123` | Ready to browse Pandits, book available slots, and view personal booking statuses |

> *Note: Devotees and Pandits can also self-register at any time via the `/register` page.*

---

## 🔒 Security Highlights

- **Atomic Slot Reservation**: Concurrency control is achieved using atomic MongoDB queries (`findOneAndUpdate` matching `{ _id, "slots._id": slotId, "slots.isBooked": false }`), eliminating race conditions and double bookings when multiple devotees attempt to book simultaneously.
- **Role-Based Access Control (RBAC)**: Strictly enforced across both backend Express middlewares (`protect` + `authorize('user' | 'pandit' | 'admin')`) and frontend client routes via `ProtectedRoute`.
- **Stateless JWT Authentication**: Secure, digitally signed JWT tokens passed via `Authorization: Bearer <token>` headers with customizable expiration.
- **Cryptographic Password Protection**: User passwords are encrypted using `bcryptjs` with 10 salt rounds and excluded by default (`select: false`) from database queries.
- **Strict Input Validation**: All authentication and booking endpoints are validated and sanitized via `express-validator` to prevent malformed payloads and injection vectors.

---

## 🔮 Future Enhancements

- **Payment Gateway Integration**: Direct integration with Razorpay / Stripe to enable advance dakshina payments and refundable token deposits.
- **Multi-Language Support**: Complete localization in Hindi, Marathi, Gujarati, Bengali, Tamil, Telugu, and English.
- **Virtual Ceremonies (Live Video)**: Built-in WebRTC / video streaming integration for remote and NRI devotees.
- **Vedic Muhurat & Panchang Engine**: Automated auspicious date and time recommendations based on traditional Hindu astronomical calendars.
- **Mobile Applications**: Cross-platform mobile clients using React Native / Flutter with push notifications for instant pandit booking alerts.

---

## 👨‍💻 Author & Acknowledgements

- **Author**: `[Add Your Name Here]`
- **Repository**: [MsrSahil/pujaconnect](https://github.com/MsrSahil/pujaconnect)
- **Project Context**: Developed as an internship capstone project for **Unified Mentors**.

*Special thanks to the mentors and open-source community for the invaluable guidance, tooling, and libraries that made this project possible.*

---

## 📄 License

This project is currently shared for evaluation purposes. It is prepared for licensing under the **MIT License**.

*(An official `LICENSE` file can be added upon request.)*
