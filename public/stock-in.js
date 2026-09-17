const productSelect =
    document.getElementById("productSelect");

const stockInForm =
    document.getElementById("stockInForm");

const stockMessage =
    document.getElementById("stockMessage");




async function loadProducts() {

    try {

        const response =
            await fetch("/api/products");

        const products =
            await response.json();


        products.forEach(function(product) {

            const option =
                document.createElement("option");


            option.value = product.id;

            option.textContent =
                `${product.name} (${product.sku}) - Stock: ${product.quantity}`;


            productSelect.appendChild(option);

        });


    } catch (error) {

        console.error(
            "Products Load Error:",
            error
        );

    }

}




stockInForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const product_id =
            productSelect.value;


        const quantity =
            Number(
                document.getElementById(
                    "stockQuantity"
                ).value
            );


        if (!product_id || quantity <= 0) {

            stockMessage.textContent =
                "Please select product and enter valid quantity.";

            stockMessage.style.color = "red";

            return;

        }


        try {

            const response =
                await fetch(
                    "/api/stock-in",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            product_id,
                            quantity
                        })
                    }
                );


            const data =
                await response.json();


            if (response.ok) {

                stockMessage.textContent =
                    "Stock added successfully!";

                stockMessage.style.color =
                    "green";


                stockInForm.reset();



                productSelect.innerHTML = `
                    <option value="">
                        Select a product
                    </option>
                `;

                loadProducts();


            } else {

                stockMessage.textContent =
                    data.message ||
                    "Error adding stock.";

                stockMessage.style.color =
                    "red";

            }


        } catch (error) {

            console.error(
                "Stock In Error:",
                error
            );


            stockMessage.textContent =
                "Server se connection nahi ho raha.";

            stockMessage.style.color =
                "red";

        }

    }
);




loadProducts();