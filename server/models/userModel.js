const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    sparse: true,
    unique: true,
  },
  pwd: {
    type: String,
    required: false, 
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
  playerIds: {
    type: [String],
    default: [],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
 subscriptionPlan: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
},
  phoneNumber: {
    number: {
      type: String,
      unique:true,
      sparse: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
});

const userModel = mongoose.model("userModel", schema);

module.exports = userModel;
