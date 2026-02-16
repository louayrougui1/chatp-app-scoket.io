import { Outlet } from "react-router";
import FriendsList from "../components/FriendsList";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logout, reset } from "../../Slices/authSlice";
const ChatLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
    e;
  };
  return (
    <div className="flex h-screen max-h-screen bg-background overflow-hidden fixed inset-0">
      <FriendsList logout={handleLogout} />
      <Outlet />
    </div>
  );
};
export default ChatLayout;
