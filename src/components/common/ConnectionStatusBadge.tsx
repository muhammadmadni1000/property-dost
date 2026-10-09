import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { checkSupabaseConnection } from '../../lib/supabase';
import type { SupabaseHealthStatus } from '../../types/database';

interface ConnectionStatusBadgeProps {
  onOpenSetup?: () => void;
}

export const ConnectionStatusBadge: React.FC<ConnectionStatusBadgeProps> = ({ onOpenSetup }) => {
  const [health, setHealth] = useState<SupabaseHealthStatus>({
    state: 'checking',
    message: 'Checking Supabase...',
    urlConfigured: false,
    keyConfigured: false,
  });

  const runCheck = async () => {
    setHealth({
      state: 'checking',
      message: 'Checking Supabase...',
      urlConfigured: false,
      keyConfigured: false,
    });
    const result = await checkSupabaseConnection();
    setHealth(result);
  };

  useEffect(() => {
    runCheck();
    // Periodic health re-check every 60 seconds
    const interval = setInterval(runCheck, 60000);
    return () => clearInterval(interval);
  }, []);

  if (health.state === 'connected') {
    return (
      <div 
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 shadow-sm"
        title={`Connected & Verified with Supabase at ${health.verifiedAt?.toLocaleTimeString()}`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-semibold tracking-wide">Live Supabase Connected</span>
      </div>
    );
  }

  if (health.state === 'checking') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
        <Loader2 className="w-3 h-3 animate-spin text-gold-400" />
        <span>Checking Supabase...</span>
      </div>
    );
  }

  if (health.state === 'unconfigured') {
    return (
      <button
        onClick={onOpenSetup}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-950/80 text-amber-300 border border-amber-600/50 hover:bg-amber-900/80 transition-colors"
        title={health.errorDetail}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        <span>Supabase Setup Required</span>
      </button>
    );
  }

  // Error state
  return (
    <button
      onClick={onOpenSetup || runCheck}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-950/80 text-rose-300 border border-rose-600/50 hover:bg-rose-900/80 transition-colors"
      title={health.errorDetail || 'Click to view configuration help or retry'}
    >
      <XCircle className="w-3.5 h-3.5 text-rose-400" />
      <span>Supabase Connection Error</span>
    </button>
  );
};
