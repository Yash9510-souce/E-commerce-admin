const express = require('express')
const SECURE_CONTROLLER = require('../middlwere/jwt')
const admincontroller = require('../controller/adminContoller/admincontroller')
const adminDashbordController = require('../controller/adminContoller/adminDashbord')

const router = express.Router()

//Admin signup and login and update password only
router.post('/admin/signup',admincontroller.adminSignup)
router.post('/admin/login',admincontroller.adminLogin)
router.put('/admin/admin-update/:adminId',admincontroller.adminUpdate)

//Admin DashBorad
router.get('/admin/admin_dashboard',SECURE_CONTROLLER.ADMIN_JWT,adminDashbordController.getDashboard)
router.get('/admin/user_data',SECURE_CONTROLLER.ADMIN_JWT,adminDashbordController.getUserdata)


module.exports = router
