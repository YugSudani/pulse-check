const jwt = require("jsonwebtoken");

function setUser(user) {
  const _id = user._id;
  const name = user.name;
  const subscriptionPlan = user.subscriptionPlan;
  const number = user.phoneNumber;

  return jwt.sign(
    {
      _id,
      name,
      subscriptionPlan,
      number,
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
