const express = require('express')
const usercontroller = require('../controller/userContoller/userContoller')

const router = express.Router()

//User signupl , login , update , delete
router.post('/user/signup',usercontroller.userSignup)
router.post('/user/login',usercontroller.userLogin)
router.put('/user/user-update/:update_id',usercontroller.userUpdate)
router.delete('/user/user-delete/:delete_id',usercontroller.userDelete)



module.exports = router
