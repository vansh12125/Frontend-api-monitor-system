import { useState } from "react";
import { motion } from "framer-motion";
import { 
 Shield, LogOut, Key, Mail, 
  CheckCircle2, AlertTriangle, Eye, EyeOff, ShieldCheck 
} from "lucide-react";
import { Sidebar } from "@/components/ui/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { UpdatePassword } from "@/service/auth";
import { VALIDATION } from "@/constants";
export function Settings() {
  const { user, logoutUser } = useAuth();
  const [formData, setFormData] = useState({ currentPassword: "", newPassword: "" });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
    if (formErrors.server) setFormErrors((prev) => ({ ...prev, server: "" }));
    if (successMessage) setSuccessMessage("");
  };
  const validate = () => {
    const errors = {};
    if (!formData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    if (!formData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (/\s/.test(formData.newPassword)) {
      errors.newPassword = "Password cannot contain spaces";
    } else if (formData.newPassword.length < VALIDATION.PASSWORD.MIN_LENGTH) {
      errors.newPassword = `Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters`;
    } else if (formData.newPassword.length > VALIDATION.PASSWORD.MAX_LENGTH) {
      errors.newPassword = `Password must be less than ${VALIDATION.PASSWORD.MAX_LENGTH} characters`;
    } else if (formData.newPassword === formData.currentPassword) {
      errors.newPassword = "New password must be different from current password";
    }
    return errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await UpdatePassword(formData);
      if (res.data.success) {
        setSuccessMessage("Password updated successfully!");
        setFormData({ currentPassword: "", newPassword: "" });
      }
    } catch (err) {
      const backendError = err.response?.data;
      if (backendError?.error?.code === "INVALID_CREDENTIALS") {
        setFormErrors({ currentPassword: "Incorrect current password" });
      } else {
        setFormErrors({ server: backendError?.message || "Failed to update password." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-10 w-full overflow-x-hidden">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your account preferences and security.</p>
        </div>
        <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-1 space-y-6">
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0f0f13]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-sky-400 to-blue-600 flex items-center justify-center text-2xl font-bold shadow-[0_0_20px_rgba(56,189,248,0.3)] mb-4">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <h2 className="text-xl font-bold text-white">{user?.name || "User"}</h2>
                <p className="text-sm text-gray-400 mb-4">@{user?.username || "username"}</p>
                <div className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2 mb-6">
                  <Shield className={`w-4 h-4 ${user?.role === 'CLIENT_ADMIN' ? 'text-sky-400' : 'text-purple-400'}`} />
                  <span className="text-xs font-medium text-gray-300">
                    {user?.role === 'CLIENT_ADMIN' ? 'Administrator' : 'Viewer'}
                  </span>
                </div>
                <div className="w-full space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-300 truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className={`w-4 h-4 ${user?.isVerified ? 'text-green-400' : 'text-yellow-400'}`} />
                    <span className="text-gray-300">
                      {user?.isVerified ? "Verified Account" : "Pending Verification"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0f0f13]/80 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <LogOut className="w-4 h-4 text-red-400" />
                Danger Zone
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Log out of your account on this device. You will need to sign in again to access your dashboard.
              </p>
              <button 
                onClick={logoutUser}
                className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium rounded-xl transition-all text-sm"
              >
                Log out
              </button>
            </motion.div>
          </div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
            <div className="bg-[#0f0f13]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                  <Key className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Change Password</h3>
                  <p className="text-xs text-gray-400">Ensure your account is using a long, random password to stay secure.</p>
                </div>
              </div>
              {successMessage && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-green-400 font-medium">{successMessage}</span>
                </div>
              )}
              {formErrors.server && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-sm text-red-400 font-medium">{formErrors.server}</span>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full bg-white/5 border ${formErrors.currentPassword ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                    >
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formErrors.currentPassword && <p className="text-red-400 text-[10px] mt-1.5 ml-1">{formErrors.currentPassword}</p>}
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full bg-white/5 border ${formErrors.newPassword ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formErrors.newPassword && <p className="text-red-400 text-[10px] mt-1.5 ml-1">{formErrors.newPassword}</p>}
                  
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                      <div className={`w-1 h-1 rounded-full ${formData.newPassword.length >= VALIDATION.PASSWORD.MIN_LENGTH ? 'bg-green-400' : 'bg-gray-500'}`} />
                      Min {VALIDATION.PASSWORD.MIN_LENGTH} characters
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                      <div className={`w-1 h-1 rounded-full ${!/\s/.test(formData.newPassword) && formData.newPassword.length > 0 ? 'bg-green-400' : 'bg-gray-500'}`} />
                      No spaces
                    </div>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-6 py-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                  >
                    {isSubmitting ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}