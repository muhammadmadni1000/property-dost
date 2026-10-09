import { createClient } from '@supabase/supabase-js';
import type { SupabaseHealthStatus } from '../types/database';

// Official environment variables
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ''
).trim();

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseKey) &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project') &&
    !supabaseUrl.includes('...') &&
    !supabaseKey.includes('your-supabase-publishable-key')
  );
};

// Official Supabase browser client
const safeUrl = isSupabaseConfigured()
  ? supabaseUrl
  : 'https://placeholder-project.supabase.co';
const safeKey = isSupabaseConfigured()
  ? supabaseKey
  : 'placeholder-key';

export const supabase = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Checks live connection to Supabase by executing an actual query.
 * "Live Supabase Connected" is ONLY granted when the query succeeds.
 */
export async function checkSupabaseConnection(): Promise<SupabaseHealthStatus> {
  const urlConfigured =
    Boolean(supabaseUrl) &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project') &&
    !supabaseUrl.includes('...');
  const keyConfigured =
    Boolean(supabaseKey) &&
    !supabaseKey.includes('your-supabase-publishable-key');

  if (!urlConfigured || !keyConfigured) {
    const errorDetail = supabaseUrl.includes('...')
      ? 'VITE_SUPABASE_URL appears to be truncated with ellipses (...). Please use the full Supabase project URL.'
      : 'Please configure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file.';

    return {
      state: 'unconfigured',
      message: 'Supabase environment variables are missing or unconfigured.',
      urlConfigured,
      keyConfigured,
      errorDetail,
    };
  }

  try {
    // Perform an actual query to verify database connectivity and table accessibility
    const { error, status } = await supabase
      .from('properties')
      .select('id')
      .limit(1);

    if (error) {
      return {
        state: 'error',
        message: 'Supabase connection failed. Please check your configuration.',
        urlConfigured: true,
        keyConfigured: true,
        errorDetail: `${error.message} (HTTP status ${status || 'network error'})`,
      };
    }

    return {
      state: 'connected',
      message: 'Live Supabase Connected',
      urlConfigured: true,
      keyConfigured: true,
      verifiedAt: new Date(),
    };
  } catch (err: any) {
    return {
      state: 'error',
      message: 'Supabase connection failed. Please check your configuration.',
      urlConfigured: true,
      keyConfigured: true,
      errorDetail: err?.message || 'Network error attempting to reach Supabase',
    };
  }
}
