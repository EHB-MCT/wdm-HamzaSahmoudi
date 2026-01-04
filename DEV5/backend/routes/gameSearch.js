const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  const q = req.query.q;

  if (!q) {
    return res.status(400).json({ message: "query q is required" });
  }

  try {
    const url =
      "https://store.steampowered.com/api/storesearch/?term=" +
      encodeURIComponent(q) +
      "&l=english&cc=us";

    const response = await fetch(url);
    const data = await response.json();

    const items = (data.items || []).map((item) => {
      return {
        id: item.id,
        name: item.name,
        image: item.tiny_image,
      };
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "steam search failed" });
  }
});

module.exports = router;
