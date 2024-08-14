const express = require('express')
const usercontroller = require('../controller/userContoller/userContoller')

const router = express.Router()

//User signupl , login , update , delete

router.post('/user/signup',usercontroller.userSignup)
router.post('/user/login',usercontroller.userLogin)
router.put('/user/user-update/:userId',usercontroller.userUpdate)
router.delete('/user/user-delete/:userId',usercontroller.userDelete)


//user product

router.get('/products',usercontroller.getProduct)

module.exports = router
