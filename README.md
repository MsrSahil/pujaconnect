# PujaConnect 🙏

PujaConnect is an Online Pandit & Puja Booking Platform. It is a service-marketplace web application built on the MERN stack where Users can discover, compare, and book verified Pandits for religious ceremonies (Satyanarayan Katha, Naamkaran, Griha Pravesh, etc.) with transparent pricing and real-time availability checking.

## 🌟 Features

### 👤 For Users
* **Browse Pandits**: Search for Pandits by city.
* **View Profiles**: See a Pandit's bio, languages, experience, and the specific pujas they offer.
* **Real-time Booking**: Select a date to view available time slots.
* **Double-booking Prevention**: Atomic database transactions guarantee that a time slot cannot be double-booked by two users simultaneously.
* **Booking Dashboard**: Track the status of your bookings (Pending, Accepted, Rejected, Completed).

### 🕉️ For Pandits
* **Availability Management**: Dynamically add and manage your daily availability blocks.
* **Booking Requests**: Accept or reject incoming booking requests from users.
* **Profile Setup**: Manage your bio, location, and the languages you speak.

### 🛡️ For Admins
* **Pandit Verification**: Review and approve/reject new Pandit registrations to maintain platform quality.
* **Puja Catalog**: Manage the master global dictionary of Pujas (name, category, duration, price ranges, location constraints).
* **Platform Oversight**: View all bookings taking place across the platform.

## 🛠️ Tech Stack

* **Frontend**: React.js (Vite), Tailwind CSS, React Router, Axios, Lucide React (Icons).
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB (Mongoose ORM).
* **Authentication**: JWT (JSON Web Tokens), bcryptjs (Password Hashing).

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* MongoDB instance (Local or Atlas)

### 1. Clone & Install
```bash
# Clone the repository
# Navigate to the project folder

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables
Create a `.env` file in the `backend/` directory with the following variables:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/pujaconnect
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

### 3. Run the Application

**Run Backend:**
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

**Run Frontend:**
```bash
cd frontend
npm run dev
# Client starts on http://localhost:5173
```

## 📖 API Documentation

Detailed documentation of all REST endpoints can be found in [`docs/api.md`](./docs/api.md).

## 🔒 Security Highlights

* **Atomic Transactions**: Uses MongoDB's `findOneAndUpdate` with array filters to atomically claim time slots, completely avoiding race conditions and double-booking.
* **RBAC (Role-Based Access Control)**: Strictly enforced roles (`user`, `pandit`, `admin`) at both the API middleware layer and the Frontend React Router layer.
* **Password Security**: Passwords never leave the backend and are hashed with bcrypt using a salt factor of 10.
