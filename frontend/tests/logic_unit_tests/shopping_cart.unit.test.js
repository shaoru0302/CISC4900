/**
 * shopping_cart.unit.test.js
 *
 * Unit tests for the BeautyNest frontend shopping cart module.
 *
 * The purpose of this test file is to validate the cart logic independently
 * from the backend API and database. Since BeautyNest stores cart items in
 * localStorage before checkout, these tests use jsdom/localStorage to simulate
 * browser behavior.
 *
 * These tests verify that products can be added, removed, updated, and cleared
 * correctly. They also check total price calculation, cart count updates, and
 * invalid product handling.
 *
 * Test type:
 * Frontend unit logic test using Jest.
 * 
 * How to run:
 * 1. Open terminal in the frontend folder.
 * 2. Run:
 *    npx jest tests/logic_unit_tests/shopping_cart.unit.test.js
 * 
 */

const CART_KEY = "beautynest_cart";

/**
 * Mock product data used for unit testing.
 *
 * These products are based on the real BeautyNest product catalog.
 * The test uses mock data instead of connecting to MySQL because unit tests
 * should focus on frontend logic only.
 */
const sampleProducts = [
  {
    id: 1,
    name: "Dragonfly Essential Oil Necklaces",
    description: "Lava Stones, 24 Inch Chain",
    price: 119.0,
    image_url: "images/Necklaces/N1.jpg",
    stock: 25,
    category: "necklace",
    product_details:
      "Pendant: 2 cm; Chain: 24 inches; Material: Stainless Steel; Includes: 3 lava stones",
    how_to_use:
      "Open the locket, add 1-3 drops of essential oil onto the lava stone, wait a minute, then close it."
  },
  {
    id: 41,
    name: "Lavender Essential Oil",
    description: "10ml Lavender Aroma",
    price: 12.99,
    image_url: "images/Essential Oil/Es5.jpg",
    stock: 25,
    category: "essential oil",
    product_details:
      "Size: 10 ml; Type: Essential Oil; Suitable for diffuser jewelry and aromatherapy use",
    how_to_use:
      "Add 1-3 drops to a lava stone or felt pad in your diffuser jewelry, then let it absorb before wearing."
  },
  {
    id: 49,
    name: "Replacement Lava Stones",
    description: "Lava Stones for Diffuser Jewelry (6 pcs)",
    price: 6.99,
    image_url: "images/Essential Oil/Ac1.jpg",
    stock: 46,
    category: "accessory",
    product_details:
      "Material: Natural Lava Stone; Includes: 6 replacement lava stones; Suitable for diffuser necklaces and earrings",
    how_to_use:
      "Add 1-3 drops of essential oil directly onto a lava stone, let it absorb, then place it into your diffuser jewelry."
  }
];

/**
 * Read cart data from localStorage.
 *
 * Expected behavior:
 * - If cart data exists, convert the JSON string back into an array.
 * - If no cart data exists, return an empty array.
 */
function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

/**
 * Save cart data into localStorage.
 *
 * localStorage can only store strings, so the cart array must be converted
 * into a JSON string before saving.
 */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/**
 * Add a product into the shopping cart.
 *
 * Expected behavior:
 * - If the product is new, add it to the cart with quantity = 1.
 * - If the product already exists, increase its quantity by 1.
 * - If the product is invalid, do not add it.
 */
function addToCart(product) {
  if (!product || !product.id || !product.name) {
    return;
  }

  const cart = getCart();
  const productId = String(product.id);

  const existingItem = cart.find(
    item => String(item.id) === productId
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: Number(product.price),
      image_url: product.image_url,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartCount();
}

/**
 * Remove a product from the cart by product id.
 *
 * Expected behavior:
 * - The item with the matching id should be removed.
 * - All other items should remain in the cart.
 */
function removeFromCart(productId) {
  const id = String(productId);
  let cart = getCart();

  cart = cart.filter(item => String(item.id) !== id);

  saveCart(cart);
  updateCartCount();
}

/**
 * Update the quantity of a product in the cart.
 *
 * Expected behavior:
 * - If newQuantity is greater than 0, update the item quantity.
 * - If newQuantity is 0 or negative, remove the item from the cart.
 * - If the item does not exist, do nothing.
 */
function updateQuantity(productId, newQuantity) {
  const id = String(productId);
  const cart = getCart();

  const item = cart.find(item => String(item.id) === id);
  if (!item) return;

  if (newQuantity <= 0) {
    removeFromCart(id);
    return;
  }

  item.quantity = newQuantity;
  saveCart(cart);
  updateCartCount();
}

/**
 * Clear the entire shopping cart.
 *
 * Expected behavior:
 * - Remove the cart key from localStorage.
 * - Update the UI cart count back to 0.
 */
function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartCount();
}

/**
 * Calculate the total price of all cart items.
 *
 * Formula:
 * total = sum of item.price * item.quantity
 */
function getCartTotal() {
  const cart = getCart();

  return cart.reduce((sum, item) => {
    return sum + Number(item.price) * Number(item.quantity);
  }, 0);
}

/**
 * Update the cart count shown in the UI.
 *
 * Expected behavior:
 * - Find the element with id="cartCount".
 * - Display the total quantity of all cart items.
 *
 * Example:
 * If the cart has 2 necklaces and 3 essential oils,
 * the cart count should display 5.
 */
function updateCartCount() {
  const cart = getCart();

  const count = cart.reduce((sum, item) => {
    return sum + Number(item.quantity);
  }, 0);

  const cartCountEl = document.getElementById("cartCount");

  if (cartCountEl) {
    cartCountEl.textContent = count;
  }
}

/**
 * Test suite for BeautyNest shopping cart unit logic.
 */
describe("Shopping Cart Unit Tests", () => {
  /**
   * beforeEach runs before every test.
   *
   * This makes every test independent:
   * - localStorage is cleared before each test.
   * - a fake cartCount element is created for DOM testing.
   */
  beforeEach(() => {
    localStorage.clear();

    document.body.innerHTML = `
      <span id="cartCount"></span>
    `;
  });

  /**
   * Test 1:
   * A real BeautyNest product should be added to localStorage.
   */
  test("addToCart should add a BeautyNest product to localStorage", () => {
    const product = sampleProducts[0];

    addToCart(product);

    const cart = getCart();

    expect(cart.length).toBe(1);
    expect(cart[0].id).toBe("1");
    expect(cart[0].name).toBe("Dragonfly Essential Oil Necklaces");
    expect(cart[0].price).toBe(119.0);
    expect(cart[0].image_url).toBe("images/Necklaces/N1.jpg");
    expect(cart[0].quantity).toBe(1);
  });

  /**
   * Test 2:
   * Adding the same product twice should not create duplicate rows.
   * Instead, the quantity should increase.
   */
  test("addToCart should increase quantity when the same product already exists", () => {
    const product = sampleProducts[1];

    addToCart(product);
    addToCart(product);

    const cart = getCart();

    expect(cart.length).toBe(1);
    expect(cart[0].id).toBe("41");
    expect(cart[0].name).toBe("Lavender Essential Oil");
    expect(cart[0].quantity).toBe(2);
  });

  /**
   * Test 3:
   * removeFromCart should remove only the selected product.
   */
  test("removeFromCart should remove selected BeautyNest product by id", () => {
    const product1 = sampleProducts[0];
    const product2 = sampleProducts[2];

    addToCart(product1);
    addToCart(product2);

    removeFromCart(1);

    const cart = getCart();

    expect(cart.length).toBe(1);
    expect(cart[0].id).toBe("49");
    expect(cart[0].name).toBe("Replacement Lava Stones");
  });

  /**
   * Test 4:
   * updateQuantity should update the quantity of an existing cart item.
   */
  test("updateQuantity should update product quantity", () => {
    const product = sampleProducts[0];

    addToCart(product);
    updateQuantity(1, 5);

    const cart = getCart();

    expect(cart.length).toBe(1);
    expect(cart[0].quantity).toBe(5);
  });

  /**
   * Test 5:
   * If quantity becomes 0, the item should be removed from the cart.
   */
  test("updateQuantity should remove product when quantity is 0", () => {
    const product = sampleProducts[1];

    addToCart(product);
    updateQuantity(41, 0);

    const cart = getCart();

    expect(cart.length).toBe(0);
  });

  /**
   * Test 6:
   * clearCart should remove all cart data from localStorage.
   */
  test("clearCart should empty the shopping cart", () => {
    addToCart(sampleProducts[0]);
    addToCart(sampleProducts[1]);

    clearCart();

    const cart = getCart();

    expect(cart).toEqual([]);
    expect(localStorage.getItem(CART_KEY)).toBeNull();
  });

  /**
   * Test 7:
   * getCartTotal should calculate the correct total using real BeautyNest prices.
   *
   * Calculation:
   * Dragonfly Necklace: 119.00 * 1 = 119.00
   * Lavender Essential Oil: 12.99 * 2 = 25.98
   * Replacement Lava Stones: 6.99 * 3 = 20.97
   *
   * Expected total:
   * 119.00 + 25.98 + 20.97 = 165.95
   */
  test("getCartTotal should calculate total price correctly", () => {
    saveCart([
      {
        id: "1",
        name: "Dragonfly Essential Oil Necklaces",
        price: 119.0,
        quantity: 1
      },
      {
        id: "41",
        name: "Lavender Essential Oil",
        price: 12.99,
        quantity: 2
      },
      {
        id: "49",
        name: "Replacement Lava Stones",
        price: 6.99,
        quantity: 3
      }
    ]);

    expect(getCartTotal()).toBeCloseTo(165.95, 2);
  });

  /**
   * Test 8:
   * updateCartCount should update the cart count displayed in the UI.
   *
   * Calculation:
   * Dragonfly Necklace quantity = 1
   * Lavender Essential Oil quantity = 2
   * Replacement Lava Stones quantity = 3
   *
   * Expected cart count:
   * 1 + 2 + 3 = 6
   */
  test("updateCartCount should update cart count in DOM", () => {
    saveCart([
      {
        id: "1",
        name: "Dragonfly Essential Oil Necklaces",
        price: 119.0,
        quantity: 1
      },
      {
        id: "41",
        name: "Lavender Essential Oil",
        price: 12.99,
        quantity: 2
      },
      {
        id: "49",
        name: "Replacement Lava Stones",
        price: 6.99,
        quantity: 3
      }
    ]);

    updateCartCount();

    const cartCountEl = document.getElementById("cartCount");

    expect(cartCountEl.textContent).toBe("6");
  });

  /**
   * Test 9:
   * addToCart should ignore invalid product data.
   *
   * This prevents broken or incomplete product objects from being saved
   * into localStorage.
   */
  test("addToCart should ignore invalid product data", () => {
    addToCart(null);
    addToCart({});
    addToCart({ id: "invalid-product" });

    const cart = getCart();

    expect(cart.length).toBe(0);
  });

});