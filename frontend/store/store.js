import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Slices/authSlice";
import messagesReducer from "../Slices/messagesSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    message: messagesReducer,
  },
});
