# Leaderboard Route Implementation

## Overview

This file implements the leaderboard API endpoint that provides gaming statistics and rankings based on played games data.

## File: backend/routes/leaderboard.js

### Implementation Details

The leaderboard route aggregates data from the PlayedGame model to provide two types of rankings:

1. **Top Games by Hours** - Games ranked by total playtime
2. **Top Genres by Hours** - Game genres ranked by total playtime

### API Endpoint

- **GET** `/` - Returns leaderboard statistics

### Response Format

```json
{
  "topGamesByHours": [
    {
      "gameId": "string",
      "title": "string",
      "image": "string",
      "totalHours": "number",
      "players": "number"
    }
  ],
  "topGenresByHours": [
    {
      "genre": "string",
      "totalHours": "number"
    }
  ]
}
```

### Query Parameters

- `limit` (optional): Number of results to return (default: 10)

### MongoDB Aggregation Pipeline

#### Top Games Query

1. **Group by gameId** - Aggregate total hours, collect unique players
2. **Add fields** - Calculate player count from unique player set
3. **Sort** - By total hours descending
4. **Limit** - Apply result limit
5. **Project** - Format output fields

#### Top Genres Query

1. **Group by genre** - Aggregate total hours (handles null genres as "Unknown")
2. **Sort** - By total hours descending
3. **Limit** - Apply result limit
4. **Project** - Format output fields

### Error Handling

- Returns 500 status with generic error message on server errors
- Uses try-catch block for error handling

### Dependencies

- Express.js for routing
- PlayedGame model for data access
- MongoDB aggregation framework for complex queries

This implementation efficiently calculates gaming statistics using MongoDB's aggregation pipeline, providing insights into the most played games and genres based on user activity.

---

# Leaderboard Frontend Component

## Overview

This React component displays the leaderboard data fetched from the backend API, showing top games and genres by total playtime.

## File: frontend/src/pages/Leaderboard.jsx

### Implementation Details

I built this component from scratch to create an intuitive and responsive leaderboard interface that displays gaming statistics in a clean, organized manner.

### Component Structure

- **State Management**: Uses React hooks (useState, useEffect) for data and error handling
- **API Integration**: Fetches data from `http://localhost:3000/leaderboard?limit=10`
- **Responsive Design**: Utilizes CSS grid layout for flexible display
- **Error Handling**: Comprehensive error states with user-friendly messages

### Key Features I Implemented

1. **Data Loading Strategy**

   - Async/await pattern for clean asynchronous code
   - Loading state while fetching data
   - Error boundary for network and API errors

2. **Visual Design Elements**

   - Game images with fallback placeholders
   - Ranked numbering system (#1, #2, etc.)
   - Pill badges for hours display with custom styling
   - Player count information for each game

3. **User Experience**
   - Clear loading indicator
   - Descriptive error messages
   - Empty state handling
   - Back navigation button

### Component Props

- `onBack`: Function to handle navigation back to previous page

### API Response Handling

The component expects the same response format defined in the backend route:

- `topGamesByHours`: Array of game statistics
- `topGenresByHours`: Array of genre statistics

### Error Handling Strategy

I implemented a three-tier error handling approach:

1. **Network errors**: "backend not running?" message
2. **API errors**: Server error messages from response
3. **Empty data**: "No data yet" or "No genres yet" messages

This component provides a complete user interface for the leaderboard feature with proper loading states, error handling, and a clean visual presentation of gaming statistics.
