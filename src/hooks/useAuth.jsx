import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react"; // ✅ Import useCallback
import { setCredentials, logout as logoutAction } from "@/store/authSlice";
import { LogoutUser, GetProfile } from "@/service/auth";

export function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isInitializing, isLoading, error } = useSelector((state) => state.auth);

  // ✅ Wrap in useCallback so it doesn't recreate on every render
  const fetchAndSetUser = useCallback(async () => {
    try {
      const response = await GetProfile();
      if (response.data.success) {
        dispatch(setCredentials(response.data.data));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [dispatch]); // ✅ Only depends on dispatch (which is stable)

  // ✅ Wrap in useCallback
  const logoutUser = useCallback(async () => {
    try {
      await LogoutUser();
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(logoutAction());
      navigate("/signin");
    }
  }, [dispatch, navigate]);

  return {
    user,
    isAuthenticated,
    isInitializing,
    isLoading,
    error,
    fetchAndSetUser,
    logoutUser,
  };
}