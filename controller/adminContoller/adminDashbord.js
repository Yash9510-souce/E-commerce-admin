const User = require('../../model/user/user')
const Product = require('../../model/product/product')
const Order = require('../../model/order/order')

exports.getDashboard = async (req,res,next) => {
    try {

        const user = await User.find().countDocuments()
        const product = await Product.find().countDocuments()
        const order = await Order.find().countDocuments()

        const data = {
            UserCount:user,
            ProductCount:product,
            OrderCount:order
        }

        res.status(200).json({
            message: "DASHBOARD FATCH SUCESSFULLY !",
            data:data,
        })

    } catch(error) {
        res.status(404).json({
            message:error.message
        })
    }
}