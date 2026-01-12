const monitorModel = require("../models/monitorModel");

const getActive_Eligible_Monitors = async () => {
  const monitors = await monitorModel.find({
    isActive: true,
    $or: [
      { lastCheckedAt: null },
      {
        $expr: {
          $gte: [
            { $subtract: [new Date(), "$lastCheckedAt"] },
            { $subtract: ["$interval", 25000] }, // subtract 25sec
          ],
        },
      },
    ],
  });
  return monitors;
};

//   time  - lastCheckedAt     > interval ? ping : do nothing
// 1:22:31 - 1:22:00 = 31 seconds > 30sec ? ping : do nothing

module.exports = getActive_Eligible_Monitors;
