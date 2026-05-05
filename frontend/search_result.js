/**
 * Search Result Page Module
 * Fetches products based on the search keyword and renders product cards.
 */

function getSearchKeyword() {
  const params = new URLSearchParams(window.location.search);
  return params.get("q") || "";
}

async function fetchProducts(keyword) {
  const origin = window.BEAUTYNEST_API_ORIGIN || "";
  try {
    const response = await fetch(
      `${origin}/search?q=${encodeURIComponent(keyword)}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch products.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

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

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    const imgSrc = window.beautynestAssetUrl(product.image_url);
    const name = window.beautynestEscapeHtml(product.name);

    card.innerHTML = `
            <img src="${imgSrc}" alt="${name}" width="150">
            <h3>${name}</h3>
            <p>$${Number(product.price).toFixed(2)}</p>
            <button class="add-cart-btn">Add to Cart</button>
        `;

    const button = card.querySelector(".add-cart-btn");

    button.addEventListener("click", () => {
      addToCart(product);
    });

    results.appendChild(card);
  });
}

async function initSearchResults() {
  const keyword = getSearchKeyword();
  const titleEl =
    document.getElementById("resultsTitle") ||
    document.getElementById("resultTitle");

  if (titleEl) {
    titleEl.textContent = keyword
      ? `Search Results for "${keyword}"`
      : "All Products";
  }

  const products = await fetchProducts(keyword);
  renderProducts(products);
}

document.addEventListener("DOMContentLoaded", initSearchResults);
