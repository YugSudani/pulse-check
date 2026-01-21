const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TW_phnum;

const client = twilio(accountSid, authToken);

async function makeTestCall(number) {
  try {
    const call = await client.calls.create({
      to: number, // 🔒 hardcoded verified number
      from: fromNumber, // Twilio number
      twiml: `
        <Response>
          <Say voice="alice">
            We’re reaching out to inform you about the current status of one of your monitored services.
            At the time of this call, our system has detected a change in the health of your monitored endpoint. This could indicate a slowdown, an interruption, or a temporary outage that may require your attention.
            Please don’t panic — this is an informational alert to help you stay proactive and informed.
          </Say>
        </Response>
      `,
    });

    // console.log("✅ Call SID:", call.sid);
    return call.sid;
  } catch (error) {
    console.error("❌ Twilio Call Error:", error.message);
    throw error;
  }
}

module.exports = {
  makeTestCall,
};
