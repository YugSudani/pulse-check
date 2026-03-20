import api from "../../lib/api";

async function setOneSignalPlayerId(playerIds) {
  // Send player ID to backend if user enabled notifications
  if (!playerIds || playerIds.length === 0) playerIds = [];
  //console.log("playerIds saved : ", playerIds);
  try {
    await api.post("/user/saveOneSignalPlayerId", { playerIds });
    // console.log("Player ID saved successfully");
  } catch (err) {
    console.error("Failed to save player ID:", err);
    // Don't block login if saving player ID fails
  }
}

export default setOneSignalPlayerId;
