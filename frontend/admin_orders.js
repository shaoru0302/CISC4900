const orderTableBody = document.getElementById("orderTableBody");

async function checkAdmin() {
  const res = await fetch("/api/me");
  const data = await res.json();

  if (!data.loggedIn || data.role !== "admin") {
    window.location.href = "/";
    return false;
  }

  return true;
}

async function loadOrders() {
  try {
    const response = await fetch("/api/admin/orders");
    const orders = await response.json();

    orderTableBody.innerHTML = "";

    // if there is no order exists
    if (orders.length === 0) {
      orderTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding:20px;">
            No orders found
          </td>
        </tr>
      `;
      return;
    }

    orders.forEach((order) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.user_id}</td>
        <td>$${Number(order.total_amount).toFixed(2)}</td>
        <td>
          <select onchange="updateOrderStatus(${order.id}, this.value)">
            <option value="pending" ${order.status === "pending" ? "selected" : ""}>pending</option>
            <option value="paid" ${order.status === "paid" ? "selected" : ""}>paid</option>
            <option value="shipped" ${order.status === "shipped" ? "selected" : ""}>shipped</option>
            <option value="cancelled" ${order.status === "cancelled" ? "selected" : ""}>cancelled</option>
          </select>
        </td>
        <td>${new Date(order.created_at).toLocaleString()}</td>
      `;
      orderTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Failed to load orders:", error);
  }
}

async function updateOrderStatus(orderId, status) {
  try {
    await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    loadOrders();
  } catch (error) {
    console.error("Failed to update order status:", error);
  }
}

(async function () {
  const ok = await checkAdmin();
  if (ok) loadOrders();
})();