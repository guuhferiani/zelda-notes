import { Note, NeonConfig } from '../types';

const STORAGE_KEYS = {
  NOTES: 'zelda_notes_list',
  SKULLTULAS: 'zelda_skulltulas_status',
  HEARTS: 'zelda_hearts_status',
  SONGS: 'zelda_songs_status',
  EVENTS: 'zelda_events_status',
  NEON_CONFIG: 'zelda_neon_config'
};

export interface CloudData {
  notes: Note[];
  skulltulas: number[];
  hearts: number[];
  songs: string[];
  events: string[];
  activeSlot: string;
}

export class StorageService {
  // ---- Configuração do Neon DB ----
  static getNeonConfig(): NeonConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.NEON_CONFIG);
    if (!raw) {
      return {
        databaseUrl: '',
        isEnabled: true,
        lastSyncAt: null
      };
    }
    try {
      const parsed = JSON.parse(raw);
      return {
        databaseUrl: '',
        isEnabled: Boolean(parsed.isEnabled),
        lastSyncAt: parsed.lastSyncAt || null
      };
    } catch {
      return { databaseUrl: '', isEnabled: true, lastSyncAt: null };
    }
  }

  static setNeonConfig(config: NeonConfig) {
    localStorage.setItem(
      STORAGE_KEYS.NEON_CONFIG,
      JSON.stringify({
        databaseUrl: '',
        isEnabled: config.isEnabled,
        lastSyncAt: config.lastSyncAt
      })
    );
  }

  // Testa conexão com o Neon PostgreSQL via API Route (sem expor credenciais no cliente)
  static async testNeonConnection(_dbUrl?: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch('/api/sync?action=test');
      const data = await res.json();
      return {
        success: Boolean(data.success),
        message: data.message || (res.ok ? 'Conectado ao Neon!' : 'Falha ao conectar ao Neon DB.')
      };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Falha ao conectar ao servidor.' };
    }
  }

  // ---- Hidratação e Sincronização Completa com o Neon Cloud ----
  static async fetchCloudData(): Promise<CloudData | null> {
    const config = this.getNeonConfig();
    if (!config.isEnabled) return null;

    try {
      const res = await fetch('/api/sync');
      if (!res.ok) return null;
      const data: CloudData = await res.json();

      const { notes, skulltulas, hearts, songs, events } = data;

      // Atualiza cache no localStorage
      if (notes.length > 0) localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
      if (skulltulas.length > 0) localStorage.setItem(STORAGE_KEYS.SKULLTULAS, JSON.stringify(skulltulas));
      if (hearts.length > 0) localStorage.setItem(STORAGE_KEYS.HEARTS, JSON.stringify(hearts));
      if (songs.length > 0) localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(songs));
      if (events.length > 0) localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));

      config.lastSyncAt = new Date().toISOString();
      this.setNeonConfig(config);

      return data;
    } catch (err) {
      console.warn('Erro ao sincronizar com Neon DB:', err);
      return null;
    }
  }

  private static async postSync(action: string, payload: unknown) {
    const config = this.getNeonConfig();
    if (!config.isEnabled) return;

    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
      });
      if (res.ok) {
        config.lastSyncAt = new Date().toISOString();
        this.setNeonConfig(config);
      }
    } catch (e) {
      console.warn(`Erro ao sincronizar (${action}) com Neon:`, e);
    }
  }

  // ---- Anotações do Diário de Bordo (Notes) ----
  static getNotes(): Note[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static saveNote(note: Note): Note[] {
    const notes = this.getNotes();
    const index = notes.findIndex(n => n.id === note.id);
    if (index >= 0) {
      notes[index] = note;
    } else {
      notes.unshift(note);
    }
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));

    // Sincroniza em segundo plano com Neon
    this.syncNoteToNeon(note);

    return notes;
  }

  static deleteNote(id: string): Note[] {
    const notes = this.getNotes().filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));

    // Remove do Neon
    this.deleteNoteFromNeon(id);

    return notes;
  }

  private static async syncNoteToNeon(note: Note) {
    await this.postSync('saveNote', note);
  }

  private static async deleteNoteFromNeon(id: string) {
    await this.postSync('deleteNote', { id });
  }

  // ---- Checklists (Skulltulas, Hearts, Songs, Events) ----
  static getCollectedSkulltulas(): number[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SKULLTULAS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static toggleSkulltula(id: number): number[] {
    let list = this.getCollectedSkulltulas();
    const isCollected = !list.includes(id);
    if (isCollected) {
      list.push(id);
    } else {
      list = list.filter(item => item !== id);
    }
    localStorage.setItem(STORAGE_KEYS.SKULLTULAS, JSON.stringify(list));
    this.syncSkulltulaToNeon(id, isCollected);
    return list;
  }

  private static async syncSkulltulaToNeon(id: number, isCollected: boolean) {
    await this.postSync('toggleSkulltula', { id, isCollected });
  }

  static getCollectedHeartPieces(): number[] {
    const raw = localStorage.getItem(STORAGE_KEYS.HEARTS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static toggleHeartPiece(id: number): number[] {
    let list = this.getCollectedHeartPieces();
    const isCollected = !list.includes(id);
    if (isCollected) {
      list.push(id);
    } else {
      list = list.filter(item => item !== id);
    }
    localStorage.setItem(STORAGE_KEYS.HEARTS, JSON.stringify(list));
    this.syncHeartPieceToNeon(id, isCollected);
    return list;
  }

  private static async syncHeartPieceToNeon(id: number, isCollected: boolean) {
    await this.postSync('toggleHeartPiece', { id, isCollected });
  }

  static getLearnedSongs(): string[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SONGS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static toggleSong(songId: string): string[] {
    let list = this.getLearnedSongs();
    const isLearned = !list.includes(songId);
    if (isLearned) {
      list.push(songId);
    } else {
      list = list.filter(item => item !== songId);
    }
    localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(list));
    this.syncSongToNeon(songId, isLearned);
    return list;
  }

  private static async syncSongToNeon(songId: string, isLearned: boolean) {
    await this.postSync('toggleSong', { songId, isLearned });
  }

  static getCompletedEvents(): string[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static toggleEvent(eventKey: string): string[] {
    let list = this.getCompletedEvents();
    const isCompleted = !list.includes(eventKey);
    if (isCompleted) {
      list.push(eventKey);
    } else {
      list = list.filter(item => item !== eventKey);
    }
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(list));
    this.syncEventToNeon(eventKey, isCompleted);
    return list;
  }

  private static async syncEventToNeon(eventKey: string, isCompleted: boolean) {
    await this.postSync('toggleEvent', { eventKey, isCompleted });
  }
}
