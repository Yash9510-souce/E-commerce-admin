const User = require('../../model/user/user')
const Order = require('../../model/order/order')
const path = require('path')
const fs = require('fs')
const PDFDocument = require('pdfkit');
const niceInvoice = require('nice-invoice');


exports.postCartOrder = async (req,res,next) => {
    try{

        const user = await User.findById(req.userId).populate('cart.items.productId');
        if (!user) {
            throw new Error("Login first!")
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
            message:"Order placed sucessfully!",
            data:ordersave
           })

        } else {
            throw new Error("Failed to place order")
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

        res.status(200).json({
            message:"Order data fatch sucessfully!",
            data:order
        })

    } catch(error) {

        res.status(404).json({
            message:error.message
        })

    }
}

exports.deleteOrder = async (req,res,next) => {
    try {
        const {orderId} = req.params

        let order = await Order.findById(orderId)

        if(!order){
            throw new Error("Order not found!")
        }

        let Order_Product = await Order.findByIdAndDelete(orderId)
        
        res.status(200).json({
            message: "Order deleted sucessfully!",
            data:Order_Product
        })

    } catch(error) {
        res.status(404).json({
            message:error.message
        })
    }
}


exports.generateInvoice = async(req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);
        const user = await User.findById(req.userId);

        if (!user) {
            throw new Error("Login first!");
        }

        let date = new Date();
        let currentmonth = date.getMonth() + 1;
        let dueyear = date.getFullYear() + 1
        let currentdate = date.getDate().toString().padStart(2, '0') + '-' + currentmonth.toString().padStart(2, '0') + '-' + date.getFullYear();
        let validitidate =  date.getDate().toString().padStart(2, '0') + '-'  + currentmonth.toString().padStart(2, '0') + '-' + dueyear

        let subtotal = 0;
        order.products.forEach(product => {
            subtotal += product.product.productPrice * product.quantity;
        });

        const taxRate = 0.20; 
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        const InvoiceName = 'Invoice-' + user.userName + '-' + orderId + '.pdf';
        const invoicefolder = path.join(__dirname, '..', '..', 'Customer_Invoice');

        if (!fs.existsSync(invoicefolder)) {
            fs.mkdirSync(invoicefolder, { recursive: true });
        }

        const invoicePath = path.join(invoicefolder, InvoiceName);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + InvoiceName + '"');

        const doc = new PDFDocument({ size: 'A4', margin: 50 });

        doc.pipe(fs.createWriteStream(invoicePath));

        doc.image('C:/Users/adimin/Documents/E-commerce project/assets/company_logo/Screenshot 2024-08-07 171423.png', 50, 45, { width: 50 })
           .moveDown();

        doc
          .fontSize(20)
          .text('Deals', 110, 57)
          .moveDown();

        doc
          .fontSize(10)
          .text(`Invoice No: ${orderId}`, { align: 'right' },50, 57)
          .text(`Date: ${currentdate}`, { align: 'right' },75, 57)
          .text(`Due: ${validitidate}`, { align: 'right' },90, 57)

        doc
          .text(`Deals Pvt Ltd`, 50, 150)
          .text(`Contact: +91 90990-88451`, 50, 165)
          .text(`VAT: 24AAACC1206D1ZM`, 50, 180)
          .text(`Address: 100, Sunday Hub ,`, 50, 195)
          .text(`1th Floor Vesu Surat 395011`, 50, 210)
          .text(`Surat 395011`, 50, 210)

        doc
          .text(`Customer: ${user.userName}`, 380, 150)
          .text(`E-Mail: ${user.email}`, 380, 165)
          .text(`Address: ${user.address.address}`, 380, 180)
          .text(`${user.address.city}, ${user.address.state}`, 380, 195)
          .text(`${user.address.country} - ${user.address.postal_code}`, 380, 210)
          .moveDown();
      
        doc
          .moveDown()
          .text('Product details', 50, 250)
          .text('Price', 200, 250)
          .text('Qty.', 250, 250)
          .text('VAT', 300, 250)
          .text('Subtotal', 350, 250)
          .text('Subtotal + VAT', 400, 250);

        let position = 270;

        order.products.map((item, index) => {
            doc.text(`${index + 1}. ${item.product.productName}`, 50, position)
               .text(`₹${item.product.productPrice}`, 200, position)  // Corrected 'price' to 'productPrice'
               .text(`${item.quantity}`, 250, position)
               .text(`20%`, 300, position)
               .text(`₹${item.product.productPrice * item.quantity}`, 350, position)  // Corrected to show actual subtotal
               .text(`₹${(item.product.productPrice * item.quantity) * (1 + taxRate)}`, 400, position); // Corrected to include VAT
            position += 20;
        });

        doc
          .text(`Net Total:`, 350, position + 20)
          .text(`₹${subtotal}`, 400, position + 20);

        doc
          .text(`VAT Total:`, 350, position + 40)
          .text(`₹${tax}`, 400, position + 40);

        doc
          .fontSize(14)
          .text(`Total:`, 350, position + 60)
          .text(`₹${total}`, 400, position + 60);

        doc
          .moveDown()
          .text('Notes', 50, position + 100)
          .text('Save This Invoice Without Invoice Your Product not exchange and not return', 50, position + 115);

        doc.end();

    } catch(error) {
        res.status(404).json({
            message: error.message
        });
    }
};


// exports.getinvoice = async(req,res,next) => {
//     try{

//         const orderId = req.params.orderId;

//         const order = await Order.findById(orderId)

//         const user = await User.findById(req.userId)
//         if(!user){
//             throw new Error("Login first!")
//         }

//         let date = new Date()
//         let currentmonth = date.getMonth() + 1
//         let dueyear = date.getFullYear() + 1
//         let currentdate =   date.getDate().toString().padStart(2, '0') + '-'  + currentmonth.toString().padStart(2, '0') + '-' + date.getFullYear()
//         let validitidate =  date.getDate().toString().padStart(2, '0') + '-'  + currentmonth.toString().padStart(2, '0') + '-' + dueyear

//         let subtotal = 0;
//         order.products.forEach(product => {
//             subtotal += product.product.productPrice * product.quantity;
//         });

//         const taxRate = 0.10; 
//         const tax = subtotal * taxRate;
//         const total = subtotal + tax;

//         const InvoiceName = 'Invoice-' + user.userName + '-' + orderId + '.pdf';

//         res.setHeader('Content-Type','application/pdf');
//         res.setHeader('Content-Disposition', 'inline; filename="'+ InvoiceName +'"');

//         const invoicefolder = path.join(__dirname,'..','..','Cutomer_Invoice',InvoiceName)

//         const invoiceDetail = {
//             shipping: {
//               name: user.userName,
//               address: user.address.address,
//               city: user.address.city,
//               state: user.address.state,
//               country: user.address.country,
//               postal_code: user.address.postal_code
//             },
//             items: order.products.map(product => ({
//                 item: product.product.productName,
//                 description: product.product.productDescription,
//                 quantity: product.quantity,
//                 tax: "10%",
//                 price: product.product.productPrice
//             })),
//             subtotal: subtotal,
//             total: total,
//             order_number: orderId,
//             header:{
//                 company_name: "Deals",
//                 company_logo: "C:/Users/adimin/Documents/E-commerce project/assets/company_logo/Screenshot 2024-08-07 171423.png",
//                 company_address: "Deals. 100 Sunday Hub  1th Floor  Vesu Surat 395011",
//                 company_contact:"+91 90990-88451",
//             },
//             footer:{
//               text: "Save This Invoice Without Invoice Your Product not exchange and not return"
//             },
//             currency_symbol:"$", 
//             date: {
//               billing_date:currentdate ,
//               due_date: validitidate
//             }
//         };
        
//         niceInvoice(invoiceDetail, invoicefolder);

//         res.status(200).json({
//             message:"Invoice create"
//         })
//     } catch(error) {
//         res.status(404).json({
//             message:error.message
//         })

//     }
// }


