/**
 * Progress Service
 * Tracks user exercise completions across Python and SQL Labs.
 * - Guest mode: Persists to LocalStorage (data lost on browser clear)
 * - Authenticated: Persists to Supabase (synced across devices)
 */

import { supabase, UserProgress } from './supabaseClient';

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
const EXERCISES_PER_TOPIC = 60; // 20 easy + 20 medium + 20 hard

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

// ==================== SUPABASE OPERATIONS ====================

async function loadProgressSupabase(): Promise<ProgressData> {
  if (!currentUserId) return { completions: [], streakDays: 0, lastActiveDate: '' };

  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', currentUserId);

    if (error) throw error;

    const completions: ExerciseCompletion[] = (data || []).map((row: UserProgress) => ({
      lab: row.lab,
      topicId: row.topic_id,
      difficulty: row.difficulty,
      exerciseIndex: row.exercise_index,
      completedAt: row.completed_at || new Date().toISOString(),
      attempts: row.attempts
    }));

    // Calculate streak from completions
    const dates = [...new Set(completions.map(c => c.completedAt.split('T')[0]))].sort().reverse();
    let streakDays = 0;
    const today = getToday();

    for (let i = 0; i < dates.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      const expectedStr = expectedDate.toISOString().split('T')[0];

      if (dates[i] === expectedStr) {
        streakDays++;
      } else {
        break;
      }
    }

    return {
      completions,
      streakDays,
      lastActiveDate: dates[0] || ''
    };
  } catch (e) {
    console.error('Failed to load progress from Supabase:', e);
    return { completions: [], streakDays: 0, lastActiveDate: '' };
  }
}

async function saveProgressSupabase(
  lab: 'sql' | 'python',
  topicId: string,
  difficulty: 'easy' | 'medium' | 'hard',
  exerciseIndex: number,
  attempts: number
): Promise<void> {
  if (!currentUserId) return;

  try {
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: currentUserId,
        lab,
        topic_id: topicId,
        difficulty,
        exercise_index: exerciseIndex,
        attempts,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,lab,topic_id,difficulty,exercise_index'
      });

    if (error) throw error;
  } catch (e) {
    console.error('Failed to save progress to Supabase:', e);
  }
}

// ==================== PUBLIC API ====================

// Load progress (from appropriate source)
export function loadProgress(): ProgressData {
  // For sync operations, use local storage
  // Supabase version is async, use loadProgressAsync for that
  return loadProgressLocal();
}

// Async version for authenticated users
export async function loadProgressAsync(): Promise<ProgressData> {
  if (currentUserId) {
    return await loadProgressSupabase();
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

  // If authenticated, also save to Supabase (fire and forget)
  if (currentUserId) {
    saveProgressSupabase(lab, topicId, difficulty, exerciseIndex, attempts);
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

// Get radar/progress data by topic for a specific lab
export function getTopicProgress(
  lab: 'sql' | 'python',
  topics: Array<{ id: string; name: string }>
): TopicProgress[] {
  const completions = getCompletionsByLab(lab);

  return topics.map(topic => {
    const topicCompletions = completions.filter(c => c.topicId === topic.id);
    const completed = topicCompletions.length;
    const total = EXERCISES_PER_TOPIC;
    const percentage = Math.round((completed / total) * 100);

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

  // Also clear from Supabase if authenticated
  if (currentUserId) {
    try {
      await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', currentUserId);
    } catch (e) {
      console.error('Failed to clear Supabase progress:', e);
    }
  }
}

// Sync local progress to Supabase (called after login)
export async function syncLocalToSupabase(): Promise<void> {
  if (!currentUserId) return;

  const localData = loadProgressLocal();

  for (const completion of localData.completions) {
    await saveProgressSupabase(
      completion.lab,
      completion.topicId,
      completion.difficulty,
      completion.exerciseIndex,
      completion.attempts
    );
  }
}

// Load from Supabase to Local (called after login)
export async function syncSupabaseToLocal(): Promise<void> {
  if (!currentUserId) return;

  const supabaseData = await loadProgressSupabase();
  const localData = loadProgressLocal();

  // Merge: keep all unique completions from both sources
  const allCompletions = [...localData.completions];

  for (const completion of supabaseData.completions) {
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
    streakDays: Math.max(localData.streakDays, supabaseData.streakDays),
    lastActiveDate: localData.lastActiveDate > supabaseData.lastActiveDate
      ? localData.lastActiveDate
      : supabaseData.lastActiveDate
  });
}
