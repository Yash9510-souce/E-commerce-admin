const bcrypt = require('bcryptjs')
const Admin = require('../../model/admin/admin')
const jwt = require('jsonwebtoken')


exports.adminSignup = async (req,res,next) => {
    try {
        const adminData = req.body;

        const requiredFields = ['adminName', 'email', 'password', 'confirm_password'];
        for (const field of requiredFields) {
            if (!adminData[field]) {
                throw new Error(`Missing or empty required field: ${field}`);
            }
        }

        const Aladmin = await Admin.findOne({email:adminData.email})
        if(Aladmin){
            throw new Error("This admin email are existing ! try diffrent one")
        }

        if (adminData.password != adminData.confirm_password) {
            throw new Error("Password and confirm password not match!");
        }

        const hasspassword = await bcrypt.hash(adminData.password,12)

        const ADMIN_REGISTER = await Admin.create({ 
            ...adminData,
            password:hasspassword
         })

        res.status(201).json({
            message: "Admin registration sucessfully !",
            data:ADMIN_REGISTER
        })

    } catch(error) {
        res.status(404).json({
            message:error.message
        })
    }
}



exports.adminLogin = async (req,res,next) => {
    try {
        const {email,password} = req.body

        if(!email || !password){
            throw new Error("Plese enter all the fields !");
        }

        const admin = await Admin.findOne({email:email})
        if(!admin){
            throw new Error("Admin not found!")
        }

        const doMatch = await bcrypt.compare(password,admin.password)
        if(!doMatch){
            throw new Error("Email and password dose not Match!")
        }

        const Token = jwt.sign({
            adminId:admin._id
        }
        ,process.env.JWT_SECRET_KEY_ADMIN,
        { expiresIn:'3h' })

        res.status(200).json({
            message: "Admin login sucessfully !",
            data:admin,
            Token:Token
        })

    } catch(error) {
        res.status(404).json({
            message:error.message
        })
    }
}


exports.adminUpdate = async (req,res,next) => {
    try {
        const {adminId} = req.params
        const {email,password} = req.body

        let Find_Admin = await Admin.findById(adminId)
        if(!Find_Admin){
            throw new Error("Admin not found!")
        }

        if(Find_Admin.email !== email){
            throw new Error("Admin e-mail not match for reset password!")
        }

        const hasspassword = await bcrypt.hash(password,12)

        Find_Admin.password = hasspassword

        let Update_Admin = await Find_Admin.save()
        
        res.status(200).json({
            message: "Admin password updated sucessfully !",
            data:Update_Admin
        })

    } catch(error) {
        res.status(404).json({
            message:error.message
        })
    }
}
