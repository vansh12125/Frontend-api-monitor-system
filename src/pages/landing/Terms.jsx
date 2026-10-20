
export function Terms() {
  const sections = [
    { title: '1. Acceptance of Terms', content: 'By accessing or using the API Pulse services, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you may not access or use our services.' },
    { title: '2. Description of Service', content: 'API Pulse provides API monitoring, uptime tracking, alerting, and analytics services. We reserve the right to modify, suspend, or discontinue the service at any time.' },
    { title: '3. Account Registration', content: 'To use certain features of the service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process.' },
    { title: '4. Acceptable Use', content: 'You agree not to use the service to: violate any laws, infringe third-party rights, transmit malware, attempt unauthorized access, or interfere with the service.' },
    { title: '5. Payment Terms', content: 'Certain features of the service are provided for a fee. You agree to pay all fees in accordance with the pricing and payment terms presented to you.' },
    { title: '6. Intellectual Property', content: 'The service and its original content, features, and functionality are owned by API Pulse, Inc. and are protected by international copyright and trademark laws.' },
    { title: '7. Service Level Agreement', content: 'We guarantee 99.99% uptime for our Pro plan customers, measured on a monthly basis. If we fail to meet this commitment, you may be eligible for service credits.' },
    { title: '8. Limitation of Liability', content: 'In no event shall API Pulse, Inc., its directors, employees, partners, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages.' },
    { title: '9. Termination', content: 'We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including if you breach these Terms.' },
    { title: '10. Governing Law', content: 'These Terms shall be governed and construed in accordance with the laws of the State of California, United States.' },
    { title: '11. Changes to Terms', content: 'We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days\' notice.' },
  ];

  return (
    <div className="w-full relative overflow-hidden py-24 px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-150 bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.12)_0%,transparent_70%)] blur-3xl pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs font-medium text-gray-300">Legal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif leading-tight mb-4">Terms of Service</h1>
          <p className="text-sm text-gray-400">Last updated: January 15, 2025</p>
        </div>

        <div className="bg-white/2 border border-white/5 rounded-2xl p-6 mb-10">
          <p className="text-sm text-gray-300 leading-relaxed">
            These Terms of Service ("Terms") govern your access to and use of the API Pulse website, 
            products, and services. By accessing or using our services, you agree to be bound by these Terms.
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
          <h3 className="text-sm font-medium text-white mb-3">Contact</h3>
          <p className="text-sm text-gray-400">
            If you have any questions about these Terms of Service, please contact us at{' '}
            <a href="mailto:legal@apipulse.dev" className="text-sky-400 hover:text-sky-300 transition">
              legal@apipulse.dev
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}