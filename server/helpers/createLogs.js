const logsModel = require("../models/logsModel");
const userModel = require("../models/userModel");

const PLAN_RETENTION_MS = {
    starter: 1 * 24 * 60 * 60 * 1000,   // 1 day
    pro: 3 * 24 * 60 * 60 * 1000, // 3 days
    business: 7 * 24 * 60 * 60 * 1000,    // 7 days
};

const getUser = async (userId) => {
    try {
        const user = await userModel.findById(userId);
        return user;
    } catch (error) {
        console.error("Error fetching user for logs:", error);
        return null;
    }
}

const createLogs = async (monitorId, statusCode, responseTime, status, userId) => {

    try {
        const user = await getUser(userId);
        const plan = user ? user.subscriptionPlan : "starter";
        // console.log("plan : "+plan);

        await logsModel.create({
            monitorId,
            statusCode,
            responseTime,
            isUp: status === "UP",
            checkedAt: new Date(),
            expiresAt: new Date(Date.now() + (PLAN_RETENTION_MS[plan] || PLAN_RETENTION_MS["starter"])),
        });        

    } catch (error) {
        console.error("Error creating log for monitor:", monitorId, error);
    }

}

module.exports = createLogs;