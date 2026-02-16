const asyncHandler = require("express-async-handler");
const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");

const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ usersList: req.user._id })
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
    throw new Error("user does not exist");
  }
  const conversationExists = await Conversation.findOne({
    isGroup: false,
    usersList: { $all: [req.user._id, userContact._id] },
  }).populate("usersList", "name");
  if (conversationExists) {
    return res.status(200).json(conversationExists);
  } else {
    const newConversation = await Conversation.create({
      usersList: [req.user._id, userContact._id],
      isGroup: false,
      lastMessage: null,
    });

    if (!newConversation) {
      res.status(400);
      throw new Error("a Problem occured when creating the conversation");
    }
    const populatedConverastion = await newConversation.populate(
      "usersList",
      "name"
    );
    res.status(201).json(populatedConverastion);
  }
});

module.exports = { getConversations, addConversation };
