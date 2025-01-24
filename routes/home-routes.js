const express=require('express')
const authmiddleware=require('../middleware/auth-middleware')
const router = express.Router();



router.get('/welcome',authmiddleware,(req,res)=>{
    res.json({
        message:'welcome to the home page'
    })
})

module.exports=router