import React from 'react';
import { 
  Heart, 
  Bug, 
  Music, 
  MapPin, 
  Sparkles, 
  Shield, 
  Sword, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Database,
  Trophy,
  Settings,
  ShieldCheck
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
  onNavigate,
  isNeonEnabled
}) => {
  // Renderiza os corações de vida do Link
  const totalHearts = gameState.player.heartsMax || 3;
  const currentHearts = gameState.player.heartsCurrent || 3;

  return (
    <div className="space-y-6">
      
      {/* Banner Principal de Status do Jogo */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sheikah-card via-sheikah-dark to-sheikah-card border border-sheikah-border p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-sheikah-kokiri/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-sheikah-gold/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sheikah-kokiri/20 text-sheikah-kokiri border border-sheikah-kokiri/40">
                <Sparkles className="w-3 h-3" />
                {gameState.player.age === 'child' ? 'Era da Criança' : 'Era Adulta'}
              </span>
              <span className="text-xs text-gray-400">
                Slot Ativo: <span className="text-sheikah-gold font-mono font-medium">{gameState.activeSlot}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide font-hylian">
              Jornada de {gameState.player.name}
            </h1>

            <div className="flex items-center gap-2 mt-2 text-sm text-gray-300">
              <MapPin className="w-4 h-4 text-sheikah-gold flex-shrink-0" />
              <span>Região Atual:</span>
              <span className="font-semibold text-white bg-sheikah-border/60 px-2 py-0.5 rounded text-xs">
                {gameState.location.areaDisplay}
              </span>
            </div>
          </div>

          {/* Visualizador de Vida / Corações */}
          <div className="bg-sheikah-darkest/80 border border-sheikah-border/80 rounded-xl p-4 flex flex-col items-start md:items-end justify-center min-w-[240px]">
            <div className="text-xs text-gray-400 mb-2 font-medium flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
              <span>Pontos de Vida ({currentHearts} / {totalHearts})</span>
            </div>
            <div className="flex flex-wrap gap-1 max-w-[220px]">
              {Array.from({ length: totalHearts }).map((_, i) => (
                <Heart 
                  key={i} 
                  className={`w-4 h-4 ${
                    i < currentHearts 
                      ? 'text-red-500 fill-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]' 
                      : 'text-zinc-600 fill-zinc-800'
                  }`} 
                />
              ))}
            </div>
            <div className="mt-3 text-xs text-emerald-400 font-mono font-semibold">
              Rupias: {gameState.player.rupees} ♦
            </div>
          </div>
        </div>
      </div>

      {/* Cartões de Estatísticas / Checklists */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Skulltulas */}
        <div 
          onClick={() => onNavigate('skulltulas')}
          className="group cursor-pointer bg-sheikah-card hover:bg-sheikah-card/80 border border-sheikah-border hover:border-sheikah-gold/50 rounded-xl p-4 transition-all shadow-md hover:shadow-glow-gold"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Skulltulas de Ouro</span>
            <div className="w-8 h-8 rounded-lg bg-sheikah-gold/10 text-sheikah-gold flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bug className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{collectedSkulltulasCount}</span>
            <span className="text-xs text-gray-400">/ 100</span>
          </div>
          <div className="mt-2 w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-sheikah-gold h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${(collectedSkulltulasCount / 100) * 100}%` }}
            />
          </div>
        </div>

        {/* Peças de Coração */}
        <div 
          onClick={() => onNavigate('hearts')}
          className="group cursor-pointer bg-sheikah-card hover:bg-sheikah-card/80 border border-sheikah-border hover:border-red-500/50 rounded-xl p-4 transition-all shadow-md hover:shadow-[0_0_15px_-3px_rgba(239,68,68,0.4)]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Peças de Coração</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{collectedHeartsCount}</span>
            <span className="text-xs text-gray-400">/ 36</span>
          </div>
          <div className="mt-2 w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-red-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${(collectedHeartsCount / 36) * 100}%` }}
            />
          </div>
        </div>

        {/* Canções da Ocarina */}
        <div 
          onClick={() => onNavigate('songs')}
          className="group cursor-pointer bg-sheikah-card hover:bg-sheikah-card/80 border border-sheikah-border hover:border-sky-500/50 rounded-xl p-4 transition-all shadow-md hover:shadow-glow-blue"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Canções</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Music className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{learnedSongsCount}</span>
            <span className="text-xs text-gray-400">/ 12</span>
          </div>
          <div className="mt-2 w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-sky-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${(learnedSongsCount / 12) * 100}%` }}
            />
          </div>
        </div>

        {/* Linha do Tempo da História */}
        <div 
          onClick={() => onNavigate('timeline')}
          className="group cursor-pointer bg-sheikah-card hover:bg-sheikah-card/80 border border-sheikah-border hover:border-sheikah-kokiri/50 rounded-xl p-4 transition-all shadow-md hover:shadow-glow-green"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Marcos da História</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{completedEventsCount}</span>
            <span className="text-xs text-gray-400">/ 16</span>
          </div>
          <div className="mt-2 w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${(completedEventsCount / 16) * 100}%` }}
            />
          </div>
        </div>

      </div>

      {/* Seção Inferior: Diário Recente & Card do Neon */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Últimas Anotações do Diário */}
        <div className="lg:col-span-2 bg-sheikah-card border border-sheikah-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white font-hylian flex items-center gap-2">
              <span>Anotações Recentes do Diário</span>
            </h2>
            <button 
              onClick={() => onNavigate('journal')}
              className="text-xs text-sheikah-kokiri hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {notes.length === 0 ? (
            <div className="text-center py-8 text-gray-400 border border-dashed border-sheikah-border/60 rounded-lg">
              <p className="text-sm">Nenhuma anotação registrada ainda.</p>
              <button 
                onClick={() => onNavigate('journal')}
                className="mt-2 text-xs text-sheikah-gold hover:underline font-medium"
              >
                + Criar primeiro registro de exploração
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.slice(0, 3).map((note) => (
                <div 
                  key={note.id}
                  onClick={() => onNavigate('journal')}
                  className="cursor-pointer p-3.5 rounded-lg bg-sheikah-darkest/60 hover:bg-sheikah-darkest border border-sheikah-border/50 hover:border-sheikah-border transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{note.title}</span>
                    <span className="text-[10px] text-gray-400 bg-sheikah-border/80 px-2 py-0.5 rounded">
                      {note.area}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card de Progresso Geral da Aventura & Status Sheikah */}
        <div className="bg-sheikah-card border border-sheikah-border rounded-xl p-5 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sheikah-gold">
                <Trophy className="w-5 h-5 text-sheikah-gold" />
                <h3 className="font-bold text-base font-hylian">Conclusão 100%</h3>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-sheikah-gold/20 text-sheikah-gold border border-sheikah-gold/40">
                {Math.round(((collectedSkulltulasCount + collectedHeartsCount + learnedSongsCount + completedEventsCount) / 164) * 100)}%
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Acompanhamento total de coletáveis, segredos e marcos da jornada em Hyrule.
            </p>

            {/* Barra Geral de Progresso */}
            <div className="mt-3">
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-sheikah-kokiri via-sheikah-gold to-yellow-400 h-2 rounded-full transition-all duration-700"
                  style={{ 
                    width: `${Math.min(100, Math.round(((collectedSkulltulasCount + collectedHeartsCount + learnedSongsCount + completedEventsCount) / 164) * 100))}%` 
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1.5 font-mono">
                <span>{collectedSkulltulasCount + collectedHeartsCount + learnedSongsCount + completedEventsCount} de 164 itens</span>
                <span>Restam {164 - (collectedSkulltulasCount + collectedHeartsCount + learnedSongsCount + completedEventsCount)}</span>
              </div>
            </div>

            {/* Status da Nuvem discreto */}
            <div className="mt-4 p-3 rounded-lg bg-sheikah-darkest/80 border border-sheikah-border/60 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="font-semibold text-gray-200">Sincronização Neon</span>
                </div>
                <span className="text-[11px] font-medium text-emerald-400">Ativa</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Seus registros estão salvos com redundância na nuvem (AWS SP).
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

