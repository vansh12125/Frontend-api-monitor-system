import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RegisterUser } from "@/service/auth";
import { VALIDATION } from "@/constants";
const InputField = ({ label, name, type = "text", placeholder, required = true, value, onChange, error }) => (
  <div>
    <label className="block text-xs font-medium text-gray-400 mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-white/5 border ${error ? "border-red-500/50" : "border-white/10"} rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition`}
    />
    {error && <p className="text-red-400 text-[10px] mt-1.5 ml-1">{error}</p>}
  </div>
);
export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    email: "",
    clientName: "",
    description: "",
    website: "",
    clientEmail: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < VALIDATION.USERNAME.MIN_LENGTH) {
      newErrors.username = `Username must be at least ${VALIDATION.USERNAME.MIN_LENGTH} characters`;
    } else if (formData.username.length > VALIDATION.USERNAME.MAX_LENGTH) {
      newErrors.username = `Username must be less than ${VALIDATION.USERNAME.MAX_LENGTH} characters`;
    } else if (!VALIDATION.USERNAME.PATTERN.test(formData.username)) {
      newErrors.username = "Username must start with a letter and contain only letters, numbers, and underscores";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.length < VALIDATION.NAME.MIN_LENGTH) {
      newErrors.name = `Name must be at least ${VALIDATION.NAME.MIN_LENGTH} characters`;
    } else if (formData.name.length > VALIDATION.NAME.MAX_LENGTH) {
      newErrors.name = `Name must be less than ${VALIDATION.NAME.MAX_LENGTH} characters`;
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (/\s/.test(formData.password)) {
      newErrors.password = "Password cannot contain spaces";
    } else if (formData.password.length < VALIDATION.PASSWORD.MIN_LENGTH) {
      newErrors.password = `Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters`;
    } else if (formData.password.length > VALIDATION.PASSWORD.MAX_LENGTH) {
      newErrors.password = `Password must be less than ${VALIDATION.PASSWORD.MAX_LENGTH} characters`;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Must contain uppercase, lowercase, and a number";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!VALIDATION.EMAIL.PATTERN.test(formData.email)) {
      newErrors.email = "Invalid email format";
    } else if (formData.email.length > VALIDATION.EMAIL.MAX_LENGTH) {
      newErrors.email = `Email must be less than ${VALIDATION.EMAIL.MAX_LENGTH} characters`;
    }
    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    } else if (formData.clientName.length < VALIDATION.CLIENT_NAME.MIN_LENGTH) {
      newErrors.clientName = `Client name must be at least ${VALIDATION.CLIENT_NAME.MIN_LENGTH} characters`;
    } else if (formData.clientName.length > VALIDATION.CLIENT_NAME.MAX_LENGTH) {
      newErrors.clientName = `Client name must be less than ${VALIDATION.CLIENT_NAME.MAX_LENGTH} characters`;
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < VALIDATION.DESCRIPTION.MIN_LENGTH) {
      newErrors.description = `Description must be at least ${VALIDATION.DESCRIPTION.MIN_LENGTH} characters`;
    } else if (formData.description.length > VALIDATION.DESCRIPTION.MAX_LENGTH) {
      newErrors.description = `Description must be less than ${VALIDATION.DESCRIPTION.MAX_LENGTH} characters`;
    }
    if (!formData.website.trim()) {
      newErrors.website = "Website is required";
    } else if (formData.website.length > VALIDATION.WEBSITE.MAX_LENGTH) {
      newErrors.website = `Website must be less than ${VALIDATION.WEBSITE.MAX_LENGTH} characters`;
    } else {
      const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (!urlRegex.test(formData.website)) {
        newErrors.website = "Please enter a valid URL (e.g., https://example.com)";
      } else {
        try {
          new URL(formData.website.startsWith('http') ? formData.website : `https://${formData.website}`);
        } catch {
          newErrors.website = "Please enter a valid URL";
        }
      }
    }
    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = "Client email is required";
    } else if (!VALIDATION.EMAIL.PATTERN.test(formData.clientEmail)) {
      newErrors.clientEmail = "Invalid email format";
    } else if (formData.clientEmail.length > VALIDATION.EMAIL.MAX_LENGTH) {
      newErrors.clientEmail = `Email must be less than ${VALIDATION.EMAIL.MAX_LENGTH} characters`;
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
      const response = await RegisterUser(formData);
      if (response.data.success) {
        navigate("/signin");
      }
    } catch (err) {
      const backendError = err.response?.data;
      if (backendError?.error && Array.isArray(backendError.error)) {
        const fieldErrors = {};
        backendError.error.forEach((item) => {
          if (item.field) {
            fieldErrors[item.field] = item.message;
          }
        });
        setErrors(fieldErrors);
      } else if (backendError?.error?.code === "USERNAME_ALREADY_EXISTS") {
        setErrors({ username: backendError.message || "Username already exists" });
      } else if (backendError?.error?.code === "EMAIL_ALREADY_EXISTS") {
        setErrors({ email: backendError.message || "Email already exists" });
      } else if (backendError?.error?.code === "CLIENT_EMAIL_ALREADY_EXISTS") {
        setErrors({ clientEmail: backendError.message || "Client email already exists" });
      } else {
        setServerError(backendError?.message || "An error occurred during registration.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full max-w-2xl p-8 bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
      <div className="flex justify-center mb-6">
        <Link to="/" className="w-12 h-12 rounded-2xl bg-linear-to-br from-sky-400 to-teal-400 p-px">
          <div className="w-full h-full rounded-2xl bg-[#0a0a0a] flex items-center justify-center">
            <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </Link>
      </div>
      <h2 className="text-2xl font-serif text-center mb-2">Create an account</h2>
      <p className="text-sm text-gray-400 text-center mb-8">
        Get started with API monitoring in minutes
      </p>
      {serverError && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center">
          {serverError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Username"
            name="username"
            placeholder="tonystark"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
          />
          <InputField
            label="Full Name"
            name="name"
            placeholder="Tony Stark"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="tony@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Password <span className="text-red-400">*</span>
            </label>
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700  transition"
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
        </div>
        <hr className="border-white/10 my-4" />
        <h3 className="text-sm font-medium text-white mb-2">Client Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Client Name"
            name="clientName"
            placeholder="Acme Corp"
            value={formData.clientName}
            onChange={handleChange}
            error={errors.clientName}
          />
          <InputField
            label="Client Email"
            name="clientEmail"
            type="email"
            placeholder="contact@acme.com"
            value={formData.clientEmail}
            onChange={handleChange}
            error={errors.clientEmail}
          />
        </div>
        <InputField
          label="Website"
          name="website"
          type="url"
          placeholder="https://acme.com"
          value={formData.website}
          onChange={handleChange}
          error={errors.website}
        />
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Tell us about your project or company..."
            className={`w-full bg-white/5 border ${errors.description ? "border-red-500/50" : "border-white/10"} rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition resize-none`}
          ></textarea>
          {errors.description && <p className="text-red-400 text-[10px] mt-1.5 ml-1">{errors.description}</p>}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition duration-300 shadow-[0_0_20px_rgba(56,189,248,0.2)] flex items-center justify-center gap-2 mt-6"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            "Create Account"
          )}
        </button>
      </form>
      <p className="text-center text-xs text-gray-400 mt-6">
        Already have an account?{" "}
        <Link to="/signin" className="text-sky-400 hover:text-sky-300 font-medium transition">
          Sign in
        </Link>
      </p>
    </div>
  );
}