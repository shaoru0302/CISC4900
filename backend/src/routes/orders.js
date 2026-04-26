const express = require('express');
const router = express.Router();
const db = require('../config/db');
const requireAuth = require('../middleware/requireAuth');

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

// UPDATE order payment status after successful payment
router.post('/:orderId/pay', requireAuth("user"), (req, res) => {
    const orderId = req.params.orderId;

    const sql = `
        UPDATE orders
        SET status = 'paid', payment_status = 'paid'
        WHERE id = ?
    `;

    db.query(sql, [orderId], (err, result) => {
        if (err) {
            console.error("Update payment status error:", err);
            return res.status(500).json({ error: "Failed to update payment status." });
        }

        res.json({
            success: true,
            message: "Order marked as paid."
        });
    });
});



module.exports = router;