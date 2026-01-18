const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { setUser, getUser } = require("../services/userMap");
const userModel = require("../models/userModel");
const tokenModel = require("../models/tokenModel");
const { generateOTP } = require("../helpers/generateOTP");
const { sendOTPEmail_2 } = require("../helpers/sendMail");
const auth = require("../middlewares/auth");

router.post("/genOTP", async (req, res) => {
  try {
    const { email, name, isForSignup } = req.body;

    if (!isForSignup) {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({
            message: "User not found. Please sign up first.",
            success: false,
          });
      }
    }

    // Check if OTP was recently sent
    const recentToken = await tokenModel.findOne({
      email,
      expiryTime: { $gt: Date.now() },
    });
    if (recentToken) {
      const timeLeft = Math.ceil(
        (recentToken.expiryTime - Date.now()) / 1000 / 60
      );
      return res.status(429).json({
        message: `OTP already sent. Please wait ${timeLeft} minutes or use the existing OTP.`,
        success: false,
      });
    }
    const OTP = generateOTP();
    //await sendOTPEmail_2(email, name, OTP);
    await tokenModel.create({
      email,
      OTP,
      expiryTime: new Date(Date.now() + 300000),
    });

    res.status(200).json({ message: "OTP sent successfully", success: true });
  } catch (error) {
    console.log("Failed to send OTP : ", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

router.post("/verifyOtp", async (req, res) => {
  const { email, otp } = req.body;
  //console.log(email + " : " + " : " + otp);

  try {
    const token = await tokenModel.findOne({
      email,
      OTP: otp,
      expiryTime: { $gt: Date.now() },
    });
    //console.log("token : " + token);

    if (!token) {
      return res
        .status(404)
        .json({ message: "Token not found or Expired", success: false });
    }

    const res1 = await userModel.findOneAndUpdate(
      { email },
      { $set: { isVerified: true } }
    ); // set if not verified true in login
    //console.log("r1 : " + res1);

    const res2 = await tokenModel.deleteMany({ email });
   // console.log("r2 : " + res2);

    res.json({ message: "OTP verified successfully", success: true });
  } catch (error) {
    console.log("Failed to find token : ", error);
    return res.status(500).json({
      message: "Internal server error while finding token",
      success: false,
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, pwd } = req.body;
    // console.log(req.body);
    try {
      const hashedPwd = await bcrypt.hash(pwd, 11);
      await userModel.create({ name, email, pwd: hashedPwd });
      res
        .status(201)
        .json({ message: "User created successfully", success: true });
    } catch (error) {
      console.log("Failed to create user : ", error);
      res.status(500).json({
        message: "User Alredy exists",
        success: false,
      });
    }
  } catch (error) {
    console.log("Failed to create user : ", error);
    res.status(500).json({
      message: "Internal server error while Registering user",
      success: false,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, pwd, otp } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    if (user.isVerified === false) {
      //console.log("user : " + user.isVerified);
      return res
        .status(403)
        .json({ message: "User not verified", success: false });
    }
    if (!pwd) {
      const token = await tokenModel.findOne({
        email,
        OTP: otp,
        expiryTime: { $gt: Date.now() },
      });
      if (!token) {
        return res
          .status(404)
          .json({ message: "Token not found or Expired", success: false });
      }
    }

    if (!otp) {
      const isMatch = await bcrypt.compare(pwd, user.pwd);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Invalid credentials", success: false });
      }
    }

    const token = setUser(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

router.post("/saveOneSignalPlayerId", auth, async (req, res) => {
  try {
    const { playerId } = req.body;
    //console.log(playerId);
    const user = req.user;
    //console.log(user);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }
    await userModel.updateOne({ _id: user._id }, { playerId });
    res
      .status(201)
      .json({ message: "Player ID saved successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ message: "Logout successful" });
});

router.get("/getMe", async (req, res) => {
  try {
    const token = req.cookies.token;
    // console.log(token);
    const user = getUser(token);
    // console.log(user);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }
    // console.log(user);

    return res
      .status(200)
      .json({ message: "user found true", success: true, user: user });
  } catch (error) {
    return res.status(401).json({ message: "User not found", success: false });
  }
});

router.head("/healthCheck", (req, res) => {
  res.status(200).end();
});

module.exports = router;
