import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { socketSendMessage } from "../socketio client/socketClient";
import axios from "axios";
import { updateConversationOnNewMessage } from "./conversationSlice";
const API_URL = `http://localhost:8000/${import.meta.env.VITE_API}/messages/`;

const initialState = {
  messagesByConversation: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const getMessages = createAsyncThunk(
  "message/getAll",
  async (convID, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const resp = await axios.get(API_URL + convID, config);
      return { conversationId: convID, messages: resp.data };
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

export const sendMessage = createAsyncThunk(
  "messsage/create",
  async (message, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      };
      const resp = await axios.post(
        API_URL + message.conversationId,
        { text: message.text },
        config
      );
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

// export const updateTask = createAsyncThunk(
//   "task/update",
//   async (task, thunkAPI) => {
//     try {
//       const token = thunkAPI.getState().auth.accessToken;
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           withCredentials: true,
//         },
//       };
//       const resp = await axios.put(API_URL + task._id, task, config);
//       return resp.data;
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

export const deleteMessage = createAsyncThunk(
  "message/delete",
  async (messageId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        },
      };
      const resp = await axios.delete(API_URL + messageId, config);
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

// export const deleteTasks = createAsyncThunk(
//   "task/deleteAll",
//   async (_, thunkAPI) => {
//     try {
//       const token = thunkAPI.getState().auth.accessToken;
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           withCredentials: true,
//         },
//       };
//       const resp = await axios.delete(API_URL + id, config);
//       return resp.data;
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    reset: (state) => initialState,
    addMessage: (state, action) => {
      const message = action.payload;

      if (!state.messagesByConversation[message.conversationId]) {
        state.messagesByConversation[message.conversationId] = [];
      }
      state.messagesByConversation[message.conversationId].push(message);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        const { conversationId, messages } = action.payload;
        state.isSuccess = true;
        state.isLoading = false;
        state.isError = false;

        state.messagesByConversation[conversationId] = messages;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const sentMessage = action.payload;
        state.isSuccess = true;
        state.isLoading = false;
        state.isError = false;
        state.messagesByConversation[sentMessage.conversationId].push(
          sentMessage
        );
        socketSendMessage(sentMessage);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = action.payload;
      })

      .addCase(deleteMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        const { deletedMessage } = action.payload;

        state.isSuccess = true;
        state.isLoading = false;
        state.isError = false;

        const convId = deletedMessage.conversationId;
        if (state.messagesByConversation[convId]) {
          state.messagesByConversation[convId] = state.messagesByConversation[
            convId
          ].filter((message) => message._id !== deletedMessage._id);
        }
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.isLoading = false;
        state.message = action.payload;
      });
  },
});

export const { reset, addMessage } = messageSlice.actions;
export default messageSlice.reducer;
