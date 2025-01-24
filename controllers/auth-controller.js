const User=require('../models/User')
const bcrypt =require('bcryptjs')
const jwt=require('jsonwebtoken')

//register controller
const registerUser= async(req,res)=>{
    try {
        //extract user information from our request body
        const {username,email,password,role}=req.body;

        //check if the user is already exists inour database
        const checkExistingUser = await User.findOne({$or : [{username},{email}]})

        if(checkExistingUser){
            return res.status(404).json({
                success:false,
                message:'user is already exist either withsame username or same email'
            })
        }
       
        //hash user password
        const salt=await bcrypt.genSalt(10);
        const hashedpassword= await bcrypt.hash(password,salt)

        //create a new user and save in your darabase
        const newlycreatedUser = new User({
            username,
            email,
            password:hashedpassword,
            role:role || 'user'
        })
        
        await newlycreatedUser.save();

        if(newlycreatedUser){
            res.status(201).json({
                success:true,
                message:'user registered successfully'
            })
        }else{
            res.status(404).json({
            success:trfalseue,
            message:'user registered failed'
        })
    }


    } catch (error) {
        console.log(error);
        res.status(404).json({
            success:false,
            message:'some error occur please try again!'
        })
    }
}



//login controller

const loginUser=async(req,res)=>{
    try {
        const {username,password}=req.body;
        const user= await User.findOne({username});

        //if the user is not exist in database
        if(!user){
            return res.status(200).json({
                success:false,
                message:'invalid details'
            })
        }



        const ispasswordMatch=await bcrypt.compare(password,user.password)
        
        //if password not match
        if(!ispasswordMatch){
            return res.status(200).json({
                success:false,
                message:'invalid details'
            })
        }

        //create user token

        const accessToken = jwt.sign({
            userId:user._id,
            username:user.username,
            role:user.role
        },process.env.JWT_SECRET_KEY,{
            expiresIn:'30m'
        })

        res.status(200).json({
            success:true,
            message:'logged in successfull',
            accessToken
        })


    } catch (error) {
        console.log(error);
        res.status(404).json({
            success:false,
            message:'some error occur please try again!'
        })
    }
}

const changePassword = async(req,res)=>{
    try {
        
        const userId=req.userInfo.userId;

        //extract old and new password
        const {oldpassword,newpassworsd}=req.body;

        //find the current logged in user
        const user =await User.findById(userId)

        if(!user){
            res.status(400).json({
                success:false,
                message:'user not exist'
            })
        }

        //check if oldpassword is correct or not

        const ispasswordMatch=await bcrypt.compare(oldpassword,user.password)
        if(!ispasswordMatch){
            return res.status(400).json({
                success:false,
                message:'oldpassword is not correct please check the old password!'
            })
        }


        //hash the newpassword
        const salt=await  bcrypt.genSalt(10)
        const newhashedpassword=await bcrypt.hash(newpassworsd,salt)

        //update user password
        user.password=newhashedpassword
        await user.save()

        res.status(200).json({
            success:true,
            message:'password changed successfully'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:'something wrong please try again!'
        })

    }
}


module.exports={registerUser,loginUser,changePassword}