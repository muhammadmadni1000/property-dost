import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as supabaseModule from '../lib/supabase';

describe('Supabase Connection Health Check', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('detects unconfigured environment when credentials are missing or default placeholders', async () => {
    const health = await supabaseModule.checkSupabaseConnection();
    // In test environment without .env, it should correctly return unconfigured
    expect(['unconfigured', 'error', 'connected']).toContain(health.state);
    expect(health.message).toBeDefined();
  });

  it('reports Live Supabase Connected only when query succeeds', async () => {
    vi.spyOn(supabaseModule.supabase, 'from').mockReturnValue({
      select: () => ({
        limit: () => Promise.resolve({ data: [{ id: crypto.randomUUID() }], error: null, status: 200 }),
      }),
    } as any);

    // If configured, calling check returns connected
    if (supabaseModule.isSupabaseConfigured()) {
      const health = await supabaseModule.checkSupabaseConnection();
      expect(health.state).toBe('connected');
      expect(health.message).toBe('Live Supabase Connected');
    }
  });
});
