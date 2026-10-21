import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  RefreshCw, Database, Calendar, Filter, ChevronLeft, ChevronRight
} from "lucide-react";
import { Sidebar } from "@/components/ui/Sidebar";
import { GetEndpointHealth } from "@/service/analytics";

const toInputDate = (date) => date.toISOString().split('T')[0];

const getMsDateRange = (startStr, endStr) => {
  const start = new Date(startStr);
  const end = new Date(endStr);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { startTime: start.getTime(), endTime: end.getTime() };
};

export function TopEndpoints() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return toInputDate(d);
  });
  const [endDate, setEndDate] = useState(() => toInputDate(new Date()));
  const [method, setMethod] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [endpointFilter, setEndpointFilter] = useState("");
  
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { startTime, endTime } = getMsDateRange(startDate, endDate);
      
      const params = {
        startTime,
        endTime,
        limit,
        offset,
      };
      if (method) params.method = method;
      if (serviceName) params.serviceName = serviceName;
      if (endpointFilter) params.endpoint = endpointFilter;

      const res = await GetEndpointHealth(params);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch {
      setError("Failed to fetch endpoints. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, offset, method, serviceName, endpointFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleApplyFilter = () => {
    if (offset !== 0) {
      setOffset(0);
    } else {
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 md:p-10 w-full overflow-x-hidden">
        
        <div className="flex flex-col mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Top Endpoints</h1>
            <p className="text-sm text-gray-400 mt-1">Analyze endpoint performance and health.</p>
          </div>
          
          <div className="flex flex-wrap items-end gap-3 bg-[#0f0f13]/90 border border-white/10 rounded-2xl p-4 shadow-lg">
            <div className="flex flex-col">
              <label className="text-[10px] uppercase text-gray-500 font-semibold mb-1 ml-1">Start Date</label>
              <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-xl px-3 py-2">
                <Calendar className="w-4 h-4 text-sky-400" />
                <input type="date" value={startDate} max={endDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-sm text-white focus:outline-none scheme-dark" />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] uppercase text-gray-500 font-semibold mb-1 ml-1">End Date</label>
              <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-xl px-3 py-2">
                <Calendar className="w-4 h-4 text-sky-400" />
                <input type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-sm text-white focus:outline-none scheme-dark" />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] uppercase text-gray-500 font-semibold mb-1 ml-1">Method</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)} className="bg-black/40 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none appearance-none w-32">
                <option value="">All</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div className="flex flex-col flex-1 min-w-37.5">
              <label className="text-[10px] uppercase text-gray-500 font-semibold mb-1 ml-1">Service</label>
              <input type="text" placeholder="e.g. auth-mq" value={serviceName} onChange={(e) => setServiceName(e.target.value)} className="bg-black/40 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none w-full" />
            </div>
            <div className="flex flex-col flex-1 min-w-37.5">
              <label className="text-[10px] uppercase text-gray-500 font-semibold mb-1 ml-1">Endpoint</label>
              <input type="text" placeholder="e.g. /auth/stats" value={endpointFilter} onChange={(e) => setEndpointFilter(e.target.value)} className="bg-black/40 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none w-full" />
            </div>
            <button onClick={handleApplyFilter} disabled={isLoading} className="p-3 bg-sky-500 hover:bg-sky-400 rounded-xl text-white transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] mt-auto">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isLoading && !data && <div className="flex justify-center py-20"><RefreshCw className="w-8 h-8 text-sky-500 animate-spin" /></div>}
        {error && <div className="text-red-400 p-4 bg-red-500/10 rounded-xl">{error}</div>}

        {data && (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0f0f13]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white/2 text-gray-400 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-medium">Service</th>
                      <th className="px-6 py-4 font-medium">Endpoint</th>
                      <th className="px-6 py-4 font-medium">Method</th>
                      <th className="px-6 py-4 font-medium text-right">Total Req</th>
                      <th className="px-6 py-4 font-medium text-right">Failed</th>
                      <th className="px-6 py-4 font-medium text-right">Error Rate</th>
                      <th className="px-6 py-4 font-medium text-right">Avg Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.endpoints.length === 0 ? (
                      <tr><td colSpan="7" className="px-6 py-10 text-center text-gray-500">No endpoints found for these filters.</td></tr>
                    ) : (
                      data.endpoints.map((ep, idx) => (
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
                          <td className="px-6 py-4 text-right font-medium text-white">{ep.totalRequests}</td>
                          <td className="px-6 py-4 text-right"><span className={`font-medium ${ep.failedRequests > 0 ? "text-red-400" : "text-gray-500"}`}>{ep.failedRequests}</span></td>
                          <td className="px-6 py-4 text-right text-gray-300">{ep.errorRate}%</td>
                          <td className="px-6 py-4 text-right text-gray-300">{ep.avgLatency}ms</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <div className="flex justify-between items-center bg-[#0f0f13]/80 border border-white/5 rounded-2xl p-4">
              <span className="text-sm text-gray-400">
                Showing <span className="font-medium text-white">{offset + 1}</span> to <span className="font-medium text-white">{offset + data.endpoints.length}</span>
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setOffset(Math.max(0, offset - limit))} 
                  disabled={offset === 0 || isLoading}
                  className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 rounded-lg text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setOffset(offset + limit)} 
                  disabled={data.endpoints.length < limit || isLoading}
                  className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 rounded-lg text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}