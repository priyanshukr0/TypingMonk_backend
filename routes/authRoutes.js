const router = require('express').Router();
const { signUP, verifyOtp, login, logout, deleteUserAccount, resendOtp, validateUser } = require('../controllers/Auth');
const auth = require('../middlewares/authMiddleware');

router.post('/auth/signup', signUP);
router.post('/auth/verify-otp', verifyOtp);
router.post('/auth/login', login);
router.post('/auth/logout', auth, logout);
router.post('/auth/delete', auth, deleteUserAccount);
router.post('/auth/resend-otp', resendOtp);
router.get('/auth/validate-user', validateUser);
module.exports = router;
