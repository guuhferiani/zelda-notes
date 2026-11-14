import React, { useState } from 'react';
import { Heart, Search, CheckCircle2, Circle } from 'lucide-react';
import { HeartPieceItem } from '../types';

interface HeartTrackerProps {
  heartPieces: HeartPieceItem[];
  collectedIds: number[];
  onToggle: (id: number) => void;
}

export const HeartTracker: React.FC<HeartTrackerProps> = ({
  heartPieces,
  collectedIds,
  onToggle
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAge, setFilterAge] = useState<string>('all');

  const filtered = heartPieces.filter((h) => {
    const matchesAge = filterAge === 'all' || h.linkAge === 'both' || h.linkAge === filterAge;
    const matchesSearch = 
      h.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAge && matchesSearch;
  });

  const totalCollected = collectedIds.length;
  const completedContainers = Math.floor(totalCollected / 4);
  const remainingInCurrentContainer = totalCollected % 4;

  return (
    <div className="space-y-6">
      
      {/* Banner de Progresso dos Corações */}
      <div className="bg-gradient-to-b from-[#2c2115] to-[#17120c] border border-[#c8a962]/40 p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#c8a962] font-semibold">
              The Legend of Zelda: Ocarina of Time
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-hylian flex items-center gap-2 mt-0.5">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <span>Peças de Coração (36 Heart Pieces)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              A cada 4 peças coletadas, você forja um Contêiner de Coração (+1 coração permanente na vida máxima).
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-xs text-gray-400 font-medium">Contêineres Ganhos</span>
              <div className="text-xl font-bold text-red-400">+{completedContainers} Corações</div>
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-400 font-medium">Peças Coletadas</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">{totalCollected}</span>
                <span className="text-sm text-gray-400">/ 36</span>
              </div>
            </div>
          </div>
        </div>

        {/* Indicador do Próximo Contêiner (4 partes de um coração) */}
        <div className="mt-4 p-3 rounded-lg bg-sheikah-darkest/80 border border-sheikah-border/60 flex items-center justify-between">
          <span className="text-xs text-gray-300 font-medium">
            Progresso para o próximo Contêiner:
          </span>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((piece) => (
                <div 
                  key={piece}
                  className={`w-6 h-6 rounded flex items-center justify-center border text-xs font-bold transition-all ${
                    piece <= remainingInCurrentContainer
                      ? 'bg-red-500 text-white border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                      : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                  }`}
                >
                  {piece}/4
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Busca e Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por local ou missão do coração..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-sheikah-card border border-sheikah-border text-white text-xs focus:outline-none focus:border-sheikah-kokiri"
          />
        </div>

        <select
          value={filterAge}
          onChange={(e) => setFilterAge(e.target.value)}
          className="px-3 py-2 rounded-lg bg-sheikah-card border border-sheikah-border text-white text-xs focus:outline-none focus:border-sheikah-kokiri"
        >
          <option value="all">Todas as Idades</option>
          <option value="child">Link Criança</option>
          <option value="adult">Link Adulto</option>
        </select>
      </div>

      {/* Grid de Peças de Coração */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((item) => {
          const isDone = collectedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => onToggle(item.id)}
              className={`cursor-pointer p-4 min-h-[44px] rounded-xl border transition-all flex items-start gap-3 select-none ${
                isDone 
                  ? 'bg-sheikah-darkest/40 border-sheikah-border/40 opacity-70' 
                  : 'bg-sheikah-card border-sheikah-border hover:border-red-500/50 shadow-sm'
              }`}
            >
              <button className="mt-0.5 flex-shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                ) : (
                  <Circle className="w-5 h-5 text-zinc-500 hover:text-red-400" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-bold ${isDone ? 'text-gray-500' : 'text-red-400'}`}>
                      #{item.id.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs font-semibold text-gray-200">
                      {item.region} — {item.location}
                    </span>
                  </div>

                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {item.linkAge === 'both' ? 'Criança/Adulto' : item.linkAge}
                  </span>
                </div>

                <p className={`text-xs mt-1.5 ${isDone ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                  {item.description}
                </p>

                <div className="mt-2 text-[11px] text-sheikah-gold flex items-center gap-1">
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

