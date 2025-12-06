import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import chatRouter from "./routes/chatRoutes.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/api/chat", chatRouter);

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
