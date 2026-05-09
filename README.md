# ExpertSlot — Real-Time Expert Session Booking System

A modern full-stack application for browsing experts, viewing real-time available time slots, and booking sessions. Built with the MERN stack and Socket.io for real-time updates.

## Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | React 19 + Vite               |
| Styling   | Tailwind CSS v4               |
| Backend   | Node.js + Express.js          |
| Database  | MongoDB + Mongoose            |
| Real-time | Socket.io                     |
| Forms     | React Hook Form               |
| HTTP      | Axios                         |
| Toasts    | React Hot Toast               |

## Features

- **Expert Listing** — Search by name, filter by category, paginated grid
- **Expert Details** — Full profile with real-time available slots
- **Session Booking** — Form with validation, prevents double booking
- **My Bookings** — View bookings by email with status badges
- **Real-Time Updates** — Booked slots disable instantly for all users via Socket.io
- **Double Booking Prevention** — Compound unique index + application-level checks

## Project Structure

```
expert-session-booking/
├── backend/
│   └── src/
│       ├── config/db.js
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── seed/seed.js
│       ├── socket/socketHandler.js
│       └── server.js
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── pages/
│       ├── socket/
│       ├── App.jsx
│       └── main.jsx
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` in `/backend`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expert-booking
CLIENT_URL=http://localhost:5173
```

Seed the database:
```bash
npm run seed
```

Start the backend:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` in `/frontend`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

## API Documentation

| Method | Endpoint                    | Description                  |
|--------|-----------------------------|------------------------------|
| GET    | `/api/experts`              | List experts (search/filter/paginate) |
| GET    | `/api/experts/:id`          | Get expert details           |
| GET    | `/api/experts/categories/list` | Get all categories        |
| POST   | `/api/bookings`             | Create a booking             |
| PATCH  | `/api/bookings/:id/status`  | Update booking status        |
| GET    | `/api/bookings?email=`      | Get bookings by email        |

### Query Parameters for `GET /api/experts`
- `page` — Page number (default: 1)
- `search` — Search by expert name
- `category` — Filter by category

## Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import to Vercel
3. Set `VITE_API_URL` environment variable

### Backend (Render / Railway)
1. Push to GitHub
2. Create web service
3. Set environment variables: `PORT`, `MONGO_URI`, `CLIENT_URL`

## License

MIT
