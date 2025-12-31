const express = require("express");
const Account = require("../models/Account");

const router = express.Router();

router.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password required" });
  }

  const existing = await Account.findOne({ email: email });
  if (existing) {
    return res.status(409).json({ message: "email already exists" });
  }

  const account = new Account({
    email: email,
    password: password,
    createdAt: new Date(),
  });

  await account.save();

  res.json({
    accountId: account._id,
    email: account.email,
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

  res.json({
    accountId: account._id,
    email: account.email,
  });
});

module.exports = router;
