import { useState, useEffect ,useRef} from "react";
import { useNavigate, useLocation } from "react-router-dom";
export function Navbar({ isLandingPage = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if (!isLandingPage) return;
    const sections = ["home", "features"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isLandingPage]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname]);

  const handleAnchorClick = (e, id) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { name: "Home", type: "anchor", id: "home" },
    { name: "About", type: "route", path: "/about" },
    { name: "Contact", type: "route", path: "/contact" },
    { name: "Features", type: "anchor", id: "features" },
  ];

  return (
    <>
      {}
      <div className="fixed top-6 left-0 right-0 z-50 hidden md:flex justify-center px-4 pointer-events-none">
        <nav
          className={`
            pointer-events-auto flex items-center gap-1 
            bg-white/5 backdrop-blur-2xl 
            border border-white/10 
            rounded-full px-2 py-2 
            shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] 
            transition-all duration-500 ease-out
            ${scrolled ? "bg-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.3)] scale-95" : ""}
          `}
        >
          {navLinks.map((link) =>
            link.type === "anchor" ? (
              <a
                key={link.name}
                href={`#${link.id}`}
                onClick={(e) => handleAnchorClick(e, link.id)}
                className={`
                  relative px-5 py-2.5 text-xs font-medium rounded-full transition-all duration-300 flex items-center gap-2
                  ${
                    isLandingPage && activeSection === link.id
                      ? "bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {link.name}
              </a>
            ) : (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className={`
                  relative px-5 py-2.5 text-xs font-medium rounded-full transition-all duration-300 flex items-center gap-2
                  ${
                    location.pathname === link.path
                      ? "bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {link.name}
              </button>
            ),
          )}
          <div className="w-px h-5 bg-white/10 mx-1"></div>
          <button
            onClick={() => navigate("/signin")}
            className="px-4 py-2.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            Log in
          </button>
        </nav>
      </div>
      {}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-95 transition-transform"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>
      {}
      <div
        className={`
          md:hidden fixed inset-0 z-40 transition-all duration-300
          ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
        {}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        {}
        <div
          className={`
            absolute top-20 right-4 w-64 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl
            transition-all duration-300 transform origin-top-right
            ${isMobileMenuOpen ? "translate-y-0 opacity-100 scale-100" : "-translate-y-4 opacity-0 scale-95"}
          `}
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) =>
              link.type === "anchor" ? (
                <a
                  key={link.name}
                  href={`#${link.id}`}
                  onClick={(e) => handleAnchorClick(e, link.id)}
                  className={`
                    px-4 py-3 rounded-xl text-sm font-medium transition-colors
                    ${
                      isLandingPage && activeSection === link.id
                        ? "bg-white/10 text-white"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  {link.name}
                </a>
              ) : (
                <button
                  key={link.name}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate(link.path);
                  }}
                  className={`
                    text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors
                    ${
                      location.pathname === link.path
                        ? "bg-white/10 text-white"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  {link.name}
                </button>
              ),
            )}
            <hr className="border-white/10 my-2" />
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate("/signin");
              }}
              className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition text-sm"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
