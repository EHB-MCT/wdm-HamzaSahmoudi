const express = require("express");
const PlayedGame = require("../models/PlayedGame");

const router = express.Router();

router.post("/", async (req, res) => {
  const game = new PlayedGame({
    uid: req.body.uid,
    title: req.body.title,
    hours: req.body.hours,
    genre: req.body.genre,
    createdAt: new Date(),
  });

  await game.save();
  res.json(game);
});

router.get("/", async (req, res) => {
  const games = await PlayedGame.find({ uid: req.query.uid });
  res.json(games);
});

module.exports = router;
