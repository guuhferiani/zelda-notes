import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Pause,
  Play,
  SkipBack,
  Sparkles,
} from 'lucide-react';
import { OcarinaButton, OcarinaNotePitch, OcarinaScoreNote, OcarinaSong } from '../types';
import {
  BUTTON_TO_PITCH,
  PITCH_FINGERING,
  buildIntroScoreFromButtons,
  playOcarinaPitch,
} from '../utils/ocarinaAudio';

interface OcarinaPlayerModalProps {
  song: OcarinaSong;
  isLearned: boolean;
  onToggleLearned: (songId: string) => void;
  onClose: () => void;
}

type VersionMode = 'beginning' | 'full';

// 5 linhas da pauta com os botões reais da Ocarina (de cima para baixo)
const CONTROLLER_ROWS: {
  button: OcarinaButton;
  symbol: string;
  name: string;
  keyHint: string;
  pitch: OcarinaNotePitch;
  badgeClass: string;
}[] = [
  {
    button: 'UP',
    symbol: '▲',
    name: 'C-Cima',
    keyHint: '↑',
    pitch: 'D5',
    badgeClass: 'bg-amber-500 text-sheikah-darkest border-amber-300',
  },
  {
    button: 'LEFT',
    symbol: '◀',
    name: 'C-Esq',
    keyHint: '←',
    pitch: 'B4',
    badgeClass: 'bg-amber-500 text-sheikah-darkest border-amber-300',
  },
  {
    button: 'RIGHT',
    symbol: '▶',
    name: 'C-Dir',
    keyHint: '→',
    pitch: 'A4',
    badgeClass: 'bg-amber-500 text-sheikah-darkest border-amber-300',
  },
  {
    button: 'DOWN',
    symbol: '▼',
    name: 'C-Baixo',
    keyHint: '↓',
    pitch: 'F4',
    badgeClass: 'bg-amber-500 text-sheikah-darkest border-amber-300',
  },
  {
    button: 'A',
    symbol: 'A',
    name: 'Botão A',
    keyHint: 'Z',
    pitch: 'D4',
    badgeClass: 'bg-blue-600 text-white border-blue-400',
  },
];

// Mapeia qualquer altura musical da versão completa para a linha do botão correspondente
const PITCH_TO_BUTTON: Record<OcarinaNotePitch, OcarinaButton> = {
  E5: 'UP',
  D5: 'UP',
  C5: 'LEFT',
  B4: 'LEFT',
  Bb4: 'LEFT',
  A4: 'RIGHT',
  G4: 'RIGHT',
  'F#4': 'DOWN',
  F4: 'DOWN',
  E4: 'DOWN',
  D4: 'A',
  C4: 'A',
};

const BUTTON_TO_ROW_INDEX: Record<OcarinaButton, number> = {
  UP: 0,
  LEFT: 1,
  RIGHT: 2,
  DOWN: 3,
  A: 4,
};

const BUTTON_SYMBOL: Record<OcarinaButton, string> = {
  UP: '▲',
  LEFT: '◀',
  RIGHT: '▶',
  DOWN: '▼',
  A: 'A',
};

const PX_PER_SECOND = 155;
const PLAYHEAD_OFFSET_PERCENT = 34;

// Coordenadas dos 7 furos na Ocarina SVG
const OCARINA_HOLES = [
  { cx: 112, cy: 62, r: 5.5 },
  { cx: 132, cy: 49, r: 6 },
  { cx: 158, cy: 47, r: 6.5 },
  { cx: 186, cy: 52, r: 5.5 },
  { cx: 212, cy: 60, r: 5 },
  { cx: 236, cy: 67, r: 4.5 },
  { cx: 258, cy: 71, r: 4 },
];

export const OcarinaPlayerModal: React.FC<OcarinaPlayerModalProps> = ({
  song,
  isLearned,
  onToggleLearned,
  onClose,
}) => {
  const [versionMode, setVersionMode] = useState<VersionMode>('full');
  const [isGuided, setIsGuided] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeNoteIdx, setActiveNoteIdx] = useState<number | null>(null);
  const [waitingNoteIdx, setWaitingNoteIdx] = useState<number | null>(null);
  const [manualButton, setManualButton] = useState<OcarinaButton | null>(null);

  const score: OcarinaScoreNote[] = useMemo(() => {
    if (versionMode === 'beginning') {
      return song.introScore && song.introScore.length > 0
        ? song.introScore
        : buildIntroScoreFromButtons(song.notes);
    }
    return song.fullScore && song.fullScore.length > 0
      ? song.fullScore
      : song.introScore && song.introScore.length > 0
      ? song.introScore
      : buildIntroScoreFromButtons(song.notes);
  }, [song, versionMode]);

  const totalDuration = useMemo(() => {
    if (score.length === 0) return 3;
    const last = score[score.length - 1];
    return last.start + last.duration + 0.8;
  }, [score]);

  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const triggeredNotesRef = useRef<Set<number>>(new Set());
  const stopAudioFnsRef = useRef<(() => void)[]>([]);
  const timeRef = useRef(0);

  const stopAllActiveAudio = useCallback(() => {
    stopAudioFnsRef.current.forEach((fn) => fn());
    stopAudioFnsRef.current = [];
  }, []);

  const resetPlayback = useCallback(
    (autoPlay = true) => {
      stopAllActiveAudio();
      triggeredNotesRef.current.clear();
      timeRef.current = 0;
      lastFrameRef.current = null;
      setCurrentTime(0);
      setActiveNoteIdx(null);
      setWaitingNoteIdx(null);
      setIsPlaying(autoPlay);
    },
    [stopAllActiveAudio]
  );

  const handleChangeVersion = (mode: VersionMode) => {
    setVersionMode(mode);
    stopAllActiveAudio();
    triggeredNotesRef.current.clear();
    timeRef.current = 0;
    lastFrameRef.current = null;
    setCurrentTime(0);
    setActiveNoteIdx(null);
    setWaitingNoteIdx(null);
    setIsPlaying(true);
  };

  const handleToggleGuided = () => {
    setIsGuided((prev) => {
      const next = !prev;
      if (!next) {
        setWaitingNoteIdx(null);
      }
      return next;
    });
  };

  // Loop principal da timeline (60fps)
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastFrameRef.current = null;
      return;
    }

    const tick = (timestamp: number) => {
      if (lastFrameRef.current === null) {
        lastFrameRef.current = timestamp;
      }
      const deltaSec = Math.min(0.05, (timestamp - lastFrameRef.current) / 1000);
      lastFrameRef.current = timestamp;

      if (isGuided && waitingNoteIdx !== null) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const prevTime = timeRef.current;
      const nextTime = prevTime + deltaSec;

      let pausedForGuide = false;
      for (let i = 0; i < score.length; i++) {
        const note = score[i];
        if (!triggeredNotesRef.current.has(i) && nextTime >= note.start) {
          if (isGuided) {
            timeRef.current = note.start;
            setCurrentTime(note.start);
            setWaitingNoteIdx(i);
            setActiveNoteIdx(i);
            pausedForGuide = true;
            break;
          } else {
            triggeredNotesRef.current.add(i);
            const stopFn = playOcarinaPitch(note.pitch, note.duration);
            stopAudioFnsRef.current.push(stopFn);
          }
        }
      }

      if (pausedForGuide) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      let currentActive: number | null = null;
      for (let i = 0; i < score.length; i++) {
        const n = score[i];
        if (nextTime >= n.start && nextTime <= n.start + n.duration) {
          currentActive = i;
          break;
        }
      }
      setActiveNoteIdx(currentActive);

      if (nextTime >= totalDuration) {
        timeRef.current = totalDuration;
        setCurrentTime(totalDuration);
        setActiveNoteIdx(null);
        setIsPlaying(false);
        return;
      }

      timeRef.current = nextTime;
      setCurrentTime(nextTime);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, isGuided, waitingNoteIdx, score, totalDuration]);

  useEffect(() => {
    return () => {
      stopAllActiveAudio();
    };
  }, [stopAllActiveAudio]);

  // Usuário toca um botão do controle (A, ▼, ▶, ◀, ▲)
  const handleUserPlayButton = useCallback(
    (btn: OcarinaButton) => {
      setManualButton(btn);
      const waitingNote =
        isGuided && waitingNoteIdx !== null ? score[waitingNoteIdx] : null;
      const expectedBtn = waitingNote
        ? waitingNote.button ?? PITCH_TO_BUTTON[waitingNote.pitch]
        : null;

      // Se acertou no Modo Guiado, toca a altura real daquela nota na partitura
      const pitchToPlay =
        expectedBtn === btn && waitingNote
          ? waitingNote.pitch
          : BUTTON_TO_PITCH[btn];

      const stopFn = playOcarinaPitch(pitchToPlay, 0.38);
      stopAudioFnsRef.current.push(stopFn);
      setTimeout(() => {
        setManualButton((curr) => (curr === btn ? null : curr));
      }, 280);

      if (isGuided && waitingNoteIdx !== null && expectedBtn === btn) {
        triggeredNotesRef.current.add(waitingNoteIdx);
        setWaitingNoteIdx(null);
        if (!isPlaying) setIsPlaying(true);
      }
    },
    [isGuided, waitingNoteIdx, score, isPlaying]
  );

  // Atalhos de teclado: Setas (C-Buttons) + Z (Botão A) + Espaço (Play/Pause) + Esc (Fechar)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        if (currentTime >= totalDuration) {
          resetPlayback(true);
        } else {
          setIsPlaying((p) => !p);
        }
        return;
      }

      const keyMap: Record<string, OcarinaButton> = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
        z: 'A',
        Z: 'A',
        a: 'A',
        A: 'A',
      };

      const mapped = keyMap[e.key];
      if (mapped) {
        e.preventDefault();
        handleUserPlayButton(mapped);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, handleUserPlayButton, currentTime, totalDuration, resetPlayback]);

  // Botão e altura ativos para iluminar a Ocarina e a linha da timeline
  const currentTargetNote =
    waitingNoteIdx !== null && score[waitingNoteIdx]
      ? score[waitingNoteIdx]
      : activeNoteIdx !== null && score[activeNoteIdx]
      ? score[activeNoteIdx]
      : null;

  const activeButton: OcarinaButton | null =
    manualButton ??
    (currentTargetNote
      ? currentTargetNote.button ?? PITCH_TO_BUTTON[currentTargetNote.pitch]
      : null);

  const illuminatedPitch: OcarinaNotePitch | null = manualButton
    ? BUTTON_TO_PITCH[manualButton]
    : currentTargetNote?.pitch ?? null;

  const activeHoles = illuminatedPitch ? PITCH_FINGERING[illuminatedPitch] ?? [] : [];
  const activeRowIndex = activeButton ? BUTTON_TO_ROW_INDEX[activeButton] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-y-auto border border-[#c8a962]/40 bg-gradient-to-b from-[#1e1712] via-[#17120e] to-[#0f0c09] shadow-2xl flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header estilo Play Ocarina */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#14100c] shrink-0">
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Voltar (Esc)"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h3 className="text-base sm:text-lg font-bold text-white font-hylian tracking-wide">
              {song.name}
            </h3>
            <p className="text-[11px] text-[#c8a962]">{song.namePt}</p>
          </div>

          <button
            onClick={() => onToggleLearned(song.id)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 transition-colors"
            title={isLearned ? 'Aprendida' : 'Marcar como aprendida'}
          >
            {isLearned ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Circle className="w-4 h-4 text-zinc-500" />
            )}
            <span className="hidden sm:inline">
              {isLearned ? 'Aprendida' : 'Marcar'}
            </span>
          </button>
        </div>

        {/* Área da Ocarina + Controles */}
        <div className="px-4 pt-3 pb-4 flex flex-col items-center bg-gradient-to-b from-[#1c1611] to-[#140f0b] shrink-0">
          <div className="relative w-64 sm:w-72 h-28 sm:h-32 flex items-center justify-center select-none">
            <svg
              viewBox="0 0 320 160"
              className="w-full h-full drop-shadow-[0_14px_24px_rgba(0,0,0,0.85)]"
            >
              <defs>
                <linearGradient id="ocarinaBody" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="45%" stopColor="#1d4ed8" />
                  <stop offset="100%" stopColor="#0f296b" />
                </linearGradient>
                <linearGradient id="ocarinaHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="silverBand" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="50%" stopColor="#f1f5f9" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
                <filter id="holeGlow" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="4.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Bocal */}
              <path
                d="M 118 88 L 106 140 Q 105 147 114 148 L 128 148 Q 136 147 138 139 L 154 90 Z"
                fill="url(#ocarinaBody)"
                stroke="#1e3a8a"
                strokeWidth="1.5"
              />
              {/* Faixa prateada + Triforce */}
              <path
                d="M 115 98 L 150 99 L 146 113 L 112 111 Z"
                fill="url(#silverBand)"
                opacity="0.92"
              />
              <polygon points="131,100 127,106 135,106" fill="#eab308" />
              <polygon points="127,106 123,111 131,111" fill="#eab308" />
              <polygon points="135,106 131,111 139,111" fill="#eab308" />

              {/* Corpo principal */}
              <path
                d="M 55 76 C 55 40, 115 24, 178 30 C 232 35, 286 52, 294 65 C 298 71, 288 78, 272 82 C 230 92, 168 102, 110 102 C 74 102, 55 92, 55 76 Z"
                fill="url(#ocarinaBody)"
                stroke="#60a5fa"
                strokeOpacity="0.35"
                strokeWidth="1.5"
              />
              <path
                d="M 68 68 C 80 42, 130 32, 185 36 C 228 39, 268 52, 278 60 C 250 56, 195 50, 135 55 C 95 58, 76 68, 68 68 Z"
                fill="url(#ocarinaHighlight)"
              />

              {/* 7 Furos */}
              {OCARINA_HOLES.map((hole, idx) => {
                const isLit = activeHoles.includes(idx);
                return (
                  <g key={idx}>
                    {isLit && (
                      <circle
                        cx={hole.cx}
                        cy={hole.cy}
                        r={hole.r + 5}
                        fill="#38bdf8"
                        opacity="0.45"
                        filter="url(#holeGlow)"
                      />
                    )}
                    <circle
                      cx={hole.cx}
                      cy={hole.cy}
                      r={hole.r}
                      fill={isLit ? '#e0f2fe' : '#06122c'}
                      stroke={isLit ? '#7dd3fc' : '#1e40af'}
                      strokeWidth={isLit ? 2 : 1.2}
                      filter={isLit ? 'url(#holeGlow)' : undefined}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Badge flutuante mostrando o botão atual do controle */}
            {activeButton && (
              <div
                className={`absolute top-1 right-1 w-8 h-8 rounded-full border text-xs font-bold flex items-center justify-center shadow-lg ${
                  activeButton === 'A'
                    ? 'bg-blue-600 text-white border-blue-300'
                    : 'bg-amber-500 text-sheikah-darkest border-amber-200'
                }`}
              >
                {BUTTON_SYMBOL[activeButton]}
              </div>
            )}
          </div>

          {/* Controles: Reiniciar | Play/Pause | Guided Playback */}
          <div className="mt-2 flex items-center justify-center gap-4">
            <button
              onClick={() => resetPlayback(true)}
              className="p-2.5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Reiniciar do início"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={() => {
                if (currentTime >= totalDuration) {
                  resetPlayback(true);
                } else {
                  setIsPlaying((p) => !p);
                }
              }}
              className="w-12 h-12 rounded-full bg-[#332d27] hover:bg-[#443b33] border border-white/15 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
              title={isPlaying ? 'Pausar (Espaço)' : 'Tocar (Espaço)'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={handleToggleGuided}
              className={`px-3.5 py-2 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isGuided
                  ? 'bg-amber-600/30 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'bg-[#2a231d] border-white/15 text-gray-300 hover:text-white hover:bg-[#362d26]'
              }`}
              title="No Modo Guiado, a partitura espera você apertar cada botão!"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modo Guiado</span>
            </button>
          </div>
        </div>

        {/* Seletor de Versão (Início vs Completa) */}
        <div className="px-4 py-2 bg-[#140f0b] border-t border-white/5 shrink-0">
          <div className="grid grid-cols-2 rounded-lg overflow-hidden bg-[#1e1813] border border-white/10 p-0.5">
            <button
              onClick={() => handleChangeVersion('beginning')}
              className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                versionMode === 'beginning'
                  ? 'bg-[#7c3f0c] text-amber-100 shadow-inner'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Tocar só o início
            </button>
            <button
              onClick={() => handleChangeVersion('full')}
              className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                versionMode === 'full'
                  ? 'bg-[#7c3f0c] text-amber-100 shadow-inner'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Tocar versão completa
            </button>
          </div>
        </div>

        {/* Partitura Timeline com os 5 Botões do Controle (altura fixa para renderizar a grade inteira) */}
        <div className="relative h-[225px] sm:h-[250px] shrink-0 bg-[#120d0a] border-t border-white/10 overflow-hidden select-none">
          {/* Eixo esquerdo com os ícones dos botões (▲, ◀, ▶, ▼, A) */}
          <div className="absolute left-0 top-0 bottom-0 w-11 z-20 bg-[#120d0a]/95 border-r border-white/10 flex flex-col">
            {CONTROLLER_ROWS.map((row, idx) => {
              const isRowActive = activeRowIndex === idx;
              return (
                <button
                  key={row.button}
                  onClick={() => handleUserPlayButton(row.button)}
                  title={row.name}
                  className={`flex-1 flex items-center justify-center transition-colors ${
                    isRowActive ? 'bg-amber-500/15' : 'hover:bg-white/5'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full border text-[11px] font-bold flex items-center justify-center transition-transform ${
                      row.badgeClass
                    } ${isRowActive ? 'scale-110 shadow-[0_0_10px_rgba(251,191,36,0.75)]' : 'opacity-80'}`}
                  >
                    {row.symbol}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Área rolável da partitura */}
          <div className="relative h-full ml-11">
            {/* Linhas horizontais da grade */}
            <div className="absolute inset-0 flex flex-col pointer-events-none">
              {CONTROLLER_ROWS.map((row, idx) => (
                <div
                  key={row.button}
                  className={`flex-1 border-b border-white/[0.07] ${
                    activeRowIndex === idx ? 'bg-amber-500/[0.05]' : ''
                  }`}
                />
              ))}
            </div>

            {/* Marcadores verticais de tempo + blocos dos botões */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                transform: `translateX(calc(${PLAYHEAD_OFFSET_PERCENT}% - ${
                  currentTime * PX_PER_SECOND
                }px))`,
              }}
            >
              {Array.from({ length: Math.ceil(totalDuration * 2) + 4 }).map((_, beatIdx) => (
                <div
                  key={beatIdx}
                  className="absolute top-0 bottom-0 border-l border-white/[0.05]"
                  style={{ left: `${beatIdx * 0.5 * PX_PER_SECOND}px` }}
                />
              ))}

              {/* Blocos dos botões na timeline */}
              {score.map((note, idx) => {
                const btn = note.button ?? PITCH_TO_BUTTON[note.pitch];
                const rowIndex = BUTTON_TO_ROW_INDEX[btn];
                const topPercent = (rowIndex / CONTROLLER_ROWS.length) * 100;
                const heightPercent = 100 / CONTROLLER_ROWS.length;
                const leftPx = note.start * PX_PER_SECOND;
                const widthPx = Math.max(32, note.duration * PX_PER_SECOND - 4);

                const isCurrentlyHit = activeNoteIdx === idx;
                const isWaitingHere = isGuided && waitingNoteIdx === idx;
                const isPast = currentTime > note.start + note.duration;
                const isAButton = btn === 'A';

                return (
                  <div
                    key={`${btn}-${idx}`}
                    onClick={() => handleUserPlayButton(btn)}
                    style={{
                      top: `calc(${topPercent}% + 6px)`,
                      height: `calc(${heightPercent}% - 12px)`,
                      left: `${leftPx}px`,
                      width: `${widthPx}px`,
                    }}
                    className={`pointer-events-auto absolute rounded-lg flex items-center pl-1.5 text-xs font-bold cursor-pointer border transition-all ${
                      isCurrentlyHit || isWaitingHere
                        ? 'bg-gradient-to-r from-amber-100 via-white to-amber-200 text-[#2a1b0e] border-white shadow-[0_0_16px_rgba(251,191,36,0.95)] scale-[1.03] z-10'
                        : isPast
                        ? isAButton
                          ? 'bg-blue-900/50 text-blue-200/70 border-blue-500/30'
                          : 'bg-amber-900/45 text-amber-200/70 border-amber-500/30'
                        : isAButton
                        ? 'bg-blue-600/90 text-white border-blue-400 shadow-sm hover:brightness-110'
                        : 'bg-[#e6ddd0] text-[#2b2219] border-amber-200/70 shadow-sm hover:brightness-110'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isAButton
                          ? 'bg-blue-500 text-white border border-blue-300'
                          : 'bg-amber-500 text-[#1b140d] border border-amber-300'
                      }`}
                    >
                      {BUTTON_SYMBOL[btn]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Linha vertical dourada fixa (Playhead) */}
            <div
              className="absolute top-0 bottom-0 z-20 pointer-events-none"
              style={{ left: `${PLAYHEAD_OFFSET_PERCENT}%` }}
            >
              <div className="w-[2px] h-full bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 shadow-[0_0_10px_rgba(250,204,21,0.85)]" />

              {activeRowIndex !== null && (
                <div
                  className="absolute -left-[6px] w-3.5 h-3.5 rotate-45 bg-amber-300 border border-white shadow-[0_0_14px_rgba(253,224,71,1)]"
                  style={{
                    top: `calc(${
                      ((activeRowIndex + 0.5) / CONTROLLER_ROWS.length) * 100
                    }% - 7px)`,
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Controle interativo da Ocarina (botões A e C-Buttons) */}
        <div className="px-3 py-3 bg-[#0d0a07] border-t border-white/10 shrink-0">
          {isGuided && waitingNoteIdx !== null && score[waitingNoteIdx] && (
            <div className="text-center text-[11px] text-amber-300 font-semibold mb-2 animate-pulse">
              Aperte o botão{' '}
              {
                BUTTON_SYMBOL[
                  score[waitingNoteIdx].button ??
                    PITCH_TO_BUTTON[score[waitingNoteIdx].pitch]
                ]
              }{' '}
              para continuar!
            </div>
          )}
          <div className="flex items-center justify-center gap-3">
            {[
              CONTROLLER_ROWS[4], // A
              CONTROLLER_ROWS[3], // ▼
              CONTROLLER_ROWS[2], // ▶
              CONTROLLER_ROWS[1], // ◀
              CONTROLLER_ROWS[0], // ▲
            ].map((ctrl) => {
              const waiting =
                isGuided && waitingNoteIdx !== null && score[waitingNoteIdx];
              const expectedBtn = waiting
                ? waiting.button ?? PITCH_TO_BUTTON[waiting.pitch]
                : null;
              const isTarget = expectedBtn === ctrl.button;

              return (
                <button
                  key={ctrl.button}
                  onClick={() => handleUserPlayButton(ctrl.button)}
                  title={`${ctrl.name} (Tecla ${ctrl.keyHint})`}
                  className={`flex flex-col items-center gap-1 transition-transform active:scale-90`}
                >
                  <span
                    className={`w-11 h-11 rounded-full border-2 text-base font-bold flex items-center justify-center shadow-lg transition-all ${
                      ctrl.badgeClass
                    } ${
                      isTarget
                        ? 'ring-4 ring-white shadow-[0_0_18px_rgba(251,191,36,0.95)] animate-pulse scale-110'
                        : 'hover:brightness-110'
                    }`}
                  >
                    {ctrl.symbol}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {ctrl.keyHint}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
