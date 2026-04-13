const express = require("express");
const passport = require("passport");
const router = express.Router();

// login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    if (req.user.role === "admin") {
      return res.redirect("/admin");
    }
    return res.redirect("/");
  }
);

// logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;
