import express from "express"
import mongoose from "mongoose"
import  dotenv from "dotenv"
import userRouter from '../api/Routes/user.route.js'
import authRouter from "../api/Routes/auth.route.js"
import listingRouter from '../api/Routes/listing.route.js'
import cookieParser from "cookie-parser"
import cors from 'cors';


dotenv.config()



mongoose.connect(process.env.MONGODB)
.then(()=>{console.log("Mongodb is connected")})
.catch((err)=>{console.log(err)})
const app=express()
app.use(express.json())
app.use(cookieParser())
app.listen(3000,()=>{console.log("Server is running on port 3000!!!")})
app.use(cors());



app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)
app.use('/api/listing',listingRouter)


//Middleware
app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500
    const message=err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })
})

