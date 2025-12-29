const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const axios = require("axios");
const mongoose = require("mongoose");
const monitorModel = require("../models/monitorModel");
const logsModel = require("../models/logModel");
const incidentModel = require("../models/incidentModel");

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
                        { $subtract: ["$interval", 25000] } // subtract 25sec
                    ]
                }
            }
        ]
    });
};

//   time  - lastCheckedAt     > interval ? ping : do nothing
// 1:22:31 - 1:22:00 = 31 seconds > 30sec ? ping : do nothing

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
                console.log(new Date().toLocaleTimeString());
                responseTime = Date.now() - startTime;
                statusCode = response.status;
                console.log("time : " + responseTime + " | code : " + statusCode);

                status =
                    statusCode >= 200 && statusCode < 400
                        ? "UP"
                        : "DOWN";

                console.log(monitor.url, " -> ", status);

            } catch (err) {
                responseTime = Date.now() - startTime;

                if (err.code === "ECONNABORTED") status = "TIME-OUT";
                else if (err.code === "ENOTFOUND") status = "DNS-ERROR";
                else status = "NETWORK-ERROR";

                console.log(monitor.url, " -> ", status);
            }
            
            
            // create incident
            if(status !== monitor.lastStatus && status !== "UP"){
                await incidentModel.create({
                    userID: monitor.userId,
                    monitorId: monitor._id,
                    monitorUrl: monitor.url,
                    incidentType: status,
                    incidentStartTime: new Date(),
                });
                console.log("Incident created for", monitor.url , " FOR : " + status);
            }
            
            // update incident
            if(monitor.lastStatus !== "UP" && status === "UP"){      // consider all as down accept up
                const incident = await incidentModel.findOneAndUpdate(
                    { 
                        monitorId: monitor._id,
                        incidentEndTime: null  // find the open incident
                    },
                    {
                        $set: {
                            incidentEndTime: new Date(),
                        },
                    },
                    { 
                        sort: { incidentStartTime: -1 },  // get the most recent one
                        new: true 
                    }
                );
                
                if (incident) {
                    // Calculate duration in milliseconds
                    const duration = new Date() - new Date(incident.incidentStartTime);
                    await incidentModel.findByIdAndUpdate(incident._id, {
                        $set: { incidentDuration: duration }
                    });
                    console.log("Incident updated for", monitor.url , " FOR : " + status);
                } else {
                    console.log("No open incident found for", monitor.url);
                }
            }


            // Check if status changed BEFORE updating
            const statusChanged = status !== monitor.lastStatus;
            // Update monitor with currentUpDownTimeStart reset if status changed
            await monitorModel.findOneAndUpdate(
                { _id: monitor._id },
                {
                    $set: {
                        lastStatus: status,
                        lastCheckedAt: new Date(),
                        ...(statusChanged ? { currentUpDownTimeStart: new Date() } : {}),
                    },
                    $inc: {
                        totalChecks: 1,
                        ...(status !== "UP" ? { totalDown: 1 } : {}),
                    },
                },
                { new: true }
            );

            // create log
            await logsModel.create({
                monitorId: monitor._id,
                statusCode,
                responseTime,
                isUp: status === "UP",
                checkedAt: new Date(),
            });

            console.log("Log created for", monitor.name);
            
            if (statusChanged) {
                console.log("Status changed - currentUpDownTimeStart reset");
            }
        }
    } catch (error) {
        console.error("Monitor worker error:", error);
    } finally {
        isRunning = false;
    }
};

setInterval(monitorWorker, 30000);

module.exports = monitorWorker;
