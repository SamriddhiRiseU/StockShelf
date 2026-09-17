const productForm = document.getElementById("productForm");
const message = document.getElementById("message");

const productTableBody =
    document.getElementById("productTableBody");

const totalProducts =
    document.getElementById("totalProducts");

const totalStock =
    document.getElementById("totalStock");

const lowStock =
    document.getElementById("lowStock");

const totalRacks =
    document.getElementById("totalRacks");

const inventoryValue =
    document.getElementById("inventoryValue");


async function loadProducts() {

    try {

        const response =
            await fetch("/api/products");

        if (!response.ok) {
            throw new Error(
                "Products load nahi ho rahe."
            );
        }

        const products =
            await response.json();


        productTableBody.innerHTML = "";



        if (products.length === 0) {

            productTableBody.innerHTML = `
                <tr>
                    <td colspan="9">
                        No products available
                    </td>
                </tr>
            `;

        } else {

            products.forEach(function(product) {

                const row =
                    document.createElement("tr");



                if (
                    Number(product.quantity) <=
                    Number(product.minimum_stock)
                ) {

                    row.classList.add(
                        "low-stock-row"
                    );

                }


                row.innerHTML = `
                    <td>${product.name}</td>

                    <td>${product.sku}</td>

                    <td>
                        ${product.category || "-"}
                    </td>

                    <td>
                        ${product.quantity}
                    </td>

                    <td>
                        ${product.minimum_stock}
                    </td>

                    <td>
                        ${product.rack || "-"}
                    </td>

                    <td>
                        ${product.shelf || "-"}
                    </td>

                    <td>
                        ₹${Number(product.price).toFixed(2)}
                    </td>

                    <td>

                        <button
                            type="button"
                            onclick="editProduct(${product.id})"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            onclick="deleteProduct(${product.id})"
                        >
                            Delete
                        </button>

                    </td>
                `;


                productTableBody.appendChild(row);

            });

        }



        totalProducts.textContent =
            products.length;


      

        let stock = 0;

        products.forEach(function(product) {

            stock +=
                Number(product.quantity) || 0;

        });

        totalStock.textContent = stock;


     

        let lowStockCount = 0;

        products.forEach(function(product) {

            const quantity =
                Number(product.quantity) || 0;

            const minimum =
                Number(product.minimum_stock) || 0;


            if (quantity <= minimum) {

                lowStockCount++;

            }

        });

        lowStock.textContent =
            lowStockCount;


      

        const racks = new Set();

        products.forEach(function(product) {

            if (product.rack) {

                racks.add(product.rack);

            }

        });

        totalRacks.textContent =
            racks.size;


        /* ========================================
           INVENTORY VALUE
        ======================================== */

        let totalInventoryValue = 0;

        products.forEach(function(product) {

            const quantity =
                Number(product.quantity) || 0;

            const price =
                Number(product.price) || 0;


            totalInventoryValue +=
                quantity * price;

        });


        inventoryValue.textContent =
            "₹" +
            totalInventoryValue.toLocaleString(
                "en-IN"
            );


    } catch (error) {

        console.error(
            "Load Products Error:",
            error
        );

    }

}




productForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const product = {

            name:
                document
                    .getElementById("name")
                    .value
                    .trim(),

            sku:
                document
                    .getElementById("sku")
                    .value
                    .trim(),

            category:
                document
                    .getElementById("category")
                    .value
                    .trim(),

            quantity:
                Number(
                    document
                        .getElementById("quantity")
                        .value
                ) || 0,

            minimum_stock:
                Number(
                    document
                        .getElementById("minimum_stock")
                        .value
                ) || 0,

            rack:
                document
                    .getElementById("rack")
                    .value
                    .trim(),

            shelf:
                document
                    .getElementById("shelf")
                    .value
                    .trim(),

            price:
                Number(
                    document
                        .getElementById("price")
                        .value
                ) || 0

        };


        try {

            const response =
                await fetch(
                    "/api/products",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(product)
                    }
                );


            const data =
                await response.json();


            if (response.ok) {

                message.textContent =
                    "Product added successfully!";

                message.style.color =
                    "green";


                productForm.reset();


                await loadProducts();

            } else {

                message.textContent =
                    data.message ||
                    "Error adding product.";

                message.style.color =
                    "red";

            }


        } catch (error) {

            console.error(
                "Add Product Error:",
                error
            );

            message.textContent =
                "Server se connection nahi ho raha.";

            message.style.color =
                "red";

        }

    }
);




async function editProduct(id) {

    const response =
        await fetch("/api/products");

    const products =
        await response.json();


    const product =
        products.find(function(item) {

            return item.id === id;

        });


    if (!product) {

        alert("Product not found.");

        return;

    }


    const name =
        prompt(
            "Product Name:",
            product.name
        );

    if (name === null) return;


    const sku =
        prompt(
            "SKU:",
            product.sku
        );

    if (sku === null) return;


    const category =
        prompt(
            "Category:",
            product.category || ""
        );

    if (category === null) return;


    const quantity =
        prompt(
            "Quantity:",
            product.quantity
        );

    if (quantity === null) return;


    const minimum_stock =
        prompt(
            "Minimum Stock:",
            product.minimum_stock
        );

    if (minimum_stock === null) return;


    const rack =
        prompt(
            "Rack:",
            product.rack || ""
        );

    if (rack === null) return;


    const shelf =
        prompt(
            "Shelf:",
            product.shelf || ""
        );

    if (shelf === null) return;


    const price =
        prompt(
            "Price:",
            product.price
        );

    if (price === null) return;


    const updatedProduct = {

        name:
            name.trim(),

        sku:
            sku.trim(),

        category:
            category.trim(),

        quantity:
            Number(quantity) || 0,

        minimum_stock:
            Number(minimum_stock) || 0,

        rack:
            rack.trim(),

        shelf:
            shelf.trim(),

        price:
            Number(price) || 0

    };


    try {

        const updateResponse =
            await fetch(
                `/api/products/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            updatedProduct
                        )
                }
            );


        const data =
            await updateResponse.json();


        if (updateResponse.ok) {

            alert(
                "Product updated successfully!"
            );

            loadProducts();

        } else {

            alert(
                data.message ||
                "Error updating product."
            );

        }


    } catch (error) {

        console.error(
            "Edit Error:",
            error
        );

        alert(
            "Server se connection nahi ho raha."
        );

    }

}



async function deleteProduct(id) {

    const response =
        await fetch("/api/products");

    const products =
        await response.json();


    const product =
        products.find(function(item) {

            return item.id === id;

        });


    if (!product) {

        alert("Product not found.");

        return;

    }


    const confirmDelete =
        confirm(
            `Are you sure you want to delete "${product.name}"?`
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const deleteResponse =
            await fetch(
                `/api/products/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await deleteResponse.json();


        if (deleteResponse.ok) {

            alert(
                "Product deleted successfully!"
            );

            loadProducts();

        } else {

            alert(
                data.message ||
                "Error deleting product."
            );

        }


    } catch (error) {

        console.error(
            "Delete Error:",
            error
        );

        alert(
            "Server se connection nahi ho raha."
        );

    }

}



window.editProduct =
    editProduct;

window.deleteProduct =
    deleteProduct;




loadProducts();





