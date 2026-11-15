import React, { useState } from 'react';
import { Music, CheckCircle2, Circle, Volume2, Gamepad2 } from 'lucide-react';
import { OcarinaButton, OcarinaSong } from '../types';
import { playOcarinaButton } from '../utils/ocarinaAudio';
import { OcarinaPlayerModal } from './OcarinaPlayerModal';
import {
  useControllerLayout,
  getControllerPrompt,
  ControllerPreference,
} from '../utils/controllerMapping';

interface SongBookProps {
  songs: OcarinaSong[];
  learnedSongIds: string[];
  onToggle: (songId: string) => void;
}

export const SongBook: React.FC<SongBookProps> = ({
  songs,
  learnedSongIds,
  onToggle,
}) => {
  const [activePlayerSong, setActivePlayerSong] = useState<OcarinaSong | null>(null);
  const { preference, setPreference, detectedGamepad, resolvedLayout } = useControllerLayout();

  const warpSongs = songs.filter((s) => s.category === 'warp');
  const magicSongs = songs.filter((s) => s.category !== 'warp');

  const renderNoteBadge = (note: OcarinaButton, idx: number) => {
    const cfg = getControllerPrompt(note, resolvedLayout);
    return (
      <span
        key={`${note}-${idx}`}
        onClick={() => playOcarinaButton(note)}
        title={cfg.title}
        className={`min-w-7 h-7 px-1.5 rounded-full font-bold text-xs flex items-center justify-center shadow-md cursor-pointer border select-none active:scale-95 transition-transform ${cfg.badgeClass}`}
      >
        {cfg.symbol}
      </span>
    );
  };

  const renderSongCard = (song: OcarinaSong, accent: 'blue' | 'gold') => {
    const isLearned = learnedSongIds.includes(song.id);
    const isPlaying = activePlayerSong?.id === song.id;

    const cardBorder = isLearned
      ? accent === 'blue'
        ? 'bg-sheikah-card border-sky-500/40 shadow-glow-blue/20'
        : 'bg-sheikah-card border-sheikah-gold/40 shadow-glow-gold/20'
      : 'bg-sheikah-darkest/60 border-sheikah-border/60 opacity-80';

    const playBtnStyle = isPlaying
      ? accent === 'blue'
        ? 'bg-sky-500 text-white border-sky-400 animate-pulse'
        : 'bg-sheikah-gold text-sheikah-darkest border-amber-300 animate-pulse'
      : accent === 'blue'
      ? 'bg-sheikah-darkest text-sky-400 border-sky-500/30 hover:bg-sky-950'
      : 'bg-sheikah-darkest text-sheikah-gold border-sheikah-gold/30 hover:bg-amber-950/40';

    return (
      <div
        key={song.id}
        className={`p-4 rounded-xl border transition-all ${cardBorder}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-bold text-white text-base font-hylian">
              {song.name}
            </h4>
            <span className="text-xs text-gray-400">{song.namePt}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActivePlayerSong(song)}
              className={`p-1.5 px-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${playBtnStyle}`}
              title="Abrir Player / Partitura"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Ouvir</span>
            </button>

            <button
              onClick={() => onToggle(song.id)}
              className="p-1 text-gray-400 hover:text-white"
              title={
                isLearned
                  ? 'Marcar como não aprendida'
                  : 'Marcar como aprendida'
              }
            >
              {isLearned ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
              ) : (
                <Circle className="w-5 h-5 text-zinc-600 hover:text-emerald-400" />
              )}
            </button>
          </div>
        </div>

        {/* Pauta com Botões das Notas */}
        <div className="mt-3 py-2 px-3 rounded-lg bg-sheikah-darkest/90 border border-sheikah-border/80 flex items-center gap-2 overflow-x-auto">
          {song.notes.map((note, idx) => renderNoteBadge(note, idx))}
        </div>

        <div className="mt-3 text-xs text-gray-300">
          <span className="text-sheikah-gold font-semibold">Efeito: </span>
          {song.effect}
        </div>

        <div className="mt-1 text-[11px] text-gray-400">
          <span className="text-gray-500 font-semibold">Local: </span>
          {song.location}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Banner estilo Play Ocarina */}
      <div className="bg-gradient-to-b from-[#2c2115] to-[#17120c] border border-[#c8a962]/40 p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#c8a962] font-semibold">
              The Legend of Zelda: Ocarina of Time
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-hylian flex items-center gap-2 mt-0.5">
              <Music className="w-5 h-5 text-[#e2c779]" />
              <span>Livro de Canções da Ocarina (12 Músicas)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Clique em <strong>Ouvir</strong> para abrir a partitura interativa estilo timeline com Ocarina iluminada e Modo Guiado.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-gray-400 font-medium">
              Canções Aprendidas
            </span>
            <div className="text-2xl font-black text-sky-400">
              {learnedSongIds.length}{' '}
              <span className="text-sm text-gray-400">/ 12</span>
            </div>
          </div>
        </div>

        {/* Seletor de Padrão de Controle + Detecção Automática */}
        <div className="mt-4 pt-4 border-t border-[#c8a962]/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Gamepad2 className="w-4 h-4 text-[#e2c779] flex-shrink-0" />
            <span>Padrão dos Botões:</span>
            {detectedGamepad ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {detectedGamepad.type === 'ps5' ? 'PS5 DualSense detectado' : 'Controle Nintendo detectado'}
              </span>
            ) : (
              <span className="text-[11px] text-gray-400">
                {preference === 'auto'
                  ? 'Nenhum controle USB/BT detectado (padrão N64)'
                  : `Modo manual: ${resolvedLayout.toUpperCase()}`}
              </span>
            )}
          </div>

          <div className="inline-flex flex-wrap items-center gap-1 bg-sheikah-darkest/80 p-1 rounded-xl border border-sheikah-border">
            {(
              [
                { id: 'auto', label: 'Auto' },
                { id: 'ps5', label: 'PS5 (○ + R▲▼)' },
                { id: 'nintendo', label: 'Nintendo (A + R▲▼)' },
                { id: 'n64', label: 'N64 (A ▲ ▼)' },
              ] as { id: ControllerPreference; label: string }[]
            ).map((opt) => {
              const active = preference === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPreference(opt.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#c8a962] text-[#17120c] shadow'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Seção 1: Músicas de Teleporte */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-sheikah-gold mb-3 flex items-center gap-2">
          <span>Canções de Teleporte (Warp Songs)</span>
          <span className="text-xs font-normal text-gray-400">
            ({warpSongs.length})
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {warpSongs.map((song) => renderSongCard(song, 'blue'))}
        </div>
      </div>

      {/* Seção 2: Músicas Mágicas e Tradicionais */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-sheikah-gold mb-3 flex items-center gap-2">
          <span>Canções Mágicas & Especiais</span>
          <span className="text-xs font-normal text-gray-400">
            ({magicSongs.length})
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {magicSongs.map((song) => renderSongCard(song, 'gold'))}
        </div>
      </div>

      {/* Player Modal estilo Timeline (Play Ocarina) */}
      {activePlayerSong && (
        <OcarinaPlayerModal
          song={activePlayerSong}
          isLearned={learnedSongIds.includes(activePlayerSong.id)}
          onToggleLearned={onToggle}
          onClose={() => setActivePlayerSong(null)}
          controllerLayout={resolvedLayout}
        />
      )}
    </div>
  );
};
