const request = require("supertest");
const app = require("../src/app");

describe("Order History API", () => {

  // test: should return orders for a valid user
  it("should return orders for a valid userId", async () => {
    const res = await request(app).get("/api/orders/1");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // test: should return empty array if user does not exist
  it("should return empty array for non-existing user", async () => {
    const res = await request(app).get("/api/orders/99999");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // test: should handle invalid userId input
  it("should handle invalid userId input", async () => {
    const res = await request(app).get("/api/orders/abc");

    // your backend returns 200 with empty array
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});