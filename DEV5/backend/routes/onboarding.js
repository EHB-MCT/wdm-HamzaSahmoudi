const express = require("express");
const User = require("../models/User");

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

module.exports = router;
