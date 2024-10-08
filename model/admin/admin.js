const mongoose = require('mongoose')

const Schema = mongoose.Schema

const adminSchema = new Schema(
    {
        adminName: {
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
        role:{
            type:String,
            default:"Admin"
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('admin',adminSchema);