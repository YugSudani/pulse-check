const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
    {
        monitorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Monitor",
            required: true,
        },

        statusCode: {
            type: Number, // e.g. 200, 404, 500
            required: true,
        },

        responseTime: {
            type: Number, // in milliseconds
            required: true,
        },

        isUp: {
            type: Boolean,
            required: true,
        },

        checkedAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
        expiresAt: {
            type: Date,
            index: { expires: 0 }, // MongoDB auto-deletes when this date is reached
        },
    }
)

const logsModel = new mongoose.model("logsModel", logSchema);

module.exports = logsModel;