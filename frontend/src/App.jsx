import "./App.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoutes";
import { io } from "socket.io-client";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NavigateToChatApp from "./pages/NavigateToChatApp";
import useGetAccessToken from "./getAcessToken";
import ChatLayout from "./layouts/ChatLayout";
import Conversations from "./components/Conversations";
import NoConversationSelected from "./components/NoConversationSelected";
function App() {
  /*const socket = io("http://localhost:3000");
  socket.on("message", (message) => {
    console.log(message);
  });*/
  useGetAccessToken();
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Login />} />
        <Route
          path="/conversations"
          element={
            <ProtectedRoute>
              <ChatLayout />{" "}
            </ProtectedRoute>
          }
        >
          <Route path=":conversationId" element={<Conversations />} />
          <Route index element={<NoConversationSelected />} />
        </Route>

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/Register" element={<Register />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Route>
    )
  );
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
