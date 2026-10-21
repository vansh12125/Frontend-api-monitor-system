import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Key, Plus, Copy, Check, MoreVertical, 
  ShieldAlert, ShieldCheck, Trash2, X, RefreshCw, AlertTriangle,
  Info
} from "lucide-react";
import { Sidebar } from "@/components/ui/Sidebar";
import { GetAllApiKey, CreateApiKey, ActivateApiKey, DeactivateApiKey, DeleteApiKey } from "@/service/api";
import { API_ENIVORNMENT, VALIDATION } from "@/constants";
export function ManageApiKeys() {
  const [keys, setKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRawKeyOpen, setIsRawKeyOpen] = useState(false);
  const [rawKeyData, setRawKeyData] = useState(null);
  const [deleteKeyId, setDeleteKeyId] = useState(null); 
  const [selectedKey, setSelectedKey] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", enivornment: API_ENIVORNMENT.DEVELOPMENT });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const fetchKeys = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await GetAllApiKey();
      if (res.data.success) {
        setKeys(res.data.data);
      }
    } catch {
      setError("Failed to load API keys.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchKeys();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchKeys]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleCreateKey = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.length < VALIDATION.NAME.MIN_LENGTH) {
      errors.name = `Name must be at least ${VALIDATION.NAME.MIN_LENGTH} characters`;
    } else if (formData.name.length > VALIDATION.NAME.MAX_LENGTH) {
      errors.name = `Name must be less than ${VALIDATION.NAME.MAX_LENGTH} characters`;
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.length < VALIDATION.DESCRIPTION.MIN_LENGTH) {
      errors.description = `Description must be at least ${VALIDATION.DESCRIPTION.MIN_LENGTH} characters`;
    } else if (formData.description.length > VALIDATION.DESCRIPTION.MAX_LENGTH) {
      errors.description = `Description must be less than ${VALIDATION.DESCRIPTION.MAX_LENGTH} characters`;
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await CreateApiKey(formData);
      if (res.data.success) {
        setRawKeyData(res.data.data);
        setIsCreateOpen(false);
        setIsRawKeyOpen(true);
        setFormData({ name: "", description: "", enivornment: API_ENIVORNMENT.DEVELOPMENT });
        fetchKeys();
      }
    } catch (err) {
      setFormErrors({ server: err.response?.data?.message || "Failed to create key" });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleToggleStatus = async (keyId, currentStatus) => {
    setActiveDropdown(null);
    try {
      const payload = { apiKeyId: keyId };
      const res = currentStatus 
        ? await DeactivateApiKey(payload) 
        : await ActivateApiKey(payload);
      if (res.data.success) {
        setKeys(keys.map(k => k.keyId === keyId ? { ...k, isActive: !currentStatus } : k));
        if (selectedKey && selectedKey.keyId === keyId) {
          setSelectedKey({ ...selectedKey, isActive: !currentStatus });
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update key status.");
    }
  };
  const confirmDelete = async () => {
    if (!deleteKeyId) return;
    try {
      const res = await DeleteApiKey({ apiKeyId: deleteKeyId });
      if (res.data.success) {
        setKeys(keys.filter(k => k.keyId !== deleteKeyId));
        if (selectedKey && selectedKey.keyId === deleteKeyId) setSelectedKey(null);
      }
    } catch {
      alert("Failed to delete key.");
    } finally {
      setDeleteKeyId(null);
      setActiveDropdown(null);
    }
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-10 w-full overflow-x-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">API Keys</h1>
            <p className="text-sm text-gray-400 mt-1">Manage authentication keys for your services.</p>
          </div>
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-sm font-medium transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)]"
          >
            <Plus className="w-4 h-4" />
            Create API Key
          </button>
        </div>
        {error && <div className="text-red-400 p-4 bg-red-500/10 rounded-xl mb-6">{error}</div>}
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="hidden md:block bg-[#0f0f13]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-visible">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/2 text-gray-400 text-xs uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Env</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Usage</th>
                  <th className="px-6 py-4 font-medium">Expires</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading && keys.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-10 text-center"><RefreshCw className="w-6 h-6 text-sky-500 animate-spin mx-auto" /></td></tr>
                ) : keys.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">No API keys found. Create one to get started.</td></tr>
                ) : (
                  keys.map((key) => (
                    <tr 
                      key={key.keyId} 
                      className="hover:bg-white/2 transition-colors cursor-pointer"
                      onClick={() => setSelectedKey(key)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-white flex items-center gap-2">
                            <Key className="w-4 h-4 text-gray-500" />
                            {key.name}
                          </span>
                          <span className="text-xs text-gray-500 mt-0.5 max-w-50 truncate">{key.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${
                          key.enivornment === 'PRODUCTION' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                          key.enivornment === 'STAGING' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                          'bg-sky-500/10 text-sky-400 border-sky-500/20'
                        }`}>
                          {key.enivornment}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 text-xs font-medium ${key.isActive ? 'text-green-400' : 'text-gray-500'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${key.isActive ? 'bg-green-400' : 'bg-gray-500'}`} />
                          {key.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 w-24">
                          <div className="flex justify-between text-[10px] text-gray-400">
                            <span>{key.usage?.used || 0}</span>
                            <span>{key.usage?.max || 0}</span>
                          </div>
                          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${key.usage?.percentage > 80 ? 'bg-red-500' : 'bg-sky-500'}`} 
                              style={{ width: `${key.usage?.percentage || 0}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {new Date(key.expiresAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === key.keyId ? null : key.keyId); }}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                        <AnimatePresence>
                          {activeDropdown === key.keyId && (
                            <motion.div 
                              ref={dropdownRef}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-8 top-10 w-40 bg-[#18181b] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 text-left"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button 
                                onClick={() => handleToggleStatus(key.keyId, key.isActive)}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition"
                              >
                                {key.isActive ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                                {key.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <div className="h-px bg-white/5" />
                              <button 
                                onClick={() => { setDeleteKeyId(key.keyId); setActiveDropdown(null); }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete Key
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        <div className="md:hidden space-y-4">
          {isLoading && keys.length === 0 && <div className="flex justify-center py-10"><RefreshCw className="w-6 h-6 text-sky-500 animate-spin" /></div>}
          {keys.length === 0 && !isLoading && <div className="text-center text-gray-500 py-10 bg-[#0f0f13]/80 rounded-2xl border border-white/5">No API keys found.</div>}
          {keys.map((key) => (
            <motion.div 
              key={key.keyId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedKey(key)}
              className="bg-[#0f0f13]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 flex flex-col gap-4 cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-medium text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-gray-500" />
                    {key.name}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">{key.description}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === key.keyId ? null : key.keyId); }}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 relative"
                >
                  <MoreVertical className="w-4 h-4" />
                  <AnimatePresence>
                    {activeDropdown === key.keyId && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 top-10 w-40 bg-[#18181b] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 text-left"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button 
                          onClick={() => handleToggleStatus(key.keyId, key.isActive)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition"
                        >
                          {key.isActive ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                          {key.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <div className="h-px bg-white/5" />
                        <button 
                          onClick={() => { setActiveDropdown(null); setDeleteKeyId(key.keyId); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${
                  key.enivornment === 'PRODUCTION' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                  key.enivornment === 'STAGING' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                  'bg-sky-500/10 text-sky-400 border-sky-500/20'
                }`}>
                  {key.enivornment}
                </span>
                <span className={`flex items-center gap-1.5 font-medium ${key.isActive ? 'text-green-400' : 'text-gray-500'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${key.isActive ? 'bg-green-400' : 'bg-gray-500'}`} />
                  {key.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-gray-500 ml-auto">
                  Exp: {new Date(key.expiresAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Usage: {key.usage?.used || 0} / {key.usage?.max || 0}</span>
                  <span>{key.usage?.percentage || 0}%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${key.usage?.percentage > 80 ? 'bg-red-500' : 'bg-sky-500'}`} 
                    style={{ width: `${key.usage?.percentage || 0}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      
      <AnimatePresence>
        {selectedKey && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setSelectedKey(null)}
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-100 bg-[#0a0a0c] border-l border-white/10 z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Info className="w-5 h-5 text-sky-400" /> Key Details
                  </h2>
                  <button onClick={() => setSelectedKey(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-6">
                  
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Basic Info</h3>
                    <div className="space-y-3 bg-white/2 border border-white/5 rounded-xl p-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Name</span>
                        <span className="text-sm text-white font-medium">{selectedKey.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Description</span>
                        <span className="text-sm text-white font-medium text-right max-w-45">{selectedKey.description}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Key ID</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white font-mono">{selectedKey.keyId}</span>
                          <button onClick={() => copyToClipboard(selectedKey.keyId)} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md text-gray-400 transition">
                            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Environment</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          selectedKey.enivornment === 'PRODUCTION' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                          'bg-sky-500/10 text-sky-400 border-sky-500/20'
                        }`}>{selectedKey.enivornment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Status</span>
                        <span className={`text-sm font-medium ${selectedKey.isActive ? 'text-green-400' : 'text-red-400'}`}>{selectedKey.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Usage & Stats</h3>
                    <div className="space-y-3 bg-white/2 border border-white/5 rounded-xl p-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Total Requests</span>
                        <span className="text-sm text-white font-medium">{selectedKey.totalRequests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Usage</span>
                        <span className="text-sm text-white font-medium">{selectedKey.usage?.used} / {selectedKey.usage?.max} ({selectedKey.usage?.percentage}%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Last Used</span>
                        <span className="text-sm text-white">{selectedKey.lastUsedAt ? new Date(selectedKey.lastUsedAt).toLocaleString() : 'Never'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Permissions</h3>
                    <div className="space-y-3 bg-white/2 border border-white/5 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Can Ingest</span>
                        <span className={`text-sm font-medium ${selectedKey.permissions?.canIngest ? 'text-green-400' : 'text-gray-500'}`}>{selectedKey.permissions?.canIngest ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Can Read Analytics</span>
                        <span className={`text-sm font-medium ${selectedKey.permissions?.canReadAnalytics ? 'text-green-400' : 'text-gray-500'}`}>{selectedKey.permissions?.canReadAnalytics ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex flex-col gap-1 pt-2 border-t border-white/5">
                        <span className="text-sm text-gray-400">Allowed Services</span>
                        {selectedKey.permissions?.allowedServices?.length > 0 ? (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedKey.permissions.allowedServices.map(s => <span key={s} className="px-2 py-0.5 bg-white/10 rounded text-xs text-white">{s}</span>)}
                          </div>
                        ) : (
                          <span className="text-sm text-white">All Services</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Security</h3>
                    <div className="space-y-3 bg-white/2 border border-white/5 rounded-xl p-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Rotation Warning</span>
                        <span className="text-sm text-white">{selectedKey.security?.rotationWarningDays} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Last Rotated</span>
                        <span className="text-sm text-white">{new Date(selectedKey.security?.lastRotated).toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col gap-1 pt-2 border-t border-white/5">
                        <span className="text-sm text-gray-400">Allowed IPs</span>
                        {selectedKey.security?.allowedIPs?.length > 0 ? (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedKey.security.allowedIPs.map(ip => <span key={ip} className="px-2 py-0.5 bg-white/10 rounded text-xs text-white font-mono">{ip}</span>)}
                          </div>
                        ) : (
                          <span className="text-sm text-white">Any IP</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-400">Allowed Origins</span>
                        {selectedKey.security?.allowedOrigins?.length > 0 ? (
                          <div className="flex flex-col gap-1 mt-1">
                            {selectedKey.security.allowedOrigins.map(o => <span key={o} className="px-2 py-0.5 bg-white/10 rounded text-xs text-white break-all">{o}</span>)}
                          </div>
                        ) : (
                          <span className="text-sm text-white">Any Origin</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Timeline</h3>
                    <div className="space-y-3 bg-white/2 border border-white/5 rounded-xl p-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Created At</span>
                        <span className="text-sm text-white">{new Date(selectedKey.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Expires At</span>
                        <span className="text-sm text-red-400 font-medium">{new Date(selectedKey.expiresAt).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Last Updated</span>
                        <span className="text-sm text-white">{new Date(selectedKey.updatedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[#0f0f13] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white">Create API Key</h2>
                <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCreateKey} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-gray-400">Name</label>
                    <span className="text-[10px] text-gray-500">{formData.name.length}/{VALIDATION.NAME.MAX_LENGTH}</span>
                  </div>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    className={`w-full bg-white/5 border ${formErrors.name ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50`} 
                    placeholder="e.g. Production Bot" 
                  />
                  {formErrors.name && <p className="text-red-400 text-[10px] mt-1 ml-1">{formErrors.name}</p>}
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-gray-400">Description</label>
                    <span className="text-[10px] text-gray-500">{formData.description.length}/{VALIDATION.DESCRIPTION.MAX_LENGTH}</span>
                  </div>
                  <input 
                    type="text" 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    className={`w-full bg-white/5 border ${formErrors.description ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50`} 
                    placeholder="What is this key for?" 
                  />
                  {formErrors.description && <p className="text-red-400 text-[10px] mt-1 ml-1">{formErrors.description}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Environment</label>
                  <select 
                    value={formData.enivornment} 
                    onChange={(e) => setFormData({...formData, enivornment: e.target.value})} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50 appearance-none"
                  >
                    {Object.values(API_ENIVORNMENT).map(env => (
                      <option key={env} value={env} className="bg-[#18181b] text-white">{env}</option>
                    ))}
                  </select>
                </div>
                {formErrors.server && <p className="text-red-400 text-xs text-center">{formErrors.server}</p>}
                <button type="submit" disabled={isSubmitting} className="w-full mt-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all">
                  {isSubmitting ? "Generating..." : "Generate Key"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isRawKeyOpen && rawKeyData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsRawKeyOpen(false)} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="relative bg-[#0f0f13] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">API Key Generated</h2>
              <p className="text-sm text-gray-400 mb-6">
                Please copy your API key now. <strong className="text-red-400">For security reasons, it will not be shown again.</strong>
              </p>
              <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-xl p-3 mb-6 relative">
                <code className="text-sm font-mono text-sky-300 break-all flex-1">
                  {rawKeyData.rawKey}
                </code>
                <button onClick={() => copyToClipboard(rawKeyData.rawKey)} className="p-2 bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 rounded-lg transition-colors shrink-0">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <button onClick={() => setIsRawKeyOpen(false)} className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-xl transition-all">
                I have copied the key
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {deleteKeyId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteKeyId(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[#0f0f13] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Delete API Key?</h2>
              <p className="text-sm text-gray-400 mb-6">
                Are you sure you want to permanently delete this API key? This action cannot be undone and any services using this key will immediately lose access.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteKeyId(null)} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-500 hover:bg-red-400 text-white font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}