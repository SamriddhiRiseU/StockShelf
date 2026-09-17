const express = require("express");
const db = require("./database/database");

const app = express();
const PORT = 3000;




app.use(express.json());

app.use(express.static("public"));




app.get("/", (req, res) => {

    res.sendFile(
        __dirname + "/public/index.html"
    );

});




app.post("/api/products", (req, res) => {

    const {
        name,
        sku,
        category,
        quantity,
        minimum_stock,
        rack,
        shelf,
        price
    } = req.body;


    if (!name || !sku) {

        return res.status(400).json({
            message:
                "Product name and SKU are required"
        });

    }


    try {

        const insertProduct = db.prepare(`
            INSERT INTO products
            (
                name,
                sku,
                category,
                quantity,
                minimum_stock,
                rack,
                shelf,
                price
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);


        const result = insertProduct.run(
            name,
            sku,
            category,
            quantity || 0,
            minimum_stock || 0,
            rack,
            shelf,
            price || 0
        );


        res.json({

            message:
                "Product added successfully!",

            productId:
                result.lastInsertRowid

        });


    } catch (error) {

        if (
            error.code ===
            "SQLITE_CONSTRAINT_UNIQUE"
        ) {

            return res.status(409).json({

                message:
                    "SKU already exists. Please use a different SKU."

            });

        }


        res.status(500).json({

            message:
                "Error adding product",

            error:
                error.message

        });

    }

});




app.get("/api/products", (req, res) => {

    try {

        const products = db.prepare(`
            SELECT * FROM products
            ORDER BY id DESC
        `).all();


        res.json(products);


    } catch (error) {

        res.status(500).json({

            message:
                "Error fetching products",

            error:
                error.message

        });

    }

});



app.put("/api/products/:id", (req, res) => {

    const { id } = req.params;


    const {
        name,
        sku,
        category,
        quantity,
        minimum_stock,
        rack,
        shelf,
        price
    } = req.body;


    try {

        const updateProduct = db.prepare(`
            UPDATE products
            SET
                name = ?,
                sku = ?,
                category = ?,
                quantity = ?,
                minimum_stock = ?,
                rack = ?,
                shelf = ?,
                price = ?
            WHERE id = ?
        `);


        const result = updateProduct.run(

            name,
            sku,
            category,

            quantity || 0,

            minimum_stock || 0,

            rack,

            shelf,

            price || 0,

            id

        );


        if (result.changes === 0) {

            return res.status(404).json({

                message:
                    "Product not found"

            });

        }


        res.json({

            message:
                "Product updated successfully!"

        });


    } catch (error) {

        if (
            error.code ===
            "SQLITE_CONSTRAINT_UNIQUE"
        ) {

            return res.status(409).json({

                message:
                    "SKU already exists. Please use a different SKU."

            });

        }


        res.status(500).json({

            message:
                "Error updating product",

            error:
                error.message

        });

    }

});




app.delete("/api/products/:id", (req, res) => {

    const { id } = req.params;


    try {

        const deleteProduct = db.prepare(`
            DELETE FROM products
            WHERE id = ?
        `);


        const result =
            deleteProduct.run(id);


        if (result.changes === 0) {

            return res.status(404).json({

                message:
                    "Product not found"

            });

        }


        res.json({

            message:
                "Product deleted successfully!"

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Error deleting product",

            error:
                error.message

        });

    }

});




app.post("/api/stock-in", (req, res) => {

    const {
        product_id,
        quantity
    } = req.body;


    if (
        !product_id ||
        !quantity ||
        quantity <= 0
    ) {

        return res.status(400).json({

            message:
                "Valid product and quantity are required"

        });

    }


    try {

        const product = db.prepare(`
            SELECT * FROM products
            WHERE id = ?
        `).get(product_id);


        if (!product) {

            return res.status(404).json({

                message:
                    "Product not found"

            });

        }


        db.prepare(`
            UPDATE products
            SET quantity = quantity + ?
            WHERE id = ?
        `).run(
            quantity,
            product_id
        );


     

        db.prepare(`
            INSERT INTO stock_history
            (
                product_id,
                type,
                quantity
            )
            VALUES (?, ?, ?)
        `).run(
            product_id,
            "IN",
            quantity
        );


        res.json({

            message:
                "Stock added successfully!"

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Error adding stock",

            error:
                error.message

        });

    }

});




app.post("/api/stock-out", (req, res) => {

    const {
        product_id,
        quantity
    } = req.body;


    if (
        !product_id ||
        !quantity ||
        quantity <= 0
    ) {

        return res.status(400).json({

            message:
                "Valid product and quantity are required"

        });

    }


    try {

        
        const product = db.prepare(`
            SELECT * FROM products
            WHERE id = ?
        `).get(product_id);


        if (!product) {

            return res.status(404).json({

                message:
                    "Product not found"

            });

        }


       

        if (product.quantity < quantity) {

            return res.status(400).json({

                message:
                    `Insufficient stock. Available stock: ${product.quantity}`

            });

        }



        db.prepare(`
            UPDATE products
            SET quantity = quantity - ?
            WHERE id = ?
        `).run(
            quantity,
            product_id
        );



        db.prepare(`
            INSERT INTO stock_history
            (
                product_id,
                type,
                quantity
            )
            VALUES (?, ?, ?)
        `).run(
            product_id,
            "OUT",
            quantity
        );


        res.json({

            message:
                "Stock removed successfully!"

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Error removing stock",

            error:
                error.message

        });

    }

});




app.get("/api/stock-history", (req, res) => {

    try {

        const history = db.prepare(`
            SELECT
                stock_history.id,
                products.name,
                products.sku,
                stock_history.type,
                stock_history.quantity,
                stock_history.date
            FROM stock_history
            JOIN products
                ON products.id = stock_history.product_id
            ORDER BY stock_history.id DESC
        `).all();


        res.json(history);


    } catch (error) {

        res.status(500).json({

            message:
                "Error fetching stock history",

            error:
                error.message

        });

    }

});




app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});





