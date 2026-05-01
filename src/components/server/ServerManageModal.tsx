'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Plus,
  Trash2,
  Star,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  EyeOff,
  Server,
  ArrowLeft,
} from 'lucide-react';
import { useServerStore } from '@/store/serverStore';
import { checkHealth } from '@/lib/healthCheck';
import { cn } from '@/lib/cn';
import { cleanUrl, hostnameFrom } from '@/lib/utils';
import type { HealthStatus, ServerProfile } from '@/types';

// ─── Helpers ────────────────────────────────────────────────────────────────

const healthDotColor: Record<HealthStatus, string> = {
  online: '#10a37f',
  offline: '#ef4444',
  checking: '#f59e0b',
  auth_error: '#ef4444',
  unknown: '#565656',
};

const healthLabel: Record<HealthStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  checking: 'Checking…',
  auth_error: 'Auth error',
  unknown: 'Unknown',
};

// ─── Inline confirm state per card ──────────────────────────────────────────

interface ConfirmState {
  profileId: string | null;
}

// ─── Add-Server Form ─────────────────────────────────────────────────────────

interface AddFormProps {
  onBack: () => void;
  onConnected: () => void;
}

function AddServerForm({ onBack, onConnected }: AddFormProps) {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [name, setName] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const addProfile = useServerStore(s => s.addProfile);
  const connectProfile = useServerStore(s => s.connectProfile);

  const handleTest = useCallback(async () => {
    setError(null);
    const cleanedUrl = cleanUrl(url);
    if (!cleanedUrl) return setError('Server URL is required.');
    if (!cleanedUrl.startsWith('http')) return setError('URL must start with https://');
    if (!apiKey.trim()) return setError('API key is required.');

    setIsChecking(true);
    try {
      const data = await checkHealth(cleanedUrl, apiKey.trim());

      if (data.status !== 'online') {
        const msgs: Record<string, string> = {
          auth_error: 'API key rejected by server. Double-check your key.',
          offline: 'Could not reach server. Check the URL and try again.',
        };
        setError(msgs[data.status] ?? data.error ?? 'Connection failed.');
        setIsChecking(false);
        return;
      }

      const id = addProfile({
        name: name.trim() || hostnameFrom(cleanedUrl),
        tier: 'local',
        agentId: data.agentId ?? 'claude',
        url: cleanedUrl,
        apiKey: apiKey.trim(),
        isDefault: false,
      });
      await connectProfile(id);
      setSuccess(true);
      setTimeout(onConnected, 900);
    } catch {
      setError('Network error. Check your connection.');
      setIsChecking(false);
    }
  }, [url, apiKey, name, addProfile, connectProfile, onConnected]);

  const canSubmit = !!url && !!apiKey.trim() && !isChecking && !success;

  return (
    <div className="flex flex-col">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[13px] text-[#8e8e8e] hover:text-[#ececec] transition-colors mb-5 self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f] rounded-sm"
      >
        <ArrowLeft size={13} />
        Back to servers
      </button>

      <h3 className="text-[18px] font-semibold text-[#ececec] mb-1">Connect a new server</h3>
      <p className="text-[13px] text-[#8e8e8e] mb-5">
        Enter your BridgeBot server URL and API key.
      </p>

      <div className="space-y-3.5">
        {/* URL */}
        <div>
          <label htmlFor="server-url" className="block text-[13px] font-medium text-[#8e8e8e] mb-1.5">
            Server URL <span className="text-[#f87171]" aria-hidden="true">*</span>
          </label>
          <input
            id="server-url"
            type="url"
            required
            aria-required="true"
            value={url}
            onChange={e => { setUrl(e.target.value); setError(null); }}
            placeholder="https://your-machine.tail9e6f48.ts.net"
            className="w-full bg-[#152219] border border-[#2d4035] rounded-lg px-3.5 py-2.5 text-[14px] text-[#ececec] placeholder-[#565656] focus:outline-none focus:border-[#3d5548] transition-colors"
          />
        </div>

        {/* API Key */}
        <div>
          <label htmlFor="api-key" className="block text-[13px] font-medium text-[#8e8e8e] mb-1.5">
            API Key <span className="text-[#f87171]" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <input
              id="api-key"
              type={showKey ? 'text' : 'password'}
              required
              aria-required="true"
              value={apiKey}
              onChange={e => { setApiKey(e.target.value); setError(null); }}
              placeholder="bc_live_..."
              className="w-full bg-[#152219] border border-[#2d4035] rounded-lg px-3.5 py-2.5 pr-10 text-[14px] text-[#ececec] placeholder-[#565656] focus:outline-none focus:border-[#3d5548] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowKey(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#565656] hover:text-[#8e8e8e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f] rounded-sm"
              aria-label={showKey ? "Hide API key" : "Show API key"}
              title={showKey ? "Hide API key" : "Show API key"}
            >
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="server-name" className="block text-[13px] font-medium text-[#8e8e8e] mb-1.5">
            Name <span className="text-[#565656] font-normal">(optional)</span>
          </label>
          <input
            id="server-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Home Mac"
            maxLength={40}
            className="w-full bg-[#152219] border border-[#2d4035] rounded-lg px-3.5 py-2.5 text-[14px] text-[#ececec] placeholder-[#565656] focus:outline-none focus:border-[#3d5548] transition-colors"
          />
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mt-4 flex items-start gap-2.5 px-3.5 py-3 rounded-lg bg-[rgba(239,68,68,0.07)] border border-[rgba(239,68,68,0.18)]">
          <XCircle size={14} className="text-[#f87171] mt-0.5 flex-shrink-0" />
          <p className="text-[13px] text-[#f87171]">{error}</p>
        </div>
      )}

      {/* Success banner */}
      {success && (
        <div className="mt-4 flex items-center gap-2.5 px-3.5 py-3 rounded-lg bg-[rgba(16,163,127,0.08)] border border-[rgba(16,163,127,0.18)]">
          <CheckCircle size={14} className="text-[#10a37f] flex-shrink-0" />
          <p className="text-[13px] text-[#10a37f]">Connected! Returning to list…</p>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleTest}
        disabled={!canSubmit}
        className={cn(
          'mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[14px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]',
          canSubmit
            ? 'bg-[#10a37f] hover:bg-[#0d8f6f] text-[#0a1410]'
            : 'bg-[#152219] text-[#565656] cursor-not-allowed'
        )}
      >
        {isChecking ? (
          <><Loader2 size={14} className="animate-spin" /> Checking…</>
        ) : success ? (
          <><CheckCircle size={14} /> Connected</>
        ) : (
          'Test Connection'
        )}
      </button>
    </div>
  );
}

// ─── Profile Card ─────────────────────────────────────────────────────────────

interface ProfileCardProps {
  profile: ServerProfile;
  isActive: boolean;
  confirmDelete: ConfirmState;
  setConfirmDelete: (s: ConfirmState) => void;
  checkingId: string | null;
  setCheckingId: (id: string | null) => void;
}

function ProfileCard({
  profile,
  isActive,
  confirmDelete,
  setConfirmDelete,
  checkingId,
  setCheckingId,
}: ProfileCardProps) {
  const removeProfile = useServerStore(s => s.removeProfile);
  const updateProfile = useServerStore(s => s.updateProfile);
  const setDefault = useServerStore(s => s.setDefault);
  const connectProfile = useServerStore(s => s.connectProfile);

  const isChecking = checkingId === profile.id;
  const awaitingDelete = confirmDelete.profileId === profile.id;

  const handleRecheck = useCallback(async () => {
    setCheckingId(profile.id);
    await connectProfile(profile.id);
    setCheckingId(null);
  }, [profile.id, connectProfile, setCheckingId]);

  const handleDelete = useCallback(() => {
    removeProfile(profile.id);
    setConfirmDelete({ profileId: null });
  }, [profile.id, removeProfile, setConfirmDelete]);

  return (
    <div
      className={cn(
        'relative bg-[#152219] border rounded-xl p-4 mb-3 transition-all duration-150',
        isActive
          ? 'border-l-2 border-l-[#10a37f] border-t-[#1e3025] border-r-[#1e3025] border-b-[#1e3025]'
          : 'border-[#1e3025]'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Status dot */}
        <div className="flex-shrink-0 mt-0.5 pt-[3px]">
          <span
            className={cn(
              'block w-2 h-2 rounded-full',
              profile.lastHealthStatus === 'checking' && 'animate-pulse'
            )}
            style={{ backgroundColor: healthDotColor[profile.lastHealthStatus] }}
          />
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14px] font-semibold text-[#ececec] truncate">
              {profile.name}
            </span>
            {profile.isDefault && (
              <span className="px-1.5 py-0.5 rounded-full bg-[rgba(16,163,127,0.12)] text-[11px] font-medium text-[#10a37f] flex-shrink-0">
                Default
              </span>
            )}
          </div>
          <p className="text-[12px] text-[#565656] mt-0.5 truncate max-w-[240px]">
            {profile.url}
          </p>
          <p className="text-[11px] text-[#565656] mt-0.5">
            {healthLabel[profile.lastHealthStatus]}
            {profile.lastCheckedAt
              ? ` · ${new Date(profile.lastCheckedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : ''}
          </p>
        </div>

        {/* Right: tier badge + actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Tier pill */}
          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-[11px] font-medium',
              profile.tier === 'cloud'
                ? 'bg-[rgba(108,140,255,0.12)] text-[#6c8cff]'
                : 'bg-[rgba(142,142,142,0.10)] text-[#8e8e8e]'
            )}
          >
            {profile.tier === 'cloud' ? 'Cloud' : 'Local'}
          </span>

          {/* Pricing tier toggle: Free ↔ Pro */}
          <button
            onClick={() => updateProfile(profile.id, {
              pricingTier: profile.pricingTier === 'pro' ? 'free' : 'pro',
            })}
            title={profile.pricingTier === 'pro'
              ? 'Pro: 10% flagship + 90% Chinese models. Click to switch to Free.'
              : 'Free: Chinese models only. Click to switch to Pro.'}
            aria-label="Toggle pricing tier"
            className={cn(
              'px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]',
              profile.pricingTier === 'pro'
                ? 'bg-[rgba(16,163,127,0.15)] text-[#10a37f] hover:bg-[rgba(16,163,127,0.25)]'
                : 'bg-[rgba(142,142,142,0.10)] text-[#565656] hover:bg-[rgba(142,142,142,0.18)] hover:text-[#8e8e8e]'
            )}
          >
            {profile.pricingTier === 'pro' ? 'Pro' : 'Free'}
          </button>

          {/* Re-check */}
          <button
            onClick={handleRecheck}
            disabled={isChecking}
            title="Re-check connection"
            aria-label="Re-check connection"
            className="p-1.5 rounded-lg text-[#565656] hover:text-[#ececec] hover:bg-[#1e3025] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]"
          >
            {isChecking
              ? <Loader2 size={13} className="animate-spin" />
              : <RefreshCw size={13} />
            }
          </button>

          {/* Set default (hidden if already default) */}
          {!profile.isDefault && (
            <button
              onClick={() => setDefault(profile.id)}
              title="Set as default"
              aria-label="Set as default"
              className="p-1.5 rounded-lg text-[#565656] hover:text-[#f59e0b] hover:bg-[#1e3025] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b]"
            >
              <Star size={13} />
            </button>
          )}

          {/* Delete */}
          <button
            onClick={() =>
              awaitingDelete
                ? setConfirmDelete({ profileId: null })
                : setConfirmDelete({ profileId: profile.id })
            }
            title="Remove server"
            aria-label="Remove server"
            className="p-1.5 rounded-lg text-[#565656] hover:text-[#f87171] hover:bg-[rgba(239,68,68,0.08)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444]"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Inline delete confirm */}
      {awaitingDelete && (
        <div className="mt-3 pt-3 border-t border-[#1e3025] flex items-center justify-between gap-3">
          <p className="text-[12px] text-[#8e8e8e]">Remove this server?</p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDelete({ profileId: null })}
              className="px-3 py-1 rounded-md text-[12px] text-[#8e8e8e] bg-[#1e3025] hover:bg-[#2d4035] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 rounded-md text-[12px] font-medium text-[#fca5a5] bg-[rgba(239,68,68,0.10)] hover:bg-[rgba(239,68,68,0.18)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444]"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Server List View ─────────────────────────────────────────────────────────

interface ListViewProps {
  onAddServer: () => void;
}

function ServerListView({ onAddServer }: ListViewProps) {
  const profiles = useServerStore(s => s.profiles);
  const activeProfileId = useServerStore(s => s.activeProfileId);
  const [confirmDelete, setConfirmDelete] = useState<ConfirmState>({ profileId: null });
  const [checkingId, setCheckingId] = useState<string | null>(null);

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#1e3025] flex items-center justify-center mb-4">
          <Server size={24} className="text-[#565656]" />
        </div>
        <p className="text-[15px] font-medium text-[#ececec] mb-1">No servers connected</p>
        <p className="text-[13px] text-[#565656] mb-6">
          Connect a BridgeBot server to get started.
        </p>
        <button
          onClick={onAddServer}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#10a37f] hover:bg-[#0d8f6f] text-[#0a1410] text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111c15]"
        >
          <Plus size={15} />
          Connect your first server
        </button>
      </div>
    );
  }

  return (
    <div>
      {profiles.map(profile => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          isActive={profile.id === activeProfileId}
          confirmDelete={confirmDelete}
          setConfirmDelete={setConfirmDelete}
          checkingId={checkingId}
          setCheckingId={setCheckingId}
        />
      ))}
    </div>
  );
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────

export default function ServerManageModal() {
  const isManageOpen = useServerStore(s => s.isManageOpen);
  const manageTab = useServerStore(s => s.manageTab);
  const closeManage = useServerStore(s => s.closeManage);

  const [tab, setTab] = useState<'list' | 'add'>(manageTab);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Sync tab when modal opens
  useEffect(() => {
    if (isManageOpen) {
      setTab(manageTab);
      // Trigger entrance animation on next frame
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isManageOpen, manageTab]);

  // Escape key
  useEffect(() => {
    if (!isManageOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeManage();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isManageOpen, closeManage]);

  if (!isManageOpen) return null;

  const headerTitle = tab === 'list' ? 'Your Servers' : null;

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-end lg:items-center lg:justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-black/60 transition-opacity duration-300',
          visible ? 'opacity-100' : 'opacity-0'
        )}
        onClick={closeManage}
      />

      {/* ── Mobile: bottom sheet ── */}
      <div
        ref={panelRef}
        className={cn(
          'relative lg:hidden w-full rounded-t-2xl bg-[#111c15] border-t border-[#1e3025]',
          'flex flex-col max-h-[88vh]',
          'transition-transform duration-300 ease-out',
          visible ? 'translate-y-0' : 'translate-y-full'
        )}
        style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.5)' }}
      >
        {/* Drag handle */}
        <div className="flex-shrink-0 flex justify-center pt-3 pb-2">
          <div className="w-9 h-[3px] rounded-full bg-[#2d4035]" />
        </div>

        {/* Mobile header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 pb-3">
          {headerTitle ? (
            <h2 className="text-[18px] font-semibold text-[#ececec]">{headerTitle}</h2>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-2">
            {tab === 'list' && (
              <button
                onClick={() => setTab('add')}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#10a37f] hover:bg-[#0d8f6f] text-[#0a1410] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111c15]"
                title="Add server"
                aria-label="Add server"
              >
                <Plus size={15} />
              </button>
            )}
            <button
              onClick={closeManage}
              aria-label="Close modal"
              title="Close modal"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#565656] hover:text-[#ececec] hover:bg-[#1e3025] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 pb-8 overscroll-contain">
          {tab === 'list' ? (
            <ServerListView onAddServer={() => setTab('add')} />
          ) : (
            <AddServerForm
              onBack={() => setTab('list')}
              onConnected={() => setTab('list')}
            />
          )}
        </div>
      </div>

      {/* ── Desktop: centered modal ── */}
      <div
        className={cn(
          'relative hidden lg:flex flex-col w-full max-w-[480px] max-h-[80vh]',
          'rounded-2xl bg-[#111c15] border border-[#1e3025]',
          'transition-all duration-300 ease-out',
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
      >
        {/* Desktop header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#1e3025]">
          <h2 className="text-[18px] font-semibold text-[#ececec]">
            {tab === 'list' ? 'Your Servers' : 'Add Server'}
          </h2>
          <div className="flex items-center gap-2">
            {tab === 'list' && (
              <button
                onClick={() => setTab('add')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10a37f] hover:bg-[#0d8f6f] text-[#0a1410] text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111c15]"
              >
                <Plus size={13} />
                Add Server
              </button>
            )}
            <button
              onClick={closeManage}
              aria-label="Close modal"
              title="Close modal"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#565656] hover:text-[#ececec] hover:bg-[#1e3025] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10a37f]"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {tab === 'list' ? (
            <ServerListView onAddServer={() => setTab('add')} />
          ) : (
            <AddServerForm
              onBack={() => setTab('list')}
              onConnected={() => setTab('list')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
