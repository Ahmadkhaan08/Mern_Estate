import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();


app.use(express.json());
app.use(cookieParser())



let isConnected=false
async function ConnectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_DB,{
      useNewUrlParser:true,
      useUnifiedTopology:false
    })
    isConnected=true
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB",error)    
  }
}

app.use((req, res, next) => {
  if (!isConnected){
    ConnectToMongoDB()
  } 
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);


//Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

export default app

