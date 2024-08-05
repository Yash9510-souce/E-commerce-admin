const Product = require('../../model/product/product')
const User = require('../../model/user/user')

exports.addToCart = async (req,res,next) => {
    try{
    const { product_id } = req.params
    let { quantity } = req.body

    if (!quantity) {
        throw new Error("Invalid Quantity!")
    }

    const product = await Product.findById(product_id)
    if(!product){
        throw new Error("No Found Product")
    }

    const user = await User.findById(req.userId)
    if(!user){
        throw new Error("Only Authorized User")
    }

    const cartproduct = user.cart.findIndex(cp => cp.product.toString() === product_id)
    if(cartproduct >= 0){
        user.cart[cartproduct].quantity + 1;
        console.log(user.cart[cartproduct].quantity += quantity)
    } else {
        user.cart.push({ product:product_id,quantity:quantity })
    }

    await user.save()

    res.status(200).json({
        message:"ADD TO CART PRODUCT SUCESSFULLY!",
        cart:user.cart
    })

   } catch(error) {
      res.status(404).json({
         message:error.message
      })
   }
}


exports.getCart = async (req, res, next) => {
    try {

        const user = await User.findById(req.userId).populate('cart.product');
        if (!user) {
            throw new Error("User Not Authorized!")
        }

        res.status(200).json({
            message:"USER CART DATA SUCESSFULLY ",
            cart: user.cart
        });

    } catch (error) {
        res.status(404).json({
            message:error.message
         })
    }
};


exports.deleteCart = async (req, res, next) => {
    try {
        const { cart_id } = req.params;

        if (!cart_id) {
            throw new Error("Cart Id Is Required !");
        }

        const user = await User.findById(req.userId);
        if (!user) {
            throw new Error("User not authorized !");
        }

        const cartItemIndex = user.cart.findIndex(item => item._id.toString() === cart_id);

        if (cartItemIndex === -1) {
            throw new Error("Cart item not found !");
        }

        user.cart.splice(cartItemIndex, 1);


        await user.save();

        res.status(200).json({ 
            message: 'Product removed from cart successfully', 
            cart: user.cart 
        });
    } catch (error) {
        res.status(404).json({
            message:error.message
         })
    }
};
