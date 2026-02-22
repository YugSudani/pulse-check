const axios = require("axios");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TW_phnum;

const sendOTPsms = async (phone, name, otp) => {
  const message = `Dear ${name}, your OTP is ${otp}. Please use this OTP to verify your account.`;

  try {
    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      new URLSearchParams({
        To: `+91${phone}`,
        From: fromNumber,
        Body: message,
      }),
      {
        auth: {
          username: accountSid,
          password: authToken,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("SMS sent successfully:", response.data.sid);
  } catch (error) {
    console.log(
      "Error sending SMS:",
      error.response?.data || error.message
    );
     // Throw structured error
  const twilioError = error.response?.data || error;

    console.log("Twilio Full Error:", twilioError);

    // Throw structured error
    throw {
      code: twilioError.code,
      message: twilioError.message,
      status: twilioError.status || 500,
    };
  }
};

module.exports = { sendOTPsms };