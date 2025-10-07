"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MoreVertical, Phone, Video } from "lucide-react";

const messages = [
  {
    id: "1",
    sender: "Alice Johnson",
    content: "Hey there! How has your day been?",
    timestamp: "10:30 AM",
    isOwn: false,
  },
  {
    id: "2",
    sender: "You",
    content: "Pretty good! Just working on some projects. How about you?",
    timestamp: "10:32 AM",
    isOwn: true,
  },
];

export default function Conversations() {
  const selectedFriend = {
    id: "1",
    name: "Alice Johnson",
    avatar: "/diverse-woman-portrait.png",
    status: "online",
    lastMessage: "Hey, how are you doing?",
    unreadCount: 2,
  };
  const [newMessage, setNewMessage] = useState("");

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="flex-shrink-0 p-3 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-2 h-2 rounded-full ${getStatusColor(
                selectedFriend.status
              )}`}
            />
            <div>
              <h2 className="font-semibold text-card-foreground text-sm">
                {selectedFriend.name}
              </h2>
              <p className="text-xs text-muted-foreground capitalize">
                {selectedFriend.status}
              </p>
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

      <div className="flex-1 overflow-y-auto p-3 min-h-0">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isOwn ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md ${
                  message.isOwn ? "order-2" : "order-1"
                }`}
              >
                {!message.isOwn && (
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs text-muted-foreground font-medium">
                      {message.sender}
                    </span>
                  </div>
                )}
                <div
                  className={`px-3 py-2 rounded-lg ${
                    message.isOwn
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 px-1">
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 p-3 border-t border-border bg-card">
        <div className="flex items-center space-x-2">
          <Input
            placeholder={`Message ${selectedFriend.name}...`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 bg-input text-sm h-8"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-blue-500 text-white hover:bg-blue-600 h-8 w-8 p-0"
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
