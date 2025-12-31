const express = require("express");
const User = require("../models/User");
const PlayedGame = require("../models/PlayedGame");

const router = express.Router();

router.post("/genre", async (req, res) => {
  const uid = req.body.uid;
  const preferredGenre = req.body.preferredGenre;

  if (!uid || !preferredGenre) {
    return res.status(400).json({ message: "uid and preferredGenre required" });
  }

  const user = await User.findOne({ uid: uid });
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  user.preferredGenre = preferredGenre;
  await user.save();

  res.json({
    uid: user.uid,
    preferredGenre: user.preferredGenre,
  });
});

router.post("/finish", async (req, res) => {
  try {
    const uid = req.body.uid;
    const favoriteGenre = req.body.favoriteGenre;
    const playedGames = req.body.playedGames;

    if (!uid || !favoriteGenre || !Array.isArray(playedGames)) {
      return res.status(400).json({ message: "missing data" });
    }

    const user = await User.findOne({ uid: uid });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    user.preferredGenre = favoriteGenre;
    await user.save();

    await PlayedGame.deleteMany({ uid: uid });

    const docs = playedGames.map((g) => ({
      uid: uid,
      gameId: String(g.gameId),
      title: g.title,
      image: g.image || "",
      hours: Number(g.hours || 0),
      createdAt: new Date(),
    }));

    await PlayedGame.insertMany(docs);

    return res.json({ message: "onboarding saved" });
  } catch (err) {
    return res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
