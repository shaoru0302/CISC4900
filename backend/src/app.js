/**
 * NOTE:
 * This server is mainly for authentication and API routing.
 * Cart and order-related logic are handled on the frontend for simplicity.
 */

require("dotenv").config();
console.log("APP FILE:", __filename);

const express = require("express");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const session = require("express-session");
const passport = require("passport");
require("./config/passport");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const requireAuth = require("./middleware/requireAuth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const path = require("path");
const db = require("./config/db");   // connect to database

const app = express();
const FRONTEND_DIR = path.join(__dirname, "../../frontend");

app.use(express.static(FRONTEND_DIR));
app.use(express.json());

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

// always serve homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

// routes to order history page
app.get("/order_history", requireAuth("user"), (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "order_history.html"));
});

// auth routes
app.use("/auth", authRoutes);

// admin api routes
app.use("/api/admin", adminRoutes);

// get user info
app.get("/api/me", (req, res) => {
  if (!req.user) {
    return res.json({ loggedIn: false });
  }

  const email = req.user.email;
  const sql = "SELECT id FROM users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "DB error" });
    }

    res.json({
      loggedIn: true,
      id: results.length > 0 ? results[0].id : req.user.id,
      displayName: req.user.displayName,
      role: req.user.role,
      email: req.user.email,
    });
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

// search route
app.get("/search", (req, res) => {
  const keyword = req.query.q?.trim();

  if (!keyword) {
    return res.json([]);
  }

  const sql = `
    SELECT * FROM products
    WHERE name LIKE ?
       OR description LIKE ?
  `;

  const value = `%${keyword}%`;

  db.query(sql, [value, value], (err, results) => {
    if (err) {
      console.error("Search error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});

//product routes
app.use("/api/products", productRoutes);

//orders routes
app.use("/api/orders",orderRoutes);

app.post("/create-checkout-session", async (req, res) => {
    try {
    const { amount } = req.body;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "BeautyNest Order"
            },
            unit_amount: Math.round(amount * 100)
                    },
                    quantity: 1
                }
            ],
            success_url: `${process.env.BASE_URL}/success.html`,
            cancel_url: `${process.env.BASE_URL}/cancel.html`
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe checkout session error:", error);
        res.status(500).json({ error: "Failed to create checkout session" });
    }
});

app.get("/api/test-direct", (req, res) => {
  res.send("direct route works");
});

const PORT = process.env.PORT || 4900;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});