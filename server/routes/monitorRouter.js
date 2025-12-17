const express = require("express");
const router = express.Router();
const axios = require("axios");
const monitorModel = require('../models/monitorModel');



router.post('/createMonitor' , async (req,res)=>{
    try {
        const {name,url,interval} = req.body;
        const user = req.user;
        const UID = user._id;

        
        const monitor = await monitorModel.create({
                userId:UID,
                name,
                url,
                interval
        });
        
       res.status(201).json({success:true , monitor});
    } catch (error) {
        res.status(500).json({success:false , msg:"Failed to create monitor"});
    }
})

router.get("/getAllMonitors" , async (req,res)=>{
    try {
        const user = req.user;
        const monitors = await monitorModel.find({userId:user._id});
        console.log(user);
        res.status(200).json({success:true , monitors});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false , msg:"Failed to get monitors"});
    }
})

















router.post("/pingIt", async (req, res) => {
    console.log("PING API called");
    const {url,interval} = req.body;

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
