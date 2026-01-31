const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const monitorModel = require("../models/monitorModel");
const incidentModel = require("../models/incidentModel");
const adminModel = require("../models/adminModel");

// Statistics endpoint
router.get("/getStats", async (req, res) => {
  try {
    // Get user statistics
    const [totalUsers, activeUsers, blockedUsers] = await Promise.all([
      userModel.countDocuments(),
      userModel.countDocuments({ isBlocked: false }),
      userModel.countDocuments({ isBlocked: true }),
    ]);

    // Get monitor statistics - any monitor that is not UP is considered DOWN
    const totalMonitors = await monitorModel.countDocuments();
    const upMonitors = await monitorModel.countDocuments({ lastStatus: "UP" });
    const downMonitors = totalMonitors - upMonitors;

    // Get incident statistics
    const [totalIncidents, dnsErrors, timeouts, networkErrors, unknownErrors] =
      await Promise.all([
        incidentModel.countDocuments(),
        incidentModel.countDocuments({ incidentType: "DNS-ERROR" }),
        incidentModel.countDocuments({ incidentType: "TIME-OUT" }),
        incidentModel.countDocuments({ incidentType: "NETWORK-ERROR" }),
        incidentModel.countDocuments({ incidentType: "UNKNOWN-ERROR" }),
      ]);

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          active: activeUsers,
          blocked: blockedUsers,
        },
        monitors: {
          total: totalMonitors,
          up: upMonitors,
          down: downMonitors,
        },
        incidents: {
          total: totalIncidents,
          dnsError: dnsErrors,
          timeout: timeouts,
          networkError: networkErrors,
          unknownError: unknownErrors,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
});

router.get("/getAllUsers", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [users, totalCount] = await Promise.all([
      userModel.find().skip(skip).limit(limit),
      userModel.countDocuments(),
    ]);

    res.status(200).json({
      users: users,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
});

router.post("/blockUser", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    user.isBlocked = true;
    await user.save();
    await monitorModel.updateMany({ userId }, { isActive: false });
    res
      .status(200)
      .json({ message: "User blocked successfully", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
});

router.post("/unblockUser", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    user.isBlocked = false;
    await user.save();
    await monitorModel.updateMany({ userId }, { isActive: true });
    res
      .status(200)
      .json({ message: "User unblocked successfully", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
});

router.get("/getAllMonitors", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [monitors, totalCount] = await Promise.all([
      monitorModel.find().skip(skip).limit(limit),
      monitorModel.countDocuments(),
    ]);

    res.status(200).json({
      monitors,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
});

router.post("/pauseMonitor", async (req, res) => {
  try {
    const { monitorId } = req.body;
    const monitor = await monitorModel.findById(monitorId);
    monitor.isActive = false;
    await monitor.save();
    res
      .status(200)
      .json({ message: "Monitor paused successfully", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
});

router.post("/resumeMonitor", async (req, res) => {
  try {
    const { monitorId } = req.body;
    const monitor = await monitorModel.findById(monitorId);
    monitor.isActive = true;
    await monitor.save();
    res
      .status(200)
      .json({ message: "Monitor resumed successfully", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
});

router.get("/getIncidents", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [incidents, totalCount] = await Promise.all([
      incidentModel.find().skip(skip).limit(limit),
      incidentModel.countDocuments(),
    ]);

    res.status(200).json({
      incidents,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
});

router.get("/getNotifications", async (req, res) => {
  try {
    const response = await adminModel.find();

    if (response) {
      res.status(200).json({
        sets: response,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/setNotifications", async (req, res) => {
  try {
    const { pushEnabled, emailEnabled, callEnabled } = req.body;
    console.log(req.body);

    const response = await adminModel.updateMany(
      {},
      {
        $set: {
          push:pushEnabled,
          email:emailEnabled,
          call:callEnabled,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );
    console.log(response);
    res.status(200).json({
      msg: "successfully updated notification settings",
      success: true,
    });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "failed to update notification settings", success: false });
  }
});

module.exports = router;
