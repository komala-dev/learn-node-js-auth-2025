const express= require('express');
const authmiddleware = require('../middleware/auth-middleware');
const isAdminUser = require('../middleware/admin-middleware');
const uploadmiddleware = require('../middleware/upload-middleware');
const {uploadImageController, fetchImageController, deleteImageController}=require('../controllers/image-controllers')
const router =express.Router()

//uploadimage
router.post('/upload',authmiddleware,isAdminUser,uploadmiddleware.single("image"),uploadImageController)

router.get("/get",authmiddleware,fetchImageController)

router.delete('/:id',authmiddleware,isAdminUser,deleteImageController)

module.exports = router