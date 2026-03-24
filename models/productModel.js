const db = require('../db/db')

async function allProductsDb() {
    const sql = 'SELECT * FROM products'
    const [result] = await db.query(sql)
    return result || null
}

async function addProductDb(category_id, product_name, product_price, product_image, product_stock) {
    const sql = 'INSERT INTO `products`(`product_id`, `category_id`, `product_name`, `product_price`, `product_image`, `product_stock`) VALUES (NULL,?,?,?,?,?)'
    const [result] = await db.query(sql, [category_id, product_name, product_price, product_image, product_stock])
    return result || null
}

async function deleteProductDb(product_id) {
    const sql = 'DELETE FROM `products` WHERE `product_id` = ?'
    const [result] = await db.query(sql, [product_id])
    return result || null
}

async function updateProductDb(req,res,category_id, product_name, product_price, product_image, product_stock, product_id) {

    let sql = 'UPDATE `products` SET '
    let fields = []
    let values = []

    if (!isNaN(category_id)) {
        if (category_id >= 0) {
            fields.push('`category_id` = ?')
            values.push(category_id)
        } else return res.status(404).json({ error: 'Nem található ilyen kategória.' })
    }

    if (product_name) {
        fields.push('`product_name` = ?')
        values.push(product_name)
    }
    // console.log(product_price > 0);
    if (!isNaN(product_price)) {
        if (product_price > 0) {
            fields.push('`product_price` = ?')
            values.push(product_price)
        } else {
            return res.status(404).json({ error: 'Az összegnek nagyobbnak kell lennie, mint nulla.' })
            
        }
    }

    if (product_image) {
        fields.push('`product_image` = ?')
        values.push(product_image)
    }

    if (!isNaN(product_stock)) {
        if (product_stock >= 0) {
            fields.push('`product_stock` = ?')
            values.push(product_stock)
        } else {
            return res.status(400).json({ error: 'A darabszám nem lehet negatív.' })
        }
    }

    if (fields.length === 0) {
        return 0
    }

    sql += fields.join(', ') + ' WHERE `product_id` = ?'
    values.push(product_id)

    // console.log(sql);
    const [result] = await db.query(sql, values)
    return result.affectedRows
}

async function findByProduct(product_name) {
    // console.log(product_name);
    const sql = 'SELECT * FROM `products` WHERE `product_name` = ?'
    const [result] = await db.query(sql, [product_name])
    if (result.length > 0) {
        return true
    } else return false
}

async function findByProductId(product_id) {
    // console.log(product_id);
    const sql = 'SELECT * FROM `products` WHERE `product_id` = ?'
    const [result] = await db.query(sql, [product_id])
    if (result.length > 0) {
        return true
    } else return false
}

module.exports = { allProductsDb, addProductDb, deleteProductDb, updateProductDb, findByProduct, findByProductId }