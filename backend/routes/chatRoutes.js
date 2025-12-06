import express from "express";
import {
  deleteThread,
  getAllThreads,
  getThread,
  sendMessage,
} from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.get("/threads", getAllThreads);
chatRouter.get("/thread/:threadId", getThread);
chatRouter.delete("/thread/:threadId", deleteThread);
chatRouter.post("/message", sendMessage);

export default chatRouter;
