const express = require("express");
const router = express.Router();
const stripe = require("../config/stripe");

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { plan } = req.body;

    const PRICE_MAP = {
      pro: 'price_1SsQMjQcnBP33XC0MuXZBqUn',      
      business: 'price_1SsQNlQcnBP33XC0DE91i6dp', 
    };

    if (!PRICE_MAP[plan]) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription", 

      //currency: "usd",

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
