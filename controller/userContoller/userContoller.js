const bcrypt = require('bcryptjs')
const User = require('../../model/user/user')
const Product = require('../../model/product/product')
const jwt = require('jsonwebtoken');

exports.getProduct = async (req, res, next) => {
    try {

        const products = await Product.find({ status: 'on' })

        res.status(200).json({
            message: "Product fatch successfully!",
            data: products
        });

    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

exports.userSignup = async (req,res,next) => {
    try {
        const userData = req.body;

        const requiredFields = ['userName', 'email', 'password', 'confirm_password'];
        for (const field of requiredFields) {
            if (!userData[field]) {
                throw new Error(`Missing or empty required field: ${field}`);
            }
        }

        const AlUser = await User.findOne({ email:userData.email })
        if(AlUser){
            throw new Error("This email are existing!")
        }

        if (userData.password != userData.confirm_password) {
            throw new Error("Password's not match!");
        }

        const hasspassword = await bcrypt.hash(userData.password,12)

        const USER_REGISTER = await User.create({ 
            ...userData,
            password:hasspassword,
            cart:{items:[]}
         })

        res.status(201).json({
            message: "User registration sucessfully!",
            data:USER_REGISTER
        })

    } catch(error) {
        res.status(404).json({
            message:error.message
        })
    }
}


exports.userLogin = async (req,res,next) => {
    try {
        const { email,password } = req.body

        if(!email || !password){
            throw new Error("Plese enter all the fields!");
        }

        const user = await User.findOne({ email:email })
        if(!user){
            throw new Error("User not found!")
        }

        const doMatch = await bcrypt.compare(password,user.password)
        if(!doMatch){
            throw new Error("Email and password dose not match!")
        }

        const Token = jwt.sign({
            userId: user._id
        }
        ,process.env.JWT_SECRET_KEY_USER,
        { expiresIn: '3h' })

        res.status(200).json({
            message: "USER login sucessfully !",
            data:user,
            Token:Token
        })

    } catch(error) {
        res.status(404).json({
            message:error.message
        })
    }
}


exports.userUpdate = async (req,res,next) => {
    try {
        const {userId} = req.params
        const {userName,email,password} = req.body

        let Find_User = await User.findById(userId)
        if(!Find_User){
            throw new Error("User not found!")
        }

        const hasspassword = await bcrypt.hash(password,12)

        Find_User.userName = userName
        Find_User.email = email
        Find_User.password = hasspassword

        let Update_User = await Find_User.save()
        
        res.status(200).json({
            message: "User updated sucessfully!",
            data:Update_User
        })

    } catch(error) {
        res.status(404).json({
            message:error.message
        })
    }
}



exports.userDelete = async (req,res,next) => {
    try {
        const {userId} = req.params

        let Find_User = await User.findById(userId)

        if(!Find_User){
            throw new Error("User not found!")
        }

        let Delete_User = await User.findByIdAndDelete(userId)
        
        res.status(200).json({
            message: "User delete sucessfully!",
            data:Delete_User
        })

    } catch(error) {
        res.status(404).json({
            message:error.message
        })
    }
}