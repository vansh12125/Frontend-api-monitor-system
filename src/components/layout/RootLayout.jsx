import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { setInitialized } from "@/store/authSlice";
import { useLenis } from "@/hooks/useLenis"; // 👈 Import it here

export function RootLayout() {
  const { fetchAndSetUser } = useAuth();
  const dispatch = useDispatch();
  const isInitializedRef = useRef(false);
  
  // ✅ Initialize Lenis here instead of App.jsx
  useLenis();

  useEffect(() => {
    if (isInitializedRef.current) return;
    
    isInitializedRef.current = true;
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