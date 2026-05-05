const origin = window.BEAUTYNEST_API_ORIGIN || "";

function renderOilAccessories(products) {
  const productGrid = document.getElementById("product-grid");
  if (!productGrid) return;

  productGrid.innerHTML = "";

  if (!products.length) {
    productGrid.innerHTML =
      '<p class="product-description" style="grid-column:1/-1;">No oil or accessory products found. Add rows with <code>essential oil</code> or <code>accessory</code> categories or import seed CSV.</p>';
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    const imgSrc = window.beautynestAssetUrl(product.image_url);
    const detail = window.beautynestDetailUrl(product.id);
    const name = window.beautynestEscapeHtml(product.name);
    const desc = window.beautynestEscapeHtml(product.description || "");

    card.innerHTML = `
        <a href="${detail}">
          <img src="${imgSrc}" alt="${name}">
        </a>

        <h3>
          <a href="${detail}">${name}</a>
        </h3>

        <p class="product-description">${desc}</p>
        <p class="price">$${product.price}</p>
        <button class="btn">Add to Cart</button>
      `;

    const button = card.querySelector(".btn");

    button.addEventListener("click", () => {
      addToCart({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image_url: product.image_url,
      });
    });

    productGrid.appendChild(card);
  });
}

fetch(`${origin}/api/products?category=essential%20oil,accessory`)
  .then((response) => {
    if (!response.ok) {
      return response.text().then((t) => {
        throw new Error(t || response.statusText);
      });
    }
    return response.json();
  })
  .then((data) => {
    if (data && data.error) {
      throw new Error(data.error);
    }
    renderOilAccessories(Array.isArray(data) ? data : []);
  })
  .catch((error) => {
    console.error("Fetch oil/accessory products error:", error);
    const productGrid = document.getElementById("product-grid");
    if (productGrid) {
      productGrid.innerHTML =
        '<p class="product-description" style="grid-column:1/-1;color:#b91c1c;">Could not load products. Start the backend and open this page from <strong>http://127.0.0.1:4900</strong>.</p>';
    }
  });
