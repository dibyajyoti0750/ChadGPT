import Thread from "../models/Thread.js";
import User from "../models/User.js";
import ExpressError from "../utils/ExpressError.js";
import getAIResponse from "../utils/gemini.js";

// Get all threads
export const getAllThreads = async (req, res) => {
  const { userId: clerkUserId } = req.auth();

  const user = await User.findOne({ clerkUserId });
  if (!user) throw new ExpressError(404, "User not found");

  const threads = await Thread.find({ user: user._id }).sort("-updatedAt");

  res.json({ success: true, threads });
};

// Get individual thread
export const getThread = async (req, res) => {
  const { userId: clerkUserId } = req.auth();
  const { threadId } = req.params;

  const user = await User.findOne({ clerkUserId });
  if (!user) throw new ExpressError(404, "User not found");

  const thread = await Thread.findOne({
    threadId,
    user: user._id,
  });

  if (!thread) {
    throw new ExpressError(404, "Thread not found");
  }

  res.json({ success: true, thread });
};

// Delete a thread
export const deleteThread = async (req, res) => {
  const { userId: clerkUserId } = req.auth();
  const { threadId } = req.params;

  const user = await User.findOne({ clerkUserId });
  if (!user) throw new ExpressError(404, "User not found");

  const deletedThread = await Thread.findOneAndDelete({
    threadId,
    user: user._id,
  });

  if (!deletedThread) {
    throw new ExpressError(404, "Thread not found");
  }

  res.json({ success: true, message: "Thread deleted successfully" });
};

// Get AI response
export const sendMessage = async (req, res) => {
  const { userId: clerkUserId } = req.auth();
  const { threadId, query } = req.body;

  if (!threadId || !query) {
    throw new ExpressError(400, "Missing required fields");
  }

  const user = await User.findOne({ clerkUserId });
  if (!user) throw new ExpressError(404, "User not found");

  let thread = await Thread.findOne({
    threadId,
    user: user._id,
  });

  if (!thread) {
    thread = new Thread({
      threadId,
      user: user._id,
      title: query,
      messages: [{ role: "user", content: query }],
    });
  } else {
    thread.messages.push({ role: "user", content: query });
  }

  const aiReply = await getAIResponse(query);

  thread.messages.push({ role: aiReply.role, content: aiReply.text });

  await thread.save();

  res.json({ success: true, reply: aiReply.text });
};
