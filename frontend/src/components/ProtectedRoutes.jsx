import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { user, isLoading, isError, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, navigate, isError, message]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return null;
  }

  return children;
}
