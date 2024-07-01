const jwt = require('jsonwebtoken')
require('dotenv').config();
const User = require('../models/User')

async function auth(req, res, next) {
    //TODO retrieve the User.findone({email}) and send it in the req.user object 
    try {
        const authToken = req.cookies?.auth;
        // console.log(authToken)
        if (!authToken) {
            return res.status(400).json({
                success: false,
                message: 'auth token not found in the cookies',
            })
        }
        const decoded = jwt.verify(authToken, process.env.jwt_key);
        if (!decoded) {
            return res.status(400).json({
                success: false,
                message: "jwt token not verified"
            })
        }

        const populatedUserData = await User.findById(decoded._id);
        // .populate('bestScore');
        if (!populatedUserData) {
            return res.status(400).json({ success: false, message: "user don't exist " })
        }
        const userData = {
            _id: populatedUserData._id,
            name: populatedUserData.name,
            // bestScore: populatedUserData.bestScore,
        }
        req.user = userData;
        next();


    } catch (error) {
        console.log('error while validating token', error)
        return res.status(500).json({
            message: "Internal server Error",
        })
    }
}
module.exports = auth;