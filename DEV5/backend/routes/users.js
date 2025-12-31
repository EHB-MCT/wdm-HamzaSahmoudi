const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.post("/", async (req, res) => {
  const user = new User({
    uid: req.body.uid,
    createdAt: new Date(),
  });

  await user.save();
  res.json(user);
});

module.exports = router;
