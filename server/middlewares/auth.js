const { getUser } = require("../services/userMap");

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
    console.log("JWT error:", err.name, err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
