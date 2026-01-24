const express = require("express");
const passport = require("passport");
const { setUser } = require("../services/userMap");

const router = express.Router();

// Step 1 → Google redirect
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

// Step 2 → Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Use same setUser as regular login for consistent JWT payload
    const token = setUser(req.user);

    // Set token as HTTP-only cookie (same as regular login)
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${process.env.frontend_url}/auth-success`);
  },
);

module.exports = router;
