const fs = require("fs");
const path = require("path");

describe("BeautyNest Home Page UI Tests", () => {
  let html;

  beforeAll(() => {
    html = fs.readFileSync(
      path.resolve(__dirname, "../index.html"),
      "utf8"
    );
  });

  test("should display the BeautyNest brand name", () => {
    expect(html).toContain("BeautyNest");
  });

  test("should display the website tagline", () => {
    expect(html).toContain("Essential Oil Jewelry & Handcrafted Beauty");
  });

  test("should display main navigation links", () => {
    expect(html).toContain("Home");
    expect(html).toContain("Necklaces");
    expect(html).toContain("Earrings");
    expect(html).toContain("Bracelets");
    expect(html).toContain("Oil & Accessories");
    expect(html).toContain("Login");
  });

  test("should display the hero message", () => {
    expect(html).toContain("Our handmade creations are");
  });

  test("should display the About Us button", () => {
    expect(html).toContain("About Us");
  });
});