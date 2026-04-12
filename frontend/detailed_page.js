const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

console.log(productId);

fetch(`/api/products/${productId}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);

        // Product Info
        document.getElementById("product-name").textContent = data.name;
        document.getElementById("product-description").textContent = data.description;
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

        document.getElementById("product-image").src = data.image_url;
        document.getElementById("product-how-to-use").textContent = data.how_to_use || "";

        document.getElementById("product-details").innerHTML =
            (data.product_details || "")
                .split(";")
                .map(item => item.trim())
                .join("<br>");

        // Quantity Buttons
        const quantityValue = document.getElementById("quantity-value");
        const decreaseBtn = document.getElementById("decrease-btn");
        const increaseBtn = document.getElementById("increase-btn");
        const addToCartBtn = document.getElementById("add-to-cart-btn");

        // Plus button
        increaseBtn.addEventListener("click", () => {
            let value = Number(quantityValue.value) || 1;
            quantityValue.value = value + 1;
        });

        // Minus button
        decreaseBtn.addEventListener("click", () => {
            let value = Number(quantityValue.value) || 1;
            if (value > 1) {
                quantityValue.value = value - 1;
            }
        });

        // Add to Cart
        addToCartBtn.addEventListener("click", () => {
            console.log("detail add to cart clicked");

            const quantity = Number(quantityValue.value) || 1;

            const product = {
                id: data.id,
                name: data.name,
                price: Number(data.price),
                image_url: data.image_url
            };

            console.log("product to add:", product);
            console.log("quantity:", quantity);

            for (let i = 0; i < quantity; i++) {
                addToCart(product);
            }

            console.log("addToCart finished");
        });

    })
    .catch(error => {
        console.error("Fetch error:", error);
    });