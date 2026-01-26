const jwt = require("jsonwebtoken");

function setUser(user) {
  return jwt.sign(
    {
      _id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
}

function getUser(UID) {
  return jwt.verify(UID, process.env.JWT_SECRET);
}

module.exports = {
  setUser,
  getUser,
};
