import { Outlet, useLocation, Navigate } from "react-router-dom";
import { Navbar } from "@/components/ui";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export function AuthLayout() {
   const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] text-white">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#050505] text-white font-sans overflow-x-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2400&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#050505]/70 via-[#050505]/80 to-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.15)_0%,transparent_70%)]" />
      </div>

      <Navbar isLandingPage={isLandingPage} />

      <main className="relative z-10 flex-1 flex flex-col overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full flex-1 flex flex-col items-center justify-center py-24 px-4"
        >
          <Outlet />
        </motion.div>
      </main>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 max-w-full h-75 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
    </div>
  );
}