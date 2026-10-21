import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, Copy, Check, 
  AlertTriangle, Code2
} from "lucide-react";
import { Sidebar } from "@/components/ui/Sidebar";

const CodeBlock = ({ code, language = "bash" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl bg-[#0a0a0c] border border-white/10 overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-white/2 border-b border-white/5">
        <span className="text-xs text-gray-500 font-mono">{language}</span>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-gray-300 font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export function IntegrationGuide() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 md:p-10 w-full overflow-x-hidden">
        
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-10"
          >
            <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-4 py-1.5 mb-4">
              <Code2 className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-medium text-gray-300">Developer Documentation</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Integration Guide
            </h1>
            <p className="text-gray-400 leading-relaxed max-w-2xl">
              This guide explains how to connect any API or backend service to API Pulse so its requests appear in your dashboard.
            </p>
          </motion.div>

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="space-y-12 pb-20"
          >
            
            {/* Step 1 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 font-bold text-sm">1</div>
                <h2 className="text-xl font-bold text-white">What you need</h2>
              </div>
              <p className="text-sm text-gray-400 mb-4">From your API Pulse dashboard, get:</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-300 mb-4 ml-2">
                <li><strong className="text-white">Ingest URL</strong> — the API Monitor endpoint that accepts API-hit events.</li>
                <li><strong className="text-white">API key</strong> — the key created for your client/service.</li>
                <li><strong className="text-white">Service name</strong> — a name to identify the application in the dashboard, such as <code className="bg-white/10 px-1.5 py-0.5 rounded text-sky-300">my-store-api</code>.</li>
              </ul>
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">
                  <strong>Keep your API key secret.</strong> Send it from your backend/server only. Do not put it in frontend JavaScript, mobile app code, or a public repository.
                </p>
              </div>
            </section>

            {/* Step 2 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 font-bold text-sm">2</div>
                <h2 className="text-xl font-bold text-white">What to send</h2>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Send an HTTP <code className="text-sky-300">POST</code> request to your ingest URL with the API key in the <code className="text-sky-300">x-key</code> header and a JSON body.
              </p>

              <CodeBlock 
                language="http"
                code={`POST <YOUR_INGEST_URL>
Content-Type: application/json
x-key: <YOUR_API_KEY>`}
              />

              <CodeBlock 
                language="json"
                code={`{
  "serviceName": "my-store-api",
  "endpoint": "/api/products",
  "method": "GET",
  "statusCode": 200,
  "latencyMs": 42
}`}
              />

              <div className="overflow-x-auto mt-4 border border-white/5 rounded-xl">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white/2 text-gray-400 text-xs uppercase tracking-wider border-b border-white/5">
                    <tr>
                      <th className="px-4 py-3 font-medium">Field</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Meaning</th>
                      <th className="px-4 py-3 font-medium">Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    <tr>
                      <td className="px-4 py-3 font-mono text-sky-300">serviceName</td>
                      <td className="px-4 py-3 text-gray-500">string</td>
                      <td className="px-4 py-3">Name of the service being monitored</td>
                      <td className="px-4 py-3 font-mono">"my-store-api"</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-sky-300">endpoint</td>
                      <td className="px-4 py-3 text-gray-500">string</td>
                      <td className="px-4 py-3">Request path on your service</td>
                      <td className="px-4 py-3 font-mono">"/api/products"</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-sky-300">method</td>
                      <td className="px-4 py-3 text-gray-500">string</td>
                      <td className="px-4 py-3">HTTP method that was called</td>
                      <td className="px-4 py-3 font-mono">"GET"</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-sky-300">statusCode</td>
                      <td className="px-4 py-3 text-gray-500">number</td>
                      <td className="px-4 py-3">HTTP response status code</td>
                      <td className="px-4 py-3 font-mono">200</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-sky-300">latencyMs</td>
                      <td className="px-4 py-3 text-gray-500">number</td>
                      <td className="px-4 py-3">Time taken to handle the request</td>
                      <td className="px-4 py-3 font-mono">42</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-3">Use numbers for <code className="text-gray-400">statusCode</code> and <code className="text-gray-400">latencyMs</code>, not strings. Use the HTTP method in uppercase.</p>
            </section>

            {/* Step 3 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 font-bold text-sm">3</div>
                <h2 className="text-xl font-bold text-white">Test it with cURL</h2>
              </div>
              <CodeBlock 
                language="bash"
                code={`curl -X POST "<YOUR_INGEST_URL>" \\
  -H "Content-Type: application/json" \\
  -H "x-key: <YOUR_API_KEY>" \\
  -d '{
    "serviceName": "my-store-api",
    "endpoint": "/api/products",
    "method": "GET",
    "statusCode": 200,
    "latencyMs": 42
  }'`}
              />
              <p className="text-sm text-gray-400 mt-2">If the request fails, check the HTTP status and response body. A successful ingest response means the event was accepted; it does not necessarily mean the dashboard's aggregated metrics have already updated.</p>
            </section>

            {/* Step 4 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 font-bold text-sm">4</div>
                <h2 className="text-xl font-bold text-white">Send events from Node.js</h2>
              </div>
              <p className="text-sm text-gray-400 mb-2">This example uses Node.js 18+ (which has a built-in fetch) and sends one sample event.</p>
              <CodeBlock 
                language="javascript"
                code={`const INGEST_URL = process.env.API_MONITOR_INGEST_URL;
const API_KEY = process.env.API_MONITOR_API_KEY;

async function sendApiHit({
  serviceName,
  endpoint,
  method,
  statusCode,
  latencyMs,
}) {
  const response = await fetch(INGEST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-key": API_KEY,
    },
    body: JSON.stringify({
      serviceName,
      endpoint,
      method,
      statusCode,
      latencyMs,
    }),
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(
      \`API Monitor ingest failed: HTTP \${response.status} — \${body}\`
    );
  }

  return body;
}

sendApiHit({
  serviceName: "my-store-api",
  endpoint: "/api/products",
  method: "GET",
  statusCode: 200,
  latencyMs: 42,
})
  .then((result) => console.log("API hit sent:", result))
  .catch((error) => console.error(error.message));`}
              />
            </section>

            {/* Step 5 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 font-bold text-sm">5</div>
                <h2 className="text-xl font-bold text-white">Automatically monitor requests in Express</h2>
              </div>
              <p className="text-sm text-gray-400 mb-2">Install no additional package if your Node version supports fetch. Register this middleware <strong>before your routes</strong>, so it can measure each response.</p>
              <CodeBlock 
                language="javascript"
                code={`const serviceName = process.env.API_MONITOR_SERVICE_NAME || "my-store-api";

app.use((req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    const endpoint = req.originalUrl.split("?")[0];

    sendApiHit({
      serviceName,
      endpoint,
      method: req.method,
      statusCode: res.statusCode,
      latencyMs: Date.now() - startedAt,
    }).catch((error) => {
      console.error("Failed to send API hit to API Monitor:", error.message);
    });
  });

  next();
});`}
              />
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3 mt-4">
                <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-200 space-y-2">
                  <p>Avoid monitoring API Monitor's own ingest endpoint with this middleware, or you may create a loop.</p>
                  <p>For routes with dynamic IDs, consider normalizing paths (for example, <code className="bg-black/30 px-1 rounded">/api/users/:id</code>) rather than recording every concrete ID as a separate endpoint.</p>
                </div>
              </div>
            </section>

            {/* Step 6 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 font-bold text-sm">6</div>
                <h2 className="text-xl font-bold text-white">Send a test event from Postman</h2>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300 ml-2 mb-4">
                <li>Create a new request and choose <strong>POST</strong>.</li>
                <li>Paste your exact ingest URL.</li>
                <li>Under <strong>Headers</strong>, add <code>Content-Type</code> and <code>x-key</code>.</li>
                <li>Under <strong>Body → raw → JSON</strong>, paste the sample JSON body from Step 2.</li>
                <li>Send the request.</li>
                <li>Check the response, then open the dashboard and select a date range that includes the test event.</li>
              </ol>
            </section>

            {/* Step 7 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 font-bold text-sm">7</div>
                <h2 className="text-xl font-bold text-white">Troubleshooting</h2>
              </div>
              <div className="space-y-4">
                {[
                  { title: "401/403 or an API-key error", desc: "Confirm the key is active, belongs to the correct client, and is sent in the x-key header." },
                  { title: "400 or validation error", desc: "Check that all five fields are present, serviceName and endpoint are strings, method is an allowed uppercase HTTP method, and statusCode/latencyMs are numbers." },
                  { title: "The ingest request succeeds but no dashboard metrics appear", desc: "Confirm the event consumer/processor is running, then check the dashboard's client, service, endpoint, and date filters. Aggregated metrics may update asynchronously." },
                  { title: "The wrong service appears", desc: "Make sure serviceName is set to the service you want to track." },
                  { title: "No data for the selected day", desc: "Verify the event timestamp/time bucket and the dashboard's timezone and end-date handling." },
                  { title: "Duplicate-looking endpoints", desc: "Normalize paths and remove query strings before sending events." },
                ].map((item, i) => (
                  <div key={i} className="bg-white/2 border border-white/5 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Checklist */}
            <section className="bg-sky-500/5 border border-sky-500/20 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-sky-400" />
                Integration Checklist
              </h2>
              <ul className="space-y-3 text-sm text-gray-300">
                {[
                  "I copied the correct ingest URL from my API Monitor deployment.",
                  "My API key is active and sent in the x-key header.",
                  "The request body contains all five fields.",
                  "statusCode and latencyMs are JSON numbers.",
                  "My service uses a consistent serviceName.",
                  "I tested one event in Postman or with cURL.",
                  "The processor is running and my dashboard filters include the event's time range."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-sky-400" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <Shield className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">
                <strong>Security:</strong> API Monitor API keys are secrets. If a key has been exposed in a public repository or client-side code, deactivate/rotate it.
              </p>
            </div>

          </motion.div>
        </div>
      </main>
    </div>
  );
}