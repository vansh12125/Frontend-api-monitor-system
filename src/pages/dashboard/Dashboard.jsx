import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Database, 
  Globe, 
  LogOut, 
  Settings, 
  User 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
 Cell, PieChart, Pie
} from "recharts";

const dashboardData = {
  summary: {
    totalHits: 8,
    errorHits: 5,
    errorRate: 62.5,
    successRate: 37.5,
    avgLatency: 40,
    uniqueServices: 3,
    uniqueEndpoints: 3,
  },
  topEndpoints: [
    { serviceName: "auth-service", endpoint: "/auth/dashboard", method: "GET", totalHits: 3, errorHits: 2, avgLatency: 40 },
    { serviceName: "auth-mq", endpoint: "/auth/stats", method: "GET", totalHits: 2, errorHits: 2, avgLatency: 40 },
    { serviceName: "auth-service", endpoint: "/auth/login", method: "GET", totalHits: 2, errorHits: 0, avgLatency: 40 },
    { serviceName: "auth-ingest", endpoint: "/auth/dashboard", method: "GET", totalHits: 1, errorHits: 1, avgLatency: 40 },
  ],
  metrics: [
    { time_bucket: "2026-10-14T13:00:00.000Z", total_hits: 2, error_hits: 0, avg_latency: 40 },
    { time_bucket: "2026-10-14T13:00:00.000Z", total_hits: 2, error_hits: 1, avg_latency: 40 },
    { time_bucket: "2026-10-16T16:00:00.000Z", total_hits: 1, error_hits: 1, avg_latency: 40 },
    { time_bucket: "2026-10-16T16:00:00.000Z", total_hits: 2, error_hits: 2, avg_latency: 40 },
    { time_bucket: "2026-10-16T16:00:00.000Z", total_hits: 1, error_hits: 1, avg_latency: 40 },
  ],
};

const profileData = {
  name: "stark",
  username: "stark12125",
  email: "vanshsahu9@gmail.com",
  role: "CLIENT_VIEWER",
  isVerified: false,
  isActive: true,
  createdAt: "2026-10-10T12:19:22.345Z",
};


const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, subtitle }) => (
  <div className="bg-[#0f0f13]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${bgClass}`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
    </div>
    {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
  </div>
);

export function Dashboard() {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format chart data (Grouping by date)
  const chartData = dashboardData.metrics.reduce((acc, curr) => {
    const date = new Date(curr.time_bucket).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const existing = acc.find((item) => item.date === date);
    if (existing) {
      existing.hits += Number(curr.total_hits);
      existing.errors += Number(curr.error_hits);
    } else {
      acc.push({ date, hits: Number(curr.total_hits), errors: Number(curr.error_hits) });
    }
    return acc;
  }, []);

  // Pie chart data for Success vs Errors
  const pieData = [
    { name: "Success", value: dashboardData.summary.successRate, color: "#10b981" },
    { name: "Errors", value: dashboardData.summary.errorRate, color: "#ef4444" },
  ];

  const handleLogout = () => {
    // Add your logout logic here (clear tokens, etc.)
    navigate("/signin");
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white p-6 md:p-10 font-sans selection:bg-sky-500/30">
      
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-gray-400 mt-1">Monitoring your API infrastructure</p>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full py-1.5 px-1.5 pr-4 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-sm font-bold">
              {profileData.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-white leading-tight">{profileData.name}</p>
              <p className="text-[10px] text-gray-400 leading-tight">{profileData.role.replace("_", " ")}</p>
            </div>
            <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-72 bg-[#0f0f13] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                {/* Header */}
                <div className="p-5 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-lg font-bold">
                      {profileData.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{profileData.name}</p>
                      <p className="text-xs text-gray-400">@{profileData.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 rounded-lg p-2">
                    <Globe className="w-3.5 h-3.5" />
                    <span className="truncate">{profileData.email}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="p-3 border-b border-white/5 flex gap-2">
                  <div className={`flex-1 flex flex-col items-center justify-center p-2 rounded-xl border ${profileData.isActive ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                    <span className="text-[10px] uppercase font-bold tracking-wider mb-1">Status</span>
                    <span className="text-xs font-medium">{profileData.isActive ? "Active" : "Inactive"}</span>
                  </div>
                  <div className={`flex-1 flex flex-col items-center justify-center p-2 rounded-xl border ${profileData.isVerified ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'}`}>
                    <span className="text-[10px] uppercase font-bold tracking-wider mb-1">Verified</span>
                    <span className="text-xs font-medium">{profileData.isVerified ? "Yes" : "Pending"}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2">
                    <User className="w-4 h-4" /> Profile Settings
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2">
                    <Settings className="w-4 h-4" /> Account Preferences
                  </button>
                  <div className="h-px bg-white/5 my-1" />
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Requests" 
          value={dashboardData.summary.totalHits} 
          icon={Activity} 
          colorClass="text-sky-400" 
          bgClass="bg-sky-500/10" 
        />
        <StatCard 
          title="Error Rate" 
          value={`${dashboardData.summary.errorRate}%`} 
          icon={AlertTriangle} 
          colorClass="text-red-400" 
          bgClass="bg-red-500/10" 
          subtitle={`${dashboardData.summary.errorHits} failed requests`}
        />
        <StatCard 
          title="Success Rate" 
          value={`${dashboardData.summary.successRate}%`} 
          icon={CheckCircle2} 
          colorClass="text-green-400" 
          bgClass="bg-green-500/10" 
          subtitle={`${dashboardData.summary.totalHits - dashboardData.summary.errorHits} successful`}
        />
        <StatCard 
          title="Avg Latency" 
          value={`${dashboardData.summary.avgLatency}ms`} 
          icon={Clock} 
          colorClass="text-yellow-400" 
          bgClass="bg-yellow-500/10" 
        />
      </div>

      {/* Charts Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Main Traffic Chart */}
        <div className="lg:col-span-2 bg-[#0f0f13]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">Request Volume</h2>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-sky-500"></div> Hits</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div> Errors</div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="hits" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorHits)" />
                <Area type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorErrors)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Success vs Errors Donut Chart */}
        <div className="bg-[#0f0f13]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-2">Health Overview</h2>
          <p className="text-xs text-gray-400 mb-6">Success vs Error distribution</p>
          
          <div className="flex-1 flex items-center justify-center relative min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-white">{dashboardData.summary.uniqueServices}</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Services</span>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-400">{item.name}</span>
                </div>
                <span className="font-medium text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Top Endpoints Table */}
      <div className="max-w-7xl mx-auto bg-[#0f0f13]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-white">Top Endpoints</h2>
            <p className="text-xs text-gray-400 mt-1">Highest traffic and error rate</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.02] text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Service</th>
                <th className="px-6 py-4 font-medium">Endpoint</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium text-right">Hits</th>
                <th className="px-6 py-4 font-medium text-right">Errors</th>
                <th className="px-6 py-4 font-medium text-right">Avg Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {dashboardData.topEndpoints.map((ep, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-white">{ep.serviceName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-300">{ep.endpoint}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      {ep.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-white">{ep.totalHits}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-medium ${ep.errorHits > 0 ? "text-red-400" : "text-gray-500"}`}>
                      {ep.errorHits}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-300">{ep.avgLatency}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}