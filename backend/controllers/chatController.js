import Thread from "../models/Thread.js";
import ExpressError from "../utils/ExpressError.js";
import getAIResponse from "../utils/gemini.js";

// Get all threads
export const getAllThreads = async (req, res) => {
  const threads = await Thread.find({}).sort("-updatedAt");
  res.json({ success: true, threads });
};

// Get individual thread
export const getThread = async (req, res) => {
  const { threadId } = req.params;

  const thread = await Thread.findOne({ threadId });
  if (!thread) {
    throw new ExpressError(404, "Thread not found");
  }

  res.json({ success: true, thread });
};

// Delete a thread
export const deleteThread = async (req, res) => {
  const { threadId } = req.params;

  const deletedThread = await Thread.findOneAndDelete({ threadId });
  if (!deletedThread) {
    throw new ExpressError(404, "Thread not found");
  }

  res.json({ success: true, message: "Thread deleted successfully" });
};

// Get AI response
export const sendMessage = async (req, res) => {
  const { threadId, query } = req.body;

  if (!threadId || !query) {
    throw new ExpressError(400, "Missing required fields");
  }

  let thread = await Thread.findOne({ threadId });

  if (!thread) {
    thread = new Thread({
      threadId,
      title: query,
      messages: [{ role: "user", content: query }],
    });
  } else {
    thread.messages.push({ role: "user", content: query });
  }

  const aiReply = await getAIResponse(query);

  thread.messages.push({ role: aiReply.role, content: aiReply.text });
  thread.updatedAt = new Date();
  await thread.save();

  res.json({ success: true, data: aiReply.text });
};
