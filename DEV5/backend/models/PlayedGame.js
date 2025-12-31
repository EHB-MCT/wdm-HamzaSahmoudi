const mongoose = require("mongoose");

const PlayedGameSchema = new mongoose.Schema({
  uid: String,
  gameId: String,
  title: String,
  image: String,
  hours: Number,
  createdAt: Date,
});

module.exports = mongoose.model("PlayedGame", PlayedGameSchema);
