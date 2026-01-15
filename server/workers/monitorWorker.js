const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env") });
const monitorModel = require("../models/monitorModel");
const logsModel = require("../models/logModel");
const incidentModel = require("../models/incidentModel");
const { sendAlertEmail_2 } = require("../helpers/sendMail");
const connectDB = require("../helpers/connectWorkerDB");
const getActive_Eligible_Monitors = require("../helpers/fetchMonitor");
const pingIt = require("../helpers/ping-it");
const { sendAlertNotification } = require("../helpers/sendPushNotification");

//db connection
connectDB();

// Flage to prevent multiple instances of the worker
let isRunning = false;

// core Logic function
const monitorWorker = async () => {
  if (isRunning) return;
  isRunning = true;

  try {
    //fetch monitor only which are eligible to be ping
    const monitors = await getActive_Eligible_Monitors();
    //console.log("Eligible monitors:", monitors.length);

    for (const monitor of monitors) {
      //ping End-point and give data
      const { status, statusCode, responseTime } = await pingIt(monitor);

      // create incident
      if (status !== monitor.lastStatus && status !== "UP") {
        await incidentModel.create({
          userID: monitor.userId,
          monitorId: monitor._id,
          monitorUrl: monitor.url,
          incidentType: status,
          incidentStartTime: new Date(),
        });
        // console.log("Incident created for", monitor.url, " FOR : " + status);
      }

      // update incident
      if (monitor.lastStatus !== "UP" && status === "UP") {
        await incidentModel.findOneAndUpdate(
          {
            monitorId: monitor._id,
            incidentEndTime: null, // open incident
          },
          [
            {
              $set: {
                incidentEndTime: "$$NOW",
                incidentDuration: {
                  $subtract: ["$$NOW", "$incidentStartTime"],
                },
              },
            },
          ],
          {
            sort: { incidentStartTime: -1 },
            updatePipeline: true,
          }
        );
      }

      // Check if status changed BEFORE updating
      const statusChanged = status !== monitor.lastStatus;
      // Update monitor with current-Up-Down-TimeStart reset if status changed
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

      //send alert mail
      if (
        (monitor.lastStatus === "UP" || monitor.lastStatus === null) &&
        status !== "UP"
      ) {
        sendAlertEmail_2("DOWN", monitor, status); //DOWN alert
        await sendAlertNotification("DOWN",monitor);
      }
      if (
        monitor.lastStatus !== "UP" && monitor.lastStatus !== null && status === "UP"
      ) {
        sendAlertEmail_2("RECOVERED", monitor, status); // RECOVERY alert
        await sendAlertNotification("RECOVERED",monitor);
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
