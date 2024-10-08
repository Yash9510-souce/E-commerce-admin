const Product = require('../../model/product/product')
const FileuploadTofirbase = require('../../middlwere/multerUpload')

exports.getProduct = async (req, res, next) => {
    try {

        const products = await Product.find({ status: 'on' })

        res.status(200).json({
            message: "Product detail fetch successfully!",
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

        const productData = req.body;

        const requiredFields = ['productName', 'productPrice' ,'productDescription'];
        for (const field of requiredFields) {
            if (!productData[field]) {
                throw new Error(`Missing or empty required field: ${field}`);
            }
        }

        const imageUrl = req.file
        if(!imageUrl){
            return res.status(400).json({ 
                message: 'Select The File' 
            });
        }

        const certificateDownloadURL = await FileuploadTofirbase.uploadCertifiesToFierbase(imageUrl)

        const product = await Product.create({
            ...productData,
            productImage:certificateDownloadURL,
            adminId:req.adminId
        })
        
        res.status(201).json({
            message: "Product add successfully!",
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
            throw new Error("Product name required!")
        }

        const products = await Product.find({
            productName: { $regex: productName, $options: 'i' }
        });

        if (products.length === 0) {
            throw new Error("Products not found!")
        }

        res.status(200).json({
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
            throw new Error('Product not found!')
        }

        if(updateProduct.adminId.toString() !== req.adminId){
            throw new Error('Only authorized!')
        }

        let newImage = req.file

        if (newImage) {
            
            if(updateProduct.productImage){
                await FileuploadTofirbase.deleteFileFromFirebase(updateProduct.productImage)
            }

            const newAvtarUrl = await FileuploadTofirbase.uploadCertifiesToFierbase(newImage) 

            updateProduct.productImage = newAvtarUrl
            
        } else {
             res.status(400).json({ 
                message: 'Select the file' 
            });
        }
        
        updateProduct.productName = productName
        updateProduct.productPrice = productPrice
        updateProduct.productDescription = productDescription


        let Update_Product = await updateProduct.save()
        
        res.status(200).json({
            message: "Product update sucessfully!",
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
            throw new Error("Product not found!")
        }

        if(Find_Product.adminId.toString() !== req.adminId){
            throw new Error('Only authorized!')
        }

        let existingimage = Find_Product.productImage
        await FileuploadTofirbase.deleteFileFromFirebase(existingimage)

        let Delete_Product = await Product.findByIdAndDelete(productId)
        
        res.status(200).json({
            message: "Product delete sucessfully!",
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
                message: "Invalid status value only [on/off]."
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
            message: "Product status update sucessfully!",
            data:product
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};