const express = require("express");
const User = require("../models/User");
const PlayedGame = require("../models/PlayedGame");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const uid = req.query.uid;

    if (!uid) {
      return res.status(400).json({ message: "uid required" });
    }

    const user = await User.findOne({ uid: uid });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const games = await PlayedGame.find({ uid: uid });

    let totalHours = 0;
    for (const game of games) {
      totalHours += Number(game.hours || 0);
    }

    res.json({
      uid: uid,
      totalHours: totalHours,
      favoriteGenre: user.preferredGenre || null,
      playedGames: games.map((g) => ({
        id: String(g._id),
        gameId: String(g.gameId),
        title: g.title,
        image: g.image || "",
        hours: Number(g.hours || 0),
      })),
    });
  } catch (err) {
    return res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
