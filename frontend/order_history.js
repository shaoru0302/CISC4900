document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("order-history-container");

  fetch("/api/me")
    .then((res) => res.json())
    .then((user) => {
        if (!user.loggedIn) {
            container.innerHTML = "<p>Please log in to view your order history.</p>";
            return null;
        }

        return fetch(`/api/orders/${user.id}`);
    })
    .then((response) => {
        if (!response) return null;
        return response.json();
    })
    .then((data) => {
        if (!data) return;

        console.log("Order data:", data);

      if (!data || data.length === 0) {
        container.innerHTML = "<p>No order history found.</p>";
        return;
      }

      // group items by order id
      const groupedOrders = {};

      data.forEach((item) => {
        if (!groupedOrders[item.id]) {
          groupedOrders[item.id] = {
            id: item.id,
            created_at: item.created_at,
            total_amount: item.total_amount,
            status: item.status,
            items: []
          };
        }

        groupedOrders[item.id].items.push({
          name_snapshot: item.name_snapshot,
          quantity: item.quantity,
          unit_price_snapshot: item.unit_price_snapshot
        });
      });

      let html = "";

      Object.values(groupedOrders).forEach((order) => {
        html += `
          <div class="order-card">
            <div class="order-header">
                <div class="order-info-box">
                    <span class="label">Order ID</span>
                    <span class="value">#${order.id}</span>
            </div>
            <div class="order-info-box">
                <span class="label">Date</span>
                <span class="value">${new Date(order.created_at).toLocaleString()}</span>
            </div>
            <div class="order-info-box">
                <span class="label">Status</span>
                <span class="value status-text">${order.status}</span>
            </div>
            <div class="order-info-box">
                <span class="label">Total</span>
                <span class="value">$${Number(order.total_amount).toFixed(2)}</span>
            </div>
        </div>

            <div class="order-items-list">
              <h3>Items</h3>
        `;

        order.items.forEach((product) => {
          html += `
            <div class="order-product">
                <p class="product-name">${product.name_snapshot}</p>
                <p><strong>Quantity:</strong> ${product.quantity}</p>
                <p><strong>Price:</strong> $${Number(product.unit_price_snapshot).toFixed(2)}</p>
            </div>
          `;
        });

        html += `
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
    })
    .catch((error) => {
      console.error("Error fetching orders:", error);
      document.getElementById("order-history-container").innerHTML =
        "<p>Failed to load order history.</p>";
    });
});