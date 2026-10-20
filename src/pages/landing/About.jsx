import { Link } from "react-router-dom";

export function About() {
  const team = [
    {
      name: "Vansh Sahu",
      role: "Founder & CEO",
      initials: "VS",
      color: "from-sky-400 to-blue-500",
    },
  ];

  const values = [
    {
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      title: "Speed First",
      desc: "Every millisecond counts. We obsess over performance so you can ship faster.",
    },
    {
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      title: "Reliability Always",
      desc: "Your infrastructure never sleeps — neither do we. 99.99% uptime guaranteed.",
    },
    {
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      title: "Developer First",
      desc: "Built by developers, for developers. Every feature starts with your feedback.",
    },
  ];

  return (
    <div className="w-full relative overflow-hidden py-24 px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-150 bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.12)_0%,transparent_70%)] blur-3xl pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs font-medium text-gray-300">
              About API Pulse
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif leading-tight mb-6">
            We're building the <br />
            <span className="italic text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-teal-400">
              future of reliability
            </span>
          </h1>
          <p className="text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            API Pulse was born from frustration. After years of wrestling with
            slow, bloated monitoring tools, we decided to build something better
            — something that developers actually love to use.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          {[
            { value: "10K+", label: "Developers" },
            { value: "99.99%", label: "Uptime" },
            { value: "2.5B", label: "API Calls/mo" },
            { value: "24/7", label: "Support" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/3 border border-white/5 rounded-2xl p-6 text-center"
            >
              <div className="text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-24">
          <h2 className="text-2xl font-serif text-white mb-6">Our Story</h2>
          <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
            <p>
              In 2022, our founders were running a fast-growing SaaS platform.
              They had tried every monitoring tool on the market — and every
              single one fell short.
            </p>
            <p>
              So they built their own. What started as an internal tool quickly
              became something bigger. When other engineering teams saw it, they
              asked for access.
            </p>
            <p>
              Today, we're a remote-first team of 25 engineers, designers, and
              builders spread across 8 countries.
            </p>
          </div>
        </div>

        <div className="mb-24">
          <h2 className="text-2xl font-serif text-white mb-8">
            What we believe
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-white/3 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center mb-4">
                  <svg
                    className="w-5 h-5 text-sky-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={v.icon}
                    />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">{v.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-serif text-white mb-8">The team</h2>
          <div className="flex justify-center">
            {team.map((member, i) => (
              <div
                key={i}
                className="bg-white/3 border border-white/5 rounded-2xl p-5 text-center hover:border-white/10 transition"
              >
                <div
                  className={`w-16 h-16 rounded-full mx-auto mb-3 bg-linear-to-br ${member.color} flex items-center justify-center text-white text-lg font-bold shadow-lg`}
                >
                  {member.initials}
                </div>
                <div className="text-sm font-medium text-white">
                  {member.name}
                </div>
                <div className="text-xs text-gray-400 mt-1">{member.role}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-linear-to-r from-sky-500/10 to-teal-500/10 border border-sky-500/20 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-medium text-white mb-2">
            Want to work with us?
          </h3>
          <p className="text-sm text-gray-400 mb-5">
            We're always looking for talented people who care about reliability.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-black px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}
