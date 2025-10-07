const express = require("express");
const {
  updatemessage,
  deletemessages,
  getMessages,
  sendMessage,
  deleteMessage,
} = require("../controllers/messageController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/:conversationId", protect, getMessages);
router.post("/:conversationId", protect, sendMessage);
//router.put("/:conversationId/:id", protect, updatemessage);
router.delete("/:messageId", protect, deleteMessage);
//router.delete("/", protect, deletemessages);

module.exports = router;
