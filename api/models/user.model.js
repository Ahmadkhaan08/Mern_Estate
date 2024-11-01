import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
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
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Fpremium-vector%2Fuser-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_44276367.htm&psig=AOvVaw1xJreHUD_OMkRXmXeyOPPE&ust=1730355533831000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJC92fG6tYkDFQAAAAAdAAAAABAE"
    }
},
{
    timestamps:true
})

const User=mongoose.model('User',userSchema)

export default User