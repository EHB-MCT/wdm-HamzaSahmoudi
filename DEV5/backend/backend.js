require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const usersRoutes = require("./routes/users");
const gamesRoutes = require("./routes/games");
const profileRoutes = require("./routes/profile");
const authRoutes = require("./routes/auth");
const gameSearchRoutes = require("./routes/gameSearch");
const onboardingRoutes = require("./routes/onboarding");
const dashboardRoutes = require("./routes/dashboard");
const leaderboardRoutes = require("./routes/leaderboard");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const recommendationsRoutes = require("./routes/recommendations");
const Account = require("./models/Account");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());

async function seedAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      console.error("Admin credentials not found in environment variables");
      return;
    }
    
    const existingAdmin = await Account.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const adminAccount = new Account({
        email: adminEmail,
        password: adminPassword,
        createdAt: new Date(),
        isAdmin: true
      });
      
      await adminAccount.save();
      
      const adminUser = new User({
        accountId: String(adminAccount._id),
        uid: "admin-" + String(adminAccount._id),
        name: "Admin",
        createdAt: new Date(),
      });
      
      await adminUser.save();
      console.log("Admin account created successfully");
    } else {
      console.log("Admin account already exists");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongo connected");
    seedAdmin();
  })
  .catch((err) => console.log("Mongo error", err));

app.get("/status", (req, res) => {
  res.send("OK");
});

app.use("/users", usersRoutes);

app.use("/games", gamesRoutes);

app.use("/profile", profileRoutes);

app.use("/auth", authRoutes);

app.use("/game-search", gameSearchRoutes);

app.use("/onboarding", onboardingRoutes);

app.use("/dashboard", dashboardRoutes);

app.use("/leaderboard", leaderboardRoutes);

app.use("/admin", adminRoutes);

app.use("/", shopRoutes);

app.use("/recommendations", recommendationsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});