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

export interface OcarinaSong {
  id: string;
  name: string;
  namePt: string;
  notes: ('A' | 'UP' | 'DOWN' | 'LEFT' | 'RIGHT')[];
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

