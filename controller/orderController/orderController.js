const User = require('../../model/user/user')
const Order = require('../../model/order/order')
const path = require('path')
const niceInvoice = require('nice-invoice');

exports.postCartOrder = async (req,res,next) => {
    try{

        const user = await User.findById(req.userId).populate('cart.items.productId');
        if (!user) {
            throw new Error("Only Authorized User!")
        }

        const product = user.cart.items.map(i => {
            return { quantity:i.quantity , product: { ...i.productId._doc } }
        })

        const order = new Order({
            user:{
                email: user.email,
                userId: req.userId
            },
            products:product
        })

        const ordersave = await order.save()

        if(ordersave){
           user.cart.items = []
           await user.save()

           res.status(200).json({
            message:"ORDER PLACED SUCESSFULLY !",
            orderDetail:order
           })

        } else {
            throw new Error("Failed To place Order")
        }

    } catch (error) {
        res.status(404).json({
            message:error.message
        })
    }
}


exports.getOrder = async(req,res,next) => {
    try{

        const order = await Order.find({'user.userId':req.userId})
        console.log(order)

        res.status(200).json({
            message:"ORDER DATA FATECH SUCESSFULLY",
            orderData:order
        })

    } catch(error) {

        res.status(404).json({
            message:error.message
        })

    }
}


exports.getinvoice = async(req,res,next) => {
    try{

        const orderId = req.params.orderId;

        const order = await Order.findById(orderId)

        const user = await User.findById(req.userId)
        if(!user){
            throw new Error("Only Authorized User")
        }

        let date = new Date()
        let currentmonth = date.getMonth() + 1
        let dueyear = date.getFullYear() + 1
        let currentdate =   date.getDate().toString().padStart(2, '0') + '-'  + currentmonth.toString().padStart(2, '0') + '-' + date.getFullYear()
        let validitidate =  date.getDate().toString().padStart(2, '0') + '-'  + currentmonth.toString().padStart(2, '0') + '-' + dueyear

        let subtotal = 0;
        order.products.forEach(product => {
            subtotal += product.product.productPrice * product.quantity;
        });

        const taxRate = 0.10; // 10% tax
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        const InvoiceName = 'Invoice-' + user.userName + '-' + orderId + '.pdf';

        const invoicefolder = path.join(__dirname,'..','..','Cutomer_Invoice',InvoiceName)

        const invoiceDetail = {
            shipping: {
              name: user.userName,
              address: user.address.address,
              city: user.address.city,
              state: user.address.state,
              country: user.address.country,
              postal_code: user.address.postal_code
            },
            items: order.products.map(product => ({
                item: product.product.productName,
                description: product.product.productDescription,
                quantity: product.quantity,
                tax: "10%",
                price: product.product.productPrice
            })),
            subtotal: subtotal,
            total: total,
            order_number: orderId,
            header:{
                company_name: "Deals",
                company_logo: "C:/Users/adimin/Documents/E-commerce project/assets/company_logo/Screenshot 2024-08-07 171423.png",
                company_address: "Deals. 100 Sunday Hub  1th Floor  Vesu Surat 395011",
                company_contact:"+91 90990-88451",
            },
            footer:{
              text: "Save This Invoice Without Invoice Your Product not exchange and not return"
            },
            currency_symbol:"$", 
            date: {
              billing_date:currentdate ,
              due_date: validitidate
            }
        };
        
        niceInvoice(invoiceDetail, invoicefolder);

        res.status(200).json({
            message:"invoice create"
        })
    } catch(error) {
        res.status(404).json({
            message:error.message
        })

    }
}