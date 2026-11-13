-- =========================================================
-- Zelda Notes: Schema Oficial para Neon PostgreSQL
-- =========================================================

-- Tabela de Perfis do Jogador
CREATE TABLE IF NOT EXISTS game_profiles (
    id VARCHAR(64) PRIMARY KEY,
    player_name VARCHAR(100) NOT NULL DEFAULT 'Link',
    active_slot VARCHAR(20) NOT NULL DEFAULT 'slot_00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Anotações do Diário de Bordo
CREATE TABLE IF NOT EXISTS journal_notes (
    id VARCHAR(64) PRIMARY KEY,
    profile_id VARCHAR(64) REFERENCES game_profiles(id) ON DELETE CASCADE,
    slot_id VARCHAR(20) NOT NULL DEFAULT 'slot_00',
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    area VARCHAR(100) NOT NULL DEFAULT 'Hyrule',
    category VARCHAR(50) NOT NULL DEFAULT 'general', -- 'quest', 'secret', 'todo', 'lore', 'dungeon'
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Progresso das 100 Skulltulas de Ouro
CREATE TABLE IF NOT EXISTS skulltulas_progress (
    profile_id VARCHAR(64) NOT NULL,
    slot_id VARCHAR(20) NOT NULL DEFAULT 'slot_00',
    skulltula_id INTEGER NOT NULL,
    is_collected BOOLEAN DEFAULT FALSE,
    collected_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (profile_id, slot_id, skulltula_id)
);

-- Tabela de Progresso das Peças de Coração (Heart Pieces)
CREATE TABLE IF NOT EXISTS heart_pieces_progress (
    profile_id VARCHAR(64) NOT NULL,
    slot_id VARCHAR(20) NOT NULL DEFAULT 'slot_00',
    heart_piece_id INTEGER NOT NULL,
    is_collected BOOLEAN DEFAULT FALSE,
    collected_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (profile_id, slot_id, heart_piece_id)
);

-- Tabela de Eventos e Marcos da História
CREATE TABLE IF NOT EXISTS story_events_progress (
    profile_id VARCHAR(64) NOT NULL,
    slot_id VARCHAR(20) NOT NULL DEFAULT 'slot_00',
    event_key VARCHAR(100) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (profile_id, slot_id, event_key)
);

-- Snapshots / Histórico de Gameplay em Tempo Real
CREATE TABLE IF NOT EXISTS game_snapshots (
    id SERIAL PRIMARY KEY,
    profile_id VARCHAR(64) NOT NULL,
    slot_id VARCHAR(20) NOT NULL DEFAULT 'slot_00',
    current_map VARCHAR(100) NOT NULL,
    link_age VARCHAR(20) NOT NULL DEFAULT 'child',
    hearts_current INTEGER NOT NULL DEFAULT 3,
    hearts_max INTEGER NOT NULL DEFAULT 3,
    rupees INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices de Performance
CREATE INDEX IF NOT EXISTS idx_journal_notes_profile ON journal_notes(profile_id, slot_id);
CREATE INDEX IF NOT EXISTS idx_skulltulas_profile ON skulltulas_progress(profile_id, slot_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_profile ON game_snapshots(profile_id, created_at DESC);
