// socket.js
const { Server } = require("socket.io");

let io;
function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // React frontend
    },
  });
}

function getIo() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}

module.exports = { initSocket, getIo };
