/**
 * Catalog Cart Module
 * Binds Add to Cart buttons on catalog pages by extracting
 * product information directly from each product card.
 */

/**
 * Convert product name into a simple id string
 * @param {string} text
 * @returns {string}
 */
function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
}

/**
 * Convert price text like "$92.00" into number 92
 * @param {string} priceText
 * @returns {number}
 */
function parsePrice(priceText) {
    return Number(priceText.replace(/[^0-9.]/g, ""));
}


// Bind Add to Cart buttons on catalog pages
document.addEventListener("DOMContentLoaded", () => {
    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach((card, index) => {
        const button = card.querySelector(".btn");
        const nameEl = card.querySelector("h3");
        const priceEl = card.querySelector(".price");
        const imgEl = card.querySelector("img");

        if (!button || !nameEl || !priceEl || !imgEl) return;

        const name = nameEl.textContent.trim();
        const price = parsePrice(priceEl.textContent.trim());
        const imageUrl = imgEl.getAttribute("src");

        const product = {
            id: `${slugify(name)}-${index}`,
            name: name,
            price: price,
            image_url: imageUrl
        };

        console.log("Binding cart button for:", product);

        button.addEventListener("click", () => {
            console.log("Catalog button clicked:", product);
            addToCart(product);
        });
    });
});