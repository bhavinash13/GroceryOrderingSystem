const express=require('express');
const router=express.Router();
const authController=require('../controllers/auth.controller')
const authValidator=require('../validators/auth.validator')


router.post('/register',authValidator.registerValidator,authController.registerUser);
router.post('/login',authValidator.loginValidator,authController.loginUser);
router.post('/verify-email', authController.verifyOTP);
router.post('/logout',authController.logoutUser);

module.exports=router;