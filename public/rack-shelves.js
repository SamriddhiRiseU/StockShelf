const storageTableBody =
    document.getElementById(
        "storageTableBody"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );


let allProducts = [];



async function loadProducts() {

    try {

        const response =
            await fetch("/api/products");


        if (!response.ok) {

            throw new Error(
                "Products load nahi ho rahe."
            );

        }


        allProducts =
            await response.json();


        displayProducts(allProducts);


    } catch (error) {

        console.error(
            "Storage Load Error:",
            error
        );


        storageTableBody.innerHTML = `

            <tr>

                <td colspan="7">

                    Error loading storage data

                </td>

            </tr>

        `;

    }

}




function displayProducts(products) {

    storageTableBody.innerHTML = "";


    if (products.length === 0) {

        storageTableBody.innerHTML = `

            <tr>

                <td colspan="7">

                    No storage data found

                </td>

            </tr>

        `;

        return;

    }


    products.forEach(function(product) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${product.name}
            </td>

            <td>
                ${product.sku}
            </td>

            <td>
                ${product.category || "-"}
            </td>

            <td>
                ${product.quantity}
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

        `;


        storageTableBody.appendChild(row);

    });

}




searchInput.addEventListener(
    "input",
    function() {

        const searchText =
            searchInput.value
                .toLowerCase()
                .trim();


        const filteredProducts =
            allProducts.filter(
                function(product) {

                    return (

                        (product.name || "")
                            .toLowerCase()
                            .includes(searchText)

                        ||

                        (product.rack || "")
                            .toLowerCase()
                            .includes(searchText)

                        ||

                        (product.shelf || "")
                            .toLowerCase()
                            .includes(searchText)

                        ||

                        (product.sku || "")
                            .toLowerCase()
                            .includes(searchText)

                    );

                }
            );


        displayProducts(
            filteredProducts
        );

    }
);




loadProducts();