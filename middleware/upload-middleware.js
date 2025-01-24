const { Error } = require('mongoose')
const multer=require('multer')
const path=require('path')

//set our multer storage

const storage = multer.diskStorage({
    destination:function(req,res,cb){
        cb(bull,"uploads/")
    },
    filename:function(req,res,cb){
        cb(null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        )
    }
})

//file filter

const checkFileFilter=(req,res,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }
    else{
        cb(new Error('not an image please check'))
    }
}

//middleware

module.exports=multer({
    storage:storage,
    fileFilter:checkFileFilter,
    limits:{
        fileSize:5 * 1024 * 1024, //5mb file size
    }
})