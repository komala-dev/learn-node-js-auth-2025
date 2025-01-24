

const isAdminUser =(req,res,next)=>{
    if(req.userInfo.role !== 'admin'){
        return res.status(403).json({
            success:false,
            message:'Access denaid ! admin rights required'
        })
    }

    next()
}

module.exports=isAdminUser