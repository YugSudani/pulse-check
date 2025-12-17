const mongoose = require("mongoose");

module.exports = async function connectDB(URI) {
    try {
        await mongoose.connect(URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB connection error", error);
    }
}