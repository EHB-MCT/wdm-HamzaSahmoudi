const express = require("express");
const PlayedGame = require("../models/PlayedGame");

const router = express.Router();

router.get("/", async (req, res) => {
  const uid = req.query.uid;

  const games = await PlayedGame.find({ uid: uid });

  let totalHours = 0;
  const genreCount = {};

  for (const game of games) {
    totalHours += game.hours;

    if (genreCount[game.genre]) {
      genreCount[game.genre] += 1;
    } else {
      genreCount[game.genre] = 1;
    }
  }

  let favoriteGenre = null;
  let max = 0;

  for (const genre in genreCount) {
    if (genreCount[genre] > max) {
      max = genreCount[genre];
      favoriteGenre = genre;
    }
  }

  res.json({
    uid: uid,
    totalHours: totalHours,
    favoriteGenre: favoriteGenre,
  });
});

module.exports = router;
