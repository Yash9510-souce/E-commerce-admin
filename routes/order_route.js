const express = require('express')
const SECURE_CONTROLLER = require('../middlwere/jwt')
const orderController = require('../controller/orderController/orderController')

const router = express.Router()

//Cart Order
router.post('/order/product-order',SECURE_CONTROLLER.USER_JWT,orderController.postCartOrder)
router.get('/order/order-detail',SECURE_CONTROLLER.USER_JWT,orderController.getOrder)
router.get('/order/invoice/:orderId',SECURE_CONTROLLER.USER_JWT,orderController.getinvoice)


module.exports = router

