const userModel = require("../models/userModel");

const getPhoneNumber = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    console.log(user?.phoneNumber?.number);
    return user?.phoneNumber?.number;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = getPhoneNumber;