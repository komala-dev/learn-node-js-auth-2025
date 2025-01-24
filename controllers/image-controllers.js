const Image=require('../models/image')
const {uploadToCloudinary}=require('../helper/cloudinary-helper')
const cloudinary = require('../config/cloudinary')

const uploadImageController=async(req,res)=>{
    try {
        
        //check if file was missing
        if(!req.file){
            res.status(500).json({
                success:false,
                message:'file is required please upload proper image'
            })
        }

        //upload to cloudinary
        const {url,publicId}=await uploadToCloudinary(req.file.path)

        //store the image url and public id along with the upload user id in database
        const newlyUploadImage=new Image({
            url,
            publicId,
            uploadedby:req.userInfo.userId
        })

        await newlyUploadImage.save()

        res.status(200).json({
            success:true,
            message:'image uploaded successfully'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:'something is wrong please try again'
        })
    }
}


const fetchImageController=async(req,res)=>{
    try {

        const page=parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 2
        const skip =(page-1)*limit;

        const sortBy=req.query.sortBy || "createdAt";
        const sortOrder=req.query.sortOrder ==='asc'?1:-1;
        const totalImages=await Image.countDocuments();
        const totalPages = Math.ceil(totalImages/limit)

        const sortObj={};
        sortObj[sortBy]=sortOrder;


        const images=await Image.find({}).sort(sortObj).skip(skip).limit(limit)
        if(images){
            res.status(200).json({
                success:true,
                message:'images fetched successfully',
                data:images,
                totalPages:totalPages,
                totalImages:totalImages

            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:'something went wrong! please try again'
        });
    }
}


const deleteImageController = async (req,res)=>{
    try {
        
        const idofimgToBeDeleted=req.params.id;
        const userId=req.userInfo.userId;

        const image=await Image.findById(idofimgToBeDeleted)

        if(!image){
            res.status(403).json({
                success:false,
                message:'image not found please try again'
            })
        }

        //check if this image is uploaded by user who is try to delete it

        if(image.uploadedby.toString() !==userId){
            return res.status(403).json({
                success:false,
                message:'you are not authrised to delete this image..'
            })
        }

        //delete this image from cloudinary
        await cloudinary.uploader.destroy(image.publicId);

        //delete this from mongodb database
        await Image.findByIdAndDelete(idofimgToBeDeleted)

        res.status(200).json({
            success:true,
            message:'Image deleted successfullt'
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:true,
            message:'something is wrong please try again!'
        })
    }
}


module.exports={
    uploadImageController,
    fetchImageController,
    deleteImageController
}