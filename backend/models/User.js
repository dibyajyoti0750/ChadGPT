import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, required: true, unique: true, index: true }, // index guarantees one DB user per Clerk user
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
