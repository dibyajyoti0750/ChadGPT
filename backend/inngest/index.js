import { Inngest } from "inngest";
import User from "../models/User.js";
import Thread from "../models/Thread.js";

export const inngest = new Inngest({ id: "ChadGPT" });

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id } = event.data;
    const user = new User({ clerkUserId: id });
    await user.save();
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    const user = await User.findOne({ clerkUserId: id });
    if (!user) return;

    await Thread.deleteMany({ user: user._id });
    await user.deleteOne();
  }
);

export const functions = [syncUserCreation, syncUserDeletion];
