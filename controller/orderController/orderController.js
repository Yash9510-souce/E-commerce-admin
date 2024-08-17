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
        const order = await Order.findById(orderId)
        const user = await User.findById(order.user.userId);
        console.log(user)

        if (!user) {
            throw new Error("Login first!");
        }

        let date = new Date();

        let currentmonth = date.getMonth() + 1;
        let dueyear = date.getFullYear() + 1
        let currentdate = date.getDate().toString().padStart(2, '0') + '-' + currentmonth.toString().padStart(2, '0') + '-' + date.getFullYear();
        let validitidate =  date.getDate().toString().padStart(2, '0') + '-'  + currentmonth.toString().padStart(2, '0') + '-' + dueyear


        const InvoiceName = 'Invoice-' + orderId + '.pdf';
        const invoicefolder = path.join(__dirname, '..', '..', 'Customer_Invoice');

        if (!fs.existsSync(invoicefolder)) {
            fs.mkdirSync(invoicefolder, { recursive: true });
        }

        let subtotal = 0;
        order.products.forEach(product => {
            subtotal += product.product.productPrice * product.quantity;
        });

        const taxRate = 0.20; 
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

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
          .text(`Billing Date: ${currentdate}`, { align: 'right' },75, 57)
          .text(`Due Date: ${validitidate} `, { align: 'right' },90, 57)


        doc
         .rect(0, 130, 720, 100)  
         .fillColor('#F1F6F9')  
         .fill();

        doc
          .fillColor('black')
          .text(`Deals Pvt Ltd`, 50, 150)
          .text(`Contact: +91 90990 88451`, 50, 165)
          .text(`VAT:  24AAACC1206D1ZM`, 50, 180)
          .text(`Address:  100, Sunday Hub , Vesu`, 50, 195)
          .text(`Surat , Gujarat , India - 395011`, 50, 210)

        doc
          .fillColor('black')
          .lineGap(2)
          .text(`Customer:  ${user.userName}`, 380, 150)
          .text(`E-Mail:  ${order.user.email}`, 380, 165)
          .text(`Address: ${user.address.address} , ${user.address.city} , ${user.address.state} , ${user.address.country} - ${user.address.postal_code}`, 380, 180,)
          .moveDown();


        doc
          .fontSize(10)
          .fillColor('#6A50FF')
          .moveDown()
          .text('No',50,250)
          .text('Product details', 75, 250)
          .text('Unit-Price', 225, 250)
          .text('Qty',285, 250)
          .text('Net Amount',320, 250)
          .text('VAT', 385, 250)
          .text('VAT Amount', 420, 250)
          .text('Total Amount', 485, 250)

        doc
          .moveTo(50, 265)
          .lineTo(550, 265) 
          .strokeColor('#6A50FF') 
          .lineWidth(1) 
          .stroke();

        doc
          .fontSize(10)
          .fillColor('black');

        let position = 275;

    

        order.products.map((item, index) => {

            const itemTotal = item.product.productPrice * item.quantity;
            const itemVAT = itemTotal * 0.20; 

            doc.text(`${index + 1}`, 55, position)
               .text(`${item.product.productName}`, 75, position)
               .text(`$${item.product.productPrice}`, 230, position) 
               .text(`${item.quantity}`, 290, position)
               .text(`$${itemTotal}`, 325, position) 
               .text(`20%`, 385, position) 
               .text(`$${itemVAT}`, 430, position) 
               .text(`$${itemTotal + itemVAT}`, 495, position) 
            
            doc
              .moveTo(50, position + 15) 
              .lineTo(550, position + 15)  
              .strokeColor('#D3D3D3')      
              .lineWidth(0.5)              
              .stroke();
              
            position += 25;
        });


        doc
          .text(`NET Total: ${subtotal}`, 450, position + 0)

          doc
            .moveTo(450, position + 15) 
            .lineTo(550, position + 15)  
            .strokeColor('#D3D3D3')      
            .lineWidth(0.5)              
            .stroke();
 

        doc
          .text(`VAT Total: ${tax}`, 450, position + 25)

        doc
            .moveTo(450, position + 40) 
            .lineTo(550, position + 40)  
            .strokeColor('#D3D3D3')      
            .lineWidth(0.5)              
            .stroke();


        doc
          .rect(450, 400, 100, 30) 
          .fillColor('#8576FF')  
          .fill();

        doc
          .fontSize(14)
          .fillColor('white')
          .text(`Total:${total} `, 460, position + 60)

        doc
          .fontSize(10)
          .fillColor('black')
          .moveDown()
          .text('Notes : Save This Invoice Without Invoice Your Product not exchange and not return', 50, position + 400,{
            align:'center'
          })

        doc.end();


    } catch(error) {
        res.status(404).json({
            message: error.message
        });
    }
};





