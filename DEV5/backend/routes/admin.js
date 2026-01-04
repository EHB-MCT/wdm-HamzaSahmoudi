const express = require("express");
const Account = require("../models/Account");
const User = require("../models/User");
const PlayedGame = require("../models/PlayedGame");

const router = express.Router();

router.get("/stats", async (req, res) => {
  if (req.query.isAdmin !== "true") {
    return res.status(403).json({ message: "Admin access required" });
  }

  try {
    const totalUsers = await Account.countDocuments({ isAdmin: false });
    
    // Get non-admin accounts to find valid users
    const nonAdminAccounts = await Account.find({ isAdmin: false });
    const accountIds = nonAdminAccounts.map(acc => acc._id.toString());
    
    // Find users with non-admin accounts
    const validUsers = await User.find({ accountId: { $in: accountIds } });
    const validUids = validUsers.map(user => user.uid);
    
    // Count only games from non-admin users
    const totalGames = await PlayedGame.countDocuments({ 
      uid: { $in: validUids } 
    });

    // Calculate total hours from non-admin users
    const totalHoursResult = await PlayedGame.aggregate([
      {
        $match: {
          uid: { $in: validUids }
        }
      },
      {
        $group: {
          _id: null,
          totalHours: { $sum: "$hours" }
        }
      }
    ]);

    const totalHours = totalHoursResult.length > 0 ? totalHoursResult[0].totalHours : 0;

    const topGames = await PlayedGame.aggregate([
      {
        $match: {
          uid: { $in: validUids }
        }
      },
      {
        $group: {
          _id: { title: "$title", image: "$image" },
          totalHours: { $sum: "$hours" }
        }
      },
      { $sort: { totalHours: -1 } },
      { $limit: 5 },
      {
        $project: {
          title: "$_id.title",
          image: "$_id.image",
          totalHours: 1,
          _id: 0
        }
      }
    ]);

    const topGenres = await PlayedGame.aggregate([
      {
        $match: {
          uid: { $in: validUids }
        }
      },
      {
        $group: {
          _id: "$genre",
          totalHours: { $sum: "$hours" }
        }
      },
      { $sort: { totalHours: -1 } },
      { $limit: 5 },
      {
        $project: {
          genre: "$_id",
          totalHours: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      totalUsers,
      totalGames,
      totalHours,
      topGames,
      topGenres
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/users", async (req, res) => {
  if (req.query.isAdmin !== "true") {
    return res.status(403).json({ message: "Admin access required" });
  }

  try {
    // Get minHours filter from query params (optional)
    const minHours = req.query.minHours ? parseInt(req.query.minHours) : null;
    
    // Get non-admin accounts
    const nonAdminAccounts = await Account.find({ isAdmin: false });
    const accountIds = nonAdminAccounts.map(acc => acc._id.toString());
    
    // Build match stage for filtering by totalHours if provided
    const matchStage = {
      accountId: { $in: accountIds }
    };
    
    // Find users associated with non-admin accounts
    const users = await User.aggregate([
      {
        $match: matchStage
      },
      {
        $lookup: {
          from: "accounts",
          let: { accountIdStr: "$accountId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$accountIdStr" }]
                }
              }
            }
          ],
          as: "account"
        }
      },
      {
        $unwind: "$account"
      },
      {
        $lookup: {
          from: "playedgames",
          localField: "uid",
          foreignField: "uid",
          as: "games"
        }
      },
      {
        $project: {
          name: 1,
          email: "$account.email",
          createdAt: 1,
          games: {
            $map: {
              input: "$games",
              as: "game",
              in: {
                title: "$$game.title",
                image: "$$game.image",
                hours: "$$game.hours",
                genre: "$$game.genre",
                createdAt: "$$game.createdAt"
              }
            }
          }
        }
      },
      {
        $addFields: {
          totalGames: { $size: "$games" },
          totalHours: { $sum: "$games.hours" }
        }
      },
      // Apply minHours filter if provided
      ...(minHours !== null ? [{
        $match: {
          totalHours: { $gte: minHours }
        }
      }] : [])
    ]);

    console.log(`Found ${users.length} users${minHours !== null ? ` with ${minHours}+ hours` : ''}`);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;