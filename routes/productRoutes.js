const express = require('express')
const { allProducts, addProduct, deleteProduct, updateProduct } = require('../controllers/productController')

const { auth } = require('../middleware/userMiddleware')
const { isAdmin } = require('../middleware/roleMiddleware')

const router = express.Router()

router.get('/all', allProducts)
router.post('/add', auth, isAdmin, addProduct)
router.delete('/del/:product_id', auth, isAdmin, deleteProduct)
router.put('/update', auth, isAdmin, updateProduct)

module.exports = router