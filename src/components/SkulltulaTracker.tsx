import React, { useState } from 'react';
import { 
  Bug, 
  Search, 
  CheckCircle2, 
  Circle, 
  Sun, 
  Moon, 
  Sparkles,
  Filter
} from 'lucide-react';
import { SkulltulaItem } from '../types';

interface SkulltulaTrackerProps {
  skulltulas: SkulltulaItem[];
  collectedIds: number[];
  onToggle: (id: number) => void;
}

export const SkulltulaTracker: React.FC<SkulltulaTrackerProps> = ({
  skulltulas,
  collectedIds,
  onToggle
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [filterAge, setFilterAge] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all'); // 'all' | 'pending' | 'collected'
  const [searchTerm, setSearchTerm] = useState('');

  // Lista única de regiões
  const regions = ['all', ...Array.from(new Set(skulltulas.map(s => s.region)))];

  const filtered = skulltulas.filter((s) => {
    const isCollected = collectedIds.includes(s.id);
    const matchesRegion = selectedRegion === 'all' || s.region === selectedRegion;
    const matchesAge = filterAge === 'all' || s.linkAge === 'both' || s.linkAge === filterAge;
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'collected' && isCollected) || 
      (filterStatus === 'pending' && !isCollected);
    const matchesSearch = 
      s.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.requirement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.region.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesRegion && matchesAge && matchesStatus && matchesSearch;
  });

  const totalCollected = collectedIds.length;
  const progressPercent = Math.round((totalCollected / 100) * 100);

  return (
    <div className="space-y-6">
      
      {/* Banner de Progresso Geral */}
      <div className="bg-sheikah-card border border-sheikah-border p-5 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white font-hylian flex items-center gap-2">
              <Bug className="w-5 h-5 text-sheikah-gold" />
              <span>Rastreador de Skulltulas de Ouro (100%)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Guia completo com requisitos de itens, dia/noite e idade do Link para libertar a família de Kakariko.
            </p>
          </div>

          <div className="text-right flex items-center sm:flex-col sm:items-end justify-between">
            <span className="text-xs text-gray-400 font-medium">Tokens Coletados</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-sheikah-gold">{totalCollected}</span>
              <span className="text-sm text-gray-400">/ 100</span>
              <span className="text-xs font-semibold text-emerald-400 ml-2">({progressPercent}%)</span>
            </div>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="mt-4 w-full bg-sheikah-darkest rounded-full h-2.5 overflow-hidden border border-sheikah-border/60">
          <div 
            className="bg-gradient-to-r from-sheikah-gold to-emerald-400 h-2.5 rounded-full transition-all duration-500 shadow-glow-gold"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Controles e Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        
        {/* Campo de Busca */}
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por local ou item necessário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-sheikah-card border border-sheikah-border text-white text-xs focus:outline-none focus:border-sheikah-kokiri"
          />
        </div>

        {/* Filtro por Idade */}
        <div>
          <select
            value={filterAge}
            onChange={(e) => setFilterAge(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-sheikah-card border border-sheikah-border text-white text-xs focus:outline-none focus:border-sheikah-kokiri"
          >
            <option value="all">Todas as Idades</option>
            <option value="child">Link Criança</option>
            <option value="adult">Link Adulto</option>
          </select>
        </div>

        {/* Filtro por Status */}
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-sheikah-card border border-sheikah-border text-white text-xs focus:outline-none focus:border-sheikah-kokiri"
          >
            <option value="all">Todas (Pendentes e Coletadas)</option>
            <option value="pending">Apenas Pendentes</option>
            <option value="collected">Apenas Coletadas</option>
          </select>
        </div>

      </div>

      {/* Seletor de Região (Pills) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {regions.map((reg) => (
          <button
            key={reg}
            onClick={() => setSelectedRegion(reg)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              selectedRegion === reg
                ? 'bg-sheikah-gold text-sheikah-darkest font-bold shadow-glow-gold'
                : 'bg-sheikah-card text-gray-400 hover:text-white border border-sheikah-border/60'
            }`}
          >
            {reg === 'all' ? 'Todas as Regiões' : reg}
          </button>
        ))}
      </div>

      {/* Lista de Skulltulas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((item) => {
          const isDone = collectedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => onToggle(item.id)}
              className={`cursor-pointer p-3.5 min-h-[44px] rounded-xl border transition-all flex items-start gap-3 select-none ${
                isDone 
                  ? 'bg-sheikah-darkest/40 border-sheikah-border/40 opacity-70' 
                  : 'bg-sheikah-card border-sheikah-border hover:border-sheikah-gold/60 shadow-sm'
              }`}
            >
              {/* Checkbox Icon */}
              <button className="mt-0.5 flex-shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                ) : (
                  <Circle className="w-5 h-5 text-zinc-500 hover:text-sheikah-gold" />
                )}
              </button>

              {/* Informações da Skulltula */}
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-bold ${isDone ? 'text-gray-500' : 'text-sheikah-gold'}`}>
                      #{item.id.toString().padStart(3, '0')}
                    </span>
                    <span className="text-xs font-semibold text-gray-300">
                      {item.region}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px]">
                    {item.timeOfDay === 'night' && (
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                        <Moon className="w-2.5 h-2.5" /> Noite
                      </span>
                    )}
                    {item.timeOfDay === 'day' && (
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                        <Sun className="w-2.5 h-2.5" /> Dia
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase">
                      {item.linkAge === 'both' ? 'Criança/Adulto' : item.linkAge}
                    </span>
                  </div>
                </div>

                <p className={`text-xs mt-1.5 ${isDone ? 'text-gray-500 line-through' : 'text-gray-200 font-medium'}`}>
                  {item.location}
                </p>

                <div className="mt-2 text-[11px] text-sheikah-kokiri flex items-center gap-1">
                  <span className="text-gray-400 font-normal">Requisito:</span>
                  <span>{item.requirement}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

