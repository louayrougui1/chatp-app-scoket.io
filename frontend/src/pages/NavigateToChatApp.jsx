import { useEffect } from "react";
import { useNavigate } from "react-router";
const NavigateToChatApp = () => {
  //fetch user
  const conversationId = 123;
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/:${conversationId}`);
  }, [conversationId, navigate]);
  return <div>Redirecting to first Chat ...</div>;
};

export default NavigateToChatApp;
