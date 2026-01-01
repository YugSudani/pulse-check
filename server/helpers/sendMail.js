const userModel = require("../models/userModel");
const sendAlertEmail = require("../services/mailer");

const sendAlertEmail_2 = async (reason,monitor)=>{

    const user = await userModel.findById(monitor.userId);
    // console.log(user);
    await sendAlertEmail({
        toEmail: user.email,
        userName: user.name,
        monitorName: monitor.name,
        monitorUrl: monitor.url,
        status: reason,
        reason: monitor.lastStatus,
    });
    console.log(`${reason} alert sent for : ${monitor.name}`);
}

module.exports = sendAlertEmail_2