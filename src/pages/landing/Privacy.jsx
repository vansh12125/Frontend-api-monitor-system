
export  function Privacy() {
  const sections = [
    { title: '1. Information We Collect', content: 'We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact support. This includes your name, email address, company information, and any other information you choose to provide.' },
    { title: '2. How We Use Your Information', content: 'We use the information we collect to provide, maintain, and improve our services; to process transactions and send related information; to send technical notices, updates, and support messages; and to respond to your comments and questions.' },
    { title: '3. Data Retention', content: 'We retain your personal information only for as long as necessary to fulfill the purposes for which we collected it, including to satisfy any legal, accounting, or reporting requirements.' },
    { title: '4. Data Security', content: 'We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.' },
    { title: '5. Sharing of Information', content: 'We do not sell, trade, or rent your personal information to third parties. We may share your information with service providers who perform services on our behalf and with your consent.' },
    { title: '6. Your Rights', content: 'Depending on your location, you may have the right to access, correct, delete, or export your personal information. To exercise any of these rights, please contact us at privacy@apipulse.dev.' },
    { title: '7. Cookies and Tracking', content: 'We use cookies and similar tracking technologies to collect information about your browsing activities. You can set your browser to refuse all or some browser cookies.' },
    { title: '8. Third-Party Links', content: 'Our services may contain links to third-party websites. We do not control these third-party websites and are not responsible for their privacy statements.' },
    { title: '9. Children\'s Privacy', content: 'Our services are not intended for children under the age of 16. We do not knowingly collect personal information from children.' },
    { title: '10. Changes to This Policy', content: 'We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.' },
  ];

  return (
    <div className="w-full relative overflow-hidden py-24 px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-150 bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.12)_0%,transparent_70%)] blur-3xl pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs font-medium text-gray-300">Legal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif leading-tight mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-400">Last updated: January 15, 2025</p>
        </div>

        <div className="bg-white/2 border border-white/5 rounded-2xl p-6 mb-10">
          <p className="text-sm text-gray-300 leading-relaxed">
            At API Pulse, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you use our services.
          </p>
        </div>

        <div className="space-y-10">
          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-lg font-medium text-white mb-3">{section.title}</h2>
              <p className="text-sm text-gray-400 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/5">
          <h3 className="text-sm font-medium text-white mb-3">Questions?</h3>
          <p className="text-sm text-gray-400">
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:privacy@apipulse.dev" className="text-sky-400 hover:text-sky-300 transition">
              privacy@apipulse.dev
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}