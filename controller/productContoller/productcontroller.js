const Product = require('../../model/product/product')
const filehelper = require('../../util/removeImageHelper')

exports.getProduct = async (req, res, next) => {
    try {

        const products = await Product.find({ status: 'on' })

        res.status(200).json({
            message: "PRODUCT DETAIL FETCH SUCCESSFULLY!",
            data: products
        });

    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

exports.addProduct = async (req,res,next) => {
    try {

        if (!req.file) {
            return res.status(400).json({ 
                message: 'Select The File' 
            });
        }

        const productData = req.body;

        const requiredFields = ['productName', 'productPrice' ,'productDescription'];
        for (const field of requiredFields) {
            if (!productData[field]) {
                throw new Error(`Missing or empty required field: ${field}`);
            }
        }

        const imageUrl = req.file.filename

        const product = await Product.create({
            ...productData,
            productImage:imageUrl,
            adminId:req.adminId
        })
        
        res.status(201).json({
            message: "PRODUCT ADD SUCESSFULLY !",
            data:product
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
            throw new Error("productName Is Required")
        }

        const products = await Product.find({
            productName: { $regex: productName, $options: 'i' }
        });

        if (products.length === 0) {
            throw new Error("No products found")
        }

        res.status(200).json({
            message:"PRODUCT SEARCH SUCESSFULLY!",
            data:products
        });

    } catch (error) {
        res.status(404).json({
            message:error.message
        })
    }
};


exports.updateProduct = async(req,res,next) => {
    try {
        const {productId} = req.params
        let {productName, productPrice, productDescription} = req.body
        
        const updateProduct = await Product.findById(productId)
        if(!updateProduct){
            throw new Error('Product Not Found!')
        }

        if(updateProduct.adminId.toString() !== req.adminId){
            throw new Error('Only Admin Who Created A Product Can Modify It!')
        }

        let productImage = req.body.productImage;

        if (req.file) {
            productImage = req.file.filename;
            let oldImagePath = updateProduct.productImage
            filehelper.clearpath(oldImagePath)
            
        } else {
             res.status(400).json({ 
                message: 'Select The File' 
            });
        }
        
        updateProduct.productName = productName
        updateProduct.productImage = productImage
        updateProduct.productPrice = productPrice
        updateProduct.productDescription = productDescription


        let Update_Product = await updateProduct.save()
        
        res.status(200).json({
            message: "PRODUCT DETAIL UPDTAED SUCESSFULLY !",
            data:Update_Product
        })

    } catch(error) {
        res.status(404).json({
            message:error.message
        })
    }
}


exports.deleteProduct = async (req,res,next) => {
    try {
        const {productId} = req.params

        let Find_Product = await Product.findById(productId)

        if(!Find_Product){
            throw new Error("Product Not found!")
        }

        if(Find_Product.adminId.toString() !== req.adminId){
            throw new Error('Only Admin Who Created A Product Can Remove It!')
        }

        let oldImagePath = Find_Product.productImage
        filehelper.clearpath(oldImagePath)

        let Delete_Product = await Product.findByIdAndDelete(productId)
        
        res.status(200).json({
            message: "PRODUCT DELETED SUCESSFULLY !",
            data:Delete_Product
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
            message: "PRODUCT STATUS UPDATED SUCCESSFULLY !",
            data:product
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};