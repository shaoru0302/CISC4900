const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const origin = window.BEAUTYNEST_API_ORIGIN || "";

if (!productId) {
  console.error("Missing product id");
} else {
  fetch(`${origin}/api/products/${encodeURIComponent(productId)}`)
    .then(async (response) => {
      if (!response.ok) {
        let msg = response.statusText;
        try {
          const body = await response.json();
          if (body.error) msg = body.error;
        } catch {
          /* ignore */
        }
        throw new Error(msg);
      }
      return response.json();
    })
    .then((data) => {
      if (data.error) {
        throw new Error(data.error);
      }

      document.getElementById("product-name").textContent = data.name;
      document.getElementById("product-description").textContent =
        data.description || "";
      document.getElementById("product-price").textContent = "$" + data.price;

      const stockElement = document.getElementById("product-stock");

      if (data.stock === 0) {
        stockElement.textContent = "Out of Stock";
        stockElement.style.color = "red";
      } else if (data.stock <= 15) {
        stockElement.textContent = `Only ${data.stock} left in stock`;
        stockElement.style.color = "red";
      } else {
        stockElement.textContent = "In Stock";
        stockElement.style.color = "green";
      }

      document.getElementById("product-image").src =
        window.beautynestAssetUrl(data.image_url);
      document.getElementById("product-how-to-use").textContent =
        data.how_to_use || "";

      document.getElementById("product-details").innerHTML = (data.product_details || "")
        .split(";")
        .map((item) => item.trim())
        .join("<br>");

      const quantityValue = document.getElementById("quantity-value");
      const decreaseBtn = document.getElementById("decrease-btn");
      const increaseBtn = document.getElementById("increase-btn");
      const addToCartBtn = document.getElementById("add-to-cart-btn");

      increaseBtn.addEventListener("click", () => {
        let value = Number(quantityValue.value) || 1;
        quantityValue.value = value + 1;
      });

      decreaseBtn.addEventListener("click", () => {
        let value = Number(quantityValue.value) || 1;
        if (value > 1) {
          quantityValue.value = value - 1;
        }
      });

      addToCartBtn.addEventListener("click", () => {
        const quantity = Number(quantityValue.value) || 1;

        const product = {
          id: data.id,
          name: data.name,
          price: Number(data.price),
          image_url: data.image_url,
        };

        for (let i = 0; i < quantity; i++) {
          addToCart(product);
        }
      });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      const nameEl = document.getElementById("product-name");
      if (nameEl) {
        nameEl.textContent = "Product not found";
      }
      const descEl = document.getElementById("product-description");
      if (descEl) {
        descEl.textContent =
          "Could not load this product. Open the site from http://127.0.0.1:4900 with the server running.";
      }
    });
}
