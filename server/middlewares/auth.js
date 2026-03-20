const { getUser } = require("../services/userMap");
const logger = require("../config/logger");

const auth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = getUser(token);
    if (!user || !user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;

    next();
  } catch (err) {
    logger.error("JWT error:", { error: err });
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
