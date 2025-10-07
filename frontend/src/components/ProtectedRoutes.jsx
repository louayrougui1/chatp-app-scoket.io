import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return null;
  }

  return children;
}
