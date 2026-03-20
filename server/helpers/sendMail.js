const userModel = require("../models/userModel");
const { sendAlertEmail, sendOTPEmail } = require("../services/mailer");
const logger = require("../config/logger");

const sendAlertEmail_2 = async (status, monitor, currentStatus) => {
  const user = await userModel.findById(monitor.userId);
  // console.log(user);
  await sendAlertEmail({
    toEmail: user.email,
    userName: user.name,
    monitorName: monitor.name,
    monitorUrl: monitor.url,
    status: status,
    reason: status === "RECOVERED" ? monitor.lastStatus : currentStatus,
  });
  logger.info(`${status} alert sent for : ${monitor.name}`);
};

const sendOTPEmail_2 = async (email,name,otp) => {
  await sendOTPEmail({
    toEmail: email,
    userName: name,
    otp: otp,
  });
  logger.info(`OTP email sent for : ${name}`);
};

module.exports = { sendAlertEmail_2, sendOTPEmail_2 };
