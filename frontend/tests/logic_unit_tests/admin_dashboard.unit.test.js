/**
 * admin_dashboard.unit.test.js
 *
 * Unit tests for the BeautyNest admin dashboard frontend logic.
 *
 * The purpose of this test file is to validate admin dashboard data handling
 * independently from the backend API and database. Since the real admin
 * dashboard normally receives data from backend routes and MySQL, these tests
 * use mock summary and order data.
 *
 * These tests verify that dashboard summary values are displayed correctly,
 * low stock products are detected, order status can be updated, and only admin
 * users should be allowed to access admin dashboard logic.
 *
 * Test type:
 * Frontend unit logic test using Jest.
 *
 * How to run:
 * 1. Open terminal in the frontend folder.
 * 2. Run:
 *    npx jest tests/logic_unit_tests/admin_dashboard.unit.test.js
 */

const mockAdminUser = {
  loggedIn: true,
  id: 1,
  displayName: "Admin User",
  email: "admin@beautynest.com",
  role: "admin"
};

const mockNormalUser = {
  loggedIn: true,
  id: 2,
  displayName: "Normal User",
  email: "user@beautynest.com",
  role: "user"
};

const mockSummary = {
  totalProducts: 50,
  totalOrders: 12,
  pendingOrders: 4,
  lowStockProducts: 3
};

const mockProducts = [
  {
    id: 1,
    name: "Dragonfly Essential Oil Necklaces",
    stock: 25,
    category: "necklace"
  },
  {
    id: 41,
    name: "Lavender Essential Oil",
    stock: 5,
    category: "essential oil"
  },
  {
    id: 49,
    name: "Replacement Lava Stones",
    stock: 2,
    category: "accessory"
  }
];

const mockOrders = [
  {
    id: 101,
    email: "customer1@example.com",
    total_amount: 45.99,
    status: "pending",
    created_at: "2026-04-20"
  },
  {
    id: 102,
    email: "customer2@example.com",
    total_amount: 119.0,
    status: "paid",
    created_at: "2026-04-21"
  }
];

/**
 * Check whether the current user has admin access.
 */
function isAdmin(user) {
  if (!user) return false;
  return user.loggedIn === true && user.role === "admin";
}

/**
 * Display dashboard summary values in the DOM.
 */
function renderAdminSummary(summary) {
  document.getElementById("totalProducts").textContent = summary.totalProducts;
  document.getElementById("totalOrders").textContent = summary.totalOrders;
  document.getElementById("pendingOrders").textContent = summary.pendingOrders;
  document.getElementById("lowStockProducts").textContent =
    summary.lowStockProducts;
}

/**
 * Return products with stock less than or equal to the low stock limit.
 */
function getLowStockProducts(products, limit = 5) {
  return products.filter(product => product.stock <= limit);
}

/**
 * Update an order status by order id.
 */
function updateOrderStatus(orders, orderId, newStatus) {
  return orders.map(order => {
    if (order.id === orderId) {
      return {
        ...order,
        status: newStatus
      };
    }

    return order;
  });
}

/**
 * Render order rows into the admin orders table.
 */
function renderOrders(orders) {
  const tableBody = document.getElementById("ordersTableBody");

  tableBody.innerHTML = orders
    .map(order => {
      return `
        <tr>
          <td>${order.id}</td>
          <td>${order.email}</td>
          <td>${order.total_amount}</td>
          <td>${order.status}</td>
        </tr>
      `;
    })
    .join("");
}

describe("Admin Dashboard Logic - Unit Tests", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="totalProducts"></div>
      <div id="totalOrders"></div>
      <div id="pendingOrders"></div>
      <div id="lowStockProducts"></div>
      <table>
        <tbody id="ordersTableBody"></tbody>
      </table>
    `;
  });

  /**
   * Test 1:
   * Admin user should be allowed to access admin dashboard.
   */
  test("isAdmin should return true for admin user", () => {
    expect(isAdmin(mockAdminUser)).toBe(true);
  });

  /**
   * Test 2:
   * Normal user should not be allowed to access admin dashboard.
   */
  test("isAdmin should return false for normal user", () => {
    expect(isAdmin(mockNormalUser)).toBe(false);
  });

  /**
   * Test 3:
   * Logged out or invalid user should not be allowed to access admin dashboard.
   */
  test("isAdmin should return false for invalid user", () => {
    expect(isAdmin(null)).toBe(false);
    expect(isAdmin({ loggedIn: false, role: "admin" })).toBe(false);
  });

  /**
   * Test 4:
   * Admin summary values should be displayed correctly in the DOM.
   */
  test("renderAdminSummary should display summary values", () => {
    renderAdminSummary(mockSummary);

    expect(document.getElementById("totalProducts").textContent).toBe("50");
    expect(document.getElementById("totalOrders").textContent).toBe("12");
    expect(document.getElementById("pendingOrders").textContent).toBe("4");
    expect(document.getElementById("lowStockProducts").textContent).toBe("3");
  });

  /**
   * Test 5:
   * Low stock products should be detected correctly.
   */
  test("getLowStockProducts should return products with stock less than or equal to 5", () => {
    const lowStockProducts = getLowStockProducts(mockProducts);

    expect(lowStockProducts.length).toBe(2);
    expect(lowStockProducts[0].name).toBe("Lavender Essential Oil");
    expect(lowStockProducts[1].name).toBe("Replacement Lava Stones");
  });

  /**
   * Test 6:
   * Order status should be updated correctly.
   */
  test("updateOrderStatus should update selected order status", () => {
    const updatedOrders = updateOrderStatus(mockOrders, 101, "shipped");

    expect(updatedOrders[0].status).toBe("shipped");
    expect(updatedOrders[1].status).toBe("paid");
  });

  /**
   * Test 7:
   * If order id does not exist, orders should remain unchanged.
   */
  test("updateOrderStatus should not change orders if order id does not exist", () => {
    const updatedOrders = updateOrderStatus(mockOrders, 999, "cancelled");

    expect(updatedOrders).toEqual(mockOrders);
  });

  /**
   * Test 8:
   * Admin orders should be rendered into the orders table.
   */
  test("renderOrders should display order rows in the DOM", () => {
    renderOrders(mockOrders);

    const tableBody = document.getElementById("ordersTableBody");

    expect(tableBody.textContent).toContain("101");
    expect(tableBody.textContent).toContain("customer1@example.com");
    expect(tableBody.textContent).toContain("pending");
    expect(tableBody.textContent).toContain("102");
    expect(tableBody.textContent).toContain("customer2@example.com");
    expect(tableBody.textContent).toContain("paid");
  });
});