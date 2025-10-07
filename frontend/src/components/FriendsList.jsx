"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MessageCirclePlus } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router";

const friends = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "/diverse-woman-portrait.png",
    status: "online",
    lastMessage: "Hey, how are you doing?",
    unreadCount: 2,
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar: "/thoughtful-man.png",
    status: "away",
    lastMessage: "See you tomorrow!",
  },
  {
    id: "3",
    name: "Carol Davis",
    avatar: "/professional-woman.png",
    status: "online",
    lastMessage: "Thanks for the help",
  },
  {
    id: "4",
    name: "David Wilson",
    avatar: "/man-casual.png",
    status: "offline",
    lastMessage: "Good night!",
  },
  {
    id: "5",
    name: "Emma Brown",
    avatar: "/young-woman.png",
    status: "online",
    lastMessage: "Let's meet up soon",
    unreadCount: 1,
  },
  {
    id: "6",
    name: "Frank Miller",
    status: "online",
    lastMessage: "Working on the new project",
    unreadCount: 3,
  },
  {
    id: "7",
    name: "Grace Lee",
    status: "away",
    lastMessage: "Call me when you're free",
  },
  {
    id: "8",
    name: "Henry Clark",
    status: "offline",
    lastMessage: "Great meeting today!",
  },
  {
    id: "9",
    name: "Ivy Martinez",
    status: "online",
    lastMessage: "Can you review my code?",
    unreadCount: 1,
  },
  {
    id: "10",
    name: "Jack Thompson",
    status: "away",
    lastMessage: "Lunch tomorrow?",
  },
];

export default function FriendsList({
  selectedFriend,
  onSelectFriend,
  searchQuery,
  onSearchChange,
}) {
  const [searchQueryEmail, setSearchQueryEmail] = useState("");
  const dispatch = useDispatch();
  const getStatusColor = (status) => {
    return "bg-green-500";
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes((searchQuery || "").toLowerCase())
  );
  const handleEmailSearch = (e) => {
    e.preventDefault();
    dispatch(searchUser(searchQueryEmail));
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col min-h-0">
      <div className="p-3 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-base font-bold text-gray-900 mb-2">Messages</h1>
        <div className="flex flex-col gap-1 ">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 text-sm h-8"
            />
          </div>
          <div className="flex gap-1">
            <Button
              onClick={handleEmailSearch}
              className="bg-white cursor-pointer hover:bg-blue-600 border-2 border-gray-200 "
            >
              <MessageCirclePlus className=" text-gray-400 h-4 w-4" />
            </Button>

            <Input
              placeholder="New Conversations."
              value={searchQueryEmail}
              onChange={(e) => setSearchQueryEmail(e.target.value)}
              className="pl-3 bg-gray-50 border-gray-200 text-sm h-8"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-2">
          {filteredFriends.map((friend) => (
            <Card
              key={friend.id}
              className={`p-2 mb-1 cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedFriend.id === friend.id
                  ? "bg-gray-100"
                  : "bg-transparent"
              } border-0`}
              onClick={() => onSelectFriend(friend)}
            >
              <Link to={friend.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusColor(
                        "online"
                      )}`}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate text-gray-900 text-sm">
                        {friend.name}
                      </h3>
                      {friend.lastMessage && (
                        <p className="text-xs truncate mt-1 text-gray-500">
                          conversation.lastmessage
                        </p>
                      )}
                    </div>
                  </div>
                  {friend.unreadCount && (
                    <Badge className="bg-blue-500 text-white text-xs h-4 min-w-4">
                      {friend.unreadCount}
                    </Badge>
                  )}
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
