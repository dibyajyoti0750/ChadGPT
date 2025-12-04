import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "model"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ThreadSchema = new mongoose.Schema(
  {
    threadId: { type: String, required: true, unique: true },
    title: { type: String, default: "New chat" },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Thread", ThreadSchema);
