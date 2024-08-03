const express = require('express')
const SECURE_CONTROLLER = require('../middlwere/jwt')
const admincontroller = require('../controller/adminContoller/admincontroller')

const router = express.Router()

//Admin signup and login
router.get('/user_dashbord',SECURE_CONTROLLER.ADMIN_JWT,admincontroller.getDashboard )
router.post('/signup',admincontroller.adminSignup)
router.post('/login',admincontroller.adminLogin)


module.exports = router
