import { pb, toAuthUser, extractPbError, AuthUser } from './pocketbaseClient';

// Auth state type
export interface AuthState {
  user: AuthUser | null;
  isGuest: boolean;
  isLoading: boolean;
}

interface AuthError {
  message: string;
}

// Sign up with email, password and display name
export async function signUp(
  email: string,
  password: string,
  displayName?: string
): Promise<{ user: AuthUser | null; error: AuthError | null }> {
  try {
    await pb.collection('users').create({
      email,
      password,
      passwordConfirm: password,
      name: displayName || email.split('@')[0],
    });
    const authData = await pb.collection('users').authWithPassword(email, password);
    return { user: toAuthUser(authData.record), error: null };
  } catch (err: any) {
    return { user: null, error: { message: extractPbError(err) } };
  }
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: AuthError | null }> {
  try {
    const authData = await pb.collection('users').authWithPassword(email, password);
    return { user: toAuthUser(authData.record), error: null };
  } catch (err: any) {
    return { user: null, error: { message: extractPbError(err) } };
  }
}

// Sign in with Google (opens an OAuth2 popup, handled entirely by the SDK)
export async function signInWithGoogle(): Promise<{ error: AuthError | null }> {
  try {
    const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });
    const patch: Record<string, string> = { provider: 'google' };
    if (authData.meta?.avatarUrl && !authData.record.avatar_url) {
      patch.avatar_url = authData.meta.avatarUrl;
    }
    await pb.collection('users').update(authData.record.id, patch);
    return { error: null };
  } catch (err: any) {
    return { error: { message: extractPbError(err) } };
  }
}

// Sign out
export async function signOut(): Promise<void> {
  pb.authStore.clear();
}

// Get current user
export async function getCurrentUser(): Promise<AuthUser | null> {
  return pb.authStore.record ? toAuthUser(pb.authStore.record) : null;
}

// Subscribe to auth changes
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  return pb.authStore.onChange((_token, record) => {
    callback(record ? toAuthUser(record) : null);
  });
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  return pb.authStore.isValid;
}

// Send password reset email
export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  try {
    await pb.collection('users').requestPasswordReset(email);
    return { error: null };
  } catch (err: any) {
    return { error: { message: extractPbError(err) } };
  }
}
