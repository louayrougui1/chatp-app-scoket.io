import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Slices/authSlice";
import messagesReducer from "../Slices/messagesSlice";
import conversationReducer from "../Slices/conversationSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    message: messagesReducer,
    conversation: conversationReducer,
  },
});
