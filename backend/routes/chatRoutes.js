import express from "express";
import {
  deleteThread,
  getAllThreads,
  getThread,
  sendMessage,
} from "../controllers/chatController.js";
import { protect } from "../middlewares/auth.js";
import wrapAsync from "../middlewares/wrapAsync.js";

const chatRouter = express.Router();

chatRouter.get("/threads", protect, wrapAsync(getAllThreads));
chatRouter.get("/thread/:threadId", protect, wrapAsync(getThread));
chatRouter.delete("/thread/:threadId", protect, wrapAsync(deleteThread));
chatRouter.post("/message", protect, wrapAsync(sendMessage));

export default chatRouter;
