const express = require('express')
const { allCategory, addCategory, deleteCategory, updateCategory } = require('../controllers/categoryController.js')

const { auth } = require('../middleware/userMiddleware')
const { isAdmin } = require('../middleware/roleMiddleware')

const router = express.Router()

router.get('/all', allCategory)
router.post('/add', auth, isAdmin, addCategory)
router.delete('/del/:category_id', auth, isAdmin, deleteCategory)
router.put('/update', auth, isAdmin, updateCategory)

module.exports = router