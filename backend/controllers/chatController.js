import Thread from "../models/Thread.js";
import getAIResponse from "../utils/gemini.js";

// Get all threads
export const getAllThreads = async (req, res) => {
  try {
    const threads = await Thread.find({}).sort("-updatedAt");
    res.json({ success: true, threads });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Failed to fetch threads" });
  }
};

// Get individual thread
export const getThread = async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      res.status(404).json({ success: false, error: "Thread not found" });
    }

    res.json({ success: true, thread });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Failed to fetch chat" });
  }
};

// Delete a thread
export const deleteThread = async (req, res) => {
  const { threadId } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });

    if (!deletedThread) {
      res.status(404).json({ success: false, error: "Thread not found" });
    }

    res.json({ success: true, message: "Thread deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Failed to delete thread" });
  }
};

// Get AI response
export const sendMessage = async (req, res) => {
  const { threadId, query } = req.body;

  if (!threadId || !query) {
    res.status(400).json({ success: false, error: "Missing required fields" });
  }

  try {
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

    res.json({ success: true, reply: aiReply.text });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};
