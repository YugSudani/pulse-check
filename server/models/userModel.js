const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pwd: {
        type: String,
        required: true
    },
    lastEmailSentAt: {
        type: Date,
        default: null
    }
})

const userModel = mongoose.model("userModel", schema);

module.exports = userModel;