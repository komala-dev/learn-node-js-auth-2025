const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    url:{
        type:String
    },
    publicId:{
        type:String,
        required:true
    },
    uploadedby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true});

module.exports=mongoose.model('Image',imageSchema)