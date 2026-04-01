const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()

const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
const productRoutes = require('./routes/productRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const orderRoutes = require('./routes/orderRoutes')

app.use(cors({
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173','*'],
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())

app.use('/users', userRoutes)
app.use('/admin', adminRoutes)
app.use('/product', productRoutes)
app.use('/category', categoryRoutes)
app.use('/orders', orderRoutes)

// teszt
module.exports = app