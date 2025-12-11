import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import toast from "react-hot-toast";

interface Message {
  _id: string;
  role: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Thread {
  _id: string;
  threadId: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  history: Thread[];
}

const initialState: ChatState = {
  history: [],
};

export const fetchThreads = createAsyncThunk(
  "chat/fetchThreads",
  async (token: string | null) => {
    try {
      const { data } = await api.get("/api/chat/threads", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data.threads;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchThreads.fulfilled, (state, action) => {
      state.history = action.payload;
    });
  },
});

export default chatSlice.reducer;
