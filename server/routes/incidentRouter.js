const express = require("express");
const router = express.Router();
const incidentModel = require('../models/incidentModel');


router.get("/getAll", async (req, res) => {
    try {
        const user = req.user;
        console.log(user);
        const incidents = await incidentModel.find({ userID: user._id });
        console.log(incidents);
        res.status(200).json({ success: true, incidents });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Failed to get incidents" });
    }
})

module.exports = router;