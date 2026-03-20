const mongoose = require("mongoose");
const logger = require("../config/logger");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("=> MongoDB connected from worker");
  } catch (error) {
    logger.error("Error connecting to MongoDB from worker:", { error });
    process.exit(1);
  }
};

module.exports = connectDB;
