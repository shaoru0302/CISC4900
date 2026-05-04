const express = require("express");
console.log("products.js loaded");
const router = express.Router();
const db = require("../config/db");

// search products
router.get("/search", (req, res) => {
  const keyword = req.query.q || "";

if (!keyword.trim()) {
  return res.json([]);
}

const sql = `
  SELECT *
  FROM products
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

//product detail
router.get("/", (req, res) => {
  const category = req.query.category;

  let sql = "SELECT * FROM products";
  let values = [];

  if (category) {
    const categories = category
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    if (categories.length === 1) {
      sql += " WHERE LOWER(TRIM(category)) = LOWER(TRIM(?))";
      values.push(categories[0]);
    } else if (categories.length > 1) {
      const placeholders = categories
        .map(() => "LOWER(TRIM(category)) = LOWER(TRIM(?))")
        .join(" OR ");
      sql += ` WHERE (${placeholders})`;
      values.push(...categories);
    }
  }

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Get products error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});

router.get("/:id", (req, res) => {
  const productId = req.params.id;

  const sql = `
    SELECT *
    FROM products
    WHERE id = ?
  `;

  db.query(sql, [productId], (err, results) => {
    if (err){
      console.error("Get product error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if(results.length === 0){
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(results[0]);
  });
});

module.exports = router;