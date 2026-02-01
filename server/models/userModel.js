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
    required: false, // Optional for Google users
  },
  role: {
    type: String,
    default: "user",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  googleId: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: null,
  },
  provider: {
    type: String,
    default: "local", // "local" for email/password, "google" for OAuth
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
  },
  phoneNumber: {
    number: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
});

const userModel = mongoose.model("userModel", schema);

module.exports = userModel;
