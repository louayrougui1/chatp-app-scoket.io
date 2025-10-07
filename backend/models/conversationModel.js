const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    usersList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isGroup: {
      type: Boolean,
      default: false,
    },
    lastMessage: {
      sentAt: { type: Date, default: null },
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
      },
      text: { type: String, default: null },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("conversations", conversationSchema);
