import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jxdggjiuhocssbdyhldj.supabase.co';

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_kYZx7oy5zcFiQQ6ZxM_0pw_UUQ2X6xy';

export const APP_ID =
  process.env.NEXT_PUBLIC_APP_ID ||
  process.env.NEXT_PUBLIC_APP_PACKAGE_ID ||
  process.env.APP_PACKAGE_ID ||
  'com.playsphere.emojimatch';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseInstance;
}
