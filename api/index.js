import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import serverless from "serverless-http";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser())


const corsOption = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};  

app.use(cors(corsOption));

// DB CONNECTION — Safe for Vercel
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_DB);
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB Connected!");
  } catch (err) {
    console.error("MongoDB error:", err);
    throw err;
  }  
}  

// mongoose
//   .connect(process.env.MONGO_DB)
//   .then(() => {
//     console.log("Connected to MongoDB Successfully!");  
//   })
//   .catch((err) => {
//     console.log(err);  
//   });

// app.listen(3000, () => {
//   console.log("Server is running on port 3000!!!");
// });

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

// Export serverless handler
const handler = serverless(app);

export const GET = async (req, context) => {
  await connectDB();
  return handler(req, context);
};

export const POST = GET;
export const PUT = GET;
export const DELETE = GET;
