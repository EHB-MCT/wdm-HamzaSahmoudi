const express = require('express');
const router = express.Router();
const PlayedGame = require('../models/PlayedGame');
const { CartItem } = require('../models/Shop');
const User = require('../models/User');

const searchTerms = [
  'action', 'rpg', 'adventure', 'strategy', 'shooter', 'puzzle', 
  'horror', 'simulation', 'racing', 'sports', 'indie', 'multiplayer',
  'fantasy', 'sci-fi', 'open world', 'survival', 'co-op', 'mmo'
];

router.get('/', async (req, res) => {
  try {
    const { uid } = req.query;
    if (!uid) {
      return res.status(400).json({ error: 'uid required' });
    }

    const cartItems = await CartItem.find({ uid });
    const cartGameIds = cartItems.map(item => item.gameId);

    const user = await User.findOne({ uid });
    const notInterested = user?.notInterested || [];

    const playedGames = await PlayedGame.find({ uid });
    const playedGameIds = playedGames.map(game => game.gameId);

const excludeIds = [...playedGameIds, ...cartGameIds, ...notInterested];

    const userGenre = user?.preferredGenre;
    const allRecommendations = [];

    if (userGenre && searchTerms.includes(userGenre.toLowerCase())) {
      try {
        const searchUrl = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(userGenre)}&l=english&cc=us`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        const recommendations = (searchData.items || [])
          .filter(item => !excludeIds.includes(item.id.toString()))
          .map(item => ({
            gameId: item.id.toString(),
            title: item.name,
            image: item.tiny_image,
            reason: `Based on your preference for ${userGenre}`
          }));

        allRecommendations.push(...recommendations);
      } catch (error) {
        console.error(`Failed to search for preferred genre: ${userGenre}`);
      }
    }

    if (allRecommendations.length < 3) {
      const additionalTerms = searchTerms.filter(term => 
        !userGenre || term.toLowerCase() !== userGenre.toLowerCase()
      );
      const shuffledTerms = [...additionalTerms].sort(() => 0.5 - Math.random());
      const neededTerms = 3 - allRecommendations.length;
      const selectedTerms = shuffledTerms.slice(0, neededTerms);

      for (const term of selectedTerms) {
        try {
          const searchUrl = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(term)}&l=english&cc=us`;
          const searchResponse = await fetch(searchUrl);
          const searchData = await searchResponse.json();

          const recommendations = (searchData.items || [])
            .filter(item => !excludeIds.includes(item.id.toString()))
            .map(item => ({
              gameId: item.id.toString(),
              title: item.name,
              image: item.tiny_image,
              reason: `Popular ${term} game`
            }));

          allRecommendations.push(...recommendations.slice(0, 3 - allRecommendations.length));
        } catch (error) {
          console.error(`Failed to search for term: ${term}`);
        }
      }
    }

    const uniqueRecommendations = allRecommendations.filter((item, index, self) => 
      index === self.findIndex((t) => t.gameId === item.gameId)
    );
    
    const shuffled = uniqueRecommendations.sort(() => 0.5 - Math.random());
    const finalRecommendations = shuffled.slice(0, 3);

    res.json(finalRecommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/not-interested', async (req, res) => {
  try {
    const { uid, gameId } = req.body;
    if (!uid || !gameId) {
      return res.status(400).json({ error: 'uid and gameId required' });
    }

    await User.findOneAndUpdate(
      { uid },
      { $addToSet: { notInterested: gameId } },
      { upsert: true }
    );

    res.json({ message: 'marked as not interested' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/refresh', async (req, res) => {
  try {
    const { uid } = req.query;
    if (!uid) {
      return res.status(400).json({ error: 'uid required' });
    }

    const cartItems = await CartItem.find({ uid });
    const cartGameIds = cartItems.map(item => item.gameId);

    const user = await User.findOne({ uid });
    const notInterested = user?.notInterested || [];

    const playedGames = await PlayedGame.find({ uid });
    const playedGameIds = playedGames.map(game => game.gameId);

const excludeIds = [...playedGameIds, ...cartGameIds, ...notInterested];

    const userGenre = user?.preferredGenre;
    let searchTerm;

    if (userGenre && searchTerms.includes(userGenre.toLowerCase())) {
      searchTerm = userGenre;
    } else {
      searchTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    }

    const searchUrl = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(searchTerm)}&l=english&cc=us`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    const availableGames = (searchData.items || [])
      .filter(item => !excludeIds.includes(item.id.toString()));

    if (availableGames.length === 0) {
      return res.json([]);
    }

    const randomGame = availableGames[Math.floor(Math.random() * availableGames.length)];
    const recommendation = {
      gameId: randomGame.id.toString(),
      title: randomGame.name,
      image: randomGame.tiny_image,
      reason: userGenre && searchTerm.toLowerCase() === userGenre.toLowerCase() 
        ? `Based on your preference for ${userGenre}`
        : `Popular ${searchTerm} game`
    };

    res.json([recommendation]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;