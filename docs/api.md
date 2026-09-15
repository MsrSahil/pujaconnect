# PujaConnect API Documentation

**Base URL**: `http://localhost:5000/api/v1`

## 🔐 Authentication & Users
All private routes require an `Authorization: Bearer <token>` header.

### `POST /auth/register`
Register a new account (User, Pandit, or Admin).
* **Body**: `{ name, email, password, phone, role }`
* **Response**: `201 Created` | `{ message, user, token }`

### `POST /auth/login`
Log in to an existing account.
* **Body**: `{ email, password }`
* **Response**: `200 OK` | `{ message, user, token }`

### `GET /auth/me`
Get the current logged-in user's profile.
* **Headers**: `Authorization: Bearer <token>`
* **Response**: `200 OK` | `{ user }`

---

## 🕉️ Pandits

### `GET /pandits`
Get all verified pandits. (Public)
* **Query Params**: `city` (optional)
* **Response**: `200 OK` | `{ pandits: [...] }`

### `GET /pandits/:id`
Get a specific pandit's public profile. (Public)
* **Response**: `200 OK` | `{ pandit: {...} }`

### `GET /pandits/:id/availability`
Get a pandit's availability for a specific date range. (Public)
* **Query Params**: `from` (YYYY-MM-DD), `to` (YYYY-MM-DD)
* **Response**: `200 OK` | `{ availability: [...] }`

### `PUT /pandits/me`
Update the logged-in Pandit's profile. (Pandit Only)
* **Body**: `{ bio, experienceYears, location, languagesSpoken, supportedPujas }`
* **Response**: `200 OK` | `{ pandit }`

### `POST /pandits/me/availability`
Set or update daily availability. (Pandit Only)
* **Body**: `{ date: "YYYY-MM-DD", slots: [{ startTime: "09:00", endTime: "11:00" }] }`
* **Response**: `200 OK` | `{ availability }`

### `DELETE /pandits/me/availability`
Clear a day's availability (cannot delete if slots are booked). (Pandit Only)
* **Body**: `{ date: "YYYY-MM-DD" }`
* **Response**: `200 OK`

---

## 📅 Bookings

### `POST /bookings`
Create a new booking request. (User Only)
* **Body**: `{ panditId, pujaId, date, timeSlot: { startTime, endTime }, locationType, address }`
* **Response**: `201 Created`
* **Note**: Employs atomic DB checking to prevent double-booking.

### `GET /bookings/my`
Get bookings made by the current user. (User Only)
* **Response**: `200 OK` | `{ bookings: [...] }`

### `GET /pandits/me/bookings`
Get incoming booking requests. (Pandit Only)
* **Response**: `200 OK` | `{ bookings: [...] }`

### `PATCH /bookings/:id/accept`
Accept a booking request. (Pandit Only)
* **Response**: `200 OK`

### `PATCH /bookings/:id/reject`
Reject a booking request and instantly free up the slot. (Pandit Only)
* **Response**: `200 OK`

---

## 🛡️ Admin

### `GET /admin/pandits/pending`
Get all pandit profiles awaiting verification. (Admin Only)
* **Response**: `200 OK` | `{ pandits: [...] }`

### `PATCH /admin/pandits/:id/verify`
Approve or reject a pandit application. (Admin Only)
* **Body**: `{ status: "verified" | "rejected" }`
* **Response**: `200 OK`

### `GET /admin/pujas`
Get the global master list of all Pujas.
* **Response**: `200 OK` | `{ pujas: [...] }`

### `POST /admin/pujas`
Create a new Puja in the global catalog. (Admin Only)
* **Body**: `{ name, description, durationMinutes, priceRange, locationType, category }`
* **Response**: `201 Created`

### `DELETE /admin/pujas/:id`
Delete a Puja from the global catalog. (Admin Only)
* **Response**: `200 OK`

### `GET /admin/bookings`
Monitor all platform bookings. (Admin Only)
* **Response**: `200 OK` | `{ bookings: [...] }`
