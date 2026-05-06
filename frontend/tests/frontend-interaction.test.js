// Run:
// npx jest tests/frontend-interaction.test.js

const fs = require("fs");
const path = require("path");

describe("BeautyNest Front-End Interaction Tests", () => {
  let html;

  beforeAll(() => {
    html = fs.readFileSync(
      path.resolve(__dirname, "../index.html"),
      "utf8"
    );
  });

  test("should have a search input box", () => {
    expect(html).toContain("Search products");
  });

  test("should have a cart display", () => {
    expect(html).toContain("🛒");
  });

  test("should have an About Us clickable element", () => {
    expect(html).toContain("About Us");
  });

  test("should include footer project information", () => {
    expect(html).toContain("2026 BeautyNest");
    expect(html).toContain("CISC 4900 Project");
  });

  test("should include front-end page structure", () => {
    expect(html).toContain("<nav");
    expect(html).toContain("<footer");
  });
});