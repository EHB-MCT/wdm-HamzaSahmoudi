const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  uid: String,
  createdAt: Date,
});

module.exports = mongoose.model("User", UserSchema);
