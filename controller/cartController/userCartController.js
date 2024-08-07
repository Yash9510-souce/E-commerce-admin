const Product = require('../../model/product/product')
const User = require('../../model/user/user')

exports.addToCart = async (req,res,next) => {
    try{
    const { product_id } = req.params
    let { quantity = 1 } = req.body


    const product = await Product.findById(product_id)
    if(!product){
        throw new Error("No Found Product")
    }

    const user = await User.findById(req.userId)
    if(!user){
        throw new Error("Only Authorized User")
    }

    const cartproduct = user.cart.items.findIndex(cp => cp.productId.toString() === product_id)

    if (cartproduct >= 0) {
        if (quantity === 0) {
          user.cart.items.splice(cartproduct, 1);
        } else {
          user.cart.items[cartproduct].quantity = quantity;
        }
      } else {
          user.cart.items.push({ productId: product_id, quantity:quantity })
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

        const user = await User.findById(req.userId).populate('cart.items.productId');
        if (!user) {
            throw new Error("Only Authorized User!")
        }

        const cartcount =  user.cart.items.length;

        res.status(200).json({
            message:"USER CART DATA FATCH SUCESSFULLY ",
            cart: user.cart,
            cart_items:cartcount
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

        const cartItemIndex = user.cart.items.findIndex(item => item._id.toString() === cart_id);

        if (cartItemIndex === -1) {
            throw new Error("Cart item not found !");
        }

        user.cart.items.splice(cartItemIndex, 1);


        await user.save();

        res.status(200).json({ 
            message:'Product removed from cart successfully', 
            cart: user.cart.items
        });
    } catch (error) {
        res.status(404).json({
            message:error.message
         })
    }
};
