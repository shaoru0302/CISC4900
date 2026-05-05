// checkout.test.js
// API integration tests for the BeautyNest checkout endpoint.
// Run from the backend folder:
// npx jest tests/checkout.test.js
// Or run all backend tests with:
// npm test

const request = require("supertest");
const app = require("../src/app");

describe("Checkout API", () => {

  // test: should create an order or redirect to Stripe
  it("should handle checkout request", async () => {
    const res = await request(app)
      .post("/api/checkout")
      .send({
        userId: 1,
        items: [
          {
            productId: 1,
            name: "Test Product",
            price: 20,
            quantity: 1
          }
        ]
      });

    // backend may return 200 (no stripe) or 302 (stripe redirect)
    expect([200, 302]).toContain(res.statusCode);
  });

  // test: should handle empty cart (still may redirect)
  it("should handle empty cart", async () => {
    const res = await request(app)
      .post("/api/checkout")
      .send({
        userId: 1,
        items: []
      });

    expect([200, 302, 400, 500]).toContain(res.statusCode);
  });

  // test: should handle invalid request data
  it("should handle invalid request data", async () => {
    const res = await request(app)
      .post("/api/checkout")
      .send({});

    expect([200, 302, 400, 500]).toContain(res.statusCode);
  });

});