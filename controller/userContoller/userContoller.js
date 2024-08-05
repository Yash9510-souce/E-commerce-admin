const bcrypt = require('bcryptjs')
const User = require('../../model/user/user')
const jwt = require('jsonwebtoken')

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
            throw new Error("This User Email Are Existing !")
        }

        if (userData.password != userData.confirm_password) {
            throw new Error("PASSWORD AND CONFIRM PASSWORD NOT Match !");
        }

        const hasspassword = await bcrypt.hash(userData.password,12)

        const USER_REGISTER = await User.create({ 
            ...userData,
            password:hasspassword
         })

        res.status(201).json({
            message: "USER REGISTRATION SUCESSFULLY !",
            User:USER_REGISTER
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
            throw new Error("PLESE ENTER ALL THE FIELDS !");
        }

        const user = await User.findOne({ email:email })
        if(!user){
            throw new Error("User Not Found!")
        }

        const doMatch = await bcrypt.compare(password,user.password)
        if(!doMatch){
            throw new Error("Email and Password dose not Match!")
        }

        const Token = jwt.sign({
            _id: user._id
        }
        ,process.env.JWT_SECRET_KEY_USER,
        { expiresIn: '3h' })

        res.status(200).json({
            message: "USER LOGIN SUCESSFULLY !",
            role:user,
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
        const {update_id} = req.params
        const {userName,email,password} = req.body

        let Find_User = await User.findById(update_id)
        if(!Find_User){
            throw new Error("User Not Found!")
        }

        const hasspassword = await bcrypt.hash(password,12)

        Find_User.userName = userName
        Find_User.email = email
        Find_User.password = hasspassword

        let Update_User = await Find_User.save()
        
        res.status(200).json({
            message: "USER UPDTAED SUCESSFULLY !",
            UpdateUser:Update_User
        })

    } catch(error) {
        res.status(404).json({
            message:error.message
        })
    }
}



exports.userDelete = async (req,res,next) => {
    try {
        const {delete_id} = req.params

        let Find_User = await User.findById(delete_id)

        if(!Find_User){
            throw new Error("Not Found User For Deletion!")
        }

        let Delete_User = await User.findByIdAndDelete(delete_id)
        
        res.status(200).json({
            message: "USER DELETED SUCESSFULLY !",
            delete_user:Delete_User
        })

    } catch(error) {
        res.status(404).json({
            message:error.message
        })
    }
}