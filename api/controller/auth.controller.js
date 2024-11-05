import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import errorHandler from '../utilis/error.js'
import jwt from 'jsonwebtoken'

//Sign Up route
export const signup=async (req,res,next)=>{
    const {username,email,password}=req.body
    const hashedPassword=bcryptjs.hashSync(password,10)
    const newUser=new User({username,email,password:hashedPassword})
    try {
        await newUser.save()
        return res.status(201).json("user add successfully")
        
    } catch (error) {
        next(error)
        // next(errorHandler('550','error from function'))
    }
    // console.log(req.body)
}

//Sign In route
export const SignIn=async(req,res,next)=>{
const {email,password}=req.body
try {
    const validUser=await User.findOne({email})
    if(!validUser) return next(errorHandler('404','User not found'))
    const validPassword=bcryptjs.compareSync(password,validUser.password)
    if(!validPassword) return next(errorHandler('401','Invalid credentials'))
    const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET)
    const {password:pass,...rest}=validUser._doc
    res.cookie('Access_Token',token,{httpOnly:true})
    .status(200)
    .json(rest)
} catch (error) {
    next(error)
}}

//Continue with google route
export const Google=async(req,res,next)=>{
    try {
        const user=await User.findOne({email:req.body.email})
        if(user){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
            const {password:pass,...rest}=user._doc
            res.cookie('Access_Token',token,{httpOnly:true})
            .status(200)
            .json(rest)
        }
        else{
            const generatepassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8)
            const hashedPassword=bcryptjs.hashSync(generatepassword,10)
            const newUser=new User({
                username:
                req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),
                email:req.body.email,
                password:hashedPassword,
                avatar:req.body.photo,
            })
            await newUser.save()
            const  token=jwt.sign({id:newUser._id},process.env.JWT_SECRET)
            const {password:pass,...rest}=newUser._doc
            res.cookie('Access_Token',token,{httpOnly:true})
            .status(200)
            .json(rest)
        }
    } catch (error) {
        next(error)
    }
}

//Sign Out Route
export const SignOut=async(req,res,next)=>{
try {
    res.clearCookie('Access_Token')
    res.status(200).json('User has been logout')
} catch (error) {
    next(error)
}
}