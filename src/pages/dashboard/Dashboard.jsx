import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Activity, AlertTriangle, CheckCircle2, Clock, 
  RefreshCw, Download, Database, Calendar, Filter
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { Sidebar } from "@/components/ui/Sidebar";

const toInputDate = (date) => {
  return date.toISOString().split('T')[0];
};

const getIsoDateRange = (startStr, endStr) => {
  const start = new Date(startStr);
  const end = new Date(endStr);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { startTime: start.toISOString(), endTime: end.toISOString() };
};

const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, subtitle, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-[#0f0f13]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col justify-between"
  >
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
  </motion.div>
);

export function Dashboard() {
  const { user } = useAuth();
  const { data, isLoading, error, fetchDashboard, downloadCsv } = useDashboard();

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return toInputDate(d);
  });
  const [endDate, setEndDate] = useState(() => toInputDate(new Date()));

  useEffect(() => {
    const timer = setTimeout(() => {
      if (new Date(startDate) > new Date(endDate)) return;
      const { startTime, endTime } = getIsoDateRange(startDate, endDate);
      fetchDashboard(startTime, endTime);
    }, 500);
    return () => clearTimeout(timer);
  }, [startDate, endDate, fetchDashboard]);

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-sky-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center text-red-400">
          <AlertTriangle className="w-12 h-12 mb-4" />
          <p>{error}</p>
          <button 
            onClick={() => {
              const { startTime, endTime } = getIsoDateRange(startDate, endDate);
              fetchDashboard(startTime, endTime);
            }} 
            className="mt-4 px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data || !data.summary) return null;

  const chartData = data.metrics.reduce((acc, curr) => {
    const date = new Date(curr.time_bucket).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const existing = acc.find((item) => item.date === date);
    if (existing) {
      existing.hits += Number(curr.total_hits);
      existing.errors += Number(curr.error_hits);
    } else {
      acc.push({ date, hits: Number(curr.total_hits), errors: Number(curr.error_hits) });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

  const pieData = [
    { name: "Success", value: data.summary.successRate, color: "#10b981" },
    { name: "Errors", value: data.summary.errorRate, color: "#ef4444" },
  ];

  const isAdmin = user?.role === "CLIENT_ADMIN";

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans selection:bg-sky-500/30">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-6 md:p-10 w-full overflow-x-hidden">
        
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">Monitor your API performance and health.</p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-4 w-full xl:w-auto">
            
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#0f0f13]/90 border border-white/10 rounded-2xl p-3 w-full lg:w-auto shadow-lg">
              
              <div className="flex flex-col w-full sm:w-auto">
                <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1 ml-1">Start Time</label>
                <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-xl px-3 py-2">
                  <Calendar className="w-4 h-4 text-sky-400" />
                  <input 
                    type="date" 
                    value={startDate}
                    max={endDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-transparent border-none text-sm text-white focus:outline-none scheme-dark w-full"
                  />
                </div>
              </div>

              <span className="hidden sm:block text-gray-600 mt-4">-</span>

              <div className="flex flex-col w-full sm:w-auto">
                <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1 ml-1">End Time</label>
                <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-xl px-3 py-2">
                  <Calendar className="w-4 h-4 text-sky-400" />
                  <input 
                    type="date" 
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-transparent border-none text-sm text-white focus:outline-none scheme-dark w-full"
                  />
                </div>
              </div>

              <button 
                onClick={() => {
                  const { startTime, endTime } = getIsoDateRange(startDate, endDate);
                  fetchDashboard(startTime, endTime);
                }}
                disabled={isLoading}
                className="w-full sm:w-auto mt-2 sm:mt-4 p-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] flex justify-center items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                <span className="sm:hidden text-xs font-medium">Apply</span>
              </button>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
              <button 
                onClick={() => {
                  const { startTime, endTime } = getIsoDateRange(startDate, endDate);
                  fetchDashboard(startTime, endTime);
                }}
                disabled={isLoading}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 rounded-xl text-sm font-medium transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            {isAdmin && (
  <button 
    onClick={() => {
      const { startTime, endTime } = getIsoDateRange(startDate, endDate);
      downloadCsv(startTime, endTime);
    }}
    disabled={isLoading}
    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)]"
  >
    <Download className="w-4 h-4" />
    Export
  </button>
)}
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Requests" value={data.summary.totalHits} icon={Activity} colorClass="text-sky-400" bgClass="bg-sky-500/10" delay={0.1} />
          <StatCard title="Error Rate" value={`${data.summary.errorRate}%`} icon={AlertTriangle} colorClass="text-red-400" bgClass="bg-red-500/10" subtitle={`${data.summary.errorHits} failed requests`} delay={0.2} />
          <StatCard title="Success Rate" value={`${data.summary.successRate}%`} icon={CheckCircle2} colorClass="text-green-400" bgClass="bg-green-500/10" subtitle={`${data.summary.totalHits - data.summary.errorHits} successful`} delay={0.3} />
          <StatCard title="Avg Latency" value={`${data.summary.avgLatency}ms`} icon={Clock} colorClass="text-yellow-400" bgClass="bg-yellow-500/10" delay={0.4} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="lg:col-span-2 bg-[#0f0f13]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-white">Request Volume</h2>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-sky-500"></div> Hits</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div> Errors</div>
              </div>
            </div>
            <div className="h-75 w-full">
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
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }} itemStyle={{ color: '#fff' }} />
                  <Area type="monotone" dataKey="hits" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorHits)" />
                  <Area type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorErrors)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="bg-[#0f0f13]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-2">Health Overview</h2>
            <p className="text-xs text-gray-400 mb-6">Success vs Error distribution</p>
            <div className="flex-1 flex items-center justify-center relative min-h-50">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }} itemStyle={{ color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-white">{data.summary.uniqueServices}</span>
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
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }} className="bg-[#0f0f13]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-semibold text-white">Top Endpoints</h2>
            <p className="text-xs text-gray-400 mt-1">Highest traffic and error rate</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/2 text-gray-400 text-xs uppercase tracking-wider">
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
                {data.topEndpoints.map((ep, idx) => (
                  <tr key={idx} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-white">{ep.serviceName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-300">{ep.endpoint}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${ep.method === 'GET' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : ep.method === 'POST' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ep.method === 'PUT' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {ep.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-white">{ep.totalHits}</td>
                    <td className="px-6 py-4 text-right"><span className={`font-medium ${ep.errorHits > 0 ? "text-red-400" : "text-gray-500"}`}>{ep.errorHits}</span></td>
                    <td className="px-6 py-4 text-right text-gray-300">{ep.avgLatency}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}