const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { setUser, getUser } = require("../services/userMap");
const userModel = require("../models/userModel");


router.post("/signup", async (req, res) => {
    try {
        const { name, email, pwd } = req.body;
        const hashedPwd = await bcrypt.hash(pwd, 11);
        await userModel.create({ name, email, pwd: hashedPwd });
        res.status(201).json({ message: "User created successfully"  ,"success":true });
    } catch (error) {
        res.status(500).json({ message: "Internal server error"  ,"success":false });
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, pwd } = req.body;
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const isMatch = await bcrypt.compare(pwd, user.pwd)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const token = setUser(user);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({ message: "Login successful" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
})

router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })
    res.status(200).json({ message: "Logout successful" })
})

router.get("/getMe" ,async (req,res)=>{
    try {
        const token = req.cookies.token;
        console.log(token)
        const user = getUser(token);
        console.log(user)
        if(!user){
            return res.status(200).json({message:"User not found"});
        }

        return res.status(200).json({message : "user found true"});
    } catch (error) {
        return res.status(200).json({message:"User not found"});
    }
})

module.exports = router;