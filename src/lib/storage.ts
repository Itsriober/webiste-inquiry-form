const STORAGE_KEY = 'illustriober_briefs';
const STATS_KEY = 'illustriober_stats';

import type { BriefFormData } from '../types/brief';

export interface StoredBrief {
  id: string;             // uuid v4
  submittedAt: string;    // ISO string
  status: 'submitted';
  data: BriefFormData;
}

export interface FormStats {
  started: number;        // incremented when /brief is first visited
  submitted: number;      // incremented on successful submit
  abandoned: number;      // calculated: started - submitted
}

// Increment started count when BriefForm mounts
export function recordStart(): void {
  const stats = getStats();
  stats.started += 1;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

// Save a completed brief and increment submitted count
export function saveBrief(data: BriefFormData): StoredBrief {
  const brief: StoredBrief = {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    status: 'submitted',
    data,
  };

  const existing = getBriefs();
  existing.unshift(brief); // newest first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

  const stats = getStats();
  stats.submitted += 1;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));

  return brief;
}

export function getBriefs(): StoredBrief[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getStats(): FormStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? JSON.parse(raw) : { started: 0, submitted: 0, abandoned: 0 };
  } catch {
    return { started: 0, submitted: 0, abandoned: 0 };
  }
}

export function deleteBrief(id: string): void {
  const updated = getBriefs().filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STATS_KEY);
}
