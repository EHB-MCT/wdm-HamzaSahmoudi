# Games Tracker - DEV5 Project

Application web pour suivre les heures de jeu vidéo avec onboarding personnalisé, dashboard utilisateur et interface d'administration.

## Prerequisites

- Docker
- Docker Compose

## Step-by-Step Setup Guide

1.Clone the repository:

```bash
git clone https://github.com/EHB-MCT/wdm-HamzaSahmoudi.git
```

2.Configure environment variables:

```bash
cp DEV5/backend/.env.template DEV5/backend/.env
```

3.Start all services:

```bash
docker compose up --build
```

## Access URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Mongo Express (DB UI): http://localhost:8081

## Testing Flow

### User Flow

1. Register new account on auth page
2. Complete onboarding:
   - Search games via Steam API
   - Set hours for each selected game
3. Access dashboard:
   - View total hours and favorite genre
   - Modify game hours, add/remove games
4. View leaderboard page

### Admin Flow

1. Click "Admin" button on login page
2. Login with admin credentials:
   - Email: admin@gmail.com
   - Password: admin123
3. Access Admin Dashboard:
   - View all users with email, name, total hours, games
   - Logout functionality

## File Structure Overview

```
wdm-HamzaSahmoudi/
├── DEV5/
│   ├── backend/
│   │   ├── models/
│   │   │   ├── Account.js
│   │   │   ├── PlayedGame.js
│   │   │   ├── Shop.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── admin.js
│   │   │   ├── auth.js
│   │   │   ├── dashboard.js
│   │   │   ├── gameSearch.js
│   │   │   ├── leaderboard.js
│   │   │   ├── onboarding.js
│   │   │   └── ...
│   │   ├── .env.template
│   │   ├── backend.js
│   │   ├── package.json
│   │   └── Dockerfile
│   └── frontend/
│       ├── src/
│       │   ├── pages/
│       │   │   ├── AdminDashboard.jsx
│       │   │   ├── AuthPage.jsx
│       │   │   ├── Dashboard.jsx
│       │   │   ├── Leaderboard.jsx
│       │   │   ├── Onboarding.jsx
│       │   │   └── Shop.jsx
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── package.json
│       └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Stopping

```bash
docker compose down
```

Optional: Reset database completely:

```bash
docker compose down -v
```

## API Endpoints

### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login (returns user data with isAdmin flag)

### Dashboard

- `GET /dashboard?uid=<user_id>` - Get user dashboard data (games, total hours, favorite genre)
- `POST /dashboard/games` - Add new game to user library
- `PUT /dashboard/games/:gameId` - Update game hours
- `DELETE /dashboard/games/:gameId` - Remove game from user library

### Onboarding

- `POST /onboarding/finish` - Complete onboarding with selected games and hours

### Game Search (Steam API Proxy)

- `GET /game-search?q=<query>` - Search games via Steam Store API

### Leaderboard

- `GET /leaderboard` - Get top games and genres by total hours

### Admin (requires isAdmin=true parameter)

- `GET /admin/stats` - Get platform statistics (users, games, hours)
- `GET /admin/users?isAdmin=true` - Get all users with their games and stats

## Sources and References

- Docker Compose environment files: https://docs.docker.com/compose/environment-variables/
- Mongo Express image: https://hub.docker.com/_/mongo-express
- Steam Store API documentation: https://partner.steamgames.com/doc/webapi/steamstore
- Express.js framework: https://expressjs.com/
- Mongoose ODM: https://mongoosejs.com/
- AI Assistance - Opencode -> OpenCode.md
