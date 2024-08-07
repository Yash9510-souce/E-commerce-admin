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
router.get('/product',SECURE_CONTROLLER.ADMIN_JWT,productcontroller.getProduct)
router.post('/add-product',SECURE_CONTROLLER.ADMIN_JWT,upload.single("productImage"),productcontroller.addProduct)
router.put('/product-update/:update_id',SECURE_CONTROLLER.ADMIN_JWT,upload.single("productImage"),productcontroller.updateProduct)
router.delete('/product-delete/:delete_id',SECURE_CONTROLLER.ADMIN_JWT,productcontroller.deleteProduct)

//Admin Product serach and product are eneble or diseble
router.get('/serach',SECURE_CONTROLLER.ADMIN_JWT,productcontroller.searchProducts)
router.patch('/product/:productId/status',SECURE_CONTROLLER.ADMIN_JWT, productcontroller.updateProductStatus);

module.exports = router
