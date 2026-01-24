const express = require("express");
const router = express.Router();
const stripe = require("../config/stripe");
const userModel = require("../models/userModel");

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.error("Webhook error:", err.message);
      return res.status(400).send(`Webhook Error`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { plan, userId } = session.metadata;

      console.log("✅ Payment confirmed for user:", userId, "Plan:", plan);

      try {
        // Update user's subscription plan in database
        const updatedUser = await userModel.findByIdAndUpdate(
          userId,
          { subscriptionPlan: plan },
          { new: true },
        );

        if (updatedUser) {
          console.log(
            "✅ User subscription updated:",
            updatedUser.email,
            "->",
            plan,
          );
        } else {
          console.error("❌ User not found with ID:", userId);
        }
      } catch (dbError) {
        console.error(
          "❌ Database error updating subscription:",
          dbError.message,
        );
      }
    }

    res.json({ received: true });
  },
);

module.exports = router;
