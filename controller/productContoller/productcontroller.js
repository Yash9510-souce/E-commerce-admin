const Product = require('../../model/product/product')
const filehelper = require('../../util/removeImageHelper')

exports.getProduct = async (req,res,next) => {
    try {

        const products = await Product.find().populate('adminId')

        res.status(200).json({
            message: "PRODUCT FATCH SUCESSFULLY !",
            Product_Data:products
        })

    } catch(error) {
        res.status(404).json({
            message:error.message
        })
    }
}


exports.addProduct = async (req,res,next) => {
    try {
        console.log('Received file:', req.file); 
        console.log('Received body:', req.body); 

        if (!req.file) {
            return res.status(400).json({ message: 'Select the File' });
        }

        const productData = req.body;

        const requiredFields = ['productName', 'productPrice' ,'productDescription'];
        for (const field of requiredFields) {
            if (!productData[field]) {
                throw new Error(`Missing or empty required field: ${field}`);
            }
        }

        const imageUrl = req.file.filename
        console.log(imageUrl)

        const product = await Product.create({
            ...productData,
            productImage:imageUrl,
            adminId:req.adminId
        })
        
        res.status(201).json({
            message: "PRODUCT ADD SUCESSFULLY !",
            productData:product
        })

    } catch (error) {
        res.status(404).json({
            message:error.message
        })
    }
}


exports.searchProducts = async (req, res, next) => {
    try {
        const { keyword } = req.query;

        if (!keyword) {
            throw new Error("Keyword is required")
        }

        // Perform a case-insensitive search using a regex
        const products = await Product.find({
            productName: { $regex: keyword, $options: 'i' }
        });

        if (products.length === 0) {
            throw new Error("No products found")
        }

        res.status(200).json({
            message:"PRODUCT SEARCH SUCESSFULLY!",
            serach_pro:products
        });

    } catch (error) {
        res.status(404).json({
            message:error.message
        })
    }
};


exports.updateProduct = async(req,res,next) => {
    try {
        const {update_id} = req.params
        let {productName, productPrice, productDescription} = req.body
        
        const updateProduct = await Product.findById(update_id)
        if(!updateProduct){
            throw new Error('Product Not Found!')
        }

        if(updateProduct.adminId.toString() !== req.adminId){
            throw new Error('You are not Modifiyng this Product!')
        }

        let productImage = req.body.productImage;

        if (req.file) {
            productImage = req.file.filename;
            console.log(`New file uploaded: ${productImage}`);
            let oldImagePath = updateProduct.productImage
            filehelper.clearpath(oldImagePath)
            
        } else {
            console.log(`No new file uploaded, keeping existing image: ${productImage}`);
        }
        
        updateProduct.productName = productName
        updateProduct.productImage = productImage
        updateProduct.productPrice = productPrice
        updateProduct.productDescription = productDescription


        let Update_Product = await updateProduct.save()
        
        res.status(200).json({
            message: "PRODUCT UPDTAED SUCESSFULLY !",
            UpdateProduct:Update_Product
        })

    } catch(error) {
        res.status(404).json({
            message:error.message
        })
    }
}


exports.deleteProduct = async (req,res,next) => {
    try {
        const {delete_id} = req.params

        let Find_Product = await Product.findById(delete_id)

        if(!Find_Product){
            throw new Error("Product Not found!")
        }

        if(Find_Product.adminId.toString() !== req.adminId){
            throw new Error('You are not Remove this Product!')
        }

        let oldImagePath = Find_Product.productImage
        filehelper.clearpath(oldImagePath)

        let Delete_Product = await Product.findByIdAndDelete(delete_id)
        
        res.status(200).json({
            message: "USER DELETED SUCESSFULLY !",
            delete_product:Delete_Product
        })

    } catch(error) {
        res.status(404).json({
            message:error.message
        })
    }
}