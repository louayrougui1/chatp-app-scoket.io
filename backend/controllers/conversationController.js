const asyncHandler = require("express-async-handler");
const Conversation = require("../models/conversationModel");

const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ usersList: req.user._userId })
    .populate("lastMessage.senderId", "name")
    .populate("usersList", "name")
    .sort({
      updatedAt: -1,
    });
  res.status(200).json(conversations);
});

const addConversation = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("Please enter an email");
  }
  const userContact = await User.findOne({ email: email });
  if (!userContact) {
    res.status(404);
    throw new Error("user does not  exist");
  }
  const conversationExists = await Conversation.findOne({
    isGroup: false,
    usersList: { $all: [req.user._id, userContact._id] },
  });
  if (conversationExists) {
    res.json(200).json(conversationExists);
  }
  const newConversation = await Conversation.create({
    usersList: [req.user._id, userContact._id],
    isGroup: false,
    lastMessage: null,
  });
  if (!newConversation) {
    res.status(400);
    throw new Error("a Problem occured when creating the conversation");
  }
  res.status(200).json(newConversation);
});

module.exports = { getConversations, addConversation };
