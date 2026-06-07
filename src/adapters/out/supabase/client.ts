import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project-id.supabase.co');

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

const DEFAULT_TIMEOUT_MS = 8000;

export function withTimeout<T>(promise: PromiseLike<T>, ms = DEFAULT_TIMEOUT_MS): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Supabase query timed out after ${ms}ms`)), ms)
    )
  ]);
}

export async function safeSupabaseQuery<T>(query: () => PromiseLike<{ data: T | null; error: any }>, fallback: () => T, timeoutMs?: number): Promise<T> {
  try {
    const result = await withTimeout(query(), timeoutMs);
    if (result.error) {
      console.error('Supabase error:', result.error);
      return fallback();
    }
    return result.data ?? fallback();
  } catch (err) {
    console.error('Supabase query failed, using fallback:', err);
    return fallback();
  }
}
