require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("./config/passport");

const authRoutes = require("./routes/auth");
const requireAuth = require("./middleware/requireAuth");
const path = require("path");

const app = express();
const FRONTEND_DIR = path.join(__dirname, "../../frontend");
app.use(express.static(FRONTEND_DIR));


//always serve homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/auth", authRoutes);

// get user name by email
app.get("/api/me", (req, res) => {
  if (!req.user) {
    return res.json({ loggedIn: false });
  }

  res.json({
    loggedIn: true,
    displayName: req.user.displayName,
    role: req.user.role,
    email: req.user.email,
  });
});


// protected user page
app.get("/user", requireAuth("user"), (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "user.html"));
});

// protected admin page
app.get("/admin", requireAuth("admin"), (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "admin.html"));
});

// logout
app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });
});

const PORT = process.env.PORT || 4900;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

