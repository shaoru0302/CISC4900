const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* Dashboard Summary */
router.get("/summary", (req, res) => {
  const summary = {};

  db.query("SELECT COUNT(*) AS totalProducts FROM products", (err, results) => {
    if (err) {
      console.error("Error fetching totalProducts:", err);
      return res.status(500).json({ error: "Failed to fetch dashboard summary" });
    }

  summary.totalProducts = results[0].totalProducts;

  db.query("SELECT COUNT(*) AS totalOrders FROM orders", (err, results) => {
    if (err) {
      console.error("Error fetching totalOrders:", err);
      return res.status(500).json({ error: "Failed to fetch dashboard summary" });
    }

  summary.totalOrders = results[0].totalOrders;

  db.query(
    "SELECT COUNT(*) AS pendingOrders FROM orders WHERE status = 'pending'", (err, results) => {
      if (err) {
        console.error("Error fetching pendingOrders:", err);
        return res.status(500).json({ error: "Failed to fetch dashboard summary" });
      }

  summary.pendingOrders = results[0].pendingOrders;

  db.query(
    "SELECT COUNT(*) AS lowStockProducts FROM products WHERE stock < 5", (err, results) => {
      if (err) {
        console.error("Error fetching lowStockProducts:", err);
        return res.status(500).json({ error: "Failed to fetch dashboard summary" });
      }

  summary.lowStockProducts = results[0].lowStockProducts;
    res.json(summary);
    }
          );
        }
      );
    });
  });
});

/* Product Management */

// Get all products
router.get("/products", (req, res) => {
  const sql = `
    SELECT id, name, description, price, image_url, stock, category
    FROM products
    ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Failed to fetch products" });
    }

    res.json(results);
  });
});

// Add new product
router.post("/products", (req, res) => {
  const { name, description, price, image_url, stock, category } = req.body;

  const sql = `
    INSERT INTO products (name, description, price, image_url, stock, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, description, price, image_url, stock, category],
    (err) => {
      if (err) {
        console.error("Error adding product:", err);
        return res.status(500).json({ error: "Failed to add product" });
      }

      res.json({ message: "Product added successfully" });
    }
  );
});

// Update product
router.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url, stock, category } = req.body;

  const sql = `
    UPDATE products
    SET name = ?, description = ?, price = ?, image_url = ?, stock = ?, category = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [name, description, price, image_url, stock, category, id],
    (err) => {
      if (err) {
        console.error("Error updating product:", err);
        return res.status(500).json({ error: "Failed to update product" });
      }

      res.json({ message: "Product updated successfully" });
    }
  );
});

// Delete product
router.delete("/products/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM products WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({ error: "Failed to delete product" });
    }

    res.json({ message: "Product deleted successfully" });
  });
});

/* Order Management */

// Get all orders
router.get("/orders", (req, res) => {
  const sql = `
    SELECT 
      o.id,
      u.email,
      o.total_amount,
      o.status,
      o.created_at
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ error: "Failed to fetch orders" });
    }

    res.json(results);
  });
});

// Update order status
router.put("/orders/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, id],
    (err) => {
      if (err) {
        console.error("Error updating order status:", err);
        return res.status(500).json({ error: "Failed to update order status" });
      }

      res.json({ message: "Order status updated successfully" });
    }
  );
});

module.exports = router;