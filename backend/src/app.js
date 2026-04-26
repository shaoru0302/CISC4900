/**
 * NOTE:
 * This server is mainly for authentication and API routing.
 * Cart and order-related logic are handled on the frontend for simplicity.
 */

require("dotenv").config();
console.log("APP FILE:", __filename);

const express = require("express");
const Stripe = require("stripe");
const session = require("express-session");
const passport = require("passport");
require("./config/passport");

let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn("STRIPE_SECRET_KEY is missing. Stripe checkout is disabled.");
}

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

// product routes
app.use("/api/products", productRoutes);

// orders routes
app.use("/api/orders",orderRoutes);

// checkout routes, use Stripe if configured, otherwise create order directly
app.post("/api/checkout", requireAuth("user"), async (req, res) => {
    try {
    const { items, total } = req.body;

    console.log("req.user =", req.user);
    console.log("req.user.email =", req.user.email);

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty." });
    }

    if (!total || isNaN(total)) {
      return res.status(400).json({ error: "Invalid total amount." });
    }

    const email = req.user.email?.trim().toLowerCase();
    const findUserSql = "SELECT id FROM users WHERE email = ?";

    db.query(findUserSql, [email], (userErr, userResults) => {
      if (userErr) {
        console.error("User lookup error:", userErr);
        return res.status(500).json({ error: "Failed to find user." });
    }

      if (userResults.length === 0) {
      return res.status(404).json({ error: "User not found in database." });
    }

    const userId = userResults[0].id;

  // create order once processing checkout
    const orderSql = `
      INSERT INTO orders (user_id, total_amount, status, payment_status)
      VALUES (?, ?, 'pending', 'unpaid')
    `;

    db.query(orderSql, [userId, total], async (orderErr, orderResult) => {
      if (orderErr) {
        console.error("Order insert error:", orderErr);
        return res.status(500).json({ error: "Failed to create order." });
      }

      const orderId = orderResult.insertId;

  // create order_items
      const values = items.map(item => [
        orderId,
        item.id,
        item.quantity,
        Number(item.price),
        item.name
      ]);

      const orderItemsSql = `
        INSERT INTO order_items
        (order_id, product_id, quantity, unit_price_snapshot, name_snapshot)
        VALUES ?
      `;

      db.query(orderItemsSql, [values], async (itemErr) => {
        if (itemErr) {
          console.error("Order items insert error:", itemErr);
          return res.status(500).json({ error: "Failed to create order items." });
        }

  // if stripe exists, go to stripe checkout
    if (stripe) {
      try{
        const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
         {
          price_data: {
            currency: "usd",
            product_data: {
              name: "BeautyNest Order"
            },
            unit_amount: Math.round(Number(total) * 100)
          },
          quantity: 1
          }
        ],
          metadata: {
            orderId: String(orderId),
            userId: String(userId)
          },
          success_url: `${process.env.BASE_URL || "http://localhost:4900"}/success.html?orderId=${orderId}`,
          cancel_url: `${process.env.BASE_URL || "http://localhost:4900"}/cancel.html?orderId=${orderId}`
        });

      return res.json({
        useStripe: true,
        url: session.url,
        orderId
        });
      } catch (stripeErr) {
          console.error("Stripe checkout session error:", stripeErr);
          return res.status(500).json({ error: "Failed to create Stripe checkout session." });
        }
      }

  // if no stripe, mark order as paid directly
    const updateSql = `
      UPDATE orders
      SET status = 'paid', payment_status = 'paid'
      WHERE id = ?
    `;

    db.query(updateSql, [orderId], (updateErr) => {
      if (updateErr) {
        console.error("Order status update error:", updateErr);
        return res.status(500).json({ error: "Order created but failed to update payment status" });
      }

      return res.json({
        useStripe: false,
        orderId,
        message: "Order created successfully."
        });
      });
    });
  });
});
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ error: "Checkout failed." });
  }
});



app.get("/api/test-direct", (req, res) => {
  res.send("direct route works");
});

const PORT = process.env.PORT || 4900;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});