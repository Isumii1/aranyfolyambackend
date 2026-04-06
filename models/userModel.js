const db = require('../db/db')

async function findByEmail(user_email) {
    const sql = 'SELECT * FROM users WHERE user_email = ?'
    const [result] = await db.query(sql, [user_email])
    return result[0] || null
}

async function findByUsername(user_username) {
    const sql = 'SELECT * FROM users WHERE user_username = ?'
    const [result] = await db.query(sql, [user_username])
    return result[0] || null
}

async function createUser(user_username, user_email, hash) {
    const sql = 'INSERT INTO users(user_id, user_username, user_email, user_psw, user_role) VALUES (NULL, ?, ?, ?,"user")'
    const [result] = await db.query(sql, [user_username, user_email, hash])

    return { insertId: result.insertId }
}

async function editUser(user_username, user_email, hash, user_id) {
    const sql = 'UPDATE `users` SET `user_username`= ?,`user_email`= ?,`user_psw`= ? WHERE `user_id` = ?'
    
    const [result] = await db.query(sql, [user_username, user_email, hash, user_id])

    return result.affectedRows
}

async function deleteUser(user_id) {
    const sql = 'DELETE FROM `users` WHERE `user_id` = ?'
    const [result] = await db.query(sql, [user_id])

    return result.affectedRows
}

module.exports = { findByEmail, createUser, editUser, deleteUser, findByUsername }