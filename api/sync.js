import { neon } from '@neondatabase/serverless';

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL não configurada no servidor.');
  }
  return neon(url);
}

export default async function handler(req, res) {
  try {
    const sql = getSql();

    if (req.method === 'GET') {
      if (req.query?.action === 'test') {
        const result = await sql`SELECT NOW() as current_time, current_database() as db;`;
        if (result && result.length > 0) {
          return res.status(200).json({
            success: true,
            message: `Conectado com sucesso ao banco [${result[0].db}] no Neon!`
          });
        }
        return res.status(500).json({
          success: false,
          message: 'Não foi possível verificar a resposta do banco.'
        });
      }

      await sql`
        INSERT INTO game_profiles (id, player_name, active_slot)
        VALUES ('default', 'Link', 'slot_05')
        ON CONFLICT (id) DO NOTHING;
      `;

      const [rawNotes, rawSkulltulas, rawHearts, rawSongs, rawEvents] = await Promise.all([
        sql`
          SELECT id, title, content, area, category, is_pinned, created_at, updated_at
          FROM journal_notes
          WHERE profile_id = 'default'
          ORDER BY is_pinned DESC, updated_at DESC;
        `,
        sql`
          SELECT skulltula_id
          FROM skulltulas_progress
          WHERE profile_id = 'default' AND is_collected = TRUE;
        `,
        sql`
          SELECT heart_piece_id
          FROM heart_pieces_progress
          WHERE profile_id = 'default' AND is_collected = TRUE;
        `,
        sql`
          SELECT song_id
          FROM songs_progress
          WHERE profile_id = 'default' AND is_learned = TRUE;
        `,
        sql`
          SELECT event_key
          FROM story_events_progress
          WHERE profile_id = 'default' AND is_completed = TRUE;
        `
      ]);

      const notes = rawNotes.map((r) => ({
        id: String(r.id),
        title: String(r.title),
        content: String(r.content),
        area: String(r.area || 'Hyrule'),
        category: r.category || 'quest',
        isPinned: Boolean(r.is_pinned),
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString()
      }));

      return res.status(200).json({
        notes,
        skulltulas: rawSkulltulas.map((r) => Number(r.skulltula_id)),
        hearts: rawHearts.map((r) => Number(r.heart_piece_id)),
        songs: rawSongs.map((r) => String(r.song_id)),
        events: rawEvents.map((r) => String(r.event_key)),
        activeSlot: 'slot_05'
      });
    }

    if (req.method === 'POST') {
      const { action, payload } = req.body || {};

      switch (action) {
        case 'saveNote': {
          const note = payload;
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
          return res.status(200).json({ ok: true });
        }
        case 'deleteNote': {
          await sql`DELETE FROM journal_notes WHERE id = ${payload.id}`;
          return res.status(200).json({ ok: true });
        }
        case 'toggleSkulltula': {
          await sql`
            INSERT INTO skulltulas_progress (profile_id, slot_id, skulltula_id, is_collected, collected_at)
            VALUES ('default', 'slot_05', ${payload.id}, ${payload.isCollected}, NOW())
            ON CONFLICT (profile_id, slot_id, skulltula_id) DO UPDATE SET
              is_collected = ${payload.isCollected},
              collected_at = NOW();
          `;
          return res.status(200).json({ ok: true });
        }
        case 'toggleHeartPiece': {
          await sql`
            INSERT INTO heart_pieces_progress (profile_id, slot_id, heart_piece_id, is_collected, collected_at)
            VALUES ('default', 'slot_05', ${payload.id}, ${payload.isCollected}, NOW())
            ON CONFLICT (profile_id, slot_id, heart_piece_id) DO UPDATE SET
              is_collected = ${payload.isCollected},
              collected_at = NOW();
          `;
          return res.status(200).json({ ok: true });
        }
        case 'toggleSong': {
          await sql`
            INSERT INTO songs_progress (profile_id, slot_id, song_id, is_learned, learned_at)
            VALUES ('default', 'slot_05', ${payload.songId}, ${payload.isLearned}, NOW())
            ON CONFLICT (profile_id, slot_id, song_id) DO UPDATE SET
              is_learned = ${payload.isLearned},
              learned_at = NOW();
          `;
          return res.status(200).json({ ok: true });
        }
        case 'toggleEvent': {
          await sql`
            INSERT INTO story_events_progress (profile_id, slot_id, event_key, is_completed, completed_at)
            VALUES ('default', 'slot_05', ${payload.eventKey}, ${payload.isCompleted}, NOW())
            ON CONFLICT (profile_id, slot_id, event_key) DO UPDATE SET
              is_completed = ${payload.isCompleted},
              completed_at = NOW();
          `;
          return res.status(200).json({ ok: true });
        }
        default:
          return res.status(400).json({ error: 'Ação inválida.' });
      }
    }

    return res.status(405).json({ error: 'Método não permitido.' });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err?.message || 'Erro interno ao conectar ao Neon DB.'
    });
  }
}
