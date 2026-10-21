import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {  X, RefreshCw, 
  CheckCircle2, Shield, User, Mail 
} from "lucide-react";
import { Sidebar } from "@/components/ui/Sidebar";
import { CreateAdmin, CreateViewer, GetAllAdmin, GetAllViewer } from "@/service/client";
import { VALIDATION } from "@/constants";
export function ManageClients() {
  const [activeTab, setActiveTab] = useState("admins");
  const [admins, setAdmins] = useState([]);
  const [viewers, setViewers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createType, setCreateType] = useState("admins");
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(null);
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (activeTab === "admins") {
        const res = await GetAllAdmin();
        if (res.data.success) setAdmins(res.data.data);
      } else {
        const res = await GetAllViewer();
        if (res.data.success) setViewers(res.data.data);
      }
    } catch {
      setError(`Failed to load ${activeTab}.`);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchData]);
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => setSuccessToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);
  const openCreateModal = (type) => {
    setCreateType(type);
    setFormData({ name: "", email: "" });
    setFormErrors({});
    setIsCreateOpen(true);
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.length < VALIDATION.NAME.MIN_LENGTH) {
      errors.name = `Name must be at least ${VALIDATION.NAME.MIN_LENGTH} characters`;
    } else if (formData.name.length > VALIDATION.NAME.MAX_LENGTH) {
      errors.name = `Name must be less than ${VALIDATION.NAME.MAX_LENGTH} characters`;
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!VALIDATION.EMAIL.PATTERN.test(formData.email)) {
      errors.email = "Invalid email format";
    } else if (formData.email.length > VALIDATION.EMAIL.MAX_LENGTH) {
      errors.email = `Email must be less than ${VALIDATION.EMAIL.MAX_LENGTH} characters`;
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setIsSubmitting(true);
    try {
      const apiCall = createType === "admins" ? CreateAdmin : CreateViewer;
      const res = await apiCall(formData);
      if (res.data.success) {
        setIsCreateOpen(false);
        setSuccessToast(`Successfully created ${createType === "admins" ? "Admin" : "Viewer"}. Credentials have been sent to ${formData.email}.`);
        fetchData();
      }
    } catch (err) {
      const backendError = err.response?.data;
      if (backendError?.error?.code === "EMAIL_ALREADY_EXIST") {
        setFormErrors({ email: backendError.message || "Email already exists" });
      } else {
        setFormErrors({ server: backendError?.message || "Failed to create user." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const currentData = activeTab === "admins" ? admins : viewers;
  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-10 w-full overflow-x-hidden relative">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Manage Clients</h1>
            <p className="text-sm text-gray-400 mt-1">View and manage your Admin and Viewer accounts.</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={() => openCreateModal("admins")}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-sm font-medium transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)]"
            >
              <Shield className="w-4 h-4" />
              New Admin
            </button>
            <button 
              onClick={() => openCreateModal("viewers")}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl text-sm font-medium transition-all"
            >
              <User className="w-4 h-4" />
              New Viewer
            </button>
          </div>
        </div>
        
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
          <button 
            onClick={() => setActiveTab("admins")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'admins' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <Shield className="w-4 h-4" /> Admins
          </button>
          <button 
            onClick={() => setActiveTab("viewers")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'viewers' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <User className="w-4 h-4" /> Viewers
          </button>
        </div>
        {error && <div className="text-red-400 p-4 bg-red-500/10 rounded-xl mb-6">{error}</div>}
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0f0f13]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/2 text-gray-400 text-xs uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr><td colSpan="4" className="px-6 py-10 text-center"><RefreshCw className="w-6 h-6 text-sky-500 animate-spin mx-auto" /></td></tr>
                ) : currentData.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">No {activeTab} found.</td></tr>
                ) : (
                  currentData.map((client) => (
                    <tr key={client._id} className="hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${activeTab === 'admins' ? 'bg-sky-500/20 text-sky-400' : 'bg-purple-500/20 text-purple-400'}`}>
                          {client.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        {client.name}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          {client.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${activeTab === 'admins' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                          {activeTab === 'admins' ? 'CLIENT_ADMIN' : 'CLIENT_VIEWER'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
      
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[#0f0f13] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  {createType === 'admins' ? <Shield className="w-5 h-5 text-sky-400" /> : <User className="w-5 h-5 text-purple-400" />}
                  Create {createType === 'admins' ? 'Admin' : 'Viewer'}
                </h2>
                <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-gray-400">Full Name</label>
                    <span className="text-[10px] text-gray-500">{formData.name.length}/{VALIDATION.NAME.MAX_LENGTH}</span>
                  </div>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    className={`w-full bg-white/5 border ${formErrors.name ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50`} 
                    placeholder="e.g. John Doe" 
                  />
                  {formErrors.name && <p className="text-red-400 text-[10px] mt-1 ml-1">{formErrors.name}</p>}
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-gray-400">Email Address</label>
                    <span className="text-[10px] text-gray-500">{formData.email.length}/{VALIDATION.EMAIL.MAX_LENGTH}</span>
                  </div>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    className={`w-full bg-white/5 border ${formErrors.email ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50`} 
                    placeholder="john@example.com" 
                  />
                  {formErrors.email && <p className="text-red-400 text-[10px] mt-1 ml-1">{formErrors.email}</p>}
                </div>
                {formErrors.server && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center">
                    {formErrors.server}
                  </div>
                )}
                <p className="text-[10px] text-gray-500 text-center">
                  An invitation email with temporary credentials will be sent to this address.
                </p>
                <button type="submit" disabled={isSubmitting} className="w-full mt-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all">
                  {isSubmitting ? "Creating..." : `Create ${createType === 'admins' ? 'Admin' : 'Viewer'}`}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {successToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-[#0f0f13] border border-green-500/30 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-start gap-3 max-w-sm"
          >
            <div className="p-2 bg-green-500/20 rounded-full shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">User Created</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{successToast}</p>
            </div>
            <button onClick={() => setSuccessToast(null)} className="text-gray-500 hover:text-white ml-auto shrink-0">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}