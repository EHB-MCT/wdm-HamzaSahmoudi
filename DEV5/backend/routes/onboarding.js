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

router.post("/finish", async (req, res) => {
  try {
    const uid = req.body.uid;
    const playedGames = req.body.playedGames;

    if (!uid || !Array.isArray(playedGames)) {
      return res.status(400).json({ message: "uid and playedGames required" });
    }

    const user = await User.findOne({ uid: uid });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const enriched = [];
    for (const g of playedGames) {
      const gameId = String(g.gameId || "");
      const hours = Number(g.hours || 0);

      if (!gameId) continue;

      const genre = await getSteamPrimaryGenre(gameId);

      enriched.push({
        gameId,
        title: g.title,
        image: g.image || "",
        hours,
        genre,
      });
    }

    const genreHours = {};
    for (const g of enriched) {
      const key = g.genre || "Unknown";
      genreHours[key] = (genreHours[key] || 0) + (g.hours || 0);
    }

    let favoriteGenre = "Unknown";
    let max = -1;

    for (const genre in genreHours) {
      if (genreHours[genre] > max) {
        max = genreHours[genre];
        favoriteGenre = genre;
      }
    }

    user.preferredGenre = favoriteGenre;
    await user.save();

    await PlayedGame.deleteMany({ uid: uid });

    const docs = enriched.map((g) => ({
      uid: uid,
      gameId: String(g.gameId),
      title: g.title,
      image: g.image || "",
      hours: Number(g.hours || 0),
      genre: g.genre || "Unknown",
      createdAt: new Date(),
    }));

    await PlayedGame.insertMany(docs);

    return res.json({
      message: "onboarding saved",
      favoriteGenre: favoriteGenre,
    });
  } catch (err) {
    return res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
