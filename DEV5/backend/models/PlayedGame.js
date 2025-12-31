const mongoose = require("mongoose");

const PlayedGameSchema = new mongoose.Schema({
  uid: String,      
  title: String,    
  hours: Number,    
  genre: String,    
  createdAt: Date
});

module.exports = mongoose.model("PlayedGame", PlayedGameSchema);
