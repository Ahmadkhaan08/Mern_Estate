import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./route/auth.route.js";
import userRouter from "./route/user.route.js";
import listingRouter from "./route/listing.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();

const corsOption = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-type", "Authorization"],
};

app.use(cors(corsOption))
app.use(express.json());
app.use(cookieParser())

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// db/mongoDB.js

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return; // Already connected
    }
    await mongoose.connect(process.env.MONGO_DB);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};


app.get("/", (req, res) => {
  res.send("API is running");
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

// app.listen(3000, () => {
//   console.log("Server is running on PORT 3000");
// });

export default app
