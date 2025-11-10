import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utilis/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("User Create Successfully!");
  } catch (error) {
    // res.status(500).json(error.message)
    next(error);
    // next(errorHandler(550,"error from custom function"))
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Invalid Credentials!"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...restInfo } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(restInfo);
  } catch (error) {
    next(error);
  }
};


export const google=async(req,res,next)=>{
  try {
    const user=await User.findOne({email:req.body.email})
    if(user){
      const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
      const {password:pass,...restInfo}=user._doc
      res.cookie("access_token",token,{httpOnly:true}).status(200).json(restInfo)
    }else{
      const generatedPassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8)
      const hashedPassword=bcryptjs.hashSync(generatedPassword,10)
      const newUser=new User({
        username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),
        email:req.body.email,
        password:hashedPassword,
        avatar:req.body.photo
      })
      await newUser.save()
      const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
      const {password:pass,...restInfo}=user._doc
      res.cookie("access_token",token,{httpOnly}).status(200).json(restInfo)
    }
  } catch (error) {
    next(error)
  }
}
