import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMe, refreshToken } from "../Slices/authSlice";

const useGetAccessToken = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await dispatch(refreshToken()).unwrap();
        await dispatch(getMe()).unwrap();
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [dispatch]);
};

export default useGetAccessToken;
