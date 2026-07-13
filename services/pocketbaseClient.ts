import PocketBase from 'pocketbase';

// Backend config — env-first, swap via VITE_POCKETBASE_URL.
// The hardcoded value below is the self-hosted instance on Coolify/VPS, kept only
// as fallback so a missing env var doesn't hard-crash the app in guest mode.
const FALLBACK_URL = 'https://pocketbase-j6784mksa2l2i5a6eg5oolgd.49.12.96.95.sslip.io';

const pocketbaseUrl = import.meta.env.VITE_POCKETBASE_URL || FALLBACK_URL;

if (!import.meta.env.VITE_POCKETBASE_URL) {
  console.warn('[pocketbase] VITE_POCKETBASE_URL non impostata: uso il fallback hardcoded.');
}

export const pb = new PocketBase(pocketbaseUrl);
// Auto-cancellation would abort an in-flight save when a new one starts (e.g. rapid
// exercise completions); progress writes are independent, so disable it.
pb.autoCancellation(false);

// Circuit breaker: once PocketBase fails, stop retrying for the rest of the session.
let _pbAvailable = true;
export function isPocketBaseAvailable(): boolean { return _pbAvailable; }
export function markPocketBaseUnavailable(): void { _pbAvailable = false; }

// Types for database
export interface UserProgress {
  id?: string;
  user: string;
  lab: 'sql' | 'python';
  topic_id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  exercise_index: number;
  completed_at?: string;
  attempts: number;
}

// Minimal user shape, decoupled from PocketBase's RecordModel so the rest of the
// app (AuthContext, LandingPage, AccountPage) doesn't need to know about PocketBase.
export interface AuthUser {
  id: string;
  email: string | null;
  created_at: string;
  user_metadata: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
  };
  app_metadata: {
    provider?: string;
  };
}

export function toAuthUser(record: any): AuthUser {
  return {
    id: record.id,
    email: record.email ?? null,
    created_at: record.created,
    user_metadata: {
      full_name: record.name || undefined,
      name: record.name || undefined,
      avatar_url: record.avatar_url || undefined,
    },
    app_metadata: {
      provider: record.provider || 'email',
    },
  };
}

export function extractPbError(err: any): string {
  return err?.response?.message || err?.message || 'Errore di comunicazione con il server';
}
