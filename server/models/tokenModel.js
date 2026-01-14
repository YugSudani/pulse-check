const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    OTP: {
        type: String,
        default: null
    },
    expiryTime: {
        type: Date,
        default: null
    }
})

const tokenModel = mongoose.model("tokenModel", schema);

module.exports = tokenModel;