const userModel = require("../models/userModel");
const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TW_phnum;

const client = twilio(accountSid, authToken);

async function makeTestCall(number, monitor) {
  const user = await userModel.findById(monitor.userId);
  console.log("Calling alert to : ", user.name + "for : " + monitor.name);
  try {
    const call = await client.calls.create({
      to: number,
      from: fromNumber,
      twiml: `
        <Response>
         <Say voice="alice" language="en-IN">
  Hello.
</Say>

<Pause length="1"/>

<Say voice="alice" language="en-IN">
  ${user.name}.
</Say>

<Pause length="1"/>

<Say voice="alice" language="en-IN">
  This is an important alert from Pulse Check.
</Say>

<Pause length="1"/>

<Say voice="alice" language="en-IN">
  Your monitor.
</Say>

<Pause length="0.5"/>

<Say voice="alice" language="en-IN">
  ${monitor.name}.
</Say>

<Pause length="1"/>

<Say voice="alice" language="en-IN">
  Status.
</Say>

<Pause length="0.5"/>

<Say voice="alice" language="en-IN">
  ${monitor.lastStatus}.
</Say>

<Pause length="2"/>

<Say voice="alice" language="en-IN">
  Please check your dashboard immediately.
</Say>

<Pause length="2"/>

<Say voice="alice" language="en-IN">
  I repeat.
</Say>

<Pause length="1"/>

<Say voice="alice" language="en-IN">
  ${user.name}.
</Say>

<Pause length="1"/>

<Say voice="alice" language="en-IN">
  Monitor name.
</Say>

<Pause length="0.5"/>

<Say voice="alice" language="en-IN">
    ${monitor.name}.
</Say>

<Pause length="1"/>

<Say voice="alice" language="en-IN">
  Current status.
</Say>

<Pause length="0.5"/>

<Say voice="alice" language="en-IN">
  ${monitor.lastStatus}.
</Say>

<Pause length="1"/>

<Say voice="alice" language="en-IN">
  Please take action now.
</Say>

        </Response>
      `,
    });

    return call.sid;
  } catch (error) {
    console.error("❌ Twilio Call Error:", error.message);
    throw error;
  }
}

module.exports = {
  makeTestCall,
};
