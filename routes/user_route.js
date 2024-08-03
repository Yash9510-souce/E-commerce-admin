const express = require('express')
const usercontroller = require('../controller/userContoller/userContoller')

const router = express.Router()

//User signupl , login , update , delete
router.post('/signup',usercontroller.userSignup)
router.post('/login',usercontroller.userLogin)
router.put('/user-update/:update_id',usercontroller.userUpdate)
router.delete('/user-delete/:delete_id',usercontroller.userDelete)


module.exports = router
