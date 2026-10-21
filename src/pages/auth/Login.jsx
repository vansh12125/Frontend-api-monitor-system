import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LoginUser } from "@/service/auth";
import { VALIDATION } from "@/constants";
import { useAuth } from "@/hooks/useAuth";

export function Login() {
  const navigate = useNavigate();
  const { fetchAndSetUser } = useAuth();
  
  const [formData, setFormData] = useState({ context: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!formData.context.trim()) {
      newErrors.context = "Email or Username is required";
    } else {
      const isEmail = formData.context.includes("@");
      if (isEmail) {
        if (!VALIDATION.EMAIL.PATTERN.test(formData.context)) {
          newErrors.context = "Invalid email format";
        } else if (formData.context.length > VALIDATION.EMAIL.MAX_LENGTH) {
          newErrors.context = `Email must be less than ${VALIDATION.EMAIL.MAX_LENGTH} characters`;
        }
      } else {
        if (formData.context.length < VALIDATION.USERNAME.MIN_LENGTH) {
          newErrors.context = `Username must be at least ${VALIDATION.USERNAME.MIN_LENGTH} characters`;
        } else if (formData.context.length > VALIDATION.USERNAME.MAX_LENGTH) {
          newErrors.context = `Username must be less than ${VALIDATION.USERNAME.MAX_LENGTH} characters`;
        } else if (!VALIDATION.USERNAME.PATTERN.test(formData.context)) {
          newErrors.context = "Username must start with a letter and contain only letters, numbers, and underscores";
        }
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (/\s/.test(formData.password)) {
      newErrors.password = "Password cannot contain spaces";
    } else if (formData.password.length < VALIDATION.PASSWORD.MIN_LENGTH) {
      newErrors.password = `Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters`;
    } else if (formData.password.length > VALIDATION.PASSWORD.MAX_LENGTH) {
      newErrors.password = `Password must be less than ${VALIDATION.PASSWORD.MAX_LENGTH} characters`;
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setServerError("");

    try {
      const response = await LoginUser(formData);
      
      if (response.data.success) {
        const profileFetched = await fetchAndSetUser();
        if (profileFetched) {
          navigate("/dashboard");
        } else {
          setServerError("Failed to fetch user profile.");
        }
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setServerError(err.response.data.message || "Invalid credentials.");
      } else {
        setServerError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
      <div className="flex justify-center mb-8">
        <Link to="/" className="w-12 h-12 rounded-2xl bg-linear-to-br from-sky-400 to-teal-400 p-px">
          <div className="w-full h-full rounded-2xl bg-[#0a0a0a] flex items-center justify-center">
            <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </Link>
      </div>

      <h2 className="text-2xl font-serif text-center mb-2">Welcome back</h2>
      <p className="text-sm text-gray-400 text-center mb-8">
        Enter your credentials to access your dashboard
      </p>

      {serverError && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Email or Username</label>
          <input
            type="text"
            name="context"
            value={formData.context}
            onChange={handleChange}
            placeholder="you@company.com or username"
            className={`w-full bg-white/5 border ${errors.context ? "border-red-500/50" : "border-white/10"} rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition`}
          />
          {errors.context && <p className="text-red-400 text-[10px] mt-1.5 ml-1">{errors.context}</p>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-medium text-gray-400">Password</label>
            <a href="#" className="text-xs text-sky-400 hover:text-sky-300 transition">Forgot password?</a>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full bg-white/5 border ${errors.password ? "border-red-500/50" : "border-white/10"} rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-[10px] mt-1.5 ml-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition duration-300 shadow-[0_0_20px_rgba(56,189,248,0.2)] flex items-center justify-center gap-2 mt-4"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-8">
        Don't have an account?{" "}
        <Link to="/signup" className="text-sky-400 hover:text-sky-300 font-medium transition">
          Create one
        </Link>
      </p>
    </div>
  );
}