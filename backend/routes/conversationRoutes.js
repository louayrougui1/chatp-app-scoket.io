const express = require("express");
const {
  getConversations,
  addConversation,
} = require("../controllers/conversationController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", protect, getConversations);
router.post("/", protect, addConversation);

module.exports = router;
