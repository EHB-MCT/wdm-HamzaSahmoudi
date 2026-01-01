const express = require("express");
const User = require("../models/User");
const PlayedGame = require("../models/PlayedGame");

const router = express.Router();

router.get("/", async (req, res) => {
  const uid = req.query.uid;

  if (!uid) return res.status(400).json({ message: "uid required" });

  const user = await User.findOne({ uid: uid });
  if (!user) return res.status(404).json({ message: "user not found" });

  const games = await PlayedGame.find({ uid: uid }).sort({ createdAt: -1 });

  const totalHours = games.reduce((sum, g) => sum + (g.hours || 0), 0);

  res.json({
    uid: user.uid,
    favoriteGenre: user.preferredGenre || "",
    totalHours: totalHours,
    playedGames: games.map((g) => ({
      id: g.gameId,
      title: g.title,
      image: g.image,
      hours: g.hours,
    })),
  });
});

router.post("/games", async (req, res) => {
  const uid = req.body.uid;
  const gameId = req.body.gameId;
  const title = req.body.title;
  const image = req.body.image;
  const hours = Number(req.body.hours || 0);

  if (!uid || !gameId || !title) {
    return res.status(400).json({ message: "uid, gameId and title required" });
  }

  const exists = await PlayedGame.findOne({ uid: uid, gameId: String(gameId) });
  if (exists) {
    return res.status(409).json({ message: "game already exists" });
  }

  const g = new PlayedGame({
    uid: uid,
    gameId: String(gameId),
    title: title,
    image: image || "",
    hours: hours,
    createdAt: new Date(),
  });

  await g.save();

  res.json({ message: "added", game: g });
});

router.put("/games/:gameId", async (req, res) => {
  const uid = req.body.uid;
  const gameId = req.params.gameId;
  const hours = Number(req.body.hours);

  if (!uid) return res.status(400).json({ message: "uid required" });
  if (Number.isNaN(hours) || hours < 0) {
    return res.status(400).json({ message: "hours must be a number >= 0" });
  }

  const game = await PlayedGame.findOne({ uid: uid, gameId: String(gameId) });
  if (!game) return res.status(404).json({ message: "game not found" });

  game.hours = hours;
  await game.save();

  res.json({ message: "updated", game: game });
});

router.delete("/games/:gameId", async (req, res) => {
  const uid = req.body.uid;
  const gameId = req.params.gameId;

  if (!uid) return res.status(400).json({ message: "uid required" });

  const deleted = await PlayedGame.findOneAndDelete({
    uid: uid,
    gameId: String(gameId),
  });

  if (!deleted) return res.status(404).json({ message: "game not found" });

  res.json({ message: "deleted" });
});

module.exports = router;
