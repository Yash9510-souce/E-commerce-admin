const User = require('../../model/user/user')
const Product = require('../../model/product/product')

exports.getDashboard = async (req,res,next) => {
    try {

        const user = await User.find().countDocuments()
        const product = await Product.find().countDocuments()
        console.log(product)

        res.status(200).json({
            message: "User Data FATCH SUCESSFULLY !",
            userDataCount:user,
            productCount:product
        })

    } catch(error) {
        res.status(404).json({
            message:error.message
        })
    }
}