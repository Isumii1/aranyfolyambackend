const db = require('../db/db')

async function getAllOrdersDetailed() {
    const sql = `
        SELECT 
            orders.order_id,
            users.user_id,
            users.user_username,
            orders.order_status,
            orders.order_date,
            products.product_id,
            products.product_name,
            products.product_price,
            order_items.order_count,
            products.product_image
        FROM orders
        LEFT JOIN users ON orders.user_id = users.user_id
        LEFT JOIN order_items ON orders.order_id = order_items.order_id
        LEFT JOIN products ON order_items.product_id = products.product_id
        ORDER BY orders.order_id DESC
    `;
    const [rows] = await db.query(sql);
    return rows;
}

async function getUserOrdersDetailed(user_id) {
    const sql = `
        SELECT 
            orders.order_id,
            orders.order_date,
            orders.order_status,
            users.user_username,
            products.product_id,
            products.product_name,
            products.product_price,
            order_items.order_count,
            products.product_image
        FROM orders
        LEFT JOIN users ON orders.user_id = users.user_id
        LEFT JOIN order_items ON orders.order_id = order_items.order_id
        LEFT JOIN products ON order_items.product_id = products.product_id
        WHERE orders.user_id = ?
        ORDER BY orders.order_id DESC
    `;
    const [rows] = await db.query(sql, [user_id]);
    return rows;
}

async function createOrder(user_id) {
    const sql = `
        INSERT INTO orders (user_id, order_status)
        VALUES (?, 'shipping')
    `
    const [result] = await db.query(sql, [user_id])
    return result.insertId
}

async function addOrderItem(order_id, product_id, quantity) {
    const sql = `
        INSERT INTO order_items (order_id, product_id, order_count)
        VALUES (?, ?, ?)
    `
    await db.query(sql, [order_id, product_id, quantity])
}

async function deleteOrder(order_id) {
    await db.query('DELETE FROM order_items WHERE order_id = ?', [order_id])
    await db.query('DELETE FROM orders WHERE order_id = ?', [order_id])
}

async function updateOrderStatus(order_id, order_status) {
    const sql = `UPDATE orders SET order_status = ? WHERE order_id = ?`;
    await db.query(sql, [order_status, order_id]);
}

async function removeStock(product_id ,order_count) {
    const sql = `UPDATE products SET product_stock=product_stock-${order_count} WHERE product_id = ${product_id}`;
    console.log(sql);
    await db.query(sql);
}

module.exports = {
    getAllOrdersDetailed,
    getUserOrdersDetailed,
    createOrder,
    addOrderItem,
    deleteOrder,
    updateOrderStatus,
    removeStock
}