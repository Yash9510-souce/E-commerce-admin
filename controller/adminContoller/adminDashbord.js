const User = require('../../model/user/user')
const Product = require('../../model/product/product')
const Order = require('../../model/order/order')

exports.getDashboard = async (req,res,next) => {
    try {

        const userCount = await User.find().countDocuments()
        const productCount = await Product.find().countDocuments()
        const orders = await Order.find()
     
        let totalProfit = 0;

        orders.forEach(order => {
            let orderProfit = 0;
            order.products.forEach(item => {
                orderProfit += item.product.productPrice * item.quantity * 0.10;
            });
            totalProfit += orderProfit;
        });

        console.log(totalProfit)

        const data = [{
            userCount: userCount,
            productCount: productCount,
            orderCount: orders.length,
            totalProfit:totalProfit
        }]

        res.status(200).json({
            message: "Dashboard fatch sucessfully !",
            data:data,
        })

    } catch(error) {
        res.status(404).json({
            message:error.message
        })
    }
}


exports.getUserdata = async (req,res,next) => {
    try {

        const user = await User.find()
        
        res.status(200).json({
            message: "Userdata fatch sucessfully !",
            data:user,
        })

    } catch(error) {
        res.status(404).json({
            message:error.message
        })
    }
}