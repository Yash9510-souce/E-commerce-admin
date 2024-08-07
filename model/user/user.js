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
        cart:{
          items:[
                {
                  product: {
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