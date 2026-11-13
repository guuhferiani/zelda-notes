import { Note, NeonConfig } from '../types';
import { neon } from '@neondatabase/serverless';

declare const __VITE_DATABASE_URL__: string | undefined;

const STORAGE_KEYS = {
  NOTES: 'zelda_notes_list',
  SKULLTULAS: 'zelda_skulltulas_status',
  HEARTS: 'zelda_hearts_status',
  SONGS: 'zelda_songs_status',
  EVENTS: 'zelda_events_status',
  NEON_CONFIG: 'zelda_neon_config'
};

const ENV_NEON_URL = (typeof __VITE_DATABASE_URL__ !== 'undefined' && __VITE_DATABASE_URL__)
  ? __VITE_DATABASE_URL__
  : ((import.meta as any).env?.VITE_DATABASE_URL || '');

const DEFAULT_NEON_URL = ENV_NEON_URL || 'postgresql://neondb_owner:npg_HqCMGbyv73jx@ep-weathered-waterfall-b6vbjwxh-pooler.c-2.sa-east-1.aws.neon.tech/neondb?sslmode=require';

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
    if (!dbUrl || (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://'))) {
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

  // ---- Hidratação e Sincronização Completa com o Neon Cloud ----
  static async fetchCloudData(): Promise<CloudData | null> {
    const config = this.getNeonConfig();
    if (!config.isEnabled || !config.databaseUrl) return null;

    try {
      const sql = neon(config.databaseUrl);

      // Garante que o profile padrão exista
      await sql`
        INSERT INTO game_profiles (id, player_name, active_slot)
        VALUES ('default', 'Link', 'slot_05')
        ON CONFLICT (id) DO NOTHING;
      `;

      // 1. Busca Anotações do Diário
      const rawNotes = await sql`
        SELECT id, title, content, area, category, is_pinned, created_at, updated_at
        FROM journal_notes
        WHERE profile_id = 'default'
        ORDER BY is_pinned DESC, updated_at DESC;
      `;

      const notes: Note[] = rawNotes.map((r: any) => ({
        id: String(r.id),
        title: String(r.title),
        content: String(r.content),
        area: String(r.area || 'Hyrule'),
        category: (r.category || 'quest') as any,
        isPinned: Boolean(r.is_pinned),
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString()
      }));

      // 2. Busca Skulltulas Coletadas
      const rawSkulltulas = await sql`
        SELECT skulltula_id 
        FROM skulltulas_progress 
        WHERE profile_id = 'default' AND is_collected = TRUE;
      `;
      const skulltulas: number[] = rawSkulltulas.map((r: any) => Number(r.skulltula_id));

      // 3. Busca Peças de Coração
      const rawHearts = await sql`
        SELECT heart_piece_id 
        FROM heart_pieces_progress 
        WHERE profile_id = 'default' AND is_collected = TRUE;
      `;
      const hearts: number[] = rawHearts.map((r: any) => Number(r.heart_piece_id));

      // 4. Busca Canções Aprendidas
      const rawSongs = await sql`
        SELECT song_id 
        FROM songs_progress 
        WHERE profile_id = 'default' AND is_learned = TRUE;
      `;
      const songs: string[] = rawSongs.map((r: any) => String(r.song_id));

      // 5. Busca Marcos da História
      const rawEvents = await sql`
        SELECT event_key 
        FROM story_events_progress 
        WHERE profile_id = 'default' AND is_completed = TRUE;
      `;
      const events: string[] = rawEvents.map((r: any) => String(r.event_key));

      // Atualiza cache no localStorage
      if (notes.length > 0) localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
      if (skulltulas.length > 0) localStorage.setItem(STORAGE_KEYS.SKULLTULAS, JSON.stringify(skulltulas));
      if (hearts.length > 0) localStorage.setItem(STORAGE_KEYS.HEARTS, JSON.stringify(hearts));
      if (songs.length > 0) localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(songs));
      if (events.length > 0) localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));

      config.lastSyncAt = new Date().toISOString();
      this.setNeonConfig(config);

      return {
        notes,
        skulltulas,
        hearts,
        songs,
        events,
        activeSlot: 'slot_05'
      };
    } catch (err) {
      console.warn('Erro ao sincronizar com Neon DB:', err);
      return null;
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
    const config = this.getNeonConfig();
    if (!config.isEnabled || !config.databaseUrl) return;

    try {
      const sql = neon(config.databaseUrl);
      await sql`
        INSERT INTO journal_notes (id, profile_id, slot_id, title, content, area, category, is_pinned, updated_at)
        VALUES (${note.id}, 'default', 'slot_05', ${note.title}, ${note.content}, ${note.area}, ${note.category}, ${note.isPinned}, NOW())
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
    const config = this.getNeonConfig();
    if (!config.isEnabled || !config.databaseUrl) return;
    try {
      const sql = neon(config.databaseUrl);
      await sql`
        INSERT INTO skulltulas_progress (profile_id, slot_id, skulltula_id, is_collected, collected_at)
        VALUES ('default', 'slot_05', ${id}, ${isCollected}, NOW())
        ON CONFLICT (profile_id, slot_id, skulltula_id) DO UPDATE SET
          is_collected = ${isCollected},
          collected_at = NOW();
      `;
    } catch (e) {
      console.warn('Erro ao sincronizar skulltula com Neon:', e);
    }
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
    const config = this.getNeonConfig();
    if (!config.isEnabled || !config.databaseUrl) return;
    try {
      const sql = neon(config.databaseUrl);
      await sql`
        INSERT INTO heart_pieces_progress (profile_id, slot_id, heart_piece_id, is_collected, collected_at)
        VALUES ('default', 'slot_05', ${id}, ${isCollected}, NOW())
        ON CONFLICT (profile_id, slot_id, heart_piece_id) DO UPDATE SET
          is_collected = ${isCollected},
          collected_at = NOW();
      `;
    } catch (e) {
      console.warn('Erro ao sincronizar peça de coração com Neon:', e);
    }
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
    const config = this.getNeonConfig();
    if (!config.isEnabled || !config.databaseUrl) return;
    try {
      const sql = neon(config.databaseUrl);
      await sql`
        INSERT INTO songs_progress (profile_id, slot_id, song_id, is_learned, learned_at)
        VALUES ('default', 'slot_05', ${songId}, ${isLearned}, NOW())
        ON CONFLICT (profile_id, slot_id, song_id) DO UPDATE SET
          is_learned = ${isLearned},
          learned_at = NOW();
      `;
    } catch (e) {
      console.warn('Erro ao sincronizar canção com Neon:', e);
    }
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
    const config = this.getNeonConfig();
    if (!config.isEnabled || !config.databaseUrl) return;
    try {
      const sql = neon(config.databaseUrl);
      await sql`
        INSERT INTO story_events_progress (profile_id, slot_id, event_key, is_completed, completed_at)
        VALUES ('default', 'slot_05', ${eventKey}, ${isCompleted}, NOW())
        ON CONFLICT (profile_id, slot_id, event_key) DO UPDATE SET
          is_completed = ${isCompleted},
          completed_at = NOW();
      `;
    } catch (e) {
      console.warn('Erro ao sincronizar evento com Neon:', e);
    }
  }
}
