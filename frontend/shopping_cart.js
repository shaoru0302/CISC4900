/*
 * Shopping Cart Module
 
 * This module manages cart operations on the frontend using localStorage.
 * It supports adding, removing, updating items, and calculating totals.
 *
 * Design choice:
 * - localStorage is used to reduce backend load during browsing
 * - cart data is only sent to backend during checkout
 */

console.log("shopping_cart.js loaded");

const CART_KEY = "beautynest_cart";         // key used to store cart data in browser LocalStorage

// retrieve cart from LocalStorage
function getCart() {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
}

// save cart back to LocalStorage
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// add a product into the cart, if product already exists, the quantity increases
function addToCart(product) {
    console.log("addToCart called:", product);

    if (!product || !product.id || !product.name) {
        console.error("Invalid product:", product);
        return;
    }

    const cart = getCart();
    const productId = String(product.id);

    const existingItem = cart.find(item => String(item.id) === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({                                 // add new item to cart
            id: productId,
            name: product.name,
            price: Number(product.price),
            image_url: product.image_url,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();
    showToast(`${product.name} now added to your shopping cart.`);        // feedback to user on the screen
}
    

// remove a product from the cart
function removeFromCart(productId) {
    const id = String(productId);
    let cart = getCart();

    cart = cart.filter(item => String(item.id) !== id);      // filter out the product

    saveCart(cart);
    updateCartCount();
}

// update selected product's quantity
function updateQuantity(productId, newQuantity) {
    const id = String(productId);
    const cart = getCart();

    const item = cart.find(item => String(item.id) === id);
    if (!item) return;

    if (newQuantity <= 0) {             // if quantity <= 0, remove the item from the cart
        removeFromCart(id);      
        return;
    }

    item.quantity = newQuantity;
    saveCart(cart);
    updateCartCount();
}

// clear the entire cart
function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartCount();
}

// get the total price of all items
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);
}

// update the item count in the cart UI
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartCountEl = document.getElementById("cartCount");
    if (cartCountEl) {
        cartCountEl.textContent = count;
    }
}

// Show alert message if added the product to cart successfully
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 1500); // toast message appears arund 1.5 second 
}

// initialize the cartCount when the page loads
document.addEventListener("DOMContentLoaded", updateCartCount);

document.addEventListener("DOMContentLoaded", () => {
    const checkoutBtn = document.getElementById("checkoutBtn");

    if (!checkoutBtn) return;

    checkoutBtn.addEventListener("click", async () => {
        try {
            const cart = getCart();

            if (!cart || cart.length === 0) {
                alert("Your cart is empty.");
                return;
            }

            const total = cart.reduce((sum, item) => {
                return sum + Number(item.price) * Number(item.quantity || 1);
            }, 0);

            const response = await fetch("/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ amount: total })
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || "Failed to start checkout.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Something went wrong.");
        }
    });
});