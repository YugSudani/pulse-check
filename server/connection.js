const mongoose = require("mongoose");
const logger = require("./config/logger");

module.exports = async function connectDB(URI) {
    try {
        await mongoose.connect(URI);
        logger.info("MongoDB connected");
    } catch (error) {
        logger.error("MongoDB connection error", { error });
    }
}