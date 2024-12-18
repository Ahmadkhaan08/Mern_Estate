import User from "../models/user.model.js"
import errorHandler from "../utilis/error.js"
import bcryptjs from 'bcryptjs'

export const test=(req,res)=>{
    res.json({
        message:'Hello World!'
    })
    }
//Update user api route;
export const UpdateUser=async(req,res,next)=>{
    if(req.user.id!==req.params.id)
        return next(errorHandler(401,'You can only update your account!'))
    try {
        if(req.body.password){
            req.body.password=bcryptjs.hashSync(req.body.password,10)
        }
        const UpdatedUser=await User.findByIdAndUpdate(
            req.params.id,
            {
                $set:{
                    username:req.body.username,
                    email:req.body.email,
                    password:req.body.password,
                    avatar:req.body.avatar
                }
            },
            {new:true}
        )
        const {password,...rest}=UpdatedUser._doc
        res.status(200).json(rest)
        } catch (error) {
            next(error)
        
    }

}

//Delete User Route

export const DeleteUser=async(req,res,next)=>{
    if(req.user.id!==req.params.id) return next(errorHandler(401,'You can Delete your account only'))
    try{
          await User.findByIdAndDelete(req.params.id)
          res.clearCookie('Access_Token')
          res.status(200).json('User has been deleted')
}catch(error){
    next(error)
}
}
