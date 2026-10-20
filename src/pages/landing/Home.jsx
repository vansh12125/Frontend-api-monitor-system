import  { useState, useEffect } from 'react';

const LiveMonitoringWidget = () => {
  const [latency, setLatency] = useState(32);
  const [requests, setRequests] = useState(1420);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setLatency((prev) => Math.max(20, Math.min(80, prev + (Math.random() * 10 - 5))));
      setRequests((prev) => Math.max(1000, Math.min(2000, prev + Math.floor(Math.random() * 50 - 25))));
    }, 2000);
    return () => clearInterval(interval);
  }, [isLive]);

  const endpoints = [
    { method: 'GET', path: '/api/users', status: '200 OK', ms: 24, color: 'text-green-400', bg: 'bg-green-500/10' },
    { method: 'POST', path: '/api/auth', status: '201 Created', ms: 45, color: 'text-green-400', bg: 'bg-green-500/10' },
    { method: 'GET', path: '/api/products', status: '200 OK', ms: 18, color: 'text-green-400', bg: 'bg-green-500/10' },
    { method: 'PUT', path: '/api/orders', status: '503 Error', ms: 210, color: 'text-red-400', bg: 'bg-red-500/10' },
    { method: 'DELETE', path: '/api/sessions', status: '204 No Content', ms: 12, color: 'text-green-400', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="relative w-full max-w-2xl mx-auto perspective-1000">
      <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="relative bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transform transition-transform duration-500 hover:scale-[1.02] hover:border-blue-500/30">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/2">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span className="text-xs font-medium text-gray-400 ml-2">api-monitor / dashboard</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsLive(!isLive)}>
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{isLive ? 'Live' : 'Paused'}</span>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="text-[10px] text-gray-400 mb-1">Avg Latency</div>
              <div className="text-xl font-bold text-white flex items-baseline gap-1">
                {Math.round(latency)}<span className="text-xs text-gray-500 font-normal">ms</span>
              </div>
              <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
                <div className="bg-blue-400 h-full rounded-full transition-all duration-500" style={{ width: `${(latency / 100) * 100}%` }}></div>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="text-[10px] text-gray-400 mb-1">Req / Sec</div>
              <div className="text-xl font-bold text-white">{requests}</div>
              <div className="flex gap-1 mt-2 h-1 items-end">
                {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                  <div key={i} className="flex-1 bg-teal-400/60 rounded-t-sm" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="text-[10px] text-gray-400 mb-1">Uptime</div>
              <div className="text-xl font-bold text-white">99.99%</div>
              <div className="text-[10px] text-green-400 mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                All systems operational
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-gray-500 px-2 pb-1 uppercase tracking-wider font-semibold">
              <span>Endpoint</span>
              <span>Status / Latency</span>
            </div>
            {endpoints.map((ep, i) => (
              <div key={i} className="flex items-center justify-between bg-white/3 hover:bg-white/6 transition-colors rounded-lg px-3 py-2.5 border border-white/5">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ep.bg} ${ep.color}`}>{ep.method}</span>
                  <span className="text-xs text-gray-300 font-mono">{ep.path}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] ${ep.color} hidden sm:block`}>{ep.status}</span>
                  <span className="text-xs text-gray-400 font-mono">{ep.ms}ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export  function Home() {
  return (
    <div className="w-full relative overflow-hidden selection:bg-white/20">
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-300 h-200 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.12)_0%,rgba(30,58,138,0.05)_30%,transparent_70%)] blur-3xl"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-blue-500/10 blur-[100px] rounded-full"></div>
      </div>

      <main id="home" className="relative z-10 flex flex-col items-center justify-start pt-36 px-4 w-full max-w-5xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] leading-[1.1] mb-6 tracking-tight flex flex-col items-center">
          <span className="font-serif">Monitor Your</span>
          <span className="font-serif italic text-transparent bg-clip-text bg-linear-to-r from-gray-200 to-gray-500 pb-2">
            APIs Effortlessly
          </span>
        </h1>

        <p className="text-sm sm:text-base text-gray-400 max-w-lg mb-10 leading-relaxed">
          Keep your services healthy with real-time uptime tracking, instant alerts, and deep performance analytics. Built for developers who demand reliability.
        </p>

        <a href="#features" className="bg-[#3b82f6] hover:bg-blue-500 text-white px-8 py-3 rounded-full text-sm font-medium transition duration-300 shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center gap-2 z-20 relative mb-16">
          Explore Features
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
        </a>

        <div className="relative z-20 w-full mt-4 -mb-20">
          <LiveMonitoringWidget />
        </div>

        <div className="w-full relative -mt-20 z-10 pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-transparent to-[#050505] z-30 pointer-events-none opacity-90"></div>
          <div className="absolute inset-0 bg-linear-to-r from-[#050505] via-transparent to-[#050505] z-30 pointer-events-none opacity-80"></div>
          
          <div className="flex gap-4 h-75 px-4 overflow-hidden opacity-80 transition-opacity duration-1000">
            <div className="flex-1 rounded-2xl overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Landscape 1" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
            <div className="flex-1 rounded-2xl overflow-hidden relative hidden md:block group">
              <img src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Landscape 2" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
            <div className="flex-1 rounded-2xl overflow-hidden relative hidden md:block group">
              <img src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Landscape 3" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
            <div className="flex-1 rounded-2xl overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Landscape 4" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
          </div>
        </div>
      </main>

      <section id="features" className="relative z-10 w-full max-w-5xl mx-auto px-6 py-24 mt-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Everything you need to <span className="italic text-gray-400">stay online</span></h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">Powerful monitoring tools that give you complete visibility into your API infrastructure.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Real-time Monitoring", desc: "Track latency, status codes, and error rates across all your endpoints with millisecond precision.", color: "blue" },
            { icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", title: "Instant Alerts", desc: "Get notified via Slack, email, or webhook the second something goes wrong. No more silent failures.", color: "teal" },
            { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "Deep Analytics", desc: "Visualize trends, pinpoint bottlenecks, and optimize performance with detailed historical data.", color: "purple" }
          ].map((f, i) => (
            <div key={i} className="bg-[#111]/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:border-white/20 transition duration-300">
              <div className={`w-10 h-10 rounded-xl bg-${f.color}-500/10 flex items-center justify-center mb-6`}>
                <svg className={`w-5 h-5 text-${f.color}-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={f.icon} />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="relative z-10 w-full max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Simple, transparent <span className="italic text-gray-400">pricing</span></h2>
        <p className="text-gray-400 text-sm mb-12 max-w-md mx-auto">Start for free, upgrade as you scale. No hidden fees, cancel anytime.</p>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
          <div className="bg-[#111]/30 border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-medium text-white mb-2">Hobby</h3>
            <p className="text-sm text-gray-400 mb-6">For side projects and testing.</p>
            <div className="text-4xl font-bold text-white mb-6">$0<span className="text-sm text-gray-500 font-normal">/mo</span></div>
            <ul className="space-y-3 text-sm text-gray-300 mb-8">
              {['5 Monitors', '5-min checks', 'Email alerts'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> {item}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition">Start for free</button>
          </div>

          <div className="bg-[#111]/70 border border-blue-500/30 rounded-2xl p-8 relative shadow-[0_0_30px_rgba(59,130,246,0.1)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Popular</div>
            <h3 className="text-xl font-medium text-white mb-2">Pro</h3>
            <p className="text-sm text-gray-400 mb-6">For production applications.</p>
            <div className="text-4xl font-bold text-white mb-6">$29<span className="text-sm text-gray-500 font-normal">/mo</span></div>
            <ul className="space-y-3 text-sm text-gray-300 mb-8">
              {['Unlimited Monitors', '30-sec checks', 'Slack & Webhooks', 'Status Pages'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> {item}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition shadow-lg shadow-blue-500/20">Upgrade to Pro</button>
          </div>
        </div>
      </section>

      <section className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">
            Built for modern infrastructure
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-70 hover:opacity-100 transition-opacity duration-500 select-none">
          <div className="flex flex-col items-center gap-2 group pointer-events-auto cursor-default">
            <svg className="w-10 h-10 text-[#4169E1] group-hover:scale-110 transition-transform duration-300 pointer-events-none" viewBox="0 0 24 24" fill="currentColor" draggable="false">
              <path d="M16.017 21.044v-2.947c.005-.422-.021-.844-.078-1.263-.046-.32-.174-.625-.371-.882a1.515 1.515 0 0 0-.916-.507 1.893 1.893 0 0 0-1.238.164c-.35.187-.638.482-.817.84a5.045 5.045 0 0 0-.4 1.462 3.265 3.265 0 0 1-.27.94c-.13.27-.343.487-.607.616a1.62 1.62 0 0 1-.812.135 1.504 1.504 0 0 1-1.223-.72 2.935 2.935 0 0 1-.42-1.196 8.71 8.71 0 0 1-.123-1.353v-1.55c0-.196.014-.392.043-.585a1.29 1.29 0 0 1 .214-.515c.1-.146.23-.263.38-.342a1.1 1.1 0 0 1 .522-.126h.733v3.24h1.382v-4.43H9.507c-.272-.001-.54.07-.775.208a1.59 1.59 0 0 0-.53.565 1.928 1.928 0 0 0-.232.833 10.288 10.288 0 0 0-.057 1.157v1.148c0 .873.067 1.687.203 2.44.135.752.37 1.408.705 1.967.335.559.79 1.002 1.366 1.328.577.327 1.29.49 2.138.49.64 0 1.213-.08 1.72-.242a3.98 3.98 0 0 0 1.31-.686 4.25 4.25 0 0 0 .915-1.08c.25-.42.443-.87.578-1.35Z"/>
              <path d="M14.183 11.43h-.386V5.345c0-.28-.01-.552-.028-.816a4.32 4.32 0 0 0-.115-.757 2.36 2.36 0 0 0-.284-.66 1.85 1.85 0 0 0-.513-.515 2.29 2.29 0 0 0-.808-.303 4.94 4.94 0 0 0-1.187-.112c-.44 0-.84.037-1.198.112a2.29 2.29 0 0 0-.809.303c-.222.13-.397.305-.513.515-.116.21-.21.44-.284.66a4.32 4.32 0 0 0-.115.757 8.72 8.72 0 0 0-.028.816v6.085h-.386a.55.55 0 0 1-.55-.55V5.345c0-.322.012-.635.033-.938.021-.303.066-.59.135-.86.07-.272.17-.52.303-.745.132-.226.31-.415.533-.567.222-.152.492-.263.81-.333A5.94 5.94 0 0 1 12 1.77c.647 0 1.202.043 1.665.13.463.086.844.21 1.144.373.298.163.524.362.674.597.15.235.253.498.308.79.055.29.08.597.073.92v6.085c0 .303-.246.55-.55.55h-.578a.55.55 0 0 1-.55-.55v-.766ZM8.478 8.67h7.045v1.383H8.478V8.67Z"/>
            </svg>
            <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">PostgreSQL</span>
          </div>

          <div className="flex flex-col items-center gap-2 group pointer-events-auto cursor-default">
            <svg className="w-10 h-10 text-[#FF6600] group-hover:scale-110 transition-transform duration-300 pointer-events-none" viewBox="0 0 24 24" fill="currentColor" draggable="false">
              <path d="M23.85 8.78h-3.135c-.37 0-.67.3-.67.67v3.135c0 .37-.3.67-.67.67h-1.83c-.37 0-.67-.3-.67-.67V8.78c0-.37-.3-.67-.67-.67H12.67c-.37 0-.67.3-.67.67v3.135c0 .37-.3.67-.67.67H9.5c-.37 0-.67-.3-.67-.67V8.78c0-.37-.3-.67-.67-.67H4.455c-.37 0-.67.3-.67.67v3.135c0 .37-.3.67-.67.67H.15c-.37 0-.67-.3-.67-.67V8.78C-.52 6.66.75 4.8 2.78 3.86c.66-.3 1.4-.46 2.16-.46h14.74c2.92 0 5.45 1.83 6.36 4.55.14.4.22.83.22 1.27v.66c0 .37-.3.67-.67.67l-1.74-.77Z"/>
              <path d="M.15 12.13h3.135c.37 0 .67.3.67.67v3.135c0 .37.3.67.67.67h1.83c.37 0 .67-.3.67-.67V12.13c0-.37.3-.67.67-.67h3.135c.37 0 .67.3.67.67v3.135c0 .37.3.67.67.67h1.83c.37 0 .67-.3.67-.67V12.13c0-.37.3-.67.67-.67h3.135c.37 0 .67.3.67.67v3.135c0 .37.3.67.67.67h1.83c.37 0 .67-.3.67-.67V12.13c1.7 2.09 1.36 5.25-.83 6.98-.66.51-1.44.86-2.26 1.02-.35.07-.71.1-1.07.1H5.14c-2.19 0-4.17-1.13-5.28-2.96-.47-.78-.71-1.66-.71-2.56v-.66c0-.37.3-.67.67-.67l.33-.25Z"/>
            </svg>
            <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">RabbitMQ</span>
          </div>

          <div className="flex flex-col items-center gap-2 group pointer-events-auto cursor-default">
            <svg className="w-10 h-10 text-[#2496ED] group-hover:scale-110 transition-transform duration-300 pointer-events-none" viewBox="0 0 24 24" fill="currentColor" draggable="false">
              <path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.186.186 0 0 0-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 0 0-.75.748 11.376 11.376 0 0 0 .692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 0 0 3.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z"/>
            </svg>
            <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">Docker</span>
          </div>

          <div className="flex flex-col items-center gap-2 group pointer-events-auto cursor-default">
            <svg className="w-10 h-10 text-[#47A248] group-hover:scale-110 transition-transform duration-300 pointer-events-none" viewBox="0 0 24 24" fill="currentColor" draggable="false">
              <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0 1 11.91 24h.481c.114-1.032.12-1.093.12-1.093.417-5.565-3.868-9.458-4.015-9.586 3.262-3.645 3.316-7.552 3.342-8.198.04.06 1.354 2.82 2.138 5.04.78 2.22 1.65 4.85 2.084 7.12.434 2.27.324 3.74.324 3.74s2.183-1.23 2.958-4.77c.45-2.05.13-3.88.13-3.88h.003Z"/>
            </svg>
            <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">MongoDB</span>
          </div>

          <div className="flex flex-col items-center gap-2 group pointer-events-auto cursor-default">
            <svg className="w-10 h-10 text-[#339933] group-hover:scale-110 transition-transform duration-300 pointer-events-none" viewBox="0 0 24 24" fill="currentColor" draggable="false">
              <path d="M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737a1.844 1.844 0 0 1-.922-1.585V16.96c0-.547.293-1.054.768-1.327l5.767-3.33a1.85 1.85 0 0 1 1.84 0l5.768 3.33c.474.273.768.78.768 1.327v3.47a1.844 1.844 0 0 1-.922 1.586l-2.936 1.737c-.28.163-.601.247-.922.247m-2.12-4.15c0 .274.147.527.384.664l2.107 1.247c.237.137.52.137.757 0l2.107-1.247a.766.766 0 0 0 .383-.664v-2.494a.766.766 0 0 0-.383-.664l-2.107-1.246a.766.766 0 0 0-.757 0L9.262 16.69a.766.766 0 0 0-.384.664v2.494Z"/>
              <path d="M12.022 1.5c.322 0 .642.084.923.247l2.936 1.737c.474.274.768.78.768 1.327v3.47a1.844 1.844 0 0 1-.768 1.327l-5.767 3.33a1.85 1.85 0 0 1-1.84 0l-5.768-3.33a1.844 1.844 0 0 1-.768-1.327v-3.47c0-.547.294-1.053.768-1.327L7.442 1.747c.28-.163.601-.247.922-.247m2.12 4.15a.766.766 0 0 0-.384-.664L11.651 3.74a.766.766 0 0 0-.757 0L8.787 4.986a.766.766 0 0 0-.383.664v2.494c0 .274.147.527.383.664l2.107 1.247c.237.137.52.137.757 0l2.107-1.247a.766.766 0 0 0 .384-.664V5.65Z" opacity=".8"/>
              <path d="M5.514 6.14c.32 0 .641.084.922.247l2.936 1.737a1.844 1.844 0 0 1 .922 1.585v3.47c0 .547-.294 1.054-.768 1.327l-5.767 3.33a1.85 1.85 0 0 1-1.84 0l-1.64-.946a1.844 1.844 0 0 1-.922-1.585v-1.68c0-.274.147-.527.384-.664l1.14-.658a.766.766 0 0 0 .383-.664v-.947a.766.766 0 0 1 .384-.664l.735-.424a.766.766 0 0 1 .757 0l.735.424a.766.766 0 0 0 .757 0l.735-.424a.766.766 0 0 0 .384-.664V7.347a.766.766 0 0 0-.384-.664l-.735-.424a.766.766 0 0 0-.757 0l-.735.424a.766.766 0 0 1-.757 0l-.735-.424a.766.766 0 0 0-.757 0L.4 6.573a.766.766 0 0 0-.384.664v.947a.766.766 0 0 1-.384.664L-.508 9.506a.766.766 0 0 0-.384.664v1.68c0 .547.294 1.054.768 1.327l1.64.947c.28.163.601.247.922.247m0-2.095c-.32 0-.641-.084-.922-.247l-.735-.424a.766.766 0 0 1-.384-.664V5.816a.766.766 0 0 1 .384-.664l.735-.424a.766.766 0 0 1 .757 0l.735.424a.766.766 0 0 1 .384.664v1.68a.766.766 0 0 1-.384.664l-.735.424a.766.766 0 0 1-.757 0" opacity=".6"/>
            </svg>
            <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">Node.js</span>
          </div>
        </div>
      </section>
    </div>
  );
}