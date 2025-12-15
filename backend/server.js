import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import chatRouter from "./routes/chatRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.get("/", (req, res) => res.json("server is running"));
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.log(err);
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).json({ success: false, message });
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected with DB");

    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log("Failed to connect with DB", err);
  }
};

connectDB();
