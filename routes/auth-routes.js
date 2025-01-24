const express=require('express')
const {registerUser,loginUser, changePassword}=require('../controllers/auth-controller');
const authmiddleware = require('../middleware/auth-middleware');

const router=express.Router();


//all routes are related to authentication and autherization
router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/change-password',authmiddleware,changePassword)
module.exports=router;