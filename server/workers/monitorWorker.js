const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const axios = require("axios");
const mongoose = require("mongoose");
const monitorModel = require("../models/monitorModel");
const logsModel = require("../models/logModel");


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

//fetch monitor only which are eligible to be ping
const getActive_Eligible_Monitors = async () => {
    return monitorModel.find({
        isActive: true,
        $or: [
            { lastCheckedAt: null },
            {
                $expr: {
                    $gte: [
                        { $subtract: [new Date(), "$lastCheckedAt"] },
                        "$interval"
                    ]
                }
            }
        ]
    });
};


// do ping calculate reponse time update monitor stats and manage logs
let isRunning = false;

const monitorWorker = async () => {
    if (isRunning) return;
    isRunning = true;

    try {
        const monitors = await getActive_Eligible_Monitors();
        console.log("Eligible monitors:", monitors.length);

        for (const monitor of monitors) {
            let status;
            let statusCode = 500;
            let responseTime = null;

            const startTime = Date.now();

            try {
                const response = await axios.head(monitor.url, { timeout: 3000 });
                responseTime = Date.now() - startTime;
                statusCode = response.status;
                console.log("time : " + responseTime + "code : " + statusCode);

                status =
                    statusCode >= 200 && statusCode < 400
                        ? "UP"
                        : "DOWN";

                console.log(monitor.url, "->", status);

            } catch (err) {
                responseTime = Date.now() - startTime;

                if (err.code === "ECONNABORTED") status = "TIME-OUT";
                else if (err.code === "ENOTFOUND") status = "DNS-ERROR";
                else status = "NETWORK-ERROR";

                console.log(monitor.url, "->", status);
            }

            // Update monitor
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

            // Log ONLY on status change
            await logsModel.create({
                monitorId: monitor._id,
                statusCode,
                responseTime,
                isUp: status === "UP",
                checkedAt: new Date(),
            });

            console.log("Log created for", monitor.name);
        }
    } catch (error) {
        console.error("Monitor worker error:", error);
    } finally {
        // ✅ ALWAYS release lock
        isRunning = false;
    }
};

setInterval(monitorWorker, 1000);

module.exports = monitorWorker;
