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
        to_email: toEmail,
        user_name: userName,
        monitor_name: monitorName,
        monitor_url: monitorUrl,
        status,
        reason,
        time: new Date().toLocaleString(),
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );

    console.log("📧 Alert email sent:", monitorName, status);
  } catch (err) {
    console.error("❌ EmailJS error:", err);
  }
};

module.exports = sendAlertEmail;
