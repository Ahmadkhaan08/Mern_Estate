import { errorHandler } from "../utilis/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(400, "You can update your account only!"));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...restInfo } = updatedUser._doc;
    res.status(200).json(restInfo);
  } catch (error) {
    next(error);
  }
};

export const deleteUser=async(req,res,next)=>{
  if(req.user.id!==req.params.id) return next(errorHandler(400,"You can delete your account only!"))
    try {
      await User.findByIdAndDelete(req.params.id)
      res.clearCookie("access_token")
      res.status(200).json("User deleted Successfully!")
    } catch (error) {
      next(error)
    }
}

export const getUserListings=async(req,res,next)=>{
  if(req.user.id===req.params.id) {
    try {
      const listing=await Listing.find({userRef:req.params.id})
      res.status(200).json(listing)
    } catch (error) {
      next(error)
    }
  }else{
    next(errorHandler(401,"You can only view your own listings!"))
  }

}

export const getUser=async(req,res,next)=>{
    try {
        const user=await User.findById(req.params.id)
        if(!user) return next(errorHandler(404,"User not found!"))
        const {password:pass,...restInfo}=user._doc
        res.status(200).json(restInfo)
    } catch (error) {
        next(error)
    }

}
