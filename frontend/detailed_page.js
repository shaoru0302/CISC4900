
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

console.log(productId);

fetch(`/api/products/${productId}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);

        document.getElementById("product-name").textContent = data.name;
        document.getElementById("product-description").textContent = data.description;
        document.getElementById("product-price").textContent = "$" + data.price;
        document.getElementById("product-stock").textContent = "Stock: " + data.stock;
        document.getElementById("product-image").src = data.image_url;

        //quantity botton
        let quantity = 1;

        const quantityValue = document.getElementById("quantity-value");
        const decreaseBtn = document.getElementById("decrease-btn");
        const increaseBtn = document.getElementById("increase-btn");
        const addToCartBtn = document.getElementById("add-to-cart-btn");

        decreaseBtn.addEventListener("click", () => {
            if (quantity > 1) {
                quantity--;
                quantityValue.textContent = quantity;
            }
        });

        increaseBtn.addEventListener("click", () => {
            quantity++;
            quantityValue.textContent = quantity;
        });

        //add to cart botton
        addToCartBtn.addEventListener("click", () => {
            console.log("detail add to cart clicked");

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

