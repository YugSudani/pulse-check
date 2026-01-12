const emailjs = require("@emailjs/nodejs");

const sendAlertEmail = async ({
  toEmail,
  userName,
  monitorName,
  monitorUrl,
  status,
  reason,
}) => {
  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ALERT,
      {
        toEmail: toEmail,
        userName: userName,
        monitorName: monitorName,
        monitorUrl: monitorUrl,
        status: status,
        reason: reason,
        time: new Date().toLocaleString(),
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );

    console.log("Alert email sent:", monitorName, status);
  } catch (err) {
    console.error("❌ EmailJS error:", err);
  }
};


const sendOTPEmail = async ({ toEmail, userName, otp }) => {
  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_OTP,
      {
        toEmail: toEmail,
        userName: userName,
        OTP: otp,
        time: new Date().toLocaleString(),
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );

    console.log("OTP Email Send to:", toEmail);
  } catch (err) {
    console.error("❌ EmailJS error:", err);
  }
};

module.exports = { sendAlertEmail, sendOTPEmail };
