const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env") });

const userModel = require("../models/userModel");
const axios = require("axios");


const ONESIGNAL_APP_ID = process.env.ONE_SIGNAL_APP_ID;
const ONESIGNAL_REST_API_KEY = process.env.ONE_SIGNAL_REST_API_KEY;

// Send notification to specific user
module.exports.sendAlertNotification = async function sendAlertNotification(reason, monitor) {
  try {
    const user = await userModel.findById(monitor.userId);

    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      {
        app_id: ONESIGNAL_APP_ID,
        include_player_ids: [user.playerId],
        headings: {
          en: "Server Monitoring Alert",
        },
        contents: {
          en: `🚨 Server Alert: ${monitor.name} is ${reason}!`,
        },
        data: {
          serverName:monitor.name,
          serverUrl:monitor.url,
          timestamp: new Date().toISOString(),
          type: "server_down",
        },
        priority: 10,
        // Optional: add action buttons
        web_buttons: [
          {
            id: "view",
            text: "View Details",
            url: `https://geoponic-verlie-impressionistically.ngrok-free.dev/monitor/${monitor._id}`,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`,
        },
      }
    );

    console.log("Notification sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error sending notification:",
      error.response?.data || error.message
    );
    throw error;
  }
}
