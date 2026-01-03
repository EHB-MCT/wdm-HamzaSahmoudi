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