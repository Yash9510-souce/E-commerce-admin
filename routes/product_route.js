const express = require('express')
const SECURE_CONTROLLER = require('../middlwere/jwt')
const productcontroller = require('../controller/productContoller/productcontroller')
const FileuploadTofirbase = require('../middlwere/multerUpload')

const uploadimage = FileuploadTofirbase.uploadMulter.single("productImage")

const router = express.Router()


//Admin Product
router.get('/admin/product',SECURE_CONTROLLER.ADMIN_JWT,productcontroller.getProduct)
router.post('/admin/add-product',SECURE_CONTROLLER.ADMIN_JWT,uploadimage,productcontroller.addProduct)
router.put('/admin/product-update/:productId',SECURE_CONTROLLER.ADMIN_JWT,uploadimage,productcontroller.updateProduct)
router.delete('/admin/product-delete/:productId',SECURE_CONTROLLER.ADMIN_JWT,productcontroller.deleteProduct)

//Admin Product serach and product are eneble or diseble
router.get('/admin/serachProduct',SECURE_CONTROLLER.ADMIN_JWT,productcontroller.searchProducts)
router.patch('/admin/product/:productId/status',SECURE_CONTROLLER.ADMIN_JWT, productcontroller.updateProductStatus);

module.exports = router
