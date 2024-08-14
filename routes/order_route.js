const express = require('express')
const SECURE_CONTROLLER = require('../middlwere/jwt')
const orderController = require('../controller/orderController/orderController')

const router = express.Router()

//Order Page
router.post('/order/product-order',SECURE_CONTROLLER.USER_JWT,orderController.postCartOrder)
router.get('/order/order-detail',SECURE_CONTROLLER.USER_JWT,orderController.getOrder)
router.get('/order/invoice/:orderId',SECURE_CONTROLLER.USER_JWT,orderController.getinvoice)
router.delete('/order/order-delete/:orderId',SECURE_CONTROLLER.ADMIN_JWT,orderController.deleteOrder)

module.exports = router

