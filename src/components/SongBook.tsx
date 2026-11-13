import React, { useState } from 'react';
import { Music, CheckCircle2, Circle, Play, Volume2 } from 'lucide-react';
import { OcarinaSong } from '../types';

interface SongBookProps {
  songs: OcarinaSong[];
  learnedSongIds: string[];
  onToggle: (songId: string) => void;
}

// Frequências das notas da Ocarina (OoT)
const NOTE_FREQS: Record<string, number> = {
  'D4': 293.66, // D4
  'F4': 349.23, // F4
  'A4': 440.00, // A4
  'B4': 493.88, // B4
  'D5': 587.33  // D5
};

const BUTTON_TO_PITCH: Record<string, number> = {
  'A': NOTE_FREQS['D4'],
  'DOWN': NOTE_FREQS['F4'],
  'RIGHT': NOTE_FREQS['A4'],
  'LEFT': NOTE_FREQS['B4'],
  'UP': NOTE_FREQS['D5']
};

export const SongBook: React.FC<SongBookProps> = ({
  songs,
  learnedSongIds,
  onToggle
}) => {
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);

  // Sintetizador Web Audio API para tocar as notas da Ocarina
  const playNote = (button: string, duration = 0.3) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      const freq = BUTTON_TO_PITCH[button] || 440;
      osc.type = 'triangle'; // Som suave similar a ocarina/flauta
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // AudioContext bloqueado antes do primeiro clique
    }
  };

  const playSongSequence = async (song: OcarinaSong) => {
    if (playingSongId) return;
    setPlayingSongId(song.id);

    for (const note of song.notes) {
      playNote(note, 0.35);
      await new Promise(r => setTimeout(r, 400));
    }

    setPlayingSongId(null);
  };

  const warpSongs = songs.filter(s => s.category === 'warp');
  const magicSongs = songs.filter(s => s.category !== 'warp');

  const renderNoteBadge = (note: 'A' | 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    switch (note) {
      case 'A':
        return (
          <span 
            key={Math.random()} 
            onClick={() => playNote('A')}
            title="Botão A (Azul)"
            className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center shadow-md cursor-pointer border border-blue-400 select-none active:scale-95 transition-transform"
          >
            A
          </span>
        );
      case 'UP':
        return (
          <span 
            key={Math.random()} 
            onClick={() => playNote('UP')}
            title="C-Cima (Amarelo)"
            className="w-7 h-7 rounded-full bg-amber-500 hover:bg-amber-400 text-sheikah-darkest font-bold text-xs flex items-center justify-center shadow-md cursor-pointer border border-amber-300 select-none active:scale-95 transition-transform"
          >
            ▲
          </span>
        );
      case 'DOWN':
        return (
          <span 
            key={Math.random()} 
            onClick={() => playNote('DOWN')}
            title="C-Baixo (Amarelo)"
            className="w-7 h-7 rounded-full bg-amber-500 hover:bg-amber-400 text-sheikah-darkest font-bold text-xs flex items-center justify-center shadow-md cursor-pointer border border-amber-300 select-none active:scale-95 transition-transform"
          >
            ▼
          </span>
        );
      case 'LEFT':
        return (
          <span 
            key={Math.random()} 
            onClick={() => playNote('LEFT')}
            title="C-Esquerda (Amarelo)"
            className="w-7 h-7 rounded-full bg-amber-500 hover:bg-amber-400 text-sheikah-darkest font-bold text-xs flex items-center justify-center shadow-md cursor-pointer border border-amber-300 select-none active:scale-95 transition-transform"
          >
            ◀
          </span>
        );
      case 'RIGHT':
        return (
          <span 
            key={Math.random()} 
            onClick={() => playNote('RIGHT')}
            title="C-Direita (Amarelo)"
            className="w-7 h-7 rounded-full bg-amber-500 hover:bg-amber-400 text-sheikah-darkest font-bold text-xs flex items-center justify-center shadow-md cursor-pointer border border-amber-300 select-none active:scale-95 transition-transform"
          >
            ▶
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-sheikah-card border border-sheikah-border p-5 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white font-hylian flex items-center gap-2">
              <Music className="w-5 h-5 text-sky-400" />
              <span>Livro de Canções da Ocarina (12 Músicas)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Notas musicais com som interativo, efeitos e locais onde cada melodia é aprendida.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-gray-400 font-medium">Canções Aprendidas</span>
            <div className="text-2xl font-black text-sky-400">
              {learnedSongIds.length} <span className="text-sm text-gray-400">/ 12</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seção 1: Músicas de Teleporte */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-sheikah-gold mb-3 flex items-center gap-2">
          <span>Canções de Teleporte (Warp Songs)</span>
          <span className="text-xs font-normal text-gray-400">({warpSongs.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {warpSongs.map((song) => {
            const isLearned = learnedSongIds.includes(song.id);
            const isPlaying = playingSongId === song.id;
            return (
              <div
                key={song.id}
                className={`p-4 rounded-xl border transition-all ${
                  isLearned
                    ? 'bg-sheikah-card border-sky-500/40 shadow-glow-blue/20'
                    : 'bg-sheikah-darkest/60 border-sheikah-border/60 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-white text-base font-hylian">{song.name}</h4>
                    <span className="text-xs text-gray-400">{song.namePt}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => playSongSequence(song)}
                      disabled={isPlaying}
                      className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                        isPlaying 
                          ? 'bg-sky-500 text-white border-sky-400 animate-pulse'
                          : 'bg-sheikah-darkest text-sky-400 border-sky-500/30 hover:bg-sky-950'
                      }`}
                      title="Ouvir notas"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Ouvir</span>
                    </button>

                    <button
                      onClick={() => onToggle(song.id)}
                      className="p-1 text-gray-400 hover:text-white"
                      title={isLearned ? 'Marcar como não aprendida' : 'Marcar como aprendida'}
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
                  {song.notes.map((note) => renderNoteBadge(note))}
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
          })}
        </div>
      </div>

      {/* Seção 2: Músicas Mágicas e Tradicionais */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-sheikah-gold mb-3 flex items-center gap-2">
          <span>Canções Mágicas & Especiais</span>
          <span className="text-xs font-normal text-gray-400">({magicSongs.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {magicSongs.map((song) => {
            const isLearned = learnedSongIds.includes(song.id);
            const isPlaying = playingSongId === song.id;
            return (
              <div
                key={song.id}
                className={`p-4 rounded-xl border transition-all ${
                  isLearned
                    ? 'bg-sheikah-card border-sheikah-gold/40 shadow-glow-gold/20'
                    : 'bg-sheikah-darkest/60 border-sheikah-border/60 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-white text-base font-hylian">{song.name}</h4>
                    <span className="text-xs text-gray-400">{song.namePt}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => playSongSequence(song)}
                      disabled={isPlaying}
                      className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                        isPlaying 
                          ? 'bg-sheikah-gold text-sheikah-darkest border-amber-300 animate-pulse'
                          : 'bg-sheikah-darkest text-sheikah-gold border-sheikah-gold/30 hover:bg-amber-950/40'
                      }`}
                      title="Ouvir notas"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Ouvir</span>
                    </button>

                    <button
                      onClick={() => onToggle(song.id)}
                      className="p-1 text-gray-400 hover:text-white"
                      title={isLearned ? 'Marcar como não aprendida' : 'Marcar como aprendida'}
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
                  {song.notes.map((note) => renderNoteBadge(note))}
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
          })}
        </div>
      </div>

    </div>
  );
};
