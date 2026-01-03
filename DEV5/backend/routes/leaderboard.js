const express = require("express");
const PlayedGame = require("../models/PlayedGame");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const limit = Number(req.query.limit || 10);

    const topGames = await PlayedGame.aggregate([
      {
        $group: {
          _id: "$gameId",
          title: { $first: "$title" },
          image: { $first: "$image" },
          totalHours: { $sum: "$hours" },
          playersSet: { $addToSet: "$uid" },
        },
      },
      {
        $addFields: {
          players: { $size: "$playersSet" },
        },
      },
      { $sort: { totalHours: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          gameId: "$_id",
          title: 1,
          image: 1,
          totalHours: 1,
          players: 1,
        },
      },
    ]);

    const topGenres = await PlayedGame.aggregate([
      {
        $group: {
          _id: { $ifNull: ["$genre", "Unknown"] },
          totalHours: { $sum: "$hours" },
        },
      },
      { $sort: { totalHours: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          genre: "$_id",
          totalHours: 1,
        },
      },
    ]);

    res.json({
      topGamesByHours: topGames,
      topGenresByHours: topGenres,
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
