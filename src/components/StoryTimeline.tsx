import React from 'react';
import { CheckCircle2, Circle, Sparkles, Sword, Shield, Award } from 'lucide-react';
import { StoryMilestone } from '../types';

interface StoryTimelineProps {
  milestones: StoryMilestone[];
  completedEventKeys: string[];
  onToggle: (key: string) => void;
}

export const StoryTimeline: React.FC<StoryTimelineProps> = ({
  milestones,
  completedEventKeys,
  onToggle
}) => {
  const childEvents = milestones.filter(m => m.category === 'child');
  const adultEvents = milestones.filter(m => m.category === 'adult');

  const totalCompleted = completedEventKeys.length;
  const progressPercent = Math.round((totalCompleted / milestones.length) * 100);

  return (
    <div className="space-y-8">
      
      {/* Banner estilo Today's Record */}
      <div className="bg-gradient-to-b from-[#2c2115] to-[#17120c] border border-[#c8a962]/40 p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#c8a962] font-semibold">
              The Legend of Zelda: Ocarina of Time
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-hylian flex items-center gap-2 mt-0.5">
              <Sparkles className="w-5 h-5 text-[#e2c779]" />
              <span>Linha do Tempo da Lenda de Hyrule</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              A trajetória do Herói do Tempo através das Eras da Criança e do Adulto.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-gray-400 font-medium">Progresso da História</span>
            <div className="text-2xl font-black text-sheikah-gold">
              {totalCompleted} <span className="text-sm text-gray-400">/ {milestones.length} ({progressPercent}%)</span>
            </div>
          </div>
        </div>

        <div className="mt-4 w-full bg-sheikah-darkest rounded-full h-2.5 overflow-hidden border border-sheikah-border/60">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-sheikah-gold h-2.5 rounded-full transition-all duration-500 shadow-glow-green"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 1. Era da Criança */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-600/40">
            Parte 1: A Era da Criança (As 3 Pedras Espirituais)
          </span>
        </div>

        <div className="relative border-l-2 border-emerald-500/30 ml-4 sm:ml-6 pl-4 sm:pl-6 space-y-6">
          {childEvents.map((event) => {
            const isDone = completedEventKeys.includes(event.key);
            return (
              <div 
                key={event.key}
                onClick={() => onToggle(event.key)}
                className={`relative cursor-pointer p-4 rounded-xl border transition-all select-none ${
                  isDone 
                    ? 'bg-sheikah-card border-emerald-500/50 shadow-glow-green/20' 
                    : 'bg-sheikah-darkest/60 border-sheikah-border/60 opacity-80'
                }`}
              >
                {/* Marcador na Linha do Tempo */}
                <div className={`absolute -left-[25px] sm:-left-[33px] top-5 w-4 h-4 rounded-full border-2 transition-all ${
                  isDone 
                    ? 'bg-emerald-400 border-white shadow-glow-green' 
                    : 'bg-sheikah-darkest border-zinc-600'
                }`} />

                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-sheikah-gold">#{event.order}</span>
                    <h3 className={`font-bold text-base font-hylian ${isDone ? 'text-white' : 'text-gray-300'}`}>
                      {event.title}
                    </h3>
                  </div>

                  <button className="flex-shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-600" />
                    )}
                  </button>
                </div>

                <p className={`text-xs mt-2 leading-relaxed ${isDone ? 'text-gray-200' : 'text-gray-400'}`}>
                  {event.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Era Adulta */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-600/40">
            Parte 2: A Era Adulta (O Despertar dos 6 Sábios)
          </span>
        </div>

        <div className="relative border-l-2 border-sheikah-gold/30 ml-4 sm:ml-6 pl-4 sm:pl-6 space-y-6">
          {adultEvents.map((event) => {
            const isDone = completedEventKeys.includes(event.key);
            return (
              <div 
                key={event.key}
                onClick={() => onToggle(event.key)}
                className={`relative cursor-pointer p-4 rounded-xl border transition-all select-none ${
                  isDone 
                    ? 'bg-sheikah-card border-sheikah-gold/50 shadow-glow-gold/20' 
                    : 'bg-sheikah-darkest/60 border-sheikah-border/60 opacity-80'
                }`}
              >
                {/* Marcador na Linha do Tempo */}
                <div className={`absolute -left-[25px] sm:-left-[33px] top-5 w-4 h-4 rounded-full border-2 transition-all ${
                  isDone 
                    ? 'bg-sheikah-gold border-white shadow-glow-gold' 
                    : 'bg-sheikah-darkest border-zinc-600'
                }`} />

                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-sheikah-gold">#{event.order}</span>
                    <h3 className={`font-bold text-base font-hylian ${isDone ? 'text-white' : 'text-gray-300'}`}>
                      {event.title}
                    </h3>
                  </div>

                  <button className="flex-shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-600" />
                    )}
                  </button>
                </div>

                <p className={`text-xs mt-2 leading-relaxed ${isDone ? 'text-gray-200' : 'text-gray-400'}`}>
                  {event.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

