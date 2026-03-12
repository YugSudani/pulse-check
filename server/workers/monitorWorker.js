const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env") });
const monitorModel = require("../models/monitorModel");
const incidentModel = require("../models/incidentModel");
const { sendAlertEmail_2 } = require("../helpers/sendMail");
const { sendAlertNotification } = require("../helpers/sendPushNotification");
const connectDB = require("../helpers/connectWorkerDB");
const getActive_Eligible_Monitors = require("../helpers/fetchMonitor");
const pingIt = require("../helpers/ping-it");
const { makeTestCall } = require("../services/Call");
const getPhoneNumber = require("../helpers/getPhoneNumber");
const createLogs = require("../helpers/createLogs");


//db connection
connectDB();

// Flag to prevent multiple instances of the worker
let isRunning = false;

// Process individual monitor without blocking the loop
const processMonitor = async (monitor) => {
  try {
    // ping End-point and get data
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
        },
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
      { new: true },
    );

    // create log
    await createLogs(monitor._id, statusCode, responseTime, status, monitor.userId);


    // send alert mail and push on down or recovered (fire and forget)
    if (
      (monitor.lastStatus === "UP" || monitor.lastStatus === null) &&
      status !== "UP"
    ) {
      if (monitor.alert.email) {
        sendAlertEmail_2("DOWN", monitor, status);
      }
      if (monitor.alert.push) {
        sendAlertNotification("DOWN", monitor);
      }
      if (monitor.alert.call) {
        const number = await getPhoneNumber(monitor.userId);
        makeTestCall(number, "DOWN", monitor);
      }
    }

    //send up alert
    if (
      monitor.lastStatus !== "UP" &&
      monitor.lastStatus !== null &&
      status === "UP"
    ) {
      if (monitor.alert.email) {
        sendAlertEmail_2("RECOVERED", monitor, status);
      }
      if (monitor.alert.push) {
        sendAlertNotification("RECOVERED", monitor);
      }
      if (monitor.alert.call) {
        const number = await getPhoneNumber(monitor.userId);
        makeTestCall(number, "RECOVERED", monitor);
      }
    }
  } catch (error) {
    console.error("Error processing monitor:", monitor._id, error);
  }
};

// core Logic function
const monitorWorker = async () => {
  if (isRunning) return;
  isRunning = true;

  try {
    // fetch monitors only which are eligible to be pinged
    const monitors = await getActive_Eligible_Monitors();

    // Fire off all monitors concurrently - no await, let Node.js handle it
    monitors.forEach((monitor) => {
      processMonitor(monitor);
    });
  } catch (error) {
    console.error("Monitor worker error:", error);
  } finally {
    isRunning = false;
  }
};

setInterval(monitorWorker, 30000);

module.exports = monitorWorker;
