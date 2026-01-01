const express = require("express");
const User = require("../models/User");
const PlayedGame = require("../models/PlayedGame");

const router = express.Router();

router.get("/", async (req, res) => {
  const uid = req.query.uid;

  if (!uid) {
    return res.status(400).json({ message: "uid required" });
  }

  const user = await User.findOne({ uid: uid });
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const playedGames = await PlayedGame.find({ uid: uid }).sort({
    createdAt: -1,
  });

  let totalHours = 0;
  for (const g of playedGames) totalHours += Number(g.hours || 0);

  res.json({
    uid: user.uid,
    name: user.name || null,
    favoriteGenre: user.preferredGenre || null,
    totalHours: totalHours,
    playedGames: playedGames.map((g) => ({
      id: g.gameId,
      title: g.title,
      image: g.image,
      hours: g.hours,
    })),
  });
});

module.exports = router;
