import React from 'react';
import {
  Heart,
  MapPin,
  Sparkles,
  ArrowRight,
  Trophy,
  ScrollText
} from 'lucide-react';
import { LiveGameState, Note } from '../types';

interface DashboardProps {
  gameState: LiveGameState;
  collectedSkulltulasCount: number;
  collectedHeartsCount: number;
  learnedSongsCount: number;
  completedEventsCount: number;
  notes: Note[];
  onNavigate: (tab: string) => void;
  isNeonEnabled: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  gameState,
  collectedSkulltulasCount,
  collectedHeartsCount,
  learnedSongsCount,
  completedEventsCount,
  notes,
  onNavigate
}) => {
  const totalHearts = gameState.player.heartsMax || 3;
  const currentHearts = gameState.player.heartsCurrent || 3;
  const totalCollected =
    collectedSkulltulasCount +
    collectedHeartsCount +
    learnedSongsCount +
    completedEventsCount;
  const totalCompletionPct = Math.min(100, Math.round((totalCollected / 164) * 100));
  const latestNote = notes[0];

  const appTiles = [
    {
      id: 'map',
      label: 'Mapa',
      badge: `${Math.round(((collectedSkulltulasCount + collectedHeartsCount) / 136) * 100)}%`,
      bg: 'bg-[radial-gradient(circle_at_center,#c9a255_0%,#9e7632_65%,#7a571f_100%)]',
      emblem: (
        <svg viewBox="0 0 64 64" className="w-12 h-12 sm:w-16 sm:h-16 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
          {/* Seta estilo bússola oficial do Map */}
          <polygon
            points="49,15 34,50 28,35 13,29"
            fill="#991b1b"
            stroke="#fef3c7"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <polygon points="49,15 28,35 13,29" fill="#ef4444" />
          <polygon points="49,15 34,50 28,35" fill="#b91c1c" />
        </svg>
      )
    },
    {
      id: 'journal',
      label: 'Diário',
      badge: `${notes.length}`,
      bg: 'bg-[radial-gradient(circle_at_center,#f5ecd0_0%,#dfd0a2_65%,#bfa76a_100%)]',
      emblem: (
        <svg viewBox="0 0 64 64" className="w-12 h-12 sm:w-16 sm:h-16 drop-shadow-[0_4px_6px_rgba(69,26,3,0.35)]">
          {/* Pergaminho estilo Today's Record */}
          <path
            d="M17 14 H45 C47.5 14 49 16 49 18.5 V45 C49 48 46.5 50 43.5 50 H19 C16 50 14 47.5 14 44.5 V18 C14 15.8 15.5 14 17 14 Z"
            fill="#fffbeb"
            stroke="#5c2810"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <rect x="20" y="21" width="6" height="5" rx="1" fill="#d97706" opacity="0.7" />
          <line x1="29" y1="22.5" x2="42" y2="22.5" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="29" y1="26" x2="39" y2="26" stroke="#a16207" strokeWidth="2" strokeLinecap="round" />
          <rect x="20" y="30" width="6" height="5" rx="1" fill="#d97706" opacity="0.7" />
          <line x1="29" y1="31.5" x2="42" y2="31.5" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="29" y1="35" x2="37" y2="35" stroke="#a16207" strokeWidth="2" strokeLinecap="round" />
          <line x1="20" y1="41.5" x2="33" y2="41.5" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="42.5" cy="43.5" r="5.5" fill="#b91c1c" stroke="#450a0a" strokeWidth="1.8" />
        </svg>
      )
    },
    {
      id: 'skulltulas',
      label: 'Skulltulas',
      badge: `${collectedSkulltulasCount}/100`,
      bg: 'bg-[radial-gradient(circle_at_center,#292118_0%,#18130d_70%,#0e0b08_100%)]',
      emblem: (
        <svg viewBox="0 0 64 64" className="w-12 h-12 sm:w-16 sm:h-16 drop-shadow-[0_4px_10px_rgba(234,179,8,0.35)]">
          <defs>
            <linearGradient id="skullGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="55%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#a16207" />
            </linearGradient>
          </defs>
          {/* Patas articuladas */}
          <path
            d="M20 26 L12 19 L9 24 M18 33 L8 33 L6 38 M20 40 L12 48 L10 53 M44 26 L52 19 L55 24 M46 33 L56 33 L58 38 M44 40 L52 48 L54 53"
            fill="none"
            stroke="#facc15"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Crânio dourado */}
          <path
            d="M32 18 C22 18 17 25 18 34 C18.5 38 22 41 25 42 V46 H39 V42 C42 41 45.5 38 46 34 C47 25 42 18 32 18 Z"
            fill="url(#skullGold)"
            stroke="#422006"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Olhos vermelhos */}
          <circle cx="26.5" cy="31" r="3.2" fill="#dc2626" stroke="#450a0a" strokeWidth="1" />
          <circle cx="37.5" cy="31" r="3.2" fill="#dc2626" stroke="#450a0a" strokeWidth="1" />
          <circle cx="25.8" cy="30.2" r="1" fill="#fca5a5" />
          <circle cx="36.8" cy="30.2" r="1" fill="#fca5a5" />
          {/* Dentes */}
          <path d="M27 42 V46 M32 42 V46 M37 42 V46" stroke="#422006" strokeWidth="1.8" />
        </svg>
      )
    },
    {
      id: 'hearts',
      label: 'Corações',
      badge: `${collectedHeartsCount}/36`,
      bg: 'bg-[radial-gradient(circle_at_center,#f5ecd0_0%,#dfd0a2_65%,#bfa76a_100%)]',
      emblem: (
        <svg viewBox="0 0 64 64" className="w-12 h-12 sm:w-16 sm:h-16 drop-shadow-[0_4px_8px_rgba(153,27,27,0.35)]">
          <defs>
            <linearGradient id="heartRed" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="45%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>
          </defs>
          <path
            d="M32 53 C32 53 10 38 10 22 C10 14.5 16 10 22.5 10 C27 10 30.5 12.5 32 16 C33.5 12.5 37 10 41.5 10 C48 10 54 14.5 54 22 C54 38 32 53 32 53 Z"
            fill="url(#heartRed)"
            stroke="#5c2810"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          <path d="M18 19 C18 15.8 21 14 24.5 14" stroke="#fecaca" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </svg>
      )
    },
    {
      id: 'songs',
      label: 'Ocarina',
      badge: `${learnedSongsCount}/12`,
      bg: 'bg-[radial-gradient(circle_at_center,#f5ecd0_0%,#dfd0a2_65%,#bfa76a_100%)]',
      emblem: (
        <svg viewBox="0 0 64 64" className="w-12 h-12 sm:w-16 sm:h-16 drop-shadow-[0_4px_6px_rgba(30,27,24,0.35)]">
          <defs>
            <linearGradient id="ocarinaBlue" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="45%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#172554" />
            </linearGradient>
            <linearGradient id="silverBand" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>

          {/* Pauta musical de fundo (como no app oficial Play Ocarina) */}
          <g stroke="#8c734b" strokeWidth="1" opacity="0.55">
            <line x1="6" y1="18" x2="58" y2="18" />
            <line x1="6" y1="25" x2="58" y2="25" />
            <line x1="6" y1="32" x2="58" y2="32" />
            <line x1="6" y1="39" x2="58" y2="39" />
            <line x1="6" y1="46" x2="58" y2="46" />
          </g>

          {/* Corpo da Ocarina of Time (ponta à esquerda, bocal em cima à direita) */}
          <path
            d="M11 23 C9.5 22 10.5 20.5 13 21 C24 23 33 25 40 28 L46 18 L53 20 L48 31 C53.5 34.5 54.5 41.5 50 45.5 C44.5 50 31 46 21 37 C16 32.5 12.5 26 11 23 Z"
            fill="url(#ocarinaBlue)"
            stroke="#0f172a"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* Brilho cerâmico superior */}
          <path
            d="M16 23.5 C24 25.5 32 27.5 39 30.5"
            stroke="#93c5fd"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.6"
            fill="none"
          />

          {/* Faixa metálica prateada no bocal com Triforce dourada */}
          <polygon
            points="43,23.5 50.5,26.2 48.2,31.2 40.5,28.2"
            fill="url(#silverBand)"
            stroke="#334155"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <polygon points="45.8,25.5 47.4,28.5 44.1,28.5" fill="#facc15" stroke="#713f12" strokeWidth="0.4" />

          {/* Orifícios da Ocarina */}
          <g fill="#091326" stroke="#93c5fd" strokeWidth="0.7">
            <circle cx="17.5" cy="25.5" r="1.4" />
            <circle cx="22.5" cy="27.2" r="1.5" />
            <circle cx="27.5" cy="29.5" r="1.4" />
            <circle cx="32.5" cy="36.2" r="1.9" />
            <circle cx="38" cy="39" r="2.1" />
            <circle cx="43.5" cy="40.5" r="1.9" />
            <circle cx="37.5" cy="34.2" r="1.2" />
          </g>
        </svg>
      )
    },
    {
      id: 'timeline',
      label: 'História',
      badge: `${completedEventsCount}/16`,
      bg: 'bg-[radial-gradient(circle_at_center,#2d2113_0%,#19120a_70%,#0d0905_100%)]',
      emblem: (
        <svg viewBox="0 0 64 64" className="w-12 h-12 sm:w-16 sm:h-16 drop-shadow-[0_4px_10px_rgba(250,204,21,0.35)]">
          <defs>
            <linearGradient id="triforceGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef9c3" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
          <polygon points="32,12 42,30 22,30" fill="url(#triforceGold)" stroke="#78350f" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="22,30 32,48 12,48" fill="url(#triforceGold)" stroke="#78350f" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="42,30 52,48 32,48" fill="url(#triforceGold)" stroke="#78350f" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Tela Principal estilo App (Nintendo Zelda Notes) */}
      <section className="relative overflow-hidden rounded-3xl border border-[#c8a962]/35 bg-[radial-gradient(ellipse_at_top,rgba(44,72,42,0.38)_0%,rgba(16,22,18,0.94)_55%,#0b0f0d_100%)] px-4 py-6 sm:px-8 sm:py-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.85)]">
        {/* Brilho ambiente sutil */}
        <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-40 rounded-full bg-[#d4af37]/15 blur-3xl" />

        {/* Brasão / Título do Jogo centralizado */}
        <div className="relative z-10 flex flex-col items-center text-center mb-6">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#e7cf8b]/80 font-semibold">
            The Legend of
          </span>
          <h1 className="font-hylian text-3xl sm:text-4xl font-extrabold tracking-wider bg-gradient-to-b from-[#fff3c4] via-[#e6c15c] to-[#a67c2e] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(212,175,55,0.28)]">
            ZELDA
          </h1>
          <span className="mt-0.5 text-[11px] sm:text-xs uppercase tracking-[0.26em] text-[#f0d98c] font-bold">
            Ocarina of Time
          </span>

          {/* Barra HUD compacta do Herói */}
          <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 rounded-full bg-black/45 border border-[#c8a962]/30 px-3.5 py-1.5 text-[11px] text-zinc-200 backdrop-blur-md">
            <span className="inline-flex items-center gap-1 text-emerald-300 font-semibold">
              <Sparkles className="w-3 h-3" />
              {gameState.player.age === 'child' ? 'Criança' : 'Adulto'}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="inline-flex items-center gap-1 text-red-400 font-semibold">
              <Heart className="w-3 h-3 fill-red-500 text-red-500" />
              {currentHearts}/{totalHearts}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-400 font-mono font-semibold">
              {gameState.player.rupees} ♦
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-zinc-300">
              <MapPin className="w-3 h-3 text-[#d4af37]" />
              {gameState.location.areaDisplay.split('(')[0].trim()}
            </span>
          </div>
        </div>

        {/* Grade de Ícones estilo App (3 colunas no mobile e desktop) */}
        <div className="relative z-10 grid grid-cols-3 gap-x-4 gap-y-5 sm:gap-x-7 sm:gap-y-6 max-w-lg mx-auto">
          {appTiles.map((tile) => (
            <button
              key={tile.id}
              type="button"
              onClick={() => onNavigate(tile.id)}
              className="group flex flex-col items-center gap-2 focus:outline-none"
            >
              <div
                className={`relative w-full aspect-square rounded-2xl border-2 border-[#d4af37] shadow-[0_10px_22px_-6px_rgba(0,0,0,0.85)] flex items-center justify-center transition-all duration-200 group-hover:scale-[1.04] group-hover:border-[#fef08a] group-hover:shadow-[0_0_22px_rgba(212,175,55,0.35)] group-active:scale-95 overflow-hidden ${tile.bg}`}
              >
                {/* Moldura interna estilo pergaminho Zelda */}
                <div className="absolute inset-1 rounded-xl border border-[#f5e1a4]/35 pointer-events-none" />
                <span className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 border-[#f5e1a4]/60 rounded-tl-sm pointer-events-none" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 border-[#f5e1a4]/60 rounded-tr-sm pointer-events-none" />
                <span className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-2 border-l-2 border-[#f5e1a4]/60 rounded-bl-sm pointer-events-none" />
                <span className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-2 border-r-2 border-[#f5e1a4]/60 rounded-br-sm pointer-events-none" />

                <div className="transform transition-transform duration-200 group-hover:scale-110">
                  {tile.emblem}
                </div>

                <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/75 text-[10px] font-mono font-bold text-[#f5e1a4] border border-[#c8a962]/45 leading-none">
                  {tile.badge}
                </span>
              </div>

              <span className="text-xs sm:text-sm font-semibold text-zinc-100 group-hover:text-[#f5e1a4] transition-colors text-center leading-tight tracking-wide">
                {tile.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Faixa Compacta de Progresso 100% + Último Registro */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="rounded-2xl bg-sheikah-card/90 border border-sheikah-border/80 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sheikah-gold">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider font-hylian">
                Jornada 100%
              </span>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-sheikah-gold/15 text-sheikah-gold border border-sheikah-gold/30">
              {totalCompletionPct}%
            </span>
          </div>
          <div className="w-full bg-zinc-800/90 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-sheikah-kokiri via-sheikah-gold to-yellow-400 h-2 rounded-full transition-all duration-700"
              style={{ width: `${totalCompletionPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1.5 font-mono">
            <span>{totalCollected} / 164 marcos</span>
            <span>Restam {164 - totalCollected}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('journal')}
          className="text-left rounded-2xl bg-sheikah-card/90 hover:bg-sheikah-card border border-sheikah-border/80 hover:border-[#c8a962]/50 p-4 transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 text-emerald-400">
              <ScrollText className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider font-hylian">
                Última Nota
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#f5e1a4] group-hover:translate-x-0.5 transition-all" />
          </div>
          {latestNote ? (
            <>
              <p className="text-xs font-semibold text-white truncate">{latestNote.title}</p>
              <p className="text-[11px] text-zinc-400 truncate mt-0.5">{latestNote.content}</p>
            </>
          ) : (
            <p className="text-xs text-zinc-400 mt-1">
              Toque para registrar sua primeira anotação em Hyrule.
            </p>
          )}
        </button>
      </div>
    </div>
  );
};
