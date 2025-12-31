const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const usersRoutes = require("./routes/users");
const gamesRoutes = require("./routes/games");
const profileRoutes = require("./routes/profile");
const authRoutes = require("./routes/auth");
const gameSearchRoutes = require("./routes/gameSearch");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.log("Mongo error", err));

app.get("/status", (req, res) => {
  res.send("OK");
});

app.use("/users", usersRoutes);

app.use("/games", gamesRoutes);

app.use("/profile", profileRoutes);

app.use("/auth", authRoutes);

app.use("/game-search", gameSearchRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
