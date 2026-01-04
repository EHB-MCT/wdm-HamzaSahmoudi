const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  email: String,
  password: String,
  createdAt: Date,
  isAdmin: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Account", AccountSchema);