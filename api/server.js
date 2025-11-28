import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => console.log("MongoDB Connected Locally"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);

app.listen(3000, () => console.log("Local server running on port 3000"));
