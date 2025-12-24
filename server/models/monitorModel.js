const mongoose = require('mongoose');

const monitorSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, // owner
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        url: {
            type: String,
            required: true,
            trim: true,
        },

        interval: {
            type: Number, // in seconds
            required: true,
        },

        isActive: {  // start pause
            type: Boolean,
            default: true,
        },

        lastStatus: {
            type: String, // e.g. "UP", "DOWN", "TIME-OUT"
            default: null,
        },

        lastCheckedAt: {
            type: Date,
            default: null,
        },

        totalChecks: {
            type: Number,
            default: 0
        },

        currentUpDownTimeStart: {
            type: Date,
            default: null, // null means never been up, or currently down
        },

        totalDown: {
            type: Number,
            default: 0
        },

    },
    {
        timestamps: true,
    }
);

monitorSchema.index({ isActive: 1, lastCheckedAt: 1 });

const monitorModel = mongoose.model("monitorModel", monitorSchema);

module.exports = monitorModel;