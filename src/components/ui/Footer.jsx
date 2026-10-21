import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const handleAnchorClick = (e, id) => {
    e.preventDefault();
    if (window.location.pathname !== "/") {
      // eslint-disable-next-line react-hooks/immutability
      window.location.href = `/#${id}`;
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const footerLinks = {
    Product: [
      { name: "Features", id: "features" },
      { name: "Pricing", id: "pricing" },
    ],
    Company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  };

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/vansh12125",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/vanshsahu98/",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "LeetCode",
      href: "https://leetcode.com/u/Vansh_12125/",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative z-10 w-full bg-[#030303] border-t border-white/5 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-50 bg-blue-500/5 blur-[100px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-16 border-b border-white/5">
          <div className="space-y-5">
            <a href="/" className="flex items-center gap-2 w-fit">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-sky-400 to-teal-400 p-px">
                <div className="w-full h-full rounded-xl bg-[#030303] flex items-center justify-center">
                  <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                API<span className="text-sky-400">Pulse</span>
              </span>
            </a>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              The all-in-one API monitoring platform built for developers who
              demand reliability. Real-time alerts, deep analytics, and
              blazing-fast uptime tracking.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:pl-12 lg:border-l lg:border-white/5">
            <h3 className="text-white font-semibold text-lg mb-2">
              Stay in the loop
            </h3>
            <p className="text-sm text-gray-400 mb-5">
              Get the latest product updates, engineering tips, and API best
              practices delivered to your inbox. No spam, ever.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition"
              />
              <button
                type="submit"
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  subscribed ? "bg-green-500 text-white" : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                {subscribed ? "✓ Subscribed" : "Subscribe"}
              </button>
            </form>
            <p className="text-[10px] text-gray-500 mt-3">
              By subscribing, you agree to our{" "}
              <a href="/privacy" className="text-sky-400 hover:text-sky-300">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16">
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.Product.map((link) => (
                <li key={link.name}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => handleAnchorClick(e, link.id)}
                    className="text-sm text-gray-400 hover:text-sky-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.Company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-sky-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.Legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-sky-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">System</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-sky-400 transition-colors duration-200 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  All Systems Operational
                </a>
              </li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-sky-400 transition-colors duration-200">Uptime History</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-sky-400 transition-colors duration-200">Security</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-sky-400 transition-colors duration-200">GDPR Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} API Pulse, Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="/about" className="hover:text-white transition-colors">About</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            <span>Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}