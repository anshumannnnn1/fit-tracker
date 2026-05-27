# FitTrack — MERN Fitness App

Full-stack fitness tracker built with MongoDB, Express, React, Node.js.

## Features
- **Auth** — JWT-based register/login
- **Steps** — Log daily steps, set goals, weekly chart
- **Calories** — Log meals with macros (protein/carbs/fats), calorie goals
- **Workouts** — Log sessions with auto calorie burn estimate
- **Water** — Track daily water intake with cup tracker
- **Schedule** — Daily timetable with color-coded entries
- **Diet** — 8 diet types, macro targets, BMR/TDEE/BMI calculator
- **Profile** — Personal info, goals, settings

## Project Structure
```
fittrack/
├── server/
│   ├── index.js          # Express entry point
│   ├── .env.example      # Copy to .env and fill in
│   ├── middleware/
│   │   └── auth.js       # JWT middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Step.js
│   │   ├── Food.js
│   │   ├── Workout.js
│   │   ├── Water.js
│   │   └── Schedule.js
│   └── routes/
│       ├── auth.js
│       ├── steps.js
│       ├── calories.js
│       ├── workouts.js
│       ├── water.js
│       ├── schedule.js
│       ├── profile.js
│       └── diet.js
└── client/
    └── src/
        ├── App.js
        ├── context/AuthContext.js
        ├── hooks/useDate.js
        ├── components/Layout.js, Card.js
        └── pages/
            ├── Auth.js
            ├── Dashboard.js
            ├── Steps.js
            ├── Calories.js
            ├── Workout.js
            ├── Water.js
            ├── Schedule.js
            ├── Diet.js
            └── Profile.js

## Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### 1. Clone and install
```bash
git clone <your-repo>
cd fittrack
npm run install-all
```

### 2. Configure server
```bash
cd server
cp .env.example .env
# Edit .env: set MONGO_URI and JWT_SECRET
```

### 3. Run development servers
```bash
cd fittrack          # back to root
npm run dev          # starts both server (port 5000) and client (port 3000)
```

Open http://localhost:3000

## API Endpoints

| Method | Route                    | Description         |
|--------|--------------------------|---------------------|
| POST   | /api/auth/register       | Register user       |
| POST   | /api/auth/login          | Login               |
| GET    | /api/profile             | Get profile         |
| PUT    | /api/profile             | Update profile      |
| GET    | /api/steps/:date         | Get today's steps   |
| POST   | /api/steps               | Add steps           |
| GET    | /api/steps/weekly/:date  | Weekly step data    |
| GET    | /api/calories/:date      | Get food log        |
| POST   | /api/calories            | Log food            |
| DELETE | /api/calories/:id        | Delete food entry   |
| GET    | /api/workouts/:date      | Get workouts        |
| POST   | /api/workouts            | Log workout         |
| DELETE | /api/workouts/:id        | Delete workout      |
| GET    | /api/water/:date         | Get water intake    |
| POST   | /api/water               | Update water intake |
| GET    | /api/schedule/:date      | Get schedule        |
| POST   | /api/schedule            | Add entry           |
| DELETE | /api/schedule/:id        | Delete entry        |
| GET    | /api/diet/plans          | Get all diet plans  |
| PUT    | /api/diet/select         | Select diet type    |

## Convert to Mobile (React Native)
All business logic, API calls, and state management are in React — these translate 1:1 to React Native.
Replace HTML elements: `div → View`, `p/span → Text`, `input → TextInput`, `button → TouchableOpacity`.
Use `@react-navigation/native` instead of `react-router-dom`.
Use `AsyncStorage` instead of `localStorage`.
