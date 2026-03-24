const { allUsersByAdminDb, deleteUserByAdminDb, findByUsername, updateUserByAdminDb } = require('../models/adminModel')
const { findByEmail } = require('../models/userModel')

async function allUsersByAdmin(req, res) {
    try {
        const result = await allUsersByAdminDb()
        // console.log(result);
        return res.status(201).json({ result })
    } catch (err) {
        return res.status(500).json({ error: 'Admin szerver oldali hiba!', err })
    }
}

async function deleteUserByAdmin(req, res) {
    try {
        const { user_id } = req.params;
        const user = await deleteUserByAdminDb(user_id)
        return res.status(201).json({ message: 'Sikeresen törölted a felhasználót!', user })

    } catch (err) {
        return res.status(500).json({ error: 'Admin szerver oldali hiba!', err })
    }
}

async function updateUserByAdmin(req, res) {
    try {
        const { user_username, user_email, user_role } = req.body
        const { user_id } = req.params
     
        console.log(user_username,user_email,user_role,user_id)
        if (!user_id) {
            return res.status(404).json({ error: 'Hiányzó felhasználó azonosító!' })
        }
        
        if (user_username) {
            const existsName = await findByUsername(user_username)
            if (existsName && existsName.user_id !== user_id) {
                return res.status(400).json({ error: 'Már található ilyen felhasználó ezzel a névvel!' })
            }
        }

        if (user_email) {
            const existsEmail = await findByEmail(user_email)
            if ( existsEmail &&  existsEmail.user_id !== user_id) {
                return res.status(400).json({ error: 'Már található ilyen felhasználó ezzel a(z) emailel!' })
            }
        }

        const user = await updateUserByAdminDb(
            req,
            res,
            user_id,
            user_username,
            user_email,
            user_role
        )

        return res.status(200).json({ message: 'Sikeresen módosítottad a felhasználót!' })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Admin szerver oldali hiba!', err })
    }
}
module.exports = { allUsersByAdmin, deleteUserByAdmin, updateUserByAdmin }