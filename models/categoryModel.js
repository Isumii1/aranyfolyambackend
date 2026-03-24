const db = require('../db/db')

async function allCategoryDb() {
    const sql = 'SELECT * FROM category'
    const [result] = await db.query(sql)
    return result || null
}

async function addCategoryDb(category_name) {
    console.log(category_name);
    const sql = 'INSERT INTO `category`(`category_id`, `category_name`) VALUES (NULL,?)'
    const [result] = await db.query(sql, [category_name])
    return result || null
}


async function deleteCategoryDb(category_id) {
    const sql = 'DELETE FROM `category` WHERE `category_id` = ?'
    const [result] = await db.query(sql, [category_id])
    return result || null
}

async function updateCategoryDb(category_id, category_name) {

    let sql = 'UPDATE `category` SET `category_name` = ? WHERE `category_id` = ?'
    const [result] = await db.query(sql,[category_name, category_id])
    return result.affectedRows
}

async function findByCategory(category_name) {
    const sql = 'SELECT * FROM `category` WHERE `category_name` = ?'
    const [result] = await db.query(sql, [category_name])
    if (result.length > 0) {
        return true
    } else return false
}

async function findByCategoryId(category_id) {
    const sql = 'SELECT * FROM `category` WHERE `category_id` = ?'
    const [result] = await db.query(sql, [category_id])
    if (result.length > 0) {
        return true
    } else return false
}
module.exports = { allCategoryDb, addCategoryDb, deleteCategoryDb, updateCategoryDb, findByCategory, findByCategoryId }