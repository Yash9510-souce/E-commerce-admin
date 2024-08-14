const express = require('express')
const SECURE_CONTROLLER = require('../middlwere/jwt')
const path = require('path')
const multer = require('multer');
const productcontroller = require('../controller/productContoller/productcontroller')

const router = express.Router()

const storage = multer.diskStorage({
    destination: function(req,file,cb) {
      const uploadpath = path.join(__dirname,'..','assets','Product_image')
      cb(null,uploadpath)
    },
    filename: function(req,file,cb){
      const filename = new Date().getTime() + '-' + file.originalname
      cb(null,filename)
    }
})

const fileFilter = (req, file, cb) => {
      const allowedMimes = ["image/jpeg", "image/png", "image/jpg"];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type. Only image files are allowed."));
      }
}

const upload = multer({ storage:storage,fileFilter:fileFilter })

//Admin Product
router.get('/admin/product',SECURE_CONTROLLER.ADMIN_JWT,productcontroller.getProduct)
router.post('/admin/add-product',SECURE_CONTROLLER.ADMIN_JWT,upload.single("productImage"),productcontroller.addProduct)
router.put('/admin/product-update/:productId',SECURE_CONTROLLER.ADMIN_JWT,upload.single("productImage"),productcontroller.updateProduct)
router.delete('/admin/product-delete/:productId',SECURE_CONTROLLER.ADMIN_JWT,productcontroller.deleteProduct)

//Admin Product serach and product are eneble or diseble
router.get('/admin/serachProduct',SECURE_CONTROLLER.ADMIN_JWT,productcontroller.searchProducts)
router.patch('/admin/product/:productId/status',SECURE_CONTROLLER.ADMIN_JWT, productcontroller.updateProductStatus);

module.exports = router
