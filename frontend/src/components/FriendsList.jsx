"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageCirclePlus } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  addConversation,
  getConversations,
  reset,
  addConversationToUi,
  updateConversationOnNewMessage,
} from "../../Slices/conversationSlice";
import { addMessage } from "../../Slices/messagesSlice";
import ConversationCard from "./ConversationCard";
import {
  joinConversation,
  joinConversations,
  socket,
} from "../../socketio client/socketClient";

export default function FriendsList({ logout }) {
  const joinedRef = useRef(false);

  const [selectedConversation, setSelectedConversation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryEmail, setSearchQueryEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { conversations, isError, isLoading, message } = useSelector(
    (state) => state.conversation
  );

  const filteredConversation = (conversations || []).filter((conversation) =>
    conversation.usersList?.some((user) =>
      user.name?.toLowerCase().includes((searchQuery || "").toLowerCase())
    )
  );
  const handleEmailSearch = (e) => {
    e.preventDefault();
    if (searchQueryEmail != "") {
      const data = { email: searchQueryEmail };
      dispatch(addConversation(data));
    }
  };
  //load the conversations
  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    if (!user) {
      navigate("/");
    } else {
      dispatch(getConversations());
    }

    return () => {
      dispatch(reset());
    };
  }, [user, dispatch, isError, message]);

  useEffect(() => {
    if (!user || conversations.length === 0) {
      return;
    }
    //join all converastions
    if (conversations.length >= 0 && !joinedRef.current) {
      joinConversations(conversations);
      joinedRef.current = true;
    }
  }, [conversations, user]);
  //join new Created conversation from other user
  useEffect(() => {
    socket.on(
      "receiveNewConversation",
      (newConversation) => {
        dispatch(addConversationToUi(newConversation));
        joinConversation(newConversation._id);
      },
      []
    );
  });
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      dispatch(addMessage(message));
      dispatch(updateConversationOnNewMessage(message));
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [dispatch]);
  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="w-100 bg-white border-r border-gray-200 flex flex-col min-h-0">
      <div className="p-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-center gap-7">
          <button
            className="mb-2 bg-red-500 px-3 py-1  text-white  rounded"
            onClick={logout}
          >
            Logout
          </button>
          <h1 className="text-base font-bold text-gray-900 mb-2">Messages</h1>
        </div>
        <div className="flex flex-col gap-1 ">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          {conversations.length > 0 ? (
            filteredConversation.map((conversation) => (
              <ConversationCard
                key={conversation._id}
                conversation={conversation}
                user={user}
                selectedConversation={selectedConversation}
                setSelectedConversation={setSelectedConversation}
              />
            ))
          ) : (
            <p>No conversations, add a friend</p>
          )}
        </div>
      </div>
    </div>
  );
}
