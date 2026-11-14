export interface Note {
  id: string;
  title: string;
  content: string;
  area: string;
  category: 'quest' | 'secret' | 'todo' | 'lore' | 'dungeon';
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SkulltulaItem {
  id: number;
  region: string;
  location: string;
  requirement: string;
  timeOfDay: 'day' | 'night' | 'both';
  linkAge: 'child' | 'adult' | 'both';
  isCollected?: boolean;
}

export interface HeartPieceItem {
  id: number;
  region: string;
  location: string;
  requirement: string;
  linkAge: 'child' | 'adult' | 'both';
  description: string;
  isCollected?: boolean;
}

export type OcarinaButton = 'A' | 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type OcarinaNotePitch =
  | 'C4'
  | 'D4'
  | 'E4'
  | 'F4'
  | 'F#4'
  | 'G4'
  | 'A4'
  | 'Bb4'
  | 'B4'
  | 'C5'
  | 'D5'
  | 'E5';

export interface OcarinaScoreNote {
  pitch: OcarinaNotePitch;
  start: number;
  duration: number;
  button?: OcarinaButton;
}

export interface OcarinaSong {
  id: string;
  name: string;
  namePt: string;
  notes: OcarinaButton[];
  introScore?: OcarinaScoreNote[];
  fullScore?: OcarinaScoreNote[];
  effect: string;
  location: string;
  category: 'warp' | 'magic' | 'special';
  isLearned?: boolean;
}

export interface StoryMilestone {
  key: string;
  title: string;
  description: string;
  category: 'child' | 'adult';
  order: number;
  isCompleted?: boolean;
}

export interface LiveGameState {
  connected: boolean;
  activeSlot: string;
  lastUpdated: string;
  player: {
    name: string;
    age: 'child' | 'adult';
    heartsCurrent: number;
    heartsMax: number;
    rupees: number;
  };
  location: {
    mapName: string;
    areaDisplay: string;
  };
  stats: {
    skulltulasCount: number;
    heartPiecesCount: number;
    songsLearnedCount: number;
    medallionsCount: number;
  };
}

export interface NeonConfig {
  databaseUrl: string;
  isEnabled: boolean;
  lastSyncAt: string | null;
}

