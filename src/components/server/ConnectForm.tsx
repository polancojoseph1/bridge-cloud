'use client';
import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useServerStore } from '@/store/serverStore';
import { cn } from '@/lib/cn';
import { cleanUrl, hostnameFrom } from '@/lib/utils';

interface ConnectFormProps {
  tier: 'local' | 'cloud';
  onBack: () => void;
  onConnected: () => void;
}

export default function ConnectForm({ tier, onBack, onConnected }: ConnectFormProps) {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [name, setName] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const addProfile = useServerStore(s => s.addProfile);
  const connectProfile = useServerStore(s => s.connectProfile);

  const handleTest = async () => {
    setError(null);
    const cleanedUrl = cleanUrl(url);
    if (!cleanedUrl) return setError('Server URL is required');
    if (!cleanedUrl.startsWith('http')) return setError('URL must start with https://');
    if (!apiKey.trim() && tier === 'local') return setError('API key is required');

    setIsChecking(true);
    try {
      const res = await fetch('/api/proxy/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cleanedUrl, apiKey: apiKey.trim() }),
        redirect: 'error',
      });
      const data = await res.json();

      if (data.status !== 'online') {
        const msgs: Record<string, string> = {
          auth_error: 'API key rejected by server. Double-check your key.',
          offline: 'Could not reach server. Check the URL and try again.',
        };
        setError(msgs[data.status] ?? data.error ?? 'Connection failed');
        setIsChecking(false);
        return;
      }

      // Save and connect
      const hostname = hostnameFrom(cleanedUrl);
      const id = addProfile({
        name: name.trim() || hostname,
        tier,
        agentId: data.agentId ?? 'claude',
        url: cleanedUrl,
        apiKey: apiKey.trim(),
        isDefault: true,
        cloudProvisionStatus: tier === 'cloud' ? 'provisioned' : undefined,
      });
      await connectProfile(id);
      setSuccess(true);
      setTimeout(onConnected, 800);
    } catch {
      setError('Network error. Check your connection.');
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1410] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px]">
        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-2 text-[13px] text-[#8e8e8e] hover:text-[#ececec] mb-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f] rounded-sm">
          <ArrowLeft size={14} />
          Back
        </button>

        <h2 className="text-[22px] font-semibold text-[#ececec] mb-1">
          {tier === 'local' ? 'Connect your server' : 'Enter cloud credentials'}
        </h2>
        <p className="text-[14px] text-[#8e8e8e] mb-8">
          {tier === 'local'
            ? 'Enter your BridgeBot URL and API key.'
            : 'Paste the URL and API key from your welcome email.'}
        </p>

        <div className="space-y-4">
          {/* URL */}
          <div>
            <label htmlFor="connect-server-url" className="block text-[13px] font-medium text-[#8e8e8e] mb-1.5">
              Server URL <span className="text-[#f87171]" aria-hidden="true">*</span>
            </label>
            <input
              id="connect-server-url"
              type="url"
              required
              aria-required="true"
              value={url}
              onChange={e => { setUrl(e.target.value); setError(null); }}
              placeholder="https://your-machine.tail9e6f48.ts.net"
              className="w-full bg-[#152219] border border-[#2d4035] rounded-lg px-4 py-2.5 text-[14px] text-[#ececec] placeholder-[#565656] focus:outline-none focus:border-[#3d5548] transition-colors"
            />
          </div>

          {/* API Key */}
          <div>
            <label htmlFor="connect-api-key" className="block text-[13px] font-medium text-[#8e8e8e] mb-1.5">
              API Key {tier === 'local' && <span className="text-[#f87171]" aria-hidden="true">*</span>}
            </label>
            <div className="relative">
              <input
                id="connect-api-key"
                type={showKey ? 'text' : 'password'}
                required={tier === 'local'}
                aria-required={tier === 'local'}
                value={apiKey}
                onChange={e => { setApiKey(e.target.value); setError(null); }}
                placeholder="bc_live_..."
                className="w-full bg-[#152219] border border-[#2d4035] rounded-lg px-4 py-2.5 pr-10 text-[14px] text-[#ececec] placeholder-[#565656] focus:outline-none focus:border-[#3d5548] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowKey(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#565656] hover:text-[#8e8e8e]"
                aria-label={showKey ? "Hide API key" : "Show API key"}
                title={showKey ? "Hide API key" : "Show API key"}
              >
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Name (optional) */}
          <div>
            <label htmlFor="connect-server-name" className="block text-[13px] font-medium text-[#8e8e8e] mb-1.5">
              Name <span className="text-[#565656] font-normal">(optional)</span>
            </label>
            <input
              id="connect-server-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={tier === 'cloud' ? 'Bridge Cloud' : 'Home Mac'}
              maxLength={40}
              className="w-full bg-[#152219] border border-[#2d4035] rounded-lg px-4 py-2.5 text-[14px] text-[#ececec] placeholder-[#565656] focus:outline-none focus:border-[#3d5548] transition-colors"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-start gap-2.5 p-3.5 rounded-lg bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.20)]">
            <XCircle size={15} className="text-[#f87171] mt-0.5 flex-shrink-0" />
            <p className="text-[13px] text-[#8e8e8e]">{error}</p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mt-4 flex items-center gap-2.5 p-3.5 rounded-lg bg-[rgba(16,163,127,0.10)] border border-[rgba(16,163,127,0.20)]">
            <CheckCircle size={15} className="text-[#10a37f] flex-shrink-0" />
            <p className="text-[13px] text-[#10a37f]">Connected! Entering chat…</p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleTest}
          disabled={isChecking || success || !url || (tier === 'local' && !apiKey.trim())}
          className={cn(
            'mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-lg text-[14px] font-medium transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]',
            isChecking || success || !url || (tier === 'local' && !apiKey.trim())
              ? 'bg-[#152219] text-[#565656] cursor-not-allowed'
              : 'bg-[#10a37f] hover:bg-[#0d8f6f] text-[#0a1410]'
          )}
        >
          {isChecking ? (
            <><Loader2 size={15} className="animate-spin" /> Checking…</>
          ) : success ? (
            <><CheckCircle size={15} /> Connected</>
          ) : (
            'Test Connection'
          )}
        </button>
      </div>
    </div>
  );
}
