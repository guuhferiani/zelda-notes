import { Note, NeonConfig } from '../types';
import { neon } from '@neondatabase/serverless';

const STORAGE_KEYS = {
  NOTES: 'zelda_notes_list',
  SKULLTULAS: 'zelda_skulltulas_status',
  HEARTS: 'zelda_hearts_status',
  SONGS: 'zelda_songs_status',
  EVENTS: 'zelda_events_status',
  NEON_CONFIG: 'zelda_neon_config'
};

const DEFAULT_NEON_URL = 'postgresql://neondb_owner:npg_HqCMGbyv73jx@ep-weathered-waterfall-b6vbjwxh-pooler.c-2.sa-east-1.aws.neon.tech/neondb?sslmode=require';

export class StorageService {
  // ---- Configuração do Neon DB ----
  static getNeonConfig(): NeonConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.NEON_CONFIG);
    if (!raw) {
      return {
        databaseUrl: DEFAULT_NEON_URL,
        isEnabled: true,
        lastSyncAt: new Date().toISOString()
      };
    }
    try {
      const parsed = JSON.parse(raw);
      if (!parsed.databaseUrl) {
        parsed.databaseUrl = DEFAULT_NEON_URL;
        parsed.isEnabled = true;
      }
      return parsed;
    } catch {
      return { databaseUrl: DEFAULT_NEON_URL, isEnabled: true, lastSyncAt: null };
    }
  }

  static setNeonConfig(config: NeonConfig) {
    localStorage.setItem(STORAGE_KEYS.NEON_CONFIG, JSON.stringify(config));
  }

  // Testa conexão com o Neon PostgreSQL
  static async testNeonConnection(dbUrl: string): Promise<{ success: boolean; message: string }> {
    if (!dbUrl || !dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
      return { success: false, message: 'URL de conexão inválida. Deve começar com postgresql://' };
    }

    try {
      const sql = neon(dbUrl);
      const result = await sql`SELECT NOW() as current_time, current_database() as db;`;
      if (result && result.length > 0) {
        return { 
          success: true, 
          message: `Conectado com sucesso ao banco [${result[0].db}] no Neon!` 
        };
      }
      return { success: false, message: 'Não foi possível verificar a resposta do banco.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Falha ao conectar ao Neon DB.' };
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

    // Sincroniza em segundo plano com Neon se ativo
    this.syncNoteToNeon(note);

    return notes;
  }

  static deleteNote(id: string): Note[] {
    const notes = this.getNotes().filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));

    // Remove do Neon se ativo
    this.deleteNoteFromNeon(id);

    return notes;
  }

  private static async syncNoteToNeon(note: Note) {
    const config = this.getNeonConfig();
    if (!config.isEnabled || !config.databaseUrl) return;

    try {
      const sql = neon(config.databaseUrl);
      await sql`
        INSERT INTO journal_notes (id, profile_id, slot_id, title, content, area, category, is_pinned, updated_at)
        VALUES (${note.id}, 'default', 'slot_00', ${note.title}, ${note.content}, ${note.area}, ${note.category}, ${note.isPinned}, NOW())
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          content = EXCLUDED.content,
          area = EXCLUDED.area,
          category = EXCLUDED.category,
          is_pinned = EXCLUDED.is_pinned,
          updated_at = NOW();
      `;
      config.lastSyncAt = new Date().toISOString();
      this.setNeonConfig(config);
    } catch (e) {
      console.warn('Erro ao sincronizar nota com Neon:', e);
    }
  }

  private static async deleteNoteFromNeon(id: string) {
    const config = this.getNeonConfig();
    if (!config.isEnabled || !config.databaseUrl) return;

    try {
      const sql = neon(config.databaseUrl);
      await sql`DELETE FROM journal_notes WHERE id = ${id}`;
    } catch (e) {
      console.warn('Erro ao deletar nota do Neon:', e);
    }
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
    if (list.includes(id)) {
      list = list.filter(item => item !== id);
    } else {
      list.push(id);
    }
    localStorage.setItem(STORAGE_KEYS.SKULLTULAS, JSON.stringify(list));
    return list;
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
    if (list.includes(id)) {
      list = list.filter(item => item !== id);
    } else {
      list.push(id);
    }
    localStorage.setItem(STORAGE_KEYS.HEARTS, JSON.stringify(list));
    return list;
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
    if (list.includes(songId)) {
      list = list.filter(item => item !== songId);
    } else {
      list.push(songId);
    }
    localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(list));
    return list;
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
    if (list.includes(eventKey)) {
      list = list.filter(item => item !== eventKey);
    } else {
      list.push(eventKey);
    }
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(list));
    return list;
  }
}

