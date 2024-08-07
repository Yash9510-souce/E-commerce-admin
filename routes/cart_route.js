const express = require('express')
const SECURE_CONTROLLER = require('../middlwere/jwt')
const userCartController = require('../controller/userContoller/userCartController')

const router = express.Router()

//User Cart 
router.get('/user-cart',SECURE_CONTROLLER.USER_JWT,userCartController.getCart)
router.post('/addTocart/:product_id',SECURE_CONTROLLER.USER_JWT,userCartController.addToCart)
router.delete('/delete-cart/:cart_id',SECURE_CONTROLLER.USER_JWT,userCartController.deleteCart)


module.exports = router

