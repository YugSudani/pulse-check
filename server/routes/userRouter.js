const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { setUser, getUser } = require("../services/userMap");
const userModel = require("../models/userModel");
const tokenModel = require("../models/tokenModel");
const { generateOTP } = require("../helpers/generateOTP");
const { sendOTPEmail_2 } = require("../helpers/sendMail");
const auth = require("../middlewares/auth");
const { sendOTPsms } = require("../helpers/sendSMS");
const logger = require("../config/logger");

router.post("/genOTP", async (req, res) => {
  try {
    const { email, name, phone, isForSignup } = req.body;

    // console.log("Received request body:", req.body);

    let l_query = {};
    if (email) {
      l_query = { email };
    } else if (phone) {
      l_query = { "phoneNumber.number": phone };
    }

    if (!isForSignup) {
      const user = await userModel.findOne(l_query);
      if (!user) {
        return res.status(404).json({
          message: "User not found. Please sign up first.",
          success: false,
        });
      }
    }

    // Check if OTP was recently sent
    const query = {
      expiryTime: { $gt: Date.now() },
    };
    if (email) {
      query.email = email;
    }
    if (phone) {
      query["phoneNumber.number"] = phone;
    }

    const recentToken = await tokenModel.findOne(query);

    if (recentToken) {
      const timeLeft = Math.ceil(
        (recentToken.expiryTime - Date.now()) / 1000 / 60,
      );
      return res.status(429).json({
        message: `OTP already sent. Please wait ${timeLeft} minutes or use the existing OTP.`,
        success: false,
      });
    }

    // Generate and send new OTP
    const OTP = generateOTP();
    if (email) {
      await sendOTPEmail_2(email, name, OTP);
    } else if (phone) {
      await sendOTPsms(phone, name, OTP);
    }
    await tokenModel.create({
      email,
      phoneNumber: { number: phone },
      OTP,
      expiryTime: new Date(Date.now() + 300000),
    });

    res.status(200).json({ message: "OTP sent successfully", success: true });
  } catch (error) {
    logger.error("Failed to send OTP : ", { error });
    // Detect Twilio trial error
    if (error.code === 21608) {
      return res.status(400).json({
        message: "Currently SMS verification is not available. Please use Email or Google Signup.", //can not send sms to unverified number in twilio trial account
        success: false,
      });
    }
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

router.post("/verifyOtp", async (req, res) => {
  const { slug, otp } = req.body;
  // console.log(slug + " : " + " : " + otp);

  let query = {};

  if (slug.includes("@")) {
    query = { email: slug };
  } else {
    query = { "phoneNumber.number": slug };
  }

  try {
    const token = await tokenModel.findOne({
      ...query,
      OTP: otp,
      expiryTime: { $gt: Date.now() },
    });
    // console.log("token : " + token);

    if (!token) {
      return res
        .status(404)
        .json({ message: "Token not found or Expired", success: false });
    }

    await userModel.findOneAndUpdate(query, { $set: { isVerified: true } }); // set if not verified true in login
    //console.log("r1 : " + res1);

    await tokenModel.deleteMany({ ...query }); // delete all tokens of that email or phone
    // console.log("r2 : " + res2);

    res.json({ message: "OTP verified successfully", success: true });
  } catch (error) {
    logger.error("Failed to find token : ", { error });
    return res.status(500).json({
      message: "Internal server error while finding token",
      success: false,
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { name, phone, email, pwd } = req.body;
    // console.log(req.body);

    let l_query = {};
    if (email) {
      l_query = { email };
    } else if (phone) {
      l_query = { "phoneNumber.number": phone };
    }

    try {
      const hashedPwd = await bcrypt.hash(pwd, 11);
      await userModel.create({
        ...l_query,
        name,
        pwd: hashedPwd,
      });
      res
        .status(201)
        .json({ message: "User created successfully", success: true });
    } catch (error) {
      logger.error("Failed to create user : ", { error });
      res.status(500).json({
        message: "User Alredy exists",
        success: false,
      });
    }
  } catch (error) {
    logger.error("Failed to create user : ", { error });
    res.status(500).json({
      message: "Internal server error while Registering user",
      success: false,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { phone, email, pwd, otp } = req.body;
    logger.info("Login request received:", { body: req.body });

    const query = {};
    if (email) {
      query.email = email;
    } else if (phone) {
      query["phoneNumber.number"] = phone;
    }

    const user = await userModel.findOne(query);
    logger.info("User found:", { user });
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
        ...query,
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
      // Check if user has a password (not a Google OAuth user)
      if (!user.pwd || user.provider === "google") {
        return res.status(400).json({
          message:
            "This account uses Google sign-in. Please login with Google.",
          success: false,
        });
      }

      const isMatch = await bcrypt.compare(pwd, user.pwd);
      // console.log("isMatch : " + isMatch);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Invalid credentials", success: false });
      }
    }

    const token = setUser(user);
    // console.log("token : " + token);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // console.log("Login successful");
    res.status(200).json({ message: "Login successful", success: true });
  } catch (error) {
    logger.error("login error : " + error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

router.post("/saveOneSignalPlayerId", auth, async (req, res) => {
  try {
    const { playerIds } = req.body;
    //console.log(playerIds);
    const user = req.user;
    //console.log(user);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }
    await userModel.updateOne(
      { _id: user._id },
      { $addToSet: { playerIds } } 
    );
    res
      .status(201)
      .json({ message: "Player ID saved successfully", success: true });
  } catch (error) {
    logger.error("Failed to save player ID : ", { error });
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

router.post("/saveCallNumber", auth, async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const user = req.user;

    await userModel.updateOne(
      { _id: user._id },
      {
        $set: {
          "phoneNumber.number": phoneNumber,
          "phoneNumber.isVerified": false,
        },
      },
    );
    logger.info("Phone number updated from " + user.phoneNumber.number + " to " + phoneNumber);

    res
      .status(200)
      .json({ success: true, message: "Phone number saved successfully" });
  } catch (error) {
    logger.error("Phone number save failed:", { error });
    res
      .status(500)
      .json({ success: false, message: "Phone number save failed" });
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
    const decoded = getUser(token); // Verify JWT first

    if (!decoded || !decoded._id) {
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }

    const user = await userModel.findById(decoded._id).select("-pwd");

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }

    return res
      .status(200)
      .json({ message: "user found true", success: true, user: user });
  } catch (error) {
    logger.error("Failed to get user : ", { error });
    return res.status(401).json({ message: "User not found", success: false });
  }
});

router.head("/healthCheck", (req, res) => {
  res.status(200).end();
});

module.exports = router;
