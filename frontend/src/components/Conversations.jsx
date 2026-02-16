"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MoreVertical, Phone, Video } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import { getMessages, sendMessage } from "../../Slices/messagesSlice";

export default function Conversations() {
  const inputRef = useRef(null);

  const [initialLoad, setinitialLoad] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const dispatch = useDispatch();
  const { conversationId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { currentConversation } = useSelector((state) => state.conversation);
  const otherUsers = currentConversation.usersList.filter(
    (other) => user._id != other._id
  );
  const otherUser = otherUsers[0];
  const { messagesByConversation, isError, isLoading, message } = useSelector(
    (state) => state.message
  );
  //fetch all messages
  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    const fetchMessages = async () => {
      try {
        if (!messagesByConversation[conversationId]) {
          await dispatch(getMessages(conversationId)).unwrap();
        }
        setinitialLoad(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();
  }, [isError, message, dispatch, conversationId]);

  //add message from other user

  useEffect(() => {
    const container = document.getElementById("chatContainer");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messagesByConversation[conversationId]]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const messageData = {
        conversationId,
        text: newMessage,
      };
      dispatch(sendMessage(messageData));
      setNewMessage("");
    }
  };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const showDate = (createdAt) => {
    const date = new Date(createdAt);
    const formatted = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }); // "10/09/2025"

    return formatted;
  };
  if (isError) {
    <div>{message}</div>;
  }
  if (isLoading && initialLoad) {
    return <div>Fetching messages...</div>;
  } else {
    return (
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-shrink-0 p-3 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full " />
              <div>
                <h2 className="font-semibold text-card-foreground text-sm">
                  {otherUser.name}
                </h2>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground h-7 w-7"
              >
                <Phone className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground h-7 w-7"
              >
                <Video className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground h-7 w-7"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        <div id="chatContainer" className="flex-1 overflow-y-auto p-3 min-h-0 ">
          <div className="space-y-3">
            {messagesByConversation[conversationId] &&
            messagesByConversation[conversationId].length > 0 ? (
              messagesByConversation[conversationId].map((message) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.senderId._id == user._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md ${
                      message.senderId._id == user._id ? "order-2" : "order-1"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-lg break-words w-full ${
                        message.senderId._id == user._id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm text-left break-words">
                        {message.text}
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground mt-1 px-1">
                      {showDate(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center text-3xl">
                <p>No messages yet</p>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSendMessage}>
          <div className="flex-shrink-0 p-3 border-t border-border bg-card">
            <div className="flex items-center space-x-2">
              <Input
                ref={inputRef}
                placeholder={`Message ${otherUser.name}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-input text-sm h-8"
              />
              <Button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-blue-500 text-white hover:bg-blue-600 h-8 w-8 p-0"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
