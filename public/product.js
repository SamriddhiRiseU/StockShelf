const productsTableBody = document.getElementById("productsTableBody");
const searchInput = document.getElementById("searchInput");

let allProducts = [];

if (!productsTableBody || !searchInput) {
    console.error("Products page elements not found.");
} else {
    async function loadProducts() {
        try {
            const response = await fetch("/api/products");

            if (!response.ok) {
                throw new Error("Products load nahi ho rahe.");
            }

            allProducts = await response.json();
            displayProducts(allProducts);
        } catch (error) {
            console.error("Load Products Error:", error);
            productsTableBody.innerHTML = `
                <tr>
                    <td colspan="9">Error loading products</td>
                </tr>
            `;
        }
    }

    function displayProducts(products) {
        productsTableBody.innerHTML = "";

        if (products.length === 0) {
            productsTableBody.innerHTML = `
                <tr>
                    <td colspan="9">No products found</td>
                </tr>
            `;
            return;
        }

        products.forEach(function(product) {
            const row = document.createElement("tr");
            if (
    Number(product.quantity) <=
    Number(product.minimum_stock)
) {
    row.classList.add("low-stock-row");
}

            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.sku}</td>
                <td>${product.category || "-"}</td>
                <td>${product.quantity}</td>
                <td>${product.minimum_stock}</td>
                <td>${product.rack || "-"}</td>
                <td>${product.shelf || "-"}</td>
                <td>₹${Number(product.price).toFixed(2)}</td>
                <td>
                    <button type="button" onclick="editProduct(${product.id})">Edit</button>
                    <button type="button" onclick="deleteProduct(${product.id})">Delete</button>
                </td>
            `;

            productsTableBody.appendChild(row);
        });
    }

    searchInput.addEventListener("input", function() {
        const searchText = searchInput.value.toLowerCase().trim();

        const filteredProducts = allProducts.filter(function(product) {
            return (
                (product.name || "").toLowerCase().includes(searchText) ||
                (product.sku || "").toLowerCase().includes(searchText)
            );
        });

        displayProducts(filteredProducts);
    });

    async function editProduct(id) {
        const product = allProducts.find(function(item) {
            return item.id === id;
        });

        if (!product) {
            alert("Product not found.");
            return;
        }

        const name = prompt("Product Name:", product.name);
        if (name === null) return;

        const sku = prompt("SKU:", product.sku);
        if (sku === null) return;

        const category = prompt("Category:", product.category || "");
        if (category === null) return;

        const quantity = prompt("Quantity:", product.quantity);
        if (quantity === null) return;

        const minimum_stock = prompt("Minimum Stock:", product.minimum_stock);
        if (minimum_stock === null) return;

        const rack = prompt("Rack:", product.rack || "");
        if (rack === null) return;

        const shelf = prompt("Shelf:", product.shelf || "");
        if (shelf === null) return;

        const price = prompt("Price:", product.price);
        if (price === null) return;

        const updatedProduct = {
            name: name.trim(),
            sku: sku.trim(),
            category: category.trim(),
            quantity: Number(quantity) || 0,
            minimum_stock: Number(minimum_stock) || 0,
            rack: rack.trim(),
            shelf: shelf.trim(),
            price: Number(price) || 0
        };

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedProduct)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Product updated successfully!");
                loadProducts();
            } else {
                alert(data.message || "Error updating product.");
            }
        } catch (error) {
            console.error("Edit Product Error:", error);
            alert("Server se connection nahi ho raha.");
        }
    }

    async function deleteProduct(id) {
        const product = allProducts.find(function(item) {
            return item.id === id;
        });

        if (!product) {
            alert("Product not found.");
            return;
        }

        const confirmDelete = confirm(`Are you sure you want to delete "${product.name}"?`);
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "DELETE"
            });

            const data = await response.json();

            if (response.ok) {
                alert("Product deleted successfully!");
                loadProducts();
            } else {
                alert(data.message || "Error deleting product.");
            }
        } catch (error) {
            console.error("Delete Product Error:", error);
            alert("Server se connection nahi ho raha.");
        }
    }

    window.editProduct = editProduct;
    window.deleteProduct = deleteProduct;
    loadProducts();
}

