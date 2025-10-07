import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = `http://localhost:8000/${
  import.meta.env.VITE_API
}/conversations/`;

const initialState = {
  conversations: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const getConversations = createAsyncThunk(
  "conversation/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const resp = await axios.get(API_URL, config);
      return resp.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addConversation = createAsyncThunk(
  "converastion/create",
  async (email, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      };
      const resp = await axios.post(API_URL, email, config);
      return resp.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const taskSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    reset: (state) => initialState,
    updateConversationOnNewMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      const index = state.conversations.findIndex(
        (conversation) => conversation._id == conversationId
      );
      if (index != -1) {
        state.conversations[index].lastMessage.sentAt = message.createdAt;
        state.conversations[index].lastMessage.senderId = message.senderId;
        state.conversations[index].lastMessage.text = message.text;
        const tmpConversation = state.conversations[index];
        //moves conversation to top
        state.conversations.splice(index, 1);
        state.conversations.unshift(tmpConversation);
      }
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getConversations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.isError = false;
        state.conversations.push(action.payload);
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(addConversation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addConversation.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.isError = false;
        state.conversations.unshift(action.payload);
      })
      .addCase(addConversation.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = action.payload;
      });
  },
});

export const { reset } = taskSlice.actions;
export default taskSlice.reducer;
