const express = require("express");
const router = express.Router();
const stripe = require("../config/stripe");

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook error:", err.message);
      return res.status(400).send(`Webhook Error`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("✅ Payment confirmed (TEST)");
      console.log("Plan:", session.metadata.plan);
      console.log("User:", session.metadata.userId);
    }
    res.json({ received: true });
  }
);

module.exports = router;
