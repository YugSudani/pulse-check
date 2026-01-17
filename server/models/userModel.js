const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  pwd: {
    type: String,
    required: true,
  },
  lastEmailSentAt: {
    type: Date,
    default: null,
  },
  playerId: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  subscriptionPlan: {
    type: String,
    default: "starter",
  }
});

const userModel = mongoose.model("userModel", schema);

module.exports = userModel;
