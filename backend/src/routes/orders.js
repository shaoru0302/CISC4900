const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET order history
router.get('/:userId', (req, res) => {
    const userId = req.params.userId;

    const sql = `
        SELECT o.id, o.created_at, o.total_amount, o.status,
               oi.name_snapshot, oi.quantity, oi.unit_price_snapshot
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Server Error");
        }
        res.json(results);
    });
});

module.exports = router;