import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
export function AdminLayout() {
  const { user, isInitializing, isAuthenticated } = useAuth();
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  if (user?.role !== "CLIENT_ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}