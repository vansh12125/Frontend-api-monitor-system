import  { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate("/");
    }
  }, [countdown, navigate]);

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center font-sans text-white overflow-hidden bg-black bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("/assets/error-bg.jpg")',
      }}
    >
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between h-full pt-12 md:pt-0 select-none">
        <div className="hidden md:block flex-1"></div>

        <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start mt-8 md:mt-0 ml-auto">
          <h2 className="text-3xl md:text-5xl font-semibold mb-2">Oops!</h2>

          <h1 className="text-[120px] md:text-[200px] leading-none font-bold tracking-tighter mb-4">
            404
          </h1>

          <p className="text-sm md:text-lg text-gray-200 max-w-sm leading-relaxed mb-8">
            Your page is currently under maintenance and will guide you back to
            the homepage after {countdown} seconds.
          </p>

          <Link
            to="/"
            className="border border-white/40 hover:border-white hover:bg-white/10 px-8 py-3 rounded-full text-sm md:text-base font-medium transition-all duration-300"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
