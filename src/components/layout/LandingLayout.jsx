import { Outlet, useLocation } from "react-router-dom";
import { Navbar, Footer } from "@/components/ui";
import { motion } from "framer-motion";

export function LandingLayout() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white font-sans">
      <Navbar isLandingPage={isLandingPage} />

      <main className="flex-1 overflow-x-hidden">
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    <Outlet />
  </motion.div>
</main>

      <Footer />
    </div>
  );
}
