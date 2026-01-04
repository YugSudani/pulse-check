const userModel = require("../models/userModel");
const sendAlertEmail = require("../services/mailer");

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
  // console.log(`${status} alert sent for : ${monitor.name}`);
};

module.exports = sendAlertEmail_2;
