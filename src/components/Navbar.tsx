import React from 'react';
import { 
  Scroll, 
  MapPin, 
  Heart, 
  Music, 
  Bug, 
  Sparkles,
  Settings,
  CloudCheck,
  Radio
} from 'lucide-react';
import { LiveGameState, NeonConfig } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  gameState: LiveGameState;
  neonConfig: NeonConfig;
  onOpenNeonModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  gameState,
  neonConfig,
  onOpenNeonModal
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Painel', shortLabel: 'Início', icon: Sparkles },
    { id: 'journal', label: 'Diário de Bordo', shortLabel: 'Diário', icon: Scroll },
    { id: 'skulltulas', label: 'Skulltulas', shortLabel: 'Skulltulas', icon: Bug, count: '100' },
    { id: 'hearts', label: 'Corações', shortLabel: 'Corações', icon: Heart, count: '36' },
    { id: 'songs', label: 'Canções', shortLabel: 'Canções', icon: Music, count: '12' },
    { id: 'timeline', label: 'Linha do Tempo', shortLabel: 'História', icon: MapPin }
  ];

  return (
    <>
      {/* ================= HEADER SUPERIOR (DESKTOP & MOBILE) ================= */}
      <header className="sticky top-0 z-40 bg-sheikah-darkest/90 backdrop-blur-xl border-b border-sheikah-border/80 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Identidade do App */}
            <div 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-sheikah-gold/30 via-sheikah-card to-sheikah-kokiri/20 p-0.5 shadow-[0_0_15px_-3px_rgba(234,179,8,0.3)] group-hover:shadow-glow-gold transition-all duration-300">
                <img 
                  src="/icon.png" 
                  alt="Zelda Notes Emblem" 
                  className="w-full h-full object-cover rounded-[10px]" 
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-hylian text-base sm:text-lg font-bold tracking-wider bg-gradient-to-r from-amber-200 via-sheikah-gold to-yellow-500 bg-clip-text text-transparent uppercase">
                    Zelda Notes
                  </span>
                  <span className="text-[10px] tracking-wider uppercase font-semibold bg-sheikah-card text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    OoT
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-medium hidden sm:block">
                  Nintendo Companion • Hyrule Journal
                </p>
              </div>
            </div>

            {/* Abas de Navegação Centrais (Apenas Desktop / Tablets Grandes) */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 bg-sheikah-dark/80 p-1 rounded-xl border border-sheikah-border/60">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-b from-sheikah-card to-sheikah-dark text-sheikah-gold border border-sheikah-gold/40 shadow-[0_0_15px_-4px_rgba(234,179,8,0.3)]'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-sheikah-gold' : 'text-zinc-400'}`} />
                    <span>{tab.label}</span>
                    {tab.count && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive ? 'bg-amber-500/20 text-amber-300' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Ações / Status Discreto do Header */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Indicador Elegante de Sincronização / Nuvem */}
              <div 
                title={neonConfig.isEnabled ? 'Sincronização em nuvem ativa com Neon PostgreSQL' : 'Armazenamento local'}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sheikah-card/60 border border-sheikah-border text-xs text-zinc-300 select-none"
              >
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    neonConfig.isEnabled ? 'bg-emerald-400' : 'bg-zinc-500'
                  }`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    neonConfig.isEnabled ? 'bg-emerald-500' : 'bg-zinc-500'
                  }`} />
                </span>
                <span className="hidden sm:inline text-[11px] font-medium text-zinc-300">
                  {neonConfig.isEnabled ? 'Nuvem Ativa' : 'Local'}
                </span>
                {gameState.connected && (
                  <span className="hidden lg:inline text-[10px] text-emerald-400 font-semibold border-l border-zinc-700 pl-1.5">
                    🎮 Jogo Conectado
                  </span>
                )}
              </div>

              {/* Botão de Configurações / Nuvem */}
              <button
                onClick={onOpenNeonModal}
                title="Configurações & Conexão com Nuvem"
                className="p-2 rounded-xl text-zinc-400 hover:text-white bg-sheikah-card/60 hover:bg-sheikah-card border border-sheikah-border hover:border-zinc-600 transition-all active:scale-95"
                aria-label="Configurações de Nuvem"
              >
                <Settings className="w-4 h-4" />
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* ================= BOTTOM NAVIGATION BAR (DOCK MÓVEL / APP STYLE) ================= */}
      {/* Barra de navegação inferior estilo Switch Online / Sheikah Slate */}
      <nav 
        aria-label="Navegação Principal Móvel"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-sheikah-darkest/95 backdrop-blur-2xl border-t border-sheikah-border/80 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.8)] pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      >
        <div className="grid grid-cols-6 h-14 max-w-md mx-auto px-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center justify-center py-1 transition-all active:scale-90 ${
                  isActive ? 'text-sheikah-gold' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {/* Indicador de Barra Superior Ativa Sheikah */}
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2.5px] bg-sheikah-gold shadow-[0_0_8px_#f59e0b] rounded-full" />
                )}

                <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-sheikah-gold drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'text-zinc-400'}`} />
                </div>

                <span className={`text-[9px] font-semibold tracking-tight transition-colors ${
                  isActive ? 'text-sheikah-gold' : 'text-zinc-400'
                }`}>
                  {tab.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
