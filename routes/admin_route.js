const express = require('express')
const SECURE_CONTROLLER = require('../middlwere/jwt')
const admincontroller = require('../controller/adminContoller/admincontroller')
const adminDashbordController = require('../controller/adminContoller/adminDashbord')

const router = express.Router()

//Admin signup and login and update password only
router.post('/signup',admincontroller.adminSignup)
router.post('/login',admincontroller.adminLogin)
router.put('/admin-update/:update_id',admincontroller.adminUpdate)

//Admin DashBorad
router.get('/admin_dashboard',SECURE_CONTROLLER.ADMIN_JWT,adminDashbordController.getDashboard)


module.exports = router
