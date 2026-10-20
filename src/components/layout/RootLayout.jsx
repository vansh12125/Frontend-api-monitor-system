import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { setInitialized } from "@/store/authSlice";

export function RootLayout() {
  const { fetchAndSetUser } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      const success = await fetchAndSetUser();
      if (!success) {
        dispatch(setInitialized());
      }
    };
    initAuth();
  }, [fetchAndSetUser, dispatch]);

  return <Outlet />;
}