const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const monitorModel = require("../models/monitorModel");

const MONGO_URI = process.env.MONGO_URI;
const USER_ID = "6969d3ee284f0059a1eedeb3"; // Your user ID
const MONITOR_URL = "https://pulse-check-6drk.onrender.com";
const TOTAL_RECORDS = 1000;

async function seedMonitors() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const monitors = [];

    for (let i = 1; i <= TOTAL_RECORDS; i++) {
      monitors.push({
        userId: new mongoose.Types.ObjectId(USER_ID),
        name: `Monitor ${i}`,
        url: MONITOR_URL,
        interval: 60000,
        alert: {
          email: false,
          push: false,
        },
        isActive: true,
        lastStatus: null,
        lastCheckedAt: null,
        totalChecks: 0,
        currentUpDownTimeStart: null,
        totalDown: 0,
      });
    }

    console.log(`Inserting ${TOTAL_RECORDS} monitors...`);
    await monitorModel.insertMany(monitors);
    console.log(`✅ Successfully inserted ${TOTAL_RECORDS} monitors!`);
  } catch (error) {
    console.error("Error seeding monitors:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seedMonitors();
