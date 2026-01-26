const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const userModel = require("../models/userModel");

const MONGO_URI = process.env.MONGO_URI;
const TOTAL_RECORDS = 1000; // change to 1000 if needed

async function seedUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const users = [];

    for (let i = 101; i <= TOTAL_RECORDS; i++) {
      users.push({
        name: `user${i}`,
        email: `user${i}@example.com`,
        pwd: "$2b$11$7zf/XC164MNJjKBkmkzPEuTatLWAPYbumwmZ1aAoSxWwQWGVE/cri",
        role: "user",
        isBlocked: false,
        googleId: null,
        avatar: null,
        provider: "local",
        lastEmailSentAt: null,
        playerId: null,
        isVerified: true,
        subscriptionPlan: "pro",
        phoneNumber: null,
      });
    }

    console.log(`Inserting ${TOTAL_RECORDS} users...`);
    await userModel.insertMany(users);
    console.log(`✅ Successfully inserted ${TOTAL_RECORDS} users!`);
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seedUsers();
