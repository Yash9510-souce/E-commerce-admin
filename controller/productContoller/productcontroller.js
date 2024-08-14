const Product = require('../../model/product/product')
const filehelper = require('../../util/removeImageHelper')

exports.getProduct = async (req, res, next) => {
    try {

        const products = await Product.find({ status: 'on' })

        res.status(200).json({
            message: "PRODUCT FETCH SUCCESSFULLY!",
            Product_Data: products
        });

    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

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
        const { productName } = req.query;

        if (!productName) {
            throw new Error("productName is required")
        }

        // Perform a case-insensitive search using a regex
        const products = await Product.find({
            productName: { $regex: productName, $options: 'i' }
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


exports.updateProductStatus = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { status } = req.body;

        // Validate the status
        if (!status || !['on', 'off'].includes(status)) {
            return res.status(400).json({
                message: "Invalid status value. It must be either 'on' or 'off'."
            });
        }

        // Find the product by ID and update its status
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.status = status;
        await product.save();

        res.status(200).json({
            message: "Product status updated successfully!",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};