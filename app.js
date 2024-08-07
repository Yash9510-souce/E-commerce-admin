require("dotenv").config();
const express = require('express')
const mongoose = require('mongoose')
const cros = require('cors')

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const admin = require('./routes/admin_route')
const user = require('./routes/user_route')
const product = require('./routes/product_route')
const cart = require('./routes/cart_route')
const order = require('./routes/order_route')

app.use(cros())
app.use('/admin',product)
app.use('/admin',admin)
app.use('/user',user)
app.use('/cart',cart)
app.use('/order',order)

mongoose.connect(process.env.DB_URL)
.then(() => { 
    console.log("DataBase Connected!")
    app.listen(3000)
})
.catch(err => {
    console.log(err.message)
})

