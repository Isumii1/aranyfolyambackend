const express = require('express')
const { register, login, whoAmI, logout, deleteProfil, editProfil }=require('../controllers/userController')

const { auth } = require('../middleware/userMiddleware')

const router=express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/whoami', auth, whoAmI)
router.post('/logout', auth, logout)
router.put('/edit', auth, editProfil)
router.delete('/delete', auth, deleteProfil)

module.exports=router