const userModel = require("../models/userModel");

const fetchUser = async (req) => {
  const user = await userModel.findById(req.user._id);
  return user;
};
const checkBlocked = async (req, res, next) => {
  const user = await fetchUser(req);
  if (user.isBlocked) {
    return res.status(403).json({
      message: "Your account has been blocked and Your Monitors are paused.",
      blocked: true,
      success: false,
    });
  }
  next();
};

module.exports = checkBlocked;
