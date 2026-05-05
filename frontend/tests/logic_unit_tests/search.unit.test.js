/**
 * search.unit.test.js
 *
 * Unit tests for the BeautyNest frontend product search logic.
 *
 * The purpose of this test file is to validate the search/filtering logic
 * independently from the backend API and database. Since the product catalog
 * is normally loaded from MySQL through backend routes, these tests use mock
 * BeautyNest product data to test the search behavior without connecting to
 * the database.
 *
 * These tests verify that products can be searched by name, description, and
 * category. They also check case-insensitive search, trimmed search input,
 * empty search input, and no-match results.
 *
 * Test type:
 * Frontend unit logic test using Jest.
 *
 * How to run:
 * 1. Open terminal in the frontend folder.
 * 2. Run:
 *    npx jest tests/logic_unit_tests/search.unit.test.js
 */

const sampleProducts = [
  {
    id: 1,
    name: "Dragonfly Essential Oil Necklaces",
    description: "Lava Stones, 24 Inch Chain",
    price: 119.0,
    category: "necklace"
  },
  {
    id: 41,
    name: "Lavender Essential Oil",
    description: "10ml Lavender Aroma",
    price: 12.99,
    category: "essential oil"
  },
  {
    id: 49,
    name: "Replacement Lava Stones",
    description: "Lava Stones for Diffuser Jewelry (6 pcs)",
    price: 6.99,
    category: "accessory"
  }
];

function filterProducts(products, keyword) {
  if (!keyword || keyword.trim() === "") {
    return [];
  }

  const searchText = keyword.toLowerCase().trim();

  return products.filter(product => {
    return (
      product.name.toLowerCase().includes(searchText) ||
      product.description.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText)
    );
  });
}

describe("Product Search Logic - Unit Tests", () => {
  /**
   * Test 1:
   * Search by product name.
   */

  test("should search products by name", () => {
    const results = filterProducts(sampleProducts, "Lavender");
    expect(results.length).toBe(1);
    expect(results[0].name).toBe("Lavender Essential Oil");
  });

  /**
   * Test 2:
   * Search by description.
   */

  test("should search products by description", () => {
    const results = filterProducts(sampleProducts, "24 inch");
    expect(results.length).toBe(1);
    expect(results[0].name).toBe("Dragonfly Essential Oil Necklaces");
  });

  /**
   * Test 3:
   * Search by category.
   */

  test("should search products by category", () => {
    const results = filterProducts(sampleProducts, "accessory");
    expect(results.length).toBe(1);
    expect(results[0].name).toBe("Replacement Lava Stones");
  });

  /**
   * Test 4:
   * Search should be case-insensitive.
   */

  test("should be case-insensitive", () => {
    const results = filterProducts(sampleProducts, "LAVENDER");
    expect(results.length).toBe(1);
    expect(results[0].name).toBe("Lavender Essential Oil");
  });

  /**
   * Test 5:
   * Search input should be trimmed.
   */

  test("should trim extra spaces in keyword", () => {
    const results = filterProducts(sampleProducts, "   lavender   ");
    expect(results.length).toBe(1);
  });

  /**
   * Test 6:
   * Empty search should return no results.
   */

  test("should return empty array for empty search input", () => {
    expect(filterProducts(sampleProducts, "")).toEqual([]);
    expect(filterProducts(sampleProducts, "   ")).toEqual([]);
  });

  /**
   * Test 7:
   * No matching results.
   */

  test("should return empty array when no products match", () => {
    const results = filterProducts(sampleProducts, "bracelet");
    expect(results).toEqual([]);
  });
});
