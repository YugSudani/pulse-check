const { getUser } = require("../services/userMap");
const logger = require("../config/logger");

const adminOnly = (req, res, next) => {
  try {
    const user = getUser(req.cookies.token);
    if (!user || user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized : Admin Only" });
    }
    next();
  } catch (err) {
    logger.error("JWT error:", { error: err });
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = adminOnly;
