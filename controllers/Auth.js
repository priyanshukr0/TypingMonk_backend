const User = require('../models/User');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mailSender = require('../utils/mailSender');
const TypingStats = require('../models/TypingStats');


async function initializeStats(_id) {
    const newStats = new TypingStats({
        user: _id,
        timeStats: {
            "10sec": { wpm: "0", accuracy: "0" },
            "30sec": { wpm: "0", accuracy: "0" },
            "60sec": { wpm: "0", accuracy: "0" },
            "120sec": { wpm: "0", accuracy: "0" },

        },
        wordStats: {
            "10words": { wpm: "0", accuracy: "0" },
            "25words": { wpm: "0", accuracy: "0" },
            "50words": { wpm: "0", accuracy: "0" },
            "100words": { wpm: "0", accuracy: "0" },

        }
    })
    await newStats.save();
    await User.findByIdAndUpdate(_id, { $set: { bestScore: newStats._id } });
    return newStats;
}

async function signUP(req, res) {
    try {
        const { name, email, password } = req.body;
        const isRegisteredUser = await User.findOne({ email: email });
        if (isRegisteredUser) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'An user is already registered with this Email ! Please Login to continue'
            })
        }
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        const newUser = new User({
            name, email, password, otp
        })
        await newUser.save();
        try {
            mailSender(email, otp);
        } catch (error) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Error occured while sending otp to the email. Please try again later'
            })

        }
        //we can add a check here if the mail is sent or not using mailResponse-- if mail is not sent then we can delete the user from the database
        return res.status(200).json({
            success: true,
            data: null,
            message: 'otp sent to the email'
        })
    } catch (error) {
        console.error('error while signUP', error);
        return res.status(500).json({
            success: false,
            data: null,
            message: 'Error occured while signup'
        })
    }
}

async function resendOtp(req, res) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'user is not registered'
            })
        }
        const mailVerified = user.emailVerified;
        if (!mailVerified) {
            const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
            await User.findOneAndUpdate({ email: email }, { $set: { otp: otp } });
            try {
                mailSender(email, otp);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Error occured while sending otp to the email. Please try again later'
                })
            }
            return res.status(200).json({
                success: true,
                message: 'New otp has been sent to the emailID  '
            })

        } else {
            return res.status(400).json({
                success: false,
                message: 'Email already verified Please login to continue'
            })
        }

    } catch (error) {
        console.error('Internal server error', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }

}
async function verifyOtp(req, res) {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'user is not registered'
            })
        }
        if (otp === user.otp) {
            await User.findOneAndUpdate({ email: email }, { $set: { emailVerified: true } });
            return res.status(200).json({
                success: true,
                message: 'OTP verified successfully Please login to continue'
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "Incorrect OTP"
            })
        }
    } catch (error) {
        console.error('Internal server error', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'user is not registered'
        })
    }
    if (!user.emailVerified) {
        return res.status(401).json({
            success: false,
            message: 'email is not verified'
        });
    }
    if (password !== user.password) {
        return res.status(400).json({
            success: false,
            message: 'Incorrect password'
        })
    }
    else if (password === user.password) {

        try {
            const authToken = jwt.sign({ _id: user._id, email: user.email }, process.env.jwt_key, {});
            const populatedUserData = await User.findById(user._id).populate('bestScore');

            const stats = await TypingStats.findOne({ user: user._id });
            if (!stats) {
                await initializeStats(user._id);
            }
            const userData = {
                name: populatedUserData.name,
                email: populatedUserData.email,

            }
            return res.cookie('auth', authToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 }).
                status(200).json({
                    success: true,
                    message: 'User Logged in successfully',
                    data: userData,
                })
        } catch (error) {
            console.log('error occured while login', error);
            return res.status(500).json({
                success: false,
                messaage: 'Internal server error'
            })
        }

    }
}

const validateUser = async (req, res) => {
    const authToken = req.cookies?.auth;
    if (!authToken) {
        return res.status(400).json({
            success: false,
            message: 'User is not logged in'
        })
    } else {
        try {
            const decoded = jwt.verify(authToken, process.env.jwt_key);
            if (!decoded) {
                return res.status(400).json({
                    success: false,
                    message: "authToken not verified"
                })
            }
            const populatedUserData = await User.findById(decoded._id).populate('bestScore');
            if (!populatedUserData) {
                return res.status(400).json({ success: false, message: "user don't exist " })
            }
            else {
                return res.status(200).json({
                    success: true,
                    message: 'User Verified successfully',
                })
            }
        } catch (error) {
            console.error('Error occured while validating token', error)
            return res.status(500).json({
                success: false,
                message: "Internal server Error",
            })
        }
    }

}

const logout = async (req, res) => {
    if (req.cookies.auth) {
        res.clearCookie('auth', { httpOnly: true, secure: true, sameSite: 'None' });
        return res.status(200).json({
            success: true,
            message: 'user logged out successfully'
        })
    }
    else {
        return res.status(400).json({
            success: false,
            message: 'user is not logged in'
        })
    }

}

async function deleteUserAccount(req, res) {

    try {
        const _id = req.user._id;
        const user = await User.findById(_id);
        if (!user) {
            return res.status(400).json({ success: false, message: 'user not found' })
        }
        await User.findByIdAndDelete(_id);
        const stats = await TypingStats.findOne({ user: _id });
        if (stats) {
            await TypingStats.findByIdAndDelete(stats._id);
        }
        if (req.cookies.auth) {
            res.clearCookie('auth', { httpOnly: true, secure: true, sameSite: 'None' })
        }
        return res.status(200).json({ success: true, message: 'user deleted successfully' })
    } catch (error) {
        console.error('Internal server error while deleting user account ', error)
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }

}

module.exports = { signUP, verifyOtp, login, logout, validateUser, deleteUserAccount, resendOtp };