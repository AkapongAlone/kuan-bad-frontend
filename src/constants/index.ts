import { Settings } from '../types';

export const DEFAULT_SETTINGS: Settings = {
  courts: 0,
  costSystem: 'club',
  fixedCost: 0,
  shuttleCost: 0,
  totalCost: 0,
  hourlyRate: false
};

export const SKILL_COLORS = {
  'BG': 'bg-gray-400',
  'N': 'bg-emerald-500',
  'S': 'bg-blue-500',
  'P-': 'bg-purple-500',
  'P/P+': 'bg-red-500',
  'C': 'bg-amber-500'
} as const;

export const WAIT_TIME_UPDATE_INTERVAL = 10000; // 10 seconds
export const WAIT_TIME_WARNING_THRESHOLD = 10; // 10 minutes
export const LOCAL_STORAGE_KEY = 'badmintonData';