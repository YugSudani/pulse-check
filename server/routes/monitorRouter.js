const express = require("express");
const router = express.Router();
const monitorModel = require("../models/monitorModel");
const incidentModel = require("../models/incidentModel");
const adminModel = require("../models/adminModel");
const logModel = require("../models/logModel");
const { sendAlertNotification } = require("../helpers/sendPushNotification");
const { sendAlertEmail_2 } = require("../helpers/sendMail");
const { makeTestCall } = require("../services/Call");

router.post("/createMonitor", async (req, res) => {
  try {
    const { name, url, interval, alert } = req.body;
    const user = req.user;
    const UID = user._id;

    console.log(alert);

    const monitor = await monitorModel.create({
      userId: UID,
      name,
      url,
      interval,
      alert: {
        email: alert.email.emailAlert,
        push: alert.push.pushAlert,
      },
    });

    res.status(201).json({ success: true, monitor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Failed to create monitor" });
  }
});

router.get("/getAllMonitors", async (req, res) => {
  try {
    const user = req.user;
    const monitors = await monitorModel.find({ userId: user._id });
    // console.log(user);
    res.status(200).json({ success: true, monitors });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Failed to get monitors" });
  }
});

router.get("/:id", async (req, res) => {
  const monitorId = req.params.id;
  try {
    const monitor = await monitorModel.findById(monitorId);
    res.status(200).json({ success: true, monitor });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ success: false, msg: "Failed to get monitor" });
  }
});

router.patch("/pause/:id", async (req, res) => {
  const monitorId = req.params.id;
  try {
    const monitor = await monitorModel.findById(monitorId);
    if (!monitor) {
      return res.status(404).json({ success: false, msg: "Monitor not found" });
    }
    monitor.isActive = !monitor.isActive;
    await monitor.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Failed to pause monitor" });
  }
});

router.delete("/deleteMonitor/:id", async (req, res) => {
  const { id: monitorId } = req.params;
  const userId = req.user._id;

  try {
    const monitor = await monitorModel.findOneAndDelete({
      _id: monitorId,
      userId,
    });

    if (!monitor) {
      return res.status(404).json({
        success: false,
        msg: "Monitor not found or unauthorized",
      });
    }

    const result = await Promise.allSettled([
      logModel.deleteMany({ monitorId }),
      incidentModel.deleteMany({ monitorId }), // not deleting
    ]);

    // result.forEach((item) => {
    //   console.log(item);
    // });
    const allMonitor = await monitorModel.find({ userId });

    res.status(200).json({ success: true, monitors: allMonitor });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Failed to delete monitor",
    });
  }
});

router.get("/:monitorId/response-history", async (req, res) => {
  const { monitorId } = req.params;
  const range = req.query.range || "1h";

  const now = new Date();
  const ranges = {
    "5m": 5 * 60 * 1000,
    "15m": 15 * 60 * 1000,
    "30m": 30 * 60 * 1000,
    "2h": 2 * 60 * 60 * 1000,
    "6h": 6 * 60 * 60 * 1000,
    "12h": 12 * 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
  };

  const from = new Date(now - ranges[range]);

  const logs = await logModel
    .find({
      monitorId,
      checkedAt: { $gte: from },
    })
    .sort({ checkedAt: 1 })
    .select("checkedAt responseTime -_id")
    .lean();

  // Calculate statistics
  let stats = {
    min: null,
    max: null,
    avg: null,
  };

  if (logs.length > 0) {
    const responseTimes = logs.map((l) => l.responseTime);
    stats.min = Math.min(...responseTimes);
    stats.max = Math.max(...responseTimes);
    stats.avg = Math.round(
      responseTimes.reduce((sum, rt) => sum + rt, 0) / responseTimes.length,
    );
  }

  res.json({
    success: true,
    data: logs.map((l) => ({
      t: new Date(l.checkedAt).toISOString(), // Ensure ISO string format
      rt: l.responseTime,
    })),
    stats: stats,
  });
});

router.put("/editeMonitor/:monitorId", async (req, res) => {
  const monitorId = req.params.monitorId;
  const { name, url, interval, alert } = req.body;

  // console.log(monitorId);
  try {
    const monitor = await monitorModel.findById(monitorId);
    if (!monitor) {
      return res.status(404).json({ success: false, msg: "Monitor not found" });
    }
    monitor.name = name;
    monitor.url = url;
    monitor.interval = interval;
    monitor.alert.email = alert.email;
    monitor.alert.push = alert.push;
    monitor.alert.call = alert.call;
    await monitor.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Failed to edit monitor" });
  }
});

router.post("/test_alert", async (req, res) => {
  try {
    const { monitorId, phoneNumber } = req.body;
    // console.log(phoneNumber);

    const enabled = await adminModel.findOne({});
    console.log("admin enabled alerts : " + enabled);

    const monitor = await monitorModel.findById(monitorId);
    if (!monitor) {
      return res
        .status(404)
        .json({ success: false, message: "Monitor not found" });
    }

    if (monitor.alert.email) {
      if (!enabled.email) {
        res.status(401).json({
          success: false,
          message: "Email services are restricted by Admin",
        });
        return;
      }
    }
    if (monitor.alert.call) {
      if (!enabled.call) {
        res.status(401).json({
          success: false,
          message: "Call services are restricted by Admin",
        });
        return;
      }
    }

    if (monitor.alert.email) {
      sendAlertEmail_2("DOWN", monitor, "down");
    }
    if (monitor.alert.push) {
      sendAlertNotification("DOWN", monitor);
    }
    if (monitor.alert.call) {
      makeTestCall(phoneNumber, "DOWN", monitor);
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to test monitor" });
  }
});

module.exports = router;
