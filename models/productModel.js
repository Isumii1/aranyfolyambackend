const db = require("../db/db");

async function allProductsDb() {
    const sql =
        "SELECT * FROM `products` INNER JOIN category ON products.category_id = category.category_id";
    const [result] = await db.query(sql);
    return result || [];
}

async function addProductDb(category_id, product_name, product_price, product_image, product_stock) {
    const sql =
        "INSERT INTO `products` (`product_id`, `category_id`, `product_name`, `product_price`, `product_image`, `product_stock`) VALUES (NULL, ?, ?, ?, ?, ?)";
    const [result] = await db.query(sql, [
        category_id,
        product_name,
        product_price,
        product_image,
        product_stock
    ]);
    return result || null;
}

async function deleteProductDb(product_id) {
    const sql = "DELETE FROM `products` WHERE `product_id` = ?";
    const [result] = await db.query(sql, [product_id]);
    return result || null;
}

async function updateProductDb(res, updates, product_id) {
    let sql = "UPDATE `products` SET ";
    const fields = [];
    const values = [];

    if (updates.category_id !== undefined) {
        fields.push("`category_id` = ?");
        values.push(updates.category_id);
    }

    if (updates.product_name !== undefined) {
        fields.push("`product_name` = ?");
        values.push(updates.product_name);
    }

    if (updates.product_price !== undefined) {
        fields.push("`product_price` = ?");
        values.push(updates.product_price);
    }

    if (updates.product_image !== undefined) {
        fields.push("`product_image` = ?");
        values.push(updates.product_image);
    }

    if (updates.product_stock !== undefined) {
        fields.push("`product_stock` = ?");
        values.push(updates.product_stock);
    }

    if (fields.length === 0) {
        return 0;
    }

    sql += fields.join(", ") + " WHERE `product_id` = ?";
    values.push(product_id);

    const [result] = await db.query(sql, values);
    return result.affectedRows;
}

async function findByProduct(product_name) {
    const sql = "SELECT * FROM `products` WHERE `product_name` = ?";
    const [result] = await db.query(sql, [product_name]);
    return result.length > 0 ? result[0] : null;
}

async function findByProductId(product_id) {
    const sql = "SELECT * FROM `products` WHERE `product_id` = ?";
    const [result] = await db.query(sql, [product_id]);
    return result.length > 0 ? result[0] : null;
}

module.exports = {
    allProductsDb,
    addProductDb,
    deleteProductDb,
    updateProductDb,
    findByProduct,
    findByProductId
};