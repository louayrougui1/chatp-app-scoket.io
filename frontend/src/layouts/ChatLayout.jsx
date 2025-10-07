import { Outlet } from "react-router";
import FriendsList from "../components/FriendsList";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import { useState } from "react";
import { logout, reset } from "../../Slices/authSlice";

const ChatLayout = () => {
  const initialFriend = {
    id: "1",
    name: "Alice Johnson",
    avatar: "/diverse-woman-portrait.png",
    status: "online",
    lastMessage: "Hey, how are you doing?",
    unreadCount: 2,
  };
  const [selectedFriend, setSelectedFriend] = useState(initialFriend);

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };
  return (
    <div className="flex h-screen max-h-screen bg-background overflow-hidden fixed inset-0">
      <button onClick={handleLogout}>LOG OUT</button>
      <FriendsList
        selectedFriend={selectedFriend}
        onSelectFriend={setSelectedFriend}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <Outlet />
    </div>
  );
};

export default ChatLayout;
