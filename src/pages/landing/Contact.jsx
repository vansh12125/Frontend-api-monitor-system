import  { useState } from 'react';

const InputField = ({ label, name, type = 'text', placeholder, required = true, value, onChange, error }) => (
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
      className={`w-full bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition`}
    />
    {error && <p className="text-red-400 text-[10px] mt-1.5 ml-1">{error}</p>}
  </div>
);

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Contact Payload:', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch  {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'Email', value: 'vanshsahu6752@gmail.com' },
    { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', label: 'Location', value: 'Uttar Pradesh, India' },
    { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Response Time', value: 'Within 24 hours' },
  ];

  return (
    <div className="w-full relative overflow-hidden py-24 px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-150 bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.12)_0%,transparent_70%)] blur-3xl pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-serif leading-tight mb-4">
            Let's <span className="italic text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-teal-400">talk</span>
          </h1>
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Have a question, feature request, or just want to say hi? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            {contactInfo.map((info, i) => (
              <div key={i} className="bg-white/3 border border-white/5 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={info.icon} />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{info.label}</div>
                  <div className="text-sm text-white font-medium">{info.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8">
            {submitted ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Message sent!</h3>
                <p className="text-sm text-gray-400 mb-6">We'll get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="text-sm text-sky-400 hover:text-sky-300 transition">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <InputField label="Name" name="name" placeholder="Tony Stark" value={formData.name} onChange={handleChange} error={errors.name} />
                  <InputField label="Email" name="email" type="email" placeholder="tony@example.com" value={formData.email} onChange={handleChange} error={errors.email} />
                </div>
                <InputField label="Subject" name="subject" placeholder="How can we help?" value={formData.subject} onChange={handleChange} error={errors.subject} />
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Tell us more about your inquiry..."
                    className={`w-full bg-white/5 border ${errors.message ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition resize-none`}
                  ></textarea>
                  {errors.message && <p className="text-red-400 text-[10px] mt-1.5 ml-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition shadow-[0_0_20px_rgba(56,189,248,0.2)] flex items-center justify-center gap-2"
                >
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}