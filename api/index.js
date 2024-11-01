import express from "express"
import mongoose from "mongoose"
import  dotenv from "dotenv"
import userRouter from '../api/Routes/user.route.js'
import authRouter from "../api/Routes/auth.route.js"
dotenv.config()


mongoose.connect(process.env.MONGODB)
.then(()=>{console.log("Mongodb is connected")})
.catch((err)=>{console.log(err)})
const app=express()
app.use(express.json())

app.listen(3000,()=>{console.log("Server is running on port 3000!!!")})


app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)


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