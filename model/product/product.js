const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PRODUCT_SCHEMA = new Schema({
    productName: {
        type: String,
        required: true
    },
    productImage: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },
    adminId:{
          type: Schema.Types.ObjectId,
          ref:"admin",
          required:true
        }
})

module.exports = mongoose.model("product", PRODUCT_SCHEMA);