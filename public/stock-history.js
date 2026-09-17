const historyTableBody =
    document.getElementById(
        "historyTableBody"
    );




async function loadStockHistory() {

    try {

        const response =
            await fetch(
                "/api/stock-history"
            );


        if (!response.ok) {

            throw new Error(
                "History load nahi ho rahi."
            );

        }


        const history =
            await response.json();


        historyTableBody.innerHTML = "";


       

        if (history.length === 0) {

            historyTableBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        No stock history available
                    </td>
                </tr>
            `;

            return;

        }


      

        history.forEach(function(item) {

            const row =
                document.createElement("tr");


            const formattedDate =
                new Date(
                    item.date
                ).toLocaleString();


            row.innerHTML = `

                <td>
                    ${item.name}
                </td>

                <td>
                    ${item.sku}
                </td>

              <td>
    <span class="stock-badge ${item.type === "IN" ? "stock-in-badge" : "stock-out-badge"}">
        ${item.type}
    </span>
</td>

                <td>
                    ${item.quantity}
                </td>

                <td>
                    ${formattedDate}
                </td>

            `;


            historyTableBody.appendChild(row);

        });


    } catch (error) {

        console.error(
            "Stock History Error:",
            error
        );


        historyTableBody.innerHTML = `

            <tr>

                <td colspan="5">

                    Error loading stock history

                </td>

            </tr>

        `;

    }

}



loadStockHistory();