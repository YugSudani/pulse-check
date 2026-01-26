const { getUser } = require("../services/userMap");

const adminOnly = (req, res, next) => {
  try {
    const user = getUser(req.cookies.token);
    if (!user || user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized : Admin Only" });
    }
    next();
  } catch (err) {
    console.log("JWT error:", err.name, err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = adminOnly;
