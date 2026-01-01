const express = require("express");
const User = require("../models/User");
const PlayedGame = require("../models/PlayedGame");

const router = express.Router();

async function getSteamPrimaryGenre(appId) {
  try {
    const res = await fetch(
      "https://store.steampowered.com/api/appdetails?appids=" +
        appId +
        "&l=english"
    );

    const json = await res.json();
    const data = json[String(appId)] && json[String(appId)].data;

    if (data && data.genres && data.genres.length > 0) {
      return data.genres[0].description;
    }

    return "Unknown";
  } catch (err) {
    return "Unknown";
  }
}

function calcFavoriteGenreByHours(games) {
  const genreHours = {};
  for (const g of games) {
    const key = g.genre || "Unknown";
    genreHours[key] = (genreHours[key] || 0) + Number(g.hours || 0);
  }

  let favoriteGenre = "Unknown";
  let max = -1;

  for (const genre in genreHours) {
    if (genreHours[genre] > max) {
      max = genreHours[genre];
      favoriteGenre = genre;
    }
  }

  return favoriteGenre;
}

router.get("/", async (req, res) => {
  const uid = req.query.uid;

  if (!uid) return res.status(400).json({ message: "uid required" });

  const user = await User.findOne({ uid: uid });
  if (!user) return res.status(404).json({ message: "user not found" });

  const games = await PlayedGame.find({ uid: uid }).sort({ createdAt: -1 });

  const totalHours = games.reduce((sum, g) => sum + Number(g.hours || 0), 0);
  const favoriteGenre = games.length > 0 ? calcFavoriteGenreByHours(games) : "";

  user.preferredGenre = favoriteGenre;
  await user.save();

  res.json({
    uid: user.uid,
    favoriteGenre: favoriteGenre,
    totalHours: totalHours,
    playedGames: games.map((g) => ({
      id: g.gameId,
      title: g.title,
      image: g.image,
      hours: g.hours,
      genre: g.genre || "Unknown",
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

  const genre = await getSteamPrimaryGenre(String(gameId));

  const g = new PlayedGame({
    uid: uid,
    gameId: String(gameId),
    title: title,
    image: image || "",
    hours: hours,
    genre: genre || "Unknown",
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

  const games = await PlayedGame.find({ uid: uid });
  const favoriteGenre = games.length ? calcFavoriteGenreByHours(games) : "";

  const user = await User.findOne({ uid: uid });
  if (user) {
    user.preferredGenre = favoriteGenre;
    await user.save();
  }

  res.json({ message: "updated", game: game, favoriteGenre });
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

  const games = await PlayedGame.find({ uid: uid });
  const favoriteGenre = games.length ? calcFavoriteGenreByHours(games) : "";

  const user = await User.findOne({ uid: uid });
  if (user) {
    user.preferredGenre = favoriteGenre;
    await user.save();
  }

  res.json({ message: "deleted", favoriteGenre });
});

module.exports = router;
