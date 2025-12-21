const express = require("express");
const router = express.Router();
const axios = require("axios");
const monitorModel = require('../models/monitorModel');



router.post('/createMonitor', async (req, res) => {
    try {
        const { name, url, interval } = req.body;
        const user = req.user;
        const UID = user._id;

        const monitor = await monitorModel.create({
            userId: UID,
            name,
            url,
            interval
        });

        res.status(201).json({ success: true, monitor });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Failed to create monitor" });
    }
})

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
})

router.get("/:id", async (req, res) => {
    const monitorId = req.params.id;
    try {
        const monitor = await monitorModel.findById(monitorId);
        res.status(200).json({ success: true, monitor });
    } catch (error) {
        // console.log(error);
        res.status(500).json({ success: false, msg: "Failed to get monitor" });
    }
})

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
})

router.delete("/deleteMonitor/:id", async (req, res) => {
    const monitorId = req.params.id;
    const user = req.user;
    console.log(monitorId);
    try {
        const monitor = await monitorModel.findById(monitorId);
        if (!monitor) {
            return res.status(404).json({ success: false, msg: "Monitor not found" });
        }
        await monitor.deleteOne({ _id: monitorId });
        const allMonitor = await monitorModel.find({ userId: user._id });
        res.status(200).json({ success: true, allMonitor });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Failed to delete monitor" });
    }
})

router.get("getLogData/:id", async (req,res)=>{
    const monitorId = req.params.id;
    try {
        const logs = await logsModel.find({ monitorId });
        res.status(200).json({ success: true, logs });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Failed to get logs" });
    }
})










router.post("/pingIt", async (req, res) => {
    console.log("PING API called");
    const { url, interval } = req.body;

    setInterval(async () => {
        try {
            const response = await axios(url, {
                method: "head"
            });
            console.log(response.status);
        } catch (error) {
            res.json({ "result": "monitoring failed" });
        }
    }, interval);
    res.json({ "result": "monitoring started" });
});


module.exports = router;
