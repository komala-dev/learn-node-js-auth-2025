require('dotenv').config()
const mongoose=require('mongoose')
const connectToDB= async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('mongodb connected successfully')
    } catch (error) {
        console.log(error)
        console.error("mongodb connection failed!")
        process.exit(1)
    }
}

module.exports=connectToDB;