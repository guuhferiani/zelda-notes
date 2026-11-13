import { LiveGameState } from '../types';

export class GameSyncService {
  private static listeners: ((state: LiveGameState) => void)[] = [];
  private static currentState: LiveGameState = {
    connected: false,
    activeSlot: 'slot_00',
    lastUpdated: new Date().toISOString(),
    player: {
      name: 'Link',
      age: 'child',
      heartsCurrent: 3,
      heartsMax: 3,
      rupees: 0
    },
    location: {
      mapName: 'KokiriForest_Child',
      areaDisplay: 'Kokiri Forest (Floresta Kokiri)'
    },
    stats: {
      skulltulasCount: 0,
      heartPiecesCount: 0,
      songsLearnedCount: 0,
      medallionsCount: 0
    }
  };

  private static pollingInterval: any = null;

  static subscribe(listener: (state: LiveGameState) => void): () => void {
    this.listeners.push(listener);
    listener(this.currentState);

    if (!this.pollingInterval) {
      this.startPolling();
    }

    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
      if (this.listeners.length === 0 && this.pollingInterval) {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
      }
    };
  }

  private static async fetchState() {
    try {
      const res = await fetch('/api/game-status');
      if (res.ok) {
        const data = await res.json();
        this.currentState = {
          ...data,
          connected: true,
          lastUpdated: new Date().toISOString()
        };
        this.notify();
        return;
      }
    } catch {
      // Bridge local offline ou desconectado
    }

    if (this.currentState.connected) {
      this.currentState = {
        ...this.currentState,
        connected: false,
        lastUpdated: new Date().toISOString()
      };
      this.notify();
    }
  }

  private static startPolling() {
    this.fetchState();
    this.pollingInterval = setInterval(() => {
      this.fetchState();
    }, 2000);
  }

  private static notify() {
    this.listeners.forEach(fn => fn(this.currentState));
  }

  static getState(): LiveGameState {
    return this.currentState;
  }
}

