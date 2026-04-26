/**
 * Shopping cart Page Module
 *
 * Responsible for rendering cart items, handling user interactions,
 * and initiating checkout requests to the backend.
 */

/**
 * Render all items currently stored in the cart
 */
function renderCart() {
    const cartItemsEl = document.getElementById("cartItems");
    const totalEl = document.getElementById("cartTotal");

    const cart = getCart();

    // Handle empty cart
    cartItemsEl.classList.remove("single-item", "multi-item", "empty-state");

    if (cart.length === 0) {
        cartItemsEl.classList.add("empty-state");
        cartItemsEl.innerHTML = `
            <div class="empty-cart">Your cart is empty.</div>
         `;
        document.getElementById("cartSubtotal").textContent = "0.00";
        document.getElementById("cartTax").textContent = "0.00";
        document.getElementById("cartTotal").textContent = "0.00";
        return;
    }

    if (cart.length === 1) {
        cartItemsEl.classList.add("single-item");
    } else {
         cartItemsEl.classList.add("multi-item");
    }

    // Clear current cart display before re-rendering
    cartItemsEl.innerHTML = "";

    // Render each cart item
    cart.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <img src="${item.image_url}" alt="${item.name}" width="100">
            <h3>${item.name}</h3>
            <p>Price: $${Number(item.price).toFixed(2)}</p>
            <label>
                Quantity:
                <div class="qty-control">
                    <button class="qty-btn minus" data-id="${item.id}">-</button>
                    <input type="text" value="${item.quantity}" class="qty-input" data-id="${item.id}">
                    <button class="qty-btn plus" data-id="${item.id}">+</button>
                </div>
            </label>
            <button data-id="${item.id}" class="btn remove-btn">Remove</button>
        `;

        cartItemsEl.appendChild(div);
    });

    // Update total price after tax
    const subTotal = getCartTotal();
    const taxRate = 0.08875;            // NY tax

    const tax = +(subTotal * taxRate).toFixed(2);
    const total = +(subTotal + tax).toFixed(2); 
    
    // uodate UI display
    document.getElementById("cartSubtotal").textContent = subTotal.toFixed(2);
    document.getElementById("cartTax").textContent = tax.toFixed(2);
    document.getElementById("cartTotal").textContent = total.toFixed(2);

    // Handle plus button
    document.querySelectorAll(".qty-btn.plus").forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const input = document.querySelector(`.qty-input[data-id="${id}"]`);
        let value = Number(input.value) || 1;

        value++;
        input.value = value;
        updateQuantity(id, value);
            renderCart(); // Refresh UI
        });
    });

    // Handle mins button
    document.querySelectorAll(".qty-btn.minus").forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const input = document.querySelector(`.qty-input[data-id="${id}"]`);
        let value = Number(input.value) || 1;

        if (value > 1) {
            value--;
            input.value = value;
            updateQuantity(id, value);
            renderCart(); // Refresh UI
        }
    });
});

    // Handle item removal
    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const productId = e.target.dataset.id;
            removeFromCart(productId);
            renderCart();
        });
    });
}
    // Clear entire cart and refresh UI
    document.getElementById("clearCartBtn").addEventListener("click", () => {
        clearCart();
        renderCart();
    });

    // Handle checkout request
    document.getElementById("checkoutBtn").addEventListener("click", async () => {
        const cart = getCart();

            if (cart.length === 0) {
                alert("Your cart is empty.");
                return;
        }

        // Check login first
        const meRes = await fetch("/api/me");
        const meData = await meRes.json();

        if (!meData.loggedIn) {
            alert("Please log in before checkout.");
            window.location.href = "/auth/google";
            return;
        }

        const subtotal = getCartTotal();
        const taxRate = 0.08875;
        const tax = +(subtotal * taxRate).toFixed(2);
        const total = +(subtotal + tax).toFixed(2);

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    items: cart.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: Number(item.price),
                        quantity: item.quantity
                    })),
                    subtotal,
                    tax,
                    total
                })
            
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Checkout failed.");
            }

            // If Stripe is available, go to Stripe checkout page
            if (data.useStripe && data.url) {
                window.location.href = data.url;
                return;
            }

            // If Stripe is not available, order is created directly

            clearCart();
            renderCart();
            alert(`Order created successfully. Order ID: ${data.orderId}`);
            window.location.href = "/order_history";

        } catch (error) {
            console.error("Checkout error:", error);
            alert(error.message);
        }
    });

    // Initialize cart page on load
    document.addEventListener("DOMContentLoaded", renderCart);