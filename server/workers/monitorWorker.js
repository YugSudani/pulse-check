const axios = require("axios");
const mongoose = require("mongoose");
const monitorModel = require("../models/monitorModel");
const logsModel = require("../models/logModel");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("=> MongoDB connected from worker");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

connectDB();

const getActiveMonitors = async () => {
    return monitorModel.find({ isActive: true });
};

const monitorWorker = async () => {
    try {
        const monitors = await getActiveMonitors();

        for (const monitor of monitors) {
            let status;
            let statusCode = null;
            let responseTime = null;

            const startTime = Date.now();

            try {
                const response = await axios.head(monitor.url, { timeout: 3000 });
                responseTime = Date.now() - startTime;
                statusCode = response.status;
                console.log(monitor.url)
                status =
                    statusCode >= 200 && statusCode < 400
                        ? "UP"
                        : "DOWN";
            } catch (err) {
                responseTime = Date.now() - startTime;

                if (err.code === "ECONNABORTED") status = "TIME-OUT";
                else if (err.code === "ENOTFOUND") status = "DNS-ERROR";
                else status = "NETWORK-ERROR";
            }

            // 🔹 Update monitor stats
            await monitorModel.findOneAndUpdate(
                { _id: monitor._id },
                {
                    $set: {
                        lastStatus: status,
                        lastCheckedAt: new Date(),
                    },
                    $inc: {
                        totalChecks: 1,
                        ...(status !== "UP" ? { totalDown: 1 } : {}),
                    },
                },
                { new: true }
            );

            // update/create logs
            if (monitor.lastStatus !== status) {
                await logsModel.create({
                    monitorId: monitor._id,
                    statusCode,
                    responseTime,
                    isUp: status === "UP",
                    checkedAt: new Date(),
                });
            }
        }
    } catch (error) {
        console.error("Monitor worker error:", error);
    }
};

setInterval(monitorWorker, 30000);

module.exports = monitorWorker;
