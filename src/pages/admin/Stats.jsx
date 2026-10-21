import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Activity, AlertTriangle, CheckCircle2, Clock, 
  RefreshCw, Database, Calendar, Filter, Layers
} from "lucide-react";
import { Sidebar } from "@/components/ui/Sidebar";
import { GetOverallStats } from "@/service/analytics";

const toInputDate = (date) => date.toISOString().split('T')[0];

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

export function Stats() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return toInputDate(d);
  });
  const [endDate, setEndDate] = useState(() => toInputDate(new Date()));

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { startTime, endTime } = getIsoDateRange(startDate, endDate);
      const res = await GetOverallStats(startTime, endTime);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch {
      setError("Failed to fetch stats. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStats();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchStats]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 md:p-10 w-full overflow-x-hidden">
        
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Overall Stats</h1>
            <p className="text-sm text-gray-400 mt-1">Aggregate performance across all services.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#0f0f13]/90 border border-white/10 rounded-2xl p-3 shadow-lg">
            <div className="flex flex-col">
              <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1 ml-1">Start Time</label>
              <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-xl px-3 py-2">
                <Calendar className="w-4 h-4 text-sky-400" />
                <input type="date" value={startDate} max={endDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent border-none text-sm text-white focus:outline-none scheme-dark w-full" />
              </div>
            </div>
            <span className="hidden sm:block text-gray-600 mt-4">-</span>
            <div className="flex flex-col">
              <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1 ml-1">End Time</label>
              <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-xl px-3 py-2">
                <Calendar className="w-4 h-4 text-sky-400" />
                <input type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent border-none text-sm text-white focus:outline-none scheme-dark w-full" />
              </div>
            </div>
            <button onClick={fetchStats} disabled={isLoading} className="mt-2 sm:mt-4 p-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)]">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isLoading && !data && <div className="flex justify-center py-20"><RefreshCw className="w-8 h-8 text-sky-500 animate-spin" /></div>}
        {error && <div className="text-red-400 p-4 bg-red-500/10 rounded-xl">{error}</div>}

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Hits" value={data.totalHits} icon={Activity} colorClass="text-sky-400" bgClass="bg-sky-500/10" delay={0.1} />
            <StatCard title="Error Rate" value={`${data.errorRate}%`} icon={AlertTriangle} colorClass="text-red-400" bgClass="bg-red-500/10" subtitle={`${data.errorHits} errors`} delay={0.2} />
            <StatCard title="Success Rate" value={`${data.successRate}%`} icon={CheckCircle2} colorClass="text-green-400" bgClass="bg-green-500/10" subtitle={`${data.totalHits - data.errorHits} successful`} delay={0.3} />
            <StatCard title="Avg Latency" value={`${data.avgLatency}ms`} icon={Clock} colorClass="text-yellow-400" bgClass="bg-yellow-500/10" delay={0.4} />
            <StatCard title="Unique Services" value={data.uniqueService} icon={Layers} colorClass="text-purple-400" bgClass="bg-purple-500/10" delay={0.5} />
            <StatCard title="Unique Endpoints" value={data.uniqueEndpoints} icon={Database} colorClass="text-indigo-400" bgClass="bg-indigo-500/10" delay={0.6} />
          </div>
        )}

      </main>
    </div>
  );
}