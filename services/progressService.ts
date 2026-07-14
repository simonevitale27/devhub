/**
 * Progress Service
 * Tracks user exercise completions across Python and SQL Labs.
 * - Guest mode: Persists to LocalStorage (data lost on browser clear)
 * - Authenticated: Persists to PocketBase (synced across devices)
 */

import { pb, isPocketBaseAvailable, markPocketBaseUnavailable } from './pocketbaseClient';

// Types
export interface ExerciseCompletion {
  topicId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  exerciseIndex: number;
  completedAt: string; // ISO date string
  attempts: number;
  lab: 'sql' | 'python';
}

export interface ProgressData {
  completions: ExerciseCompletion[];
  streakDays: number;
  lastActiveDate: string;
}

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // 0 = none, 4 = max
}

export interface TopicProgress {
  topicId: string;
  topicName: string;
  completed: number;
  total: number;
  percentage: number;
}

// Constants
const STORAGE_KEY = 'devhub_progress';
// Fallback only — used when the caller doesn't pass real per-topic totals.
// Real totals come from the generators (SQL_TOPIC_TOTALS / PYTHON_TOPIC_TOTALS).
const EXERCISES_PER_TOPIC_FALLBACK = 90; // ~30 per difficulty × 3

// Current user ID (null = guest mode)
let currentUserId: string | null = null;

// Set current user (called on auth change)
export function setCurrentUser(userId: string | null): void {
  currentUserId = userId;
}

// Check if user is authenticated
export function isUserAuthenticated(): boolean {
  return currentUserId !== null;
}

// Helper to get today's date in YYYY-MM-DD format
function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

// Helper to calculate days between two dates
function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// ==================== LOCAL STORAGE OPERATIONS ====================

function loadProgressLocal(): ProgressData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as ProgressData;
    }
  } catch (e) {
    console.error('Failed to load progress:', e);
  }
  return {
    completions: [],
    streakDays: 0,
    lastActiveDate: ''
  };
}

function saveProgressLocal(data: ProgressData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
}

// ==================== POCKETBASE OPERATIONS ====================

async function loadProgressPocketBase(): Promise<ProgressData> {
  if (!currentUserId || !isPocketBaseAvailable()) return { completions: [], streakDays: 0, lastActiveDate: '' };

  try {
    const rows = await pb.collection('user_progress').getFullList({
      filter: pb.filter('user = {:userId}', { userId: currentUserId }),
    });

    const completions: ExerciseCompletion[] = rows.map((row: any) => ({
      lab: row.lab,
      topicId: row.topic_id,
      difficulty: row.difficulty,
      exerciseIndex: row.exercise_index,
      completedAt: row.completed_at || new Date().toISOString(),
      attempts: row.attempts
    }));

    // Calculate streak: consecutive days ending at the most recent activity,
    // valid only if that activity is today OR yesterday — same rule as the local
    // getStreak(), so backend and guest streaks stay consistent (previously the
    // backend reset the streak to 0 whenever no exercise was done *today*).
    const dates = [...new Set(completions.map(c => c.completedAt.split('T')[0]))].sort().reverse();
    let streakDays = 0;
    if (dates.length > 0) {
      const DAY_MS = 1000 * 60 * 60 * 24;
      const today = new Date(getToday());
      const mostRecent = new Date(dates[0]);
      const gapFromToday = Math.round((today.getTime() - mostRecent.getTime()) / DAY_MS);
      if (gapFromToday <= 1) {
        streakDays = 1;
        for (let i = 1; i < dates.length; i++) {
          const prev = new Date(dates[i - 1]);
          const cur = new Date(dates[i]);
          if (Math.round((prev.getTime() - cur.getTime()) / DAY_MS) === 1) {
            streakDays++;
          } else {
            break;
          }
        }
      }
    }

    return {
      completions,
      streakDays,
      lastActiveDate: dates[0] || ''
    };
  } catch (e) {
    markPocketBaseUnavailable();
    return { completions: [], streakDays: 0, lastActiveDate: '' };
  }
}

async function saveProgressPocketBase(
  lab: 'sql' | 'python',
  topicId: string,
  difficulty: 'easy' | 'medium' | 'hard',
  exerciseIndex: number,
  attempts: number
): Promise<void> {
  if (!currentUserId || !isPocketBaseAvailable()) return;

  try {
    const filter = pb.filter(
      'user = {:userId} && lab = {:lab} && topic_id = {:topicId} && difficulty = {:difficulty} && exercise_index = {:exerciseIndex}',
      { userId: currentUserId, lab, topicId, difficulty, exerciseIndex }
    );
    const data = {
      user: currentUserId,
      lab,
      topic_id: topicId,
      difficulty,
      exercise_index: exerciseIndex,
      attempts,
      completed_at: new Date().toISOString(),
    };

    const existing = await pb.collection('user_progress').getFirstListItem(filter).catch(() => null);
    if (existing) {
      await pb.collection('user_progress').update(existing.id, data);
    } else {
      try {
        await pb.collection('user_progress').create(data);
      } catch (createErr: any) {
        // A concurrent sync may have created the same row first; the UNIQUE index
        // then rejects this create with a 400. That's not a failure — the progress
        // is saved. Confirm the row exists and treat as success instead of tripping
        // the circuit breaker (which would kill cloud sync for the whole session).
        if (createErr?.status === 400) {
          const now = await pb.collection('user_progress').getFirstListItem(filter).catch(() => null);
          if (now) return;
        }
        throw createErr;
      }
    }
  } catch (e: any) {
    // Only a genuine connectivity/server failure should disable cloud sync for the
    // session. A 4xx (validation/permission) is request-specific, not an outage.
    if (!e?.status || e.status >= 500) {
      markPocketBaseUnavailable();
    }
  }
}

// ==================== PUBLIC API ====================

// Load progress (from appropriate source)
export function loadProgress(): ProgressData {
  // For sync operations, use local storage
  // PocketBase version is async, use loadProgressAsync for that
  return loadProgressLocal();
}

// Async version for authenticated users
export async function loadProgressAsync(): Promise<ProgressData> {
  if (currentUserId) {
    return await loadProgressPocketBase();
  }
  return loadProgressLocal();
}

// Record a completed exercise
export function recordCompletion(
  lab: 'sql' | 'python',
  topicId: string,
  difficulty: 'easy' | 'medium' | 'hard',
  exerciseIndex: number,
  attempts: number = 1
): void {
  // Always save to local storage for immediate feedback
  const progress = loadProgressLocal();
  const today = getToday();

  // Check if already completed (avoid duplicates)
  const existing = progress.completions.find(
    c => c.lab === lab &&
         c.topicId === topicId &&
         c.difficulty === difficulty &&
         c.exerciseIndex === exerciseIndex
  );

  if (!existing) {
    progress.completions.push({
      lab,
      topicId,
      difficulty,
      exerciseIndex,
      completedAt: new Date().toISOString(),
      attempts
    });
  }

  // Update streak
  if (progress.lastActiveDate) {
    const daysDiff = daysBetween(progress.lastActiveDate, today);
    if (daysDiff === 0) {
      // Same day, streak unchanged
    } else if (daysDiff === 1) {
      // Consecutive day, increment streak
      progress.streakDays++;
    } else {
      // Streak broken, reset to 1
      progress.streakDays = 1;
    }
  } else {
    // First activity
    progress.streakDays = 1;
  }

  progress.lastActiveDate = today;
  saveProgressLocal(progress);

  // If authenticated, also save to PocketBase (fire and forget)
  if (currentUserId) {
    saveProgressPocketBase(lab, topicId, difficulty, exerciseIndex, attempts);
  }
}

// Get all completions
export function getCompletions(): ExerciseCompletion[] {
  return loadProgressLocal().completions;
}

// Get completions filtered by lab
export function getCompletionsByLab(lab: 'sql' | 'python'): ExerciseCompletion[] {
  return getCompletions().filter(c => c.lab === lab);
}

// Get completions filtered by topic
export function getCompletionsByTopic(topicId: string): ExerciseCompletion[] {
  return getCompletions().filter(c => c.topicId === topicId);
}

// Get current streak
export function getStreak(): number {
  const progress = loadProgressLocal();
  const today = getToday();

  if (progress.lastActiveDate) {
    const daysDiff = daysBetween(progress.lastActiveDate, today);
    if (daysDiff > 1) {
      return 0;
    }
  }

  return progress.streakDays;
}

// Get heatmap data for the last N days
export function getHeatmapData(days: number = 365): HeatmapDay[] {
  const completions = getCompletions();
  const result: HeatmapDay[] = [];
  const today = new Date();

  const countByDate: Record<string, number> = {};
  completions.forEach(c => {
    const date = c.completedAt.split('T')[0];
    countByDate[date] = (countByDate[date] || 0) + 1;
  });

  const maxCount = Math.max(1, ...Object.values(countByDate));

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const count = countByDate[dateStr] || 0;

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count > 0) {
      const ratio = count / maxCount;
      if (ratio <= 0.25) level = 1;
      else if (ratio <= 0.5) level = 2;
      else if (ratio <= 0.75) level = 3;
      else level = 4;
    }

    result.push({ date: dateStr, count, level });
  }

  return result;
}

// Get radar/progress data by topic for a specific lab.
// `totalsByTopic` carries the REAL number of exercises available per topic
// (from the generators). Without it we fall back to a rough constant — the old
// behaviour used a fixed 60 for every topic, which over/under-stated progress.
export function getTopicProgress(
  lab: 'sql' | 'python',
  topics: Array<{ id: string; name: string }>,
  totalsByTopic?: Record<string, number>
): TopicProgress[] {
  const completions = getCompletionsByLab(lab);

  return topics.map(topic => {
    const topicCompletions = completions.filter(c => c.topicId === topic.id);
    const completed = topicCompletions.length;
    const total = totalsByTopic?.[topic.id] ?? EXERCISES_PER_TOPIC_FALLBACK;
    // Clamp: stale local data could report more completions than the current total.
    const percentage = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

    return {
      topicId: topic.id,
      topicName: topic.name,
      completed,
      total,
      percentage
    };
  });
}

// Get total stats
export function getTotalStats(): {
  totalCompleted: number;
  pythonCompleted: number;
  sqlCompleted: number;
  averageAttempts: number;
  bestTopic: string | null;
} {
  const completions = getCompletions();
  const pythonCompletions = completions.filter(c => c.lab === 'python');
  const sqlCompletions = completions.filter(c => c.lab === 'sql');

  const totalAttempts = completions.reduce((sum, c) => sum + c.attempts, 0);
  const averageAttempts = completions.length > 0
    ? Math.round((totalAttempts / completions.length) * 10) / 10
    : 0;

  const topicCounts: Record<string, number> = {};
  completions.forEach(c => {
    topicCounts[c.topicId] = (topicCounts[c.topicId] || 0) + 1;
  });

  let bestTopic: string | null = null;
  let maxCount = 0;
  Object.entries(topicCounts).forEach(([topic, count]) => {
    if (count > maxCount) {
      maxCount = count;
      bestTopic = topic;
    }
  });

  return {
    totalCompleted: completions.length,
    pythonCompleted: pythonCompletions.length,
    sqlCompleted: sqlCompletions.length,
    averageAttempts,
    bestTopic
  };
}

// Clear all progress
export async function clearProgress(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY);

  // Also clear from PocketBase if authenticated
  if (currentUserId) {
    try {
      const rows = await pb.collection('user_progress').getFullList({
        filter: pb.filter('user = {:userId}', { userId: currentUserId }),
      });
      await Promise.all(rows.map(row => pb.collection('user_progress').delete(row.id)));
    } catch (e) {
      console.error('Failed to clear PocketBase progress:', e);
    }
  }
}

// Sync local progress to PocketBase (called after login).
// Single-flight: at login both checkSession and the authStore.onChange listener
// fire this concurrently. Without a guard the two runs race on the same rows and
// each benign UNIQUE-constraint rejection used to trip the circuit breaker.
let _syncInFlight: Promise<void> | null = null;
export async function syncLocalToBackend(): Promise<void> {
  if (!currentUserId) return;
  if (_syncInFlight) return _syncInFlight;

  const userAtStart = currentUserId;
  _syncInFlight = (async () => {
    const localData = loadProgressLocal();
    for (const completion of localData.completions) {
      // Bail out if the user logged out mid-sync.
      if (currentUserId !== userAtStart) break;
      await saveProgressPocketBase(
        completion.lab,
        completion.topicId,
        completion.difficulty,
        completion.exerciseIndex,
        completion.attempts
      );
    }
  })().finally(() => { _syncInFlight = null; });

  return _syncInFlight;
}

// Load from PocketBase to Local (called after login)
export async function syncBackendToLocal(): Promise<void> {
  if (!currentUserId) return;

  const backendData = await loadProgressPocketBase();
  const localData = loadProgressLocal();

  // Merge: keep all unique completions from both sources
  const allCompletions = [...localData.completions];

  for (const completion of backendData.completions) {
    const exists = allCompletions.find(
      c => c.lab === completion.lab &&
           c.topicId === completion.topicId &&
           c.difficulty === completion.difficulty &&
           c.exerciseIndex === completion.exerciseIndex
    );

    if (!exists) {
      allCompletions.push(completion);
    }
  }

  saveProgressLocal({
    completions: allCompletions,
    streakDays: Math.max(localData.streakDays, backendData.streakDays),
    lastActiveDate: localData.lastActiveDate > backendData.lastActiveDate
      ? localData.lastActiveDate
      : backendData.lastActiveDate
  });
}
