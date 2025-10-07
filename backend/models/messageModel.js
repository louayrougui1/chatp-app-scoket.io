const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "conversations",
    },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    text: { type: String, required: [true, "please add a text"] },
  },

  { timestamps: true }
);

module.exports = mongoose.model("messages", messageSchema);
