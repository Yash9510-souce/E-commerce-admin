let ADMIN = require('../model/admin/admin');
let USER = require('../model/user/user')
let jwt = require("jsonwebtoken");

exports.ADMIN_JWT = async (req, res, next) => {

    try {

        let authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('Please attach the token first!');
        }

        let TOKEN = authHeader.split(' ')[1];

        let CHECK_VALID_TOKEN = jwt.verify(TOKEN, process.env.JWT_SECRET_KEY_ADMIN);

        let CHECK_VALID_ADMIN = await ADMIN.findById({ _id:CHECK_VALID_TOKEN.adminId});

        if (!CHECK_VALID_ADMIN) {
            throw new Error("Invalid token OR invalid admin!");
        }

        req.adminId = CHECK_VALID_TOKEN.adminId

        next();
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }

}



exports.USER_JWT = async (req, res, next) => {
    try {
        let authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('Please attach the token first!');
        }

        let TOKEN = authHeader.split(' ')[1];

        let CHECK_VALID_TOKEN = jwt.verify(TOKEN, process.env.JWT_SECRET_KEY_USER);

        let CHECK_VALID_USER = await USER.findById({ _id: CHECK_VALID_TOKEN.userId });

        if (!CHECK_VALID_USER) {
            throw new Error("Invalid token OR invalid user!");
        }

        req.userId = CHECK_VALID_TOKEN.userId

        next();
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }

}