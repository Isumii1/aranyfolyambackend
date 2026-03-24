const express = require('express')
const router = express.Router()

const { auth } = require('../middleware/userMiddleware')

const { allOrder, userOrders, addOrder, removeOrder, updateOrderStatusController } = require('../controllers/orderController')

router.get('/', allOrder)
router.get('/:id', auth, userOrders)
router.post('/', auth, addOrder)
router.delete('/:id', auth, removeOrder)
router.put('/:id', auth, updateOrderStatusController)

module.exports = router