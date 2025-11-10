import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        default:"https://www.svgrepo.com/show/384670/account-avatar-profile-user.svg"
    }
},{timestamps:true})

const User=new mongoose.model("User",userSchema)

export default User