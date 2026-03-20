const express = require("express");
const router = express.Router();
const stripe = require("../config/stripe");
const userModel = require("../models/userModel");
const logger = require("../config/logger");

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
      logger.error("Webhook error:", { error: err });
      return res.status(400).send(`Webhook Error`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { plan, userId } = session.metadata;

      logger.info("✅ Payment confirmed for user:", { userId, plan });

      try {
        // Update user's subscription plan in database
        const updatedUser = await userModel.findByIdAndUpdate(
          userId,
          { subscriptionPlan: plan },
          { new: true },
        );

        if (updatedUser) {
          logger.info(
            "✅ User subscription updated:",
            updatedUser.email,
            "->",
            plan,
          );
        } else {
          logger.error("❌ User not found with ID:", { userId });
        }
      } catch (dbError) {
        logger.error("❌ Database error updating subscription:", { error: dbError });
      }
    }

    res.json({ received: true });
  },
);

module.exports = router;
