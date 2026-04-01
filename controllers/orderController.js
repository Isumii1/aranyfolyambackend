const {
    getAllOrdersDetailed,
    getUserOrdersDetailed,
    createOrder,
    addOrderItem,
    deleteOrder,
    updateOrderStatus,
    removeStock
} = require('../models/orderModel')

async function allOrder(req, res) {
    try {
        const data = await getAllOrdersDetailed()
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

async function userOrders(req, res) {
    try {
        const user_id = req.user.user_id
        const data = await getUserOrdersDetailed(user_id)
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

async function addOrder(req, res) {
    try {
        const user_id = req.user ? req.user.user_id: req.body.user_id
        const { items } = req.body

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'A kosár üres!' })
        }

        const order_id = await createOrder(user_id)

        for (const item of items) {
            const qty = item.quantity || item.order_count
            await addOrderItem(
                order_id, 
                item.product_id, 
                qty
            )
            await removeStock(item.product_id, qty)
        }

        res.status(201).json({ message: 'Rendelés sikeresen mentve', order_id })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

async function removeOrder(req, res) {
    try {
        const order_id = req.params.id
        await deleteOrder(order_id)
        res.json({ message: 'Törölve' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

async function updateOrderStatusController(req, res) {
    try {
        const order_id = req.params.id
        const { status } = req.body

        await updateOrderStatus(order_id, status)
        res.json({ message: 'Státusz frissítve' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    allOrder,
    userOrders,
    addOrder,
    removeOrder,
    updateOrderStatusController
}