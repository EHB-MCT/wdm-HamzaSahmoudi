const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  accountId: String,
  uid: String,
  name: String,
  createdAt: Date,
});

module.exports = mongoose.model("User", UserSchema);
