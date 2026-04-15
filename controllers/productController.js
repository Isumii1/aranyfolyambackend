const {
    allProductsDb,
    addProductDb,
    deleteProductDb,
    updateProductDb,
    findByProduct,
    findByProductId
} = require("../models/productModel");

function isMissing(value) {
    return value === undefined || value === null;
}

function isBlankString(value) {
    return typeof value === "string" && value.trim() === "";
}

function toTrimmedString(value) {
    return typeof value === "string" ? value.trim() : "";
}

function toNumberIfPresent(value) {
    if (isMissing(value) || value === "") return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? NaN : parsed;
}

async function allProducts(req, res) {
    try {
        const result = await allProductsDb();
        return res.status(200).json({ result });
    } catch (err) {
        return res.status(500).json({
            error: "Termékek szerver oldali hiba!",
            err
        });
    }
}

async function addProduct(req, res) {
    try {
        const rawCategoryId = req.body.category_id;
        const rawProductName = req.body.product_name;
        const rawProductPrice = req.body.product_price;
        const rawProductStock = req.body.product_stock;

        const category_id = toNumberIfPresent(rawCategoryId);
        const product_name = toTrimmedString(rawProductName);
        const product_price = toNumberIfPresent(rawProductPrice);
        const product_stock = toNumberIfPresent(rawProductStock);

        const product_image = req.file
            ? `/uploads/products/${req.file.filename}`
            : null;

        if (
            category_id === undefined ||
            product_name === "" ||
            product_price === undefined ||
            product_stock === undefined ||
            !product_image
        ) {
            return res.status(400).json({
                error: "Tölts ki minden mezőt megfelelően!"
            });
        }

        if (!Number.isInteger(category_id) || category_id < 0) {
            return res.status(400).json({
                error: "Érvényes kategória azonosítót adj meg!"
            });
        }

        if (!Number.isFinite(product_price) || product_price <= 0) {
            return res.status(400).json({
                error: "Az összegnek nagyobbnak kell lennie, mint nulla."
            });
        }

        if (!Number.isInteger(product_stock) || product_stock < 0) {
            return res.status(400).json({
                error: "A darabszám nem lehet negatív."
            });
        }

        const exists = await findByProduct(product_name);

        if (exists) {
            return res.status(400).json({
                error: "Már van ilyen termék!"
            });
        }

        const product = await addProductDb(
            category_id,
            product_name,
            product_price,
            product_image,
            product_stock
        );

        return res.status(201).json({
            message: "Sikeres termék felvitel!",
            product
        });
    } catch (err) {
        return res.status(500).json({
            error: "Termékek szerver oldali hiba!",
            err
        });
    }
}

async function deleteProduct(req, res) {
    try {
        const { product_id } = req.params;

        if (!product_id) {
            return res.status(400).json({
                error: "Hiányzó termék azonosító!"
            });
        }

        const exists = await findByProductId(product_id);

        if (!exists) {
            return res.status(404).json({
                error: "Nem található ilyen termék!"
            });
        }

        const product = await deleteProductDb(product_id);

        return res.status(200).json({
            message: "Sikeresen törölted a terméket!",
            product
        });
    } catch (err) {
        return res.status(500).json({
            error: "Termékek szerver oldali hiba!",
            err
        });
    }
}

async function updateProduct(req, res) {
    try {
        const { product_id } = req.body;

        if (!product_id) {
            return res.status(400).json({
                error: "Hiányzó termék azonosító!"
            });
        }

        const existingProduct = await findByProductId(product_id);

        if (!existingProduct) {
            return res.status(404).json({
                error: "Nem található ilyen termék!"
            });
        }

        const updates = {};

        if (!isMissing(req.body.category_id) && req.body.category_id !== "") {
            const category_id = Number(req.body.category_id);

            if (!Number.isInteger(category_id) || category_id < 0) {
                return res.status(400).json({
                    error: "Érvényes kategória azonosítót adj meg!"
                });
            }

            if (Number(existingProduct.category_id) !== category_id) {
                updates.category_id = category_id;
            }
        }

        if (!isMissing(req.body.product_name)) {
            const product_name = toTrimmedString(req.body.product_name);

            if (product_name !== "") {
                if (existingProduct.product_name !== product_name) {
                    const existsName = await findByProduct(product_name);

                    if (
                        existsName &&
                        Number(existsName.product_id) !== Number(product_id)
                    ) {
                        return res.status(400).json({
                            error: "Már található ilyen termék ezzel a névvel!"
                        });
                    }

                    updates.product_name = product_name;
                }
            }
        }

        if (!isMissing(req.body.product_price) && req.body.product_price !== "") {
            const product_price = Number(req.body.product_price);

            if (!Number.isFinite(product_price) || product_price <= 0) {
                return res.status(400).json({
                    error: "Az összegnek nagyobbnak kell lennie, mint nulla."
                });
            }

            if (Number(existingProduct.product_price) !== product_price) {
                updates.product_price = product_price;
            }
        }

        if (!isMissing(req.body.product_stock) && req.body.product_stock !== "") {
            const product_stock = Number(req.body.product_stock);

            if (!Number.isInteger(product_stock) || product_stock < 0) {
                return res.status(400).json({
                    error: "A darabszám nem lehet negatív."
                });
            }

            if (Number(existingProduct.product_stock) !== product_stock) {
                updates.product_stock = product_stock;
            }
        }

        if (req.file) {
            const product_image = `/uploads/products/${req.file.filename}`;

            if (existingProduct.product_image !== product_image) {
                updates.product_image = product_image;
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                error: "Nincs módosítható mező!"
            });
        }

        const updatedRows = await updateProductDb(res, updates, product_id);

        if (updatedRows === 0) {
            return res.status(400).json({
                error: "Nem történt módosítás."
            });
        }

        return res.status(200).json({
            message: "Sikeresen módosítottad a terméket!"
        });
    } catch (err) {
        return res.status(500).json({
            error: "Termékek szerver oldali hiba!",
            err
        });
    }
}

module.exports = {
    allProducts,
    addProduct,
    deleteProduct,
    updateProduct
};