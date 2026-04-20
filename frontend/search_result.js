/**
 * Search Result Page Module

 * Fetches products based on the search keyword
 * and renders product cards with Add to Cart buttons.
 */

/**
 * Get the search keyword from URL
 * Example: search-result.html?q=necklace
 */

function getSearchKeyword() {
    const params = new URLSearchParams(window.location.search);
    return params.get("q") || "";
}

/**
 * Fetch products from backend using keyword
 * @param {string} keyword
 * @returns {Promise<Array>}
 */
async function fetchProducts(keyword) {
    try {
        const response = await fetch(`/search?q=${encodeURIComponent(keyword)}`);
        if (!response.ok) {
            throw new Error("Failed to fetch products.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}


// Render products on the result page
function renderProducts(products) {
    const results = document.getElementById("results");
    const message = document.getElementById("message");

    if (!results) return;

    results.innerHTML = "";
    if (message) message.textContent = "";

    if (products.length === 0) {
        if (message) {
            message.textContent = "No matching products found.";
        }
        return;
    }

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image_url}" alt="${product.name}" width="150">
            <h3>${product.name}</h3>
            <p>$${Number(product.price).toFixed(2)}</p>
            <button class="add-cart-btn">Add to Cart</button>
        `;

        const button = card.querySelector(".add-cart-btn");

        button.addEventListener("click", () => {
            console.log("button clicked", product);
            addToCart(product);
        });

        results.appendChild(card);
    });
}


// Initialize search result page
async function initSearchResults() {
    const keyword = getSearchKeyword();
    const titleEl = document.getElementById("resultTitle");

    if (titleEl) {
        titleEl.textContent = keyword
            ? `Search Results for "${keyword}"`
            : "All Products";
    }

    const products = await fetchProducts(keyword);
    renderProducts(products);
}

document.addEventListener("DOMContentLoaded", initSearchResults);