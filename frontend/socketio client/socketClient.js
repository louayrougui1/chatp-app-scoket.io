import { io } from "socket.io-client";

export const socket = io("http://localhost:8000", { autoConnect: false });

export function joinConversations(conversations) {
  if (socket.connected) {
    conversations.forEach((conversation) => {
      socket.emit("joinConversation", conversation._id);
    });
  } else {
    socket.connect();
    socket.on("connect", () => {
      conversations.forEach((conversation) => {
        socket.emit("joinConversation", conversation._id);
      });
    });
  }
}

export function joinConversation(conversation) {
  if (socket.connected) {
    socket.emit("joinConversation", conversation._id);
  } else {
    socket.connect();
    socket.on("connect", () => {
      socket.emit("joinConversation", conversation._id);
    });
  }
}

export function joinNewConversation(conversation) {
  if (socket.connected) {
    socket.emit("joinNewConversation", conversation._id);
  } else {
    socket.connect();
    socket.on("connect", () => {
      socket.emit("joinNewConversation", conversation._id);
    });
  }
}

export function socketSendMessage(message) {
  if (socket.connected) {
    socket.emit("sendMessage", message);
  } else {
    socket.connect();
    socket.on("connect", () => {
      socket.emit("sendMessage", message);
    });
  }
}
