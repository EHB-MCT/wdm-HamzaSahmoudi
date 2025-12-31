const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  email: String,
  password: String,
  createdAt: Date,
});

module.exports = mongoose.model("Account", AccountSchema);
