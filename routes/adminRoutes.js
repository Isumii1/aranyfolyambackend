const express = require('express')
const { allUsersByAdmin, deleteUserByAdmin, updateUserByAdmin } = require('../controllers/adminController')

const { auth } = require('../middleware/userMiddleware')
const { isAdmin } = require('../middleware/roleMiddleware')

const router = express.Router()

router.get('/users',auth,isAdmin, allUsersByAdmin)
router.delete('/delete/user/:user_id',auth,isAdmin, deleteUserByAdmin)
router.put('/update/user/:user_id',auth,isAdmin, updateUserByAdmin)

module.exports = router