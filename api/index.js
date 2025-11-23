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

// Middlewares
app.use(express.json());
app.use(cookieParser());
// allow CORS; adjust origin to your frontend domain in production
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || true,
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);

// Error middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Mongoose connection (cache across serverless invocations)
const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      // useNewUrlParser/useUnifiedTopology are default in modern mongoose
    });
    console.log("Connected to MongoDB Successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

const sls = serverless(app);
// Export a serverless handler for Vercel / other platforms
export const handler = async (event, context) => {
  // ensure DB connection before handling requests
  await connectToDatabase();
  return sls(event, context);
};

// For local development, start express server when run directly
if (process.env.NODE_ENV !== "production") {
  connectToDatabase()
    .then(() => {
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`Server is running on port ${port}!!!`);
      });
    })
    .catch((err) => console.error(err));
}
