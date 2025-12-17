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
        },
    }
)

const logsModel = new mongoose.model("logsModel" , logSchema);

module.exports = logsModel;