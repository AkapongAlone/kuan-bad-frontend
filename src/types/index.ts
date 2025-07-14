export interface Player {
  id: string;
  name: string;
  skill: 'BG' | 'N' | 'S' | 'P-' | 'P/P+' | 'C';
  gamesPlayed: number;
  waitTime: number;
  cost: number;
  isPlaying: boolean;
  lastPlayTime?: Date;
  shuttlesUsed: number;
  joinedAt: Date;
}

export interface Match {
  id: string;
  court: number;
  team1: [string, string];
  team2: [string, string];
  shuttlesUsed: number;
  startTime: Date;
  endTime?: Date;
}

export interface Queue {
  id: string;
  team1: [string, string];
  team2: [string, string];
  createdAt: Date;
}

export interface Settings {
  courts: number;
  costSystem: 'club' | 'split';
  fixedCost: number;
  shuttleCost: number;
  totalCost: number;
  hourlyRate: boolean;
}

export interface BadmintonData {
  players: Player[];
  deletedPlayers: Player[];
  matches: Match[];
  matchHistory: [string, string][];
  queues: Queue[];
  settings: Settings;
}