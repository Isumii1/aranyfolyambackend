const db = require('../db/db')

async function allUsersByAdminDb() {
    const sql = 'SELECT `user_id`,`user_username`,`user_email`,`user_role` FROM `users`'
    const [result] = await db.query(sql)
    return result || null
}

async function deleteUserByAdminDb(user_id) {
    const sql = 'DELETE FROM `users` WHERE user_id = ?'
    // console.log(user_id);
    const [result] = await db.query(sql,[user_id])
    return result || null
}

async function deleteUserByAdminDb(user_id) {
    const sql = 'DELETE FROM `users` WHERE user_id = ?'
    // console.log(user_id);
    const [result] = await db.query(sql,[user_id])
    return result || null
}

async function findByUsername(user_username) {
    const sql = 'SELECT * FROM users WHERE user_username = ?'
    const [result] = await db.query(sql, [user_username])
    return result[0] || null
}

async function updateUserByAdminDb(req,res,user_id,user_username,user_email,user_role) {
    let sql = 'UPDATE `users` SET '
    let fields = []
    let values = []

    if (user_username) {
        fields.push('user_username = ?')
        values.push(user_username)
    }

    if (user_email) {
        fields.push('user_email = ?')
        values.push(user_email)
    }

    if (user_role) {
        fields.push('user_role = ?')
        values.push(user_role)
    }

    if (fields.length === 0) {
        return 0
    }

    sql += fields.join(', ') + ' WHERE `user_id` = ?'
    values.push(user_id)
    // console.log(sql);
    const [result] = await db.query(sql, values)
    return result.affectedRows
}

module.exports = { allUsersByAdminDb, deleteUserByAdminDb, findByUsername, updateUserByAdminDb }