const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        address:{
            address: String,
            city: String,
            state: String,
            country:String,
            postal_code: Number
        },
        role:{
            type:String,
            default:"User"
        },
        cart:{
          items:[
                {
                  productId: {
                    type: Schema.Types.ObjectId,
                    ref:'product',
                    required:true
                  },
                  quantity:{
                    type: Number,
                    required: true
                   }
                }
            ]
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('user',userSchema);