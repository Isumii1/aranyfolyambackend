const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { findByEmail, findByUsername, createUser, editUser, deleteUser } = require('../models/userModel')
const { config } = require('../config/dotenvConfig')

// cookie beállítások
const cookieOpts = {
    httpOnly: true,
    secure: true, // https-nél true
    sameSite: 'lax',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7
}

// register
async function register(req, res) {
    try {
        const { user_email, user_username, user_psw } = req.body
        console.log(user_email, user_username, user_psw);

        if (!user_email || !user_username || !user_psw) {
            return res.status(400).json({ error: "Email, jelszó és felhasználónév kötelező!" })
        }

        const exists = await findByEmail(user_email)
        console.log(exists);

        if (exists) {
            return res.status(409).json({ error: 'Már van ilyen felhasználó!' })
        }

        const hash = await bcrypt.hash(user_psw, 10)
        const { insertId } = await createUser(user_username, user_email, hash)

        return res.status(201).json({ message: 'Sikeres regisztráció!', insertId })
    } catch (err) {
        return res.status(500).json({ error: 'Regisztrációs szerver oldali hiba!', err })
    }
}

// login
async function login(req, res) {
    try {
        const { user_email, user_psw } = req.body
        //console.log(user_email, user_psw);
        if (!user_email || !user_psw) {
            return res.status(400).json({ error: 'Emailt és jelszót kötelező megadni!' })
        }

        const exists = await findByEmail(user_email)
        // console.log(exists);
        if (!exists) {
            return res.status(401).json({ error: 'Hibásan megadott email/jelszó.' })
        }
        const ok = await bcrypt.compare(user_psw, exists.user_psw)
        if (!ok) {
            return res.status(401).json({ error: 'Hibásan megadott email/jelszó.' })
        }

        const token = jwt.sign(
            { user_id: exists.user_id, user_email: exists.user_email, user_username: exists.user_username, user_role: exists.user_role },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN }
        )
        //console.log(token);
        res.cookie(config.COOKIE_NAME, token, cookieOpts)
        return res.status(200).json({ message: 'Sikeres bejelentkezés!' })

    } catch (err) {
        return res.status(500).json({ error: 'Bejelentkezési szerver oldali hiba!', err })
    }
}

// whoami
async function whoAmI(req, res) {
    try {
        const { user_id, user_username, user_email, user_role } = req.user
        //console.log(user_id, user_username, user_email, user_role);
        return res.status(200).json({ user_id: user_id, user_username: user_username, user_email: user_email, user_role: user_role })
    } catch (err) {
        return res.status(500).json({ error: 'whoAmI szerver oldali hiba!' })
    }
}

// logout
async function logout(req, res) {
    try {
        return res.clearCookie(config.COOKIE_NAME, 
            { 
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/' 

            }).status(200).json({ message: 'Sikeres kijelentkezés' })
    } catch (err) {
        return res.status(500).json({ error: 'Kijelentkezési szerver oldali hiba!' })
    }
}

// edit profil

async function editProfil(req, res) {
    try {
        const { user_username, user_email, user_psw } = req.body
        const { user_id } = req.user

        if (!user_username && !user_email && !user_psw) {
            return res.status(400).json({ error: "Nincs módosítandó dolog!" })
        }

        const currentUser = await findByEmail(req.user.user_email)

        if (!currentUser) {
            return res.status(404).json({ error: "Felhasználó nem található!" })
        }

        let newUsername = user_username || currentUser.user_username
        let newEmail = user_email || currentUser.user_email
        let newPassword = currentUser.user_psw

        if (user_email && user_email !== currentUser.user_email) {
            const emailExists = await findByEmail(user_email)
            if (emailExists && emailExists.user_id !== user_id) {
                return res.status(409).json({ error: "Ez az email már foglalt!" })
            }
        }

        if (user_username && user_username !== currentUser.user_username) {
            const usernameExists = await findByUsername(user_username)
            if (usernameExists && usernameExists.user_id !== user_id) {
                return res.status(409).json({ error: "Ez a felhasználónév már foglalt!" })
            }
        }

        if (user_psw && user_psw.trim() !== "") {
            newPassword = await bcrypt.hash(user_psw, 10)
        }

        const updated = await editUser(
            newUsername,
            newEmail,
            newPassword,
            user_id
        )

        if (updated === 0) {
            return res.status(400).json({ error: "Nem történt módosítás!" })
        }

        const token = jwt.sign(
            {
                user_id,
                user_email: newEmail,
                user_username: newUsername,
                role: currentUser.user_role
            },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN }
        )

        res.cookie(config.COOKIE_NAME, token, cookieOpts)

        return res.status(200).json({ message: "Profil sikeresen módosítva!" })

    } catch (err) {
        return res.status(500).json({ error: "Profil szerver oldali hiba!", err })
    }
}


// delete profil

async function deleteProfil(req, res) {
    try {
        const { user_id } = req.user
        const deleted = await deleteUser(user_id)
        console.log(deleted);
        if (deleted === 0) {
            return res.status(404).json({ error: "Felhasználó nem található!" })
        }

        res.clearCookie(config.COOKIE_NAME, { path: '/' })
        return res.status(200).json({ message: "Felhasználó sikeresen törölve!" })
    } catch (err) {
        return res.status(500).json({ error: "Törlés szerver oldali hiba!", err })
    }
}

module.exports = { register, login, whoAmI, logout, editProfil, deleteProfil }