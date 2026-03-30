fetch("/api/products?category=earrings")
  .then(response => response.json())
  .then(products => {
    const productGrid = document.getElementById("product-grid");

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <a href="/detailed_page.html?id=${product.id}">
                <img src="${product.image_url}" alt="${product.name}">
            </a>

            <h3>
                <a href="/detailed_page.html?id=${product.id}">${product.name}</a>
            </h3>

            <p class="product-description">${product.description}</p>
            <p class="price">$${product.price}</p>
            <button class="btn">Add to Cart</button>
        `;
    
        const button = card.querySelector(".btn");

        button.addEventListener("click", () => {
            addToCart({
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image_url: product.image_url
        });
});

        productGrid.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Fetch necklace products error:", error);
  });