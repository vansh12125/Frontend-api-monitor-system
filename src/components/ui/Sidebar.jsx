import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Activity, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Database,
  Key,
  Users,
  History,
  BarChart2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { logoutUser, user } = useAuth();
  const isAdmin = user?.role === "CLIENT_ADMIN";
  const baseMenuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Top Endpoints", icon: Activity, path: "/endpoints" },
    { name: "Stats", icon: BarChart2, path: "/stats" },
  ];
  const adminMenuItems = [
    { name: "API Keys", icon: Key, path: "/api-keys" },
    { name: "Manage Clients", icon: Users, path: "/clients" },
    { name: "Request History", icon: History, path: "/history" },
  ];
  const generalItems = [
    { name: "Settings", icon: Settings, path: "/settings" },
  ];
  return (
    <>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#0f0f13] border border-white/10 rounded-xl text-white"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-[#0a0a0c] border-r border-white/5 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-sky-400 to-blue-600 flex items-center justify-center">
              <Database className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">API Pulse</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
          <div>
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Menu</p>
            <div className="space-y-1">
              {baseMenuItems.map((item) => (
                <NavItem key={item.name} item={item} location={location} closeMenu={() => setIsOpen(false)} />
              ))}
            </div>
          </div>
          {isAdmin && (
            <div>
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Admin</p>
              <div className="space-y-1">
                {adminMenuItems.map((item) => (
                  <NavItem key={item.name} item={item} location={location} closeMenu={() => setIsOpen(false)} />
                ))}
              </div>
            </div>
          )}
          <div>
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">General</p>
            <div className="space-y-1">
              {generalItems.map((item) => (
                <NavItem key={item.name} item={item} location={location} closeMenu={() => setIsOpen(false)} />
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-3 border-t border-white/5">
          <button
            onClick={logoutUser}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Log out
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
function NavItem({ item, location, closeMenu }) {
  const isActive = location.pathname === item.path;
  return (
    <Link
      to={item.path}
      onClick={closeMenu}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
        ${isActive 
          ? "bg-sky-500/10 text-sky-400" 
          : "text-gray-400 hover:text-white hover:bg-white/5"}
      `}
    >
      <item.icon className={`w-5 h-5 ${isActive ? "text-sky-400" : ""}`} />
      {item.name}
    </Link>
  );
}