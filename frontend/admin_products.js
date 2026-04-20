const productForm = document.getElementById("productForm");
const productTableBody = document.getElementById("productTableBody");

async function checkAdmin() {
  const res = await fetch("/api/me");
  const data = await res.json();

  if (!data.loggedIn || data.role !== "admin") {
    window.location.href = "/";
    return false;
  }

  return true;
}

async function loadProducts() {
  try {
    const response = await fetch("/api/admin/products");
    const products = await response.json();

    productTableBody.innerHTML = "";
    window.allProducts = products;

    products.forEach((product) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>$${Number(product.price).toFixed(2)}</td>
        <td>${product.category || ""}</td>
        <td style="${product.stock < 5 ? 'color:red; font-weight:bold;' : ''}">
            ${product.stock}${product.stock < 5 ? ' (Low)' : ''}
        </td>
        <td>
          <button type="button" onclick="editProduct(${product.id})">Edit</button>
          <button type="button" onclick="deleteProduct(${product.id})">Delete</button>
        </td>
      `;
      productTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Failed to load products:", error);
  }
}

productForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const productId = document.getElementById("productId").value;

  const productData = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    image_url: document.getElementById("image_url").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value
  };

  try {
    if (productId) {
      await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      });
    } else {
      await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      });
    }

    productForm.reset();
    document.getElementById("productId").value = "";
    loadProducts();
  } catch (error) {
    console.error("Failed to save product:", error);
  }
});

// edit product
function editProduct(id) {
  const product = window.allProducts.find((item) => item.id === id);
  if (!product) return;

  document.getElementById("productId").value = product.id;
  document.getElementById("name").value = product.name || "";
  document.getElementById("description").value = product.description || "";
  document.getElementById("price").value = product.price || "";
  document.getElementById("image_url").value = product.image_url || "";
  document.getElementById("stock").value = product.stock || 0;
  document.getElementById("category").value = product.category || "";
}

// delete product
async function deleteProduct(id) {
  try {
    await fetch(`/api/admin/products/${id}`, {
      method: "DELETE"
    });
    loadProducts();
  } catch (error) {
    console.error("Failed to delete product:", error);
  }
}

(async function () {
  const ok = await checkAdmin();
  if (ok) loadProducts();
})();