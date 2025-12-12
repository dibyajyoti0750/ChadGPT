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
  threadId: string | null;
  previousQueries: string[];
  responses: (string | null)[];
  loading: boolean;
}

const initialState: ChatState = {
  history: [],
  threadId: null,
  previousQueries: [],
  responses: [],
  loading: false,
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

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    {
      threadId,
      query,
      token,
    }: { threadId: string | null; query: string; token: string | null },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const { data } = await api.post(
        "/api/chat/message",
        { threadId, query },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        dispatch(fetchThreads(token));
      }

      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    resetChat: (state) => {
      state.threadId = null;
      state.previousQueries = [];
      state.responses = [];
      state.loading = false;
    },

    setThreadId: (state, action) => {
      state.threadId = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(sendMessage.pending, (state, action) => {
        if (action.meta.arg.query) {
          state.previousQueries.push(action.meta.arg.query);
        }

        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload?.success) {
          state.responses.push(action.payload.reply ?? null);
        }
      })
      .addCase(sendMessage.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetChat, setThreadId } = chatSlice.actions;

export default chatSlice.reducer;
