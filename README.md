# Smart Campus RFID Attendance

Smart Campus RFID Attendance is a full-stack demo project for tracking campus attendance with RFID cards. The backend is built with FastAPI and MongoDB, and the frontend is a responsive React + Vite dashboard for monitoring students, departments, recent scans, and admin operations.

The current project flow supports MATLAB-style simulation as well as manual frontend simulation:

- Students are registered with a unique `rfid_uid`
- RFID scans are posted to the backend through `/rfid/scan`
- Attendance analytics and recent swipes are shown on the dashboard
- The RFID Reader page can simulate live scans for demo/testing

## Features

- Responsive dashboard for attendance overview
- Student registry connected to backend data
- Department view with attendance percentages
- RFID reader console for simulated scans
- Admin page for student registration and attendance reset
- Seed script for generating test students and attendance activity

## Tech Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS
- Backend: FastAPI, Motor, MongoDB
- Simulation: seed script and MATLAB-compatible reader IDs

## Project Structure

```text
backend/
  main.py          FastAPI backend
  seed.py          Sample student + attendance simulator
  requirements.txt Python dependencies
src/
  App.tsx          Responsive app shell and routing
  api.ts           Frontend API helpers
  pages/           Dashboard, students, admin, RFID, departments, timetable
```

## Local Setup

### 1. Start MongoDB

Make sure MongoDB is running locally on:

```text
mongodb://localhost:27017
```

### 2. Start the backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

The API runs at:

```text
http://localhost:8000
```

### 3. Start the frontend

```bash
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

## Simulation Flow

You can test the project in three ways:

1. Register students from the Admin page.
2. Use the RFID Reader page to simulate scans with reader IDs like `gate-01` or `MATLAB_READER_1`.
3. Run the backend seed script:

```bash
cd backend
python seed.py
```

## Important API Endpoints

- `GET /analytics/summary`
- `GET /analytics/recent-swipes`
- `GET /students`
- `POST /students`
- `POST /rfid/scan`
- `GET /admin/students`
- `GET /admin/attendance`
- `DELETE /admin/reset-attendance`

## Notes

- The backend already supports simulation-friendly reader IDs such as `MATLAB_READER_1`.
- If the frontend cannot connect, confirm the backend is running on `http://localhost:8000`.
- The dashboard auto-refreshes summary and recent swipe data every 30 seconds.
