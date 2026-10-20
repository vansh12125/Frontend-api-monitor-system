import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function SecuredLayout() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] text-white">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#050505] text-white font-sans">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}