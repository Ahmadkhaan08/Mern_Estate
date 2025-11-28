import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// serverless-http removed — use express app directly for Vercel handler

dotenv.config();
const app = express();

// Log presence of critical env vars (not values) to help debugging
console.log(`MONGO_DB set: ${Boolean(process.env.MONGO_DB)}`);
console.log(`FRONTEND_URL set: ${Boolean(process.env.FRONTEND_URL)}`);

// Process-level handlers to surface crashes clearly
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

app.use(express.json());
app.use(cookieParser())


const corsOptions = {
  origin: process.env.FRONTEND_URL || true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};  

app.use(cors(corsOptions));

// Debug request logging when DEBUG=true
app.use((req, res, next) => {
  if (process.env.DEBUG) {
    console.log(`API Request: ${req.method} ${req.url}`);
  }
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

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


// Production/Vercel export (req, res) signature. Use (req,res) as server handler.
export default async function (req, res) {
  if (!process.env.MONGO_DB) {
    console.error("MONGO_DB environment variable is not set. Aborting.");
    res.statusCode = 500;
    res.end(JSON.stringify({ success: false, message: "MONGO_DB not configured" }));
    return;
  }
  try {
    console.log(`Handler invoked: ${req.method} ${req.url}`);
    await connectDB();
    // Wrap app(req, res) to catch thrown errors synchronously
    try {
      return app(req, res);
    } catch (innerErr) {
      console.error('Error in app handler:', innerErr);
      res.statusCode = 500;
      res.end(JSON.stringify({ success: false, message: 'Server error' }));
      return;
    }
  } catch (err) {
    console.error("Handler error:", err);
    res.statusCode = 500;
    res.end(JSON.stringify({ success: false, message: "Server error" }));
  }
}
// Local dev server fallback (run locally with `node api/index.js`)
if (process.env.NODE_ENV !== "production") {
  (async () => {
    try {
      await connectDB();
      const port = process.env.PORT || 3000;
      app.listen(port, () => console.log(`Server listening on ${port}`));
    } catch (err) {
      console.error("Local server failed to start:", err);
    }
  })();
}

