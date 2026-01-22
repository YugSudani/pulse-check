const express = require("express");
const router = express.Router();
const stripe = require("../config/stripe");

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { plan } = req.body;

    const PRICE_MAP = {
      pro: 'price_pro_id',      // Replace with actual Stripe price ID for Pro plan
      business: 'price_business_id', // Replace with actual Stripe price ID for Business plan
    };

    if (!PRICE_MAP[plan]) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment", // use "subscription" if monthly recurring

      currency: "usd",

      line_items: [
        {
          price: PRICE_MAP[plan],
          quantity: 1,
        },
      ],

      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,

      metadata: {
        plan,
        userId: "test-user-id",
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err?.raw?.message || err.message,
    });
  }
});

module.exports = router;
