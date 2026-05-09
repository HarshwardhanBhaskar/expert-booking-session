# ExpertSlot

Real-time expert session booking platform built for the assessment task using React, Node.js, Express, MongoDB, and Socket.io.

ExpertSlot lets users:
- browse experts with search, category filters, and pagination
- view expert availability by date
- book a session with validation
- see live slot updates when another user books the same slot
- review bookings by email

## Highlights

- Real-time slot updates with Socket.io
- Double-booking protection using a compound unique index and backend validation
- Premium responsive frontend redesign with modern SaaS-inspired UI
- Proper backend structure with `routes`, `controllers`, `models`, and middleware
- Error handling for invalid input, missing resources, and booking conflicts

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Real-time | Socket.io |
| Forms | React Hook Form |
| HTTP Client | Axios |
| Notifications | React Hot Toast |

## Core Features

### 1. Expert Listing
- expert cards with name, category, rating, experience, and availability
- search by name
- filter by category
- pagination
- loading, empty, and error states

### 2. Expert Detail
- full expert profile view
- available slots grouped by date
- real-time slot disable state when a booking happens elsewhere

### 3. Booking Flow
- validated booking form
- fields for name, email, phone, date, slot, and notes
- prevents selecting already booked slots
- success feedback after booking

### 4. My Bookings
- fetch bookings by email
- display booking status:
  - `Pending`
  - `Confirmed`
  - `Completed`

## Double Booking Protection

The project prevents duplicate bookings for the same:
- expert
- date
- time slot

This is handled in two layers:
- application-level validation before insert
- MongoDB compound unique index on `{ expertId, date, slot }`

## Project Structure

```text
expert-session-booking/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/
│   │   ├── socket/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── socket/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB local instance or MongoDB Atlas

### 1. Clone the repository

```bash
git clone https://github.com/HarshwardhanBhaskar/expert-booking-session.git
cd expert-booking-session
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expert-booking
CLIENT_URL=http://localhost:5173
```

Seed sample experts:

```bash
npm run seed
```

Start backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

### 4. Open the app

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Environment Files

Example environment files are included:
- `backend/.env.example`
- `frontend/.env.example`

## Available Scripts

### Backend

```bash
npm run dev
npm run start
npm run seed
```

### Frontend

```bash
npm run dev
npm run build
npm run lint
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/experts` | List experts with pagination, search, and category filter |
| GET | `/api/experts/:id` | Get one expert and current booked-slot state |
| GET | `/api/experts/categories/list` | Get all categories |
| POST | `/api/bookings` | Create a booking |
| PATCH | `/api/bookings/:id/status` | Update booking status |
| GET | `/api/bookings?email=` | Get bookings by email |

### `GET /api/experts` query params

- `page`: page number, default `1`
- `search`: search by expert name
- `category`: filter by category

## UI Notes

The frontend was redesigned to feel more production-grade and premium with:
- layered dark theme
- improved spacing and hierarchy
- richer card design
- polished navbar
- responsive layouts
- Framer Motion transitions and hover effects

## Assessment Requirement Coverage

- Expert listing screen
- Expert detail screen
- Booking screen
- My bookings screen
- Real-time slot updates
- Double-booking prevention
- Validation and error handling
- Environment variable usage
- Clean backend folder structure

## License

MIT
