import React, { useState, useRef } from 'react';
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
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = (): AudioContext | null => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
    } catch {
      return null;
    }
  };

  // Sintetizador acústico realista de Ocarina (ressoador de Helmholtz + vibrato + sopro)
  const playNote = (button: string, duration = 0.42) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freq = BUTTON_TO_PITCH[button] || 440;

    // Filtro passa-baixa para timbre quente de cerâmica
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1900, now);
    filter.Q.setValueAtTime(1.2, now);

    // Envelope ADSR suave de sopro
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(0.28, now + 0.04);
    masterGain.gain.setValueAtTime(0.24, now + duration - 0.09);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Fundamental (senoide pura = ressoador fechado da Ocarina)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq * 0.985, now);
    osc1.frequency.exponentialRampToValueAtTime(freq, now + 0.03);

    // 2ª harmônica suave
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);
    const osc2Gain = ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.12, now);

    // 3ª harmônica sutil
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, now);
    const osc3Gain = ctx.createGain();
    osc3Gain.gain.setValueAtTime(0.03, now);

    // Vibrato natural (LFO 5.2 Hz)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(5.2, now);
    lfoGain.gain.setValueAtTime(0, now);
    lfoGain.gain.linearRampToValueAtTime(3.2, now + 0.12);
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);

    // Ruído sutil de sopro no ataque
    const bufferSize = Math.floor(ctx.sampleRate * 0.12);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const breath = ctx.createBufferSource();
    breath.buffer = noiseBuffer;
    const breathFilter = ctx.createBiquadFilter();
    breathFilter.type = 'bandpass';
    breathFilter.frequency.setValueAtTime(freq * 1.8, now);
    breathFilter.Q.setValueAtTime(2.5, now);
    const breathGain = ctx.createGain();
    breathGain.gain.setValueAtTime(0.035, now);
    breathGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    // Conexões
    osc1.connect(filter);
    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);
    osc3.connect(osc3Gain);
    osc3Gain.connect(filter);
    breath.connect(breathFilter);
    breathFilter.connect(breathGain);
    breathGain.connect(filter);

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    lfo.start(now);
    breath.start(now);

    osc1.stop(now + duration + 0.02);
    osc2.stop(now + duration + 0.02);
    osc3.stop(now + duration + 0.02);
    lfo.stop(now + duration + 0.02);
    breath.stop(now + 0.12);
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

