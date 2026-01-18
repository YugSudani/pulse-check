import api from "../../lib/api";

async function setOneSignalPlayerId(playerId) {
  // Send player ID to backend if user enabled notifications
  if (!playerId) playerId = null;
  //console.log("playerId saved : ", playerId);
  try {
    await api.post("/user/saveOneSignalPlayerId", { playerId });
    console.log("Player ID saved successfully");
  } catch (err) {
    console.error("Failed to save player ID:", err);
    // Don't block login if saving player ID fails
  }
}

export default setOneSignalPlayerId;
