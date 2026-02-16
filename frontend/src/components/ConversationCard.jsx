import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router";
import { useDispatch } from "react-redux";
import { setCurrentConversation } from "../../Slices/conversationSlice";
const ConversationCard = ({
  conversation,
  user,
  selectedConversation,
  setSelectedConversation,
}) => {
  const dispatch = useDispatch();

  const otherUsers = conversation.usersList.filter(
    (other) => user._id != other._id
  );
  const otherUser = otherUsers[0];
  const handleSelection = () => {
    if (selectedConversation._id != conversation._id) {
      setSelectedConversation(conversation);
      dispatch(setCurrentConversation(conversation));
    }
  };
  return (
    <div>
      <Link to={conversation._id}>
        <Card
          onClick={() => handleSelection(conversation)}
          className={`p-2 mb-1 cursor-pointer transition-colors border-0
    ${
      selectedConversation?._id === conversation._id
        ? "bg-gray-200 hover:bg-gray-300"
        : "bg-white hover:bg-gray-100"
    }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate text-gray-900 text-sm">
                  {otherUser.name}
                </h3>
                {conversation.lastMessage && (
                  <p className="text-xs truncate mt-1 text-gray-500">
                    {conversation.lastMessage.senderId._id == otherUser._id
                      ? ""
                      : "You: "}
                    {conversation.lastMessage.text.length >= 20
                      ? conversation.lastMessage.text.substring(0, 20) + "..."
                      : conversation.lastMessage.text.length}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default ConversationCard;
