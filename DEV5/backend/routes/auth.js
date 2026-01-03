const express = require("express");
const Account = require("../models/Account");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ message: "email, password and name required" });
  }

  const existingAdmin = await Account.findOne({ email: email, isAdmin: true });
  if (existingAdmin) {
    return res.status(403).json({ message: "admin email cannot be used for registration" });
  }

  const existing = await Account.findOne({ email: email });
  if (existing) {
    return res.status(409).json({ message: "email already exists" });
  }

  const account = new Account({
    email: email,
    password: password,
    createdAt: new Date(),
    isAdmin: false,
  });

  await account.save();

  const user = new User({
    accountId: String(account._id),
    uid: "user-" + String(account._id),
    name: name,
    createdAt: new Date(),
  });

  await user.save();

  res.json({
    accountId: account._id,
    uid: user.uid,
    name: user.name,
    email: account.email,
    isAdmin: account.isAdmin,
  });
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password required" });
  }

  const account = await Account.findOne({ email: email });

  if (!account || account.password !== password) {
    return res.status(401).json({ message: "invalid credentials" });
  }

  const user = await User.findOne({ accountId: String(account._id) });

  res.json({
    accountId: account._id,
    uid: user ? user.uid : null,
    name: user ? user.name : null,
    email: account.email,
    isAdmin: account.isAdmin,
  });
});

module.exports = router;