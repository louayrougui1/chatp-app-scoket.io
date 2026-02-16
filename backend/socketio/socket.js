// socket.js
const { Server } = require("socket.io");

let io;
function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // React frontend
    },
  });
  io.on("connection", (socket) => {
    console.log("New Connection: ", socket.id);

    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
    });
    socket.on("joinNewConversation", (conversation) => {
      socket.to.emit("receiveNewConversation", conversation);
    });
    socket.on("sendMessage", (message) => {
      socket.to(message.conversationId).emit("receiveMessage", message);
    });
    socket.on("disconnect", () => {
      console.log("Client disconnected: ", socket.id);
    });
  });
  return io;
}

function getIo() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}

module.exports = { initSocket, getIo };
