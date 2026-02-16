const message = require("../models/messageModel");
const conversation = require("../models/conversationModel");
const asyncHandler = require("express-async-handler");

const getMessages = asyncHandler(async (req, res) => {
  const conversationId = req.params.conversationId;
  const conversationExists = await conversation.findById(conversationId);
  if (!conversationExists) {
    res.status(404);
    throw new Error("Conversation not found");
  }
  const messages = await message
    .find({ conversationId: conversationId })
    .sort({ createdAt: 1 })
    .populate("senderId", "name");
  res.status(200).json(messages);
});

const sendMessage = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const conversationId = req.params.conversationId;
  if (!conversation) {
    res.status(404);
    throw new Error("Conversation not found");
  }
  if (!text) {
    res.status(400);
    throw new Error("please provide a text field in the message");
  }
  const newMessage = await message.create({
    senderId: req.user._id,
    text: text,
    conversationId: conversationId,
  });
  if (!message) {
    res.status(400);
    throw new Error("problem occured when saving the new message");
  }
  const updatedLastMessage = {
    sentAt: newMessage.createdAt,
    senderId: req.user._id,
    text: text,
  };
  const conversationUpdate = await conversation.findByIdAndUpdate(
    conversationId,
    { lastMessage: updatedLastMessage },
    { new: true }
  );
  const sentMessage = await newMessage.populate("senderId", "name");
  res.status(201).json(sentMessage);
});

// const updatemessage = asyncHandler(async (req, res) => {
//   const message = await message.findById(req.params.id);
//   if (!message) {
//     res.status(404);
//     throw new Error("message not found");
//   }
//   const { text, priority, completed } = req.body;
//   if (req.user._id.toString() !== message.user.toString()) {
//     res.status(403);
//     throw new Error("User not Authorized to update this message");
//   }
//   const newmessage = {
//     user: message.user,
//     text: text ? text : message.text,
//     priority: priority,
//     completed: completed,
//   };
//   const updatedmessage = await message.findByIdAndUpdate(
//     req.params.id,
//     newmessage,
//     {
//       new: true,
//     }
//   );
//   res.status(200).json(updatedmessage);
// });

const deleteMessage = asyncHandler(async (req, res) => {
  const messageId = req.params.messageId;
  const { message } = await message.findById(messageId);
  if (!message) {
    res.status(404);
    throw new Error("message not found");
  }
  if (req.user._id.toString() !== message.senderId.toString()) {
    res.status(403);
    throw new Error("User not Authorized to update this message");
  }
  await message.deleteOne();
  res.status(200).json({ _id: messageId });
});

// const deletemessages = asyncHandler(async (req, res) => {
//   await message.deleteMany({ user: req.user._id });
//   res.status(200).json({ id: req.params.id });
// });

module.exports = { getMessages, sendMessage, deleteMessage };
