import React from 'react';
import { 
  Scroll, 
  MapPin, 
  Heart, 
  Music, 
  Bug, 
  Database, 
  Radio, 
  Sparkles,
  ShieldAlert
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
    { id: 'dashboard', label: 'Painel', icon: Sparkles },
    { id: 'journal', label: 'Diário de Bordo', icon: Scroll },
    { id: 'skulltulas', label: 'Skulltulas (100)', icon: Bug },
    { id: 'hearts', label: 'Corações (36)', icon: Heart },
    { id: 'songs', label: 'Canções', icon: Music },
    { id: 'timeline', label: 'Linha do Tempo', icon: MapPin }
  ];

  return (
    <header className="sticky top-0 z-40 bg-sheikah-dark/95 backdrop-blur-md border-b border-sheikah-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Título */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sheikah-kokiri to-sheikah-card p-0.5 shadow-glow-green flex items-center justify-center">
              <img src="/icon.png" alt="Zelda Logo" className="w-full h-full object-cover rounded-[10px]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-hylian text-lg font-bold tracking-wider text-sheikah-gold uppercase">
                  Zelda Notes
                </span>
                <span className="text-[10px] uppercase font-semibold bg-sheikah-border px-1.5 py-0.5 rounded text-sheikah-kokiri border border-sheikah-kokiri/30">
                  Switch 2 & PC
                </span>
              </div>
              <p className="text-xs text-gray-400">Companion de Ocarina of Time</p>
            </div>
          </div>

          {/* Abas de Navegação (Desktop) */}
          <nav className="hidden md:flex space-x-1 lg:space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sheikah-card text-sheikah-gold border border-sheikah-gold/40 shadow-glow-gold'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-sheikah-card/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sheikah-gold' : 'text-gray-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Status de Conexão com Jogo & Neon DB */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Status do Jogo / Bridge */}
            <div 
              title={gameState.connected ? 'Conectado ao Hookshot / Jogo Local' : 'Bridge Local Offline (Modo Consulta)'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                gameState.connected 
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50' 
                  : 'bg-zinc-900 text-zinc-400 border-zinc-700/60'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${gameState.connected ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`} />
              <span className="hidden sm:inline">{gameState.connected ? 'Jogo Ao Vivo' : 'Modo Offline'}</span>
            </div>

            {/* Botão de Conexão Neon DB */}
            <button
              onClick={onOpenNeonModal}
              title={neonConfig.isEnabled ? 'Neon DB Conectado e Sincronizando' : 'Configurar Neon DB na Nuvem'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                neonConfig.isEnabled
                  ? 'bg-amber-950/50 text-amber-300 border-amber-500/50 hover:bg-amber-900/50 shadow-glow-gold'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-700/60 hover:text-zinc-200 hover:border-zinc-500'
              }`}
            >
              <Database className={`w-3.5 h-3.5 ${neonConfig.isEnabled ? 'text-amber-400' : 'text-zinc-400'}`} />
              <span className="hidden sm:inline">Neon DB</span>
            </button>

          </div>
        </div>

        {/* Abas Móveis (Mobile Scroll) */}
        <div className="md:hidden flex overflow-x-auto py-2 space-x-1 no-scrollbar border-t border-sheikah-border/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-sheikah-card text-sheikah-gold border border-sheikah-gold/40'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};

