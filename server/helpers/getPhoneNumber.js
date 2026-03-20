const logger = require("../config/logger");
const userModel = require("../models/userModel");

const getPhoneNumber = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    logger.info("Retrieved phone number for user:", { userId, phoneNumber: user?.phoneNumber?.number });
    return user?.phoneNumber?.number;
  } catch (error) {
    logger.error("Error retrieving phone number for user:", { userId, error });
    return null;
  }
};

module.exports = getPhoneNumber;