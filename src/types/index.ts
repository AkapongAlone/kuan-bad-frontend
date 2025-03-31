// src/types/index.ts

export interface Room {
  id: number;
  name: string;
  open_time: string;
  close_time: string;
  players: Player[];
}

export interface Player {
  id: number;
  name: string;
  skill: string;
  join_time: string;
  number_of_matches: number;
  number_of_shuttlecock: number;
  room: number;
}

export interface RoomFormData {
  name: string;
  open_time: string;
  close_time: string;
}

export interface PlayerFormData {
  name: string;
  skill: string;
  number_of_matches: number;
  number_of_shuttlecock: number;
  room: number;
}

export interface MatchmakingPlayer {
    id: number;
    name: string;
    skill: string;
  }

  export interface MatchmakingTeam {
    team_name: string;
    players: MatchmakingPlayer[];
    compatibility_score: number;
  }
  
  export interface MatchmakingMatch {
    team1: string;
    team2: string;
    balance_score: number;
    recommended_play_time: number;
  }
  
  export interface MatchmakingData {
    teams: MatchmakingTeam[];
    match: MatchmakingMatch;
    analysis: string;
  }
  
  export interface MatchmakingResponse {
    room: {
      id: number;
      name: string;
      player_count: number;
    };
    matchmaking: MatchmakingData;
  }