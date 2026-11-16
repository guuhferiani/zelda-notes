import React, { useState, useMemo, useEffect } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { StoryMilestone } from '../types';

interface StoryTimelineProps {
  milestones: StoryMilestone[];
  completedEventKeys: string[];
  onToggle: (key: string) => void;
}

type EraFilter = 'all' | 'child' | 'adult';

export const StoryTimeline: React.FC<StoryTimelineProps> = ({
  milestones,
  completedEventKeys,
  onToggle,
}) => {
  const [eraFilter, setEraFilter] = useState<EraFilter>('all');
  const [hideFuture, setHideFuture] = useState<boolean>(false);

  // Encontra o índice da próxima missão ativa (primeira não concluída)
  const firstPendingOrder = useMemo(() => {
    const pending = milestones.find((m) => !completedEventKeys.includes(m.key));
    return pending ? pending.order : milestones.length + 1;
  }, [milestones, completedEventKeys]);

  // Seleciona inicialmente a missão ativa atual (ou a primeira)
  const [selectedKey, setSelectedKey] = useState<string>(() => {
    const firstPending = milestones.find((m) => !completedEventKeys.includes(m.key));
    return firstPending?.key ?? milestones[0]?.key ?? '';
  });

  const filteredMilestones = useMemo(() => {
    if (eraFilter === 'all') return milestones;
    return milestones.filter((m) => m.category === eraFilter);
  }, [milestones, eraFilter]);

  useEffect(() => {
    if (
      filteredMilestones.length > 0 &&
      !filteredMilestones.some((m) => m.key === selectedKey)
    ) {
      setSelectedKey(filteredMilestones[0].key);
    }
  }, [filteredMilestones, selectedKey]);

  const selectedMilestone =
    filteredMilestones.find((m) => m.key === selectedKey) ??
    filteredMilestones[0] ??
    milestones[0];

  const selectedIndex = filteredMilestones.findIndex(
    (m) => m.key === selectedMilestone?.key
  );

  const totalCompleted = completedEventKeys.length;
  const progressPercent = Math.round((totalCompleted / milestones.length) * 100);

  const isSelectedDone = selectedMilestone
    ? completedEventKeys.includes(selectedMilestone.key)
    : false;
  const isSelectedActive =
    selectedMilestone &&
    !isSelectedDone &&
    selectedMilestone.order === firstPendingOrder;
  const isSelectedMystery =
    hideFuture &&
    selectedMilestone &&
    !isSelectedDone &&
    selectedMilestone.order > firstPendingOrder;

  const renderObjectiveText = (milestone: StoryMilestone) => {
    const text = milestone.objective || milestone.description;
    const highlight = milestone.objectiveHighlight;
    if (!highlight || !text.includes(highlight)) {
      return <span>{text}</span>;
    }
    const parts = text.split(highlight);
    return (
      <>
        {parts[0]}
        <span className="text-[#f97316] font-semibold">{highlight}</span>
        {parts.slice(1).join(highlight)}
      </>
    );
  };

  return (
    <div className="space-y-5">
      {/* Cabeçalho superior estilo Trama do Tempo */}
      <div className="bg-gradient-to-b from-[#2c2115] to-[#17120c] border border-[#c8a962]/40 p-5 sm:p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#c8a962] font-semibold">
              The Legend of Zelda: Ocarina of Time
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-hylian flex items-center gap-2 mt-0.5">
              <Sparkles className="w-5 h-5 text-[#e2c779]" />
              <span>Trama do Tempo</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Acompanhe os capítulos da jornada do Herói do Tempo e marque seu progresso.
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="text-left sm:text-right">
              <span className="text-xs text-gray-400 font-medium">
                Capítulos Concluídos
              </span>
              <div className="text-2xl font-black text-sheikah-gold">
                {totalCompleted}{' '}
                <span className="text-sm text-gray-400">
                  / {milestones.length} ({progressPercent}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de progresso + filtros de Era e Spoiler */}
        <div className="mt-4 w-full bg-sheikah-darkest rounded-full h-2 overflow-hidden border border-[#c8a962]/25">
          <div
            className="bg-gradient-to-r from-amber-600 via-[#e2c779] to-emerald-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-[#c8a962]/25">
            {(
              [
                { id: 'all', label: 'Todos' },
                { id: 'child', label: 'Era da Criança' },
                { id: 'adult', label: 'Era Adulta' },
              ] as { id: EraFilter; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setEraFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  eraFilter === tab.id
                    ? 'bg-[#c8a962] text-[#17120c] shadow'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setHideFuture((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              hideFuture
                ? 'bg-amber-950/60 text-[#e2c779] border-[#c8a962]/50'
                : 'bg-black/35 text-gray-300 border-[#c8a962]/20 hover:text-white'
            }`}
            title="Ocultar capítulos futuros como ??? igual ao menu do jogo"
          >
            {hideFuture ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
            <span>{hideFuture ? 'Futuros Ocultos (???)' : 'Modo Spoiler Livre'}</span>
          </button>
        </div>
      </div>

      {/* Painel Principal Estilo Menu "Trama do Tempo" do Jogo */}
      <div className="relative rounded-2xl overflow-hidden border border-[#c8a962]/45 bg-gradient-to-b from-[#17100a] via-[#100b07] to-[#0a0704] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {/* Borda ornamental superior estilo pergaminho/madeira do jogo */}
        <div className="h-2.5 w-full bg-gradient-to-r from-[#3a2815] via-[#7c5c32] to-[#3a2815] border-b border-[#c8a962]/40 relative">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(circle at 12px 0, #c8a962 2px, transparent 2.5px)',
              backgroundSize: '24px 10px',
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
          {/* Coluna Esquerda: Lista Vertical de Capítulos */}
          <aside className="lg:col-span-5 xl:col-span-4 border-b lg:border-b-0 lg:border-r border-[#c8a962]/25 bg-black/25 max-h-[320px] lg:max-h-[560px] overflow-y-auto divide-y divide-[#c8a962]/15">
            {filteredMilestones.map((item) => {
              const isDone = completedEventKeys.includes(item.key);
              const isActive = !isDone && item.order === firstPendingOrder;
              const isSelected = selectedMilestone?.key === item.key;
              const isMystery =
                hideFuture && !isDone && item.order > firstPendingOrder;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSelectedKey(item.key)}
                  className={`w-full text-left px-4 py-3.5 min-h-[48px] flex items-center justify-between gap-3 transition-all relative ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#2c466b]/90 via-[#1d2e47]/65 to-transparent border-l-[3px] border-l-white text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                      : 'hover:bg-white/[0.04] border-l-[3px] border-l-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Indicador Losango (◆) ou Check */}
                    <span className="w-4 flex items-center justify-center shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isActive || isSelected ? (
                        <span
                          className={`w-2.5 h-2.5 rotate-45 inline-block ${
                            isActive
                              ? 'bg-[#f97316] shadow-[0_0_8px_#f97316] ring-1 ring-amber-200/80'
                              : 'bg-[#e2c779]/80'
                          }`}
                        />
                      ) : (
                        <span className="w-1.5 h-1.5 rotate-45 bg-[#c8a962]/30 inline-block" />
                      )}
                    </span>

                    <span
                      className={`text-sm font-medium truncate ${
                        isMystery
                          ? 'text-zinc-500 font-mono tracking-widest'
                          : isSelected
                          ? 'text-white font-semibold'
                          : isDone
                          ? 'text-[#cfc4ad]'
                          : 'text-[#e5dcc9]'
                      }`}
                    >
                      {isMystery ? '???' : item.title}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-[#c8a962]/60 shrink-0">
                    #{item.order}
                  </span>
                </button>
              );
            })}
          </aside>

          {/* Coluna Direita: Detalhes do Capítulo + Tapeçaria de Fundo */}
          {selectedMilestone && (
            <section className="lg:col-span-7 xl:col-span-8 relative p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-hidden">
              {/* Tapeçaria sutil ao fundo direito (estilo arte do jogo) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 w-full sm:w-3/4 opacity-[0.16]"
                style={{
                  backgroundImage: "url('/images/hyrule-map.jpg')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center right',
                  filter: 'sepia(75%) saturate(130%) contrast(105%)',
                  maskImage:
                    'radial-gradient(ellipse at 82% 55%, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 75%)',
                  WebkitMaskImage:
                    'radial-gradient(ellipse at 82% 55%, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 75%)',
                }}
              />

              <div className="relative z-10 max-w-xl">
                {/* Etiqueta da Era e Status */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-[#c8a962]/15 text-[#e2c779] border border-[#c8a962]/30">
                    {selectedMilestone.category === 'child'
                      ? 'Era da Criança'
                      : 'Era Adulta'}
                  </span>
                  {isSelectedDone ? (
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                      ✓ Concluída
                    </span>
                  ) : isSelectedActive ? (
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-orange-950/80 text-orange-300 border border-orange-500/40">
                      ◆ Objetivo Atual
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-900/80 text-zinc-400 border border-zinc-700/60">
                      Pendente
                    </span>
                  )}
                </div>

                {/* Título do Capítulo (Hylian / Cinzel) */}
                <h3 className="font-hylian text-2xl sm:text-3xl font-bold text-white tracking-wide uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                  {isSelectedMystery ? '???' : selectedMilestone.title}
                </h3>

                {/* Narrativa */}
                <p className="mt-4 text-sm sm:text-[15px] text-[#e7dec8] leading-relaxed">
                  {isSelectedMystery
                    ? 'Avance na aventura para revelar os detalhes deste capítulo da Trama do Tempo.'
                    : selectedMilestone.description}
                </p>

                {/* Caixa de Objetivo (estilo ◆ Vá para a Montanha da Morte.) */}
                {!isSelectedMystery && (
                  <div className="mt-6 rounded-lg bg-black/50 border border-[#c8a962]/30 px-4 py-3.5 flex items-center gap-3 shadow-inner">
                    <span className="w-2.5 h-2.5 rotate-45 bg-[#f97316] shadow-[0_0_8px_#f97316] ring-1 ring-amber-200/80 shrink-0" />
                    <p className="text-sm text-[#f3ead8]">
                      {renderObjectiveText(selectedMilestone)}
                    </p>
                  </div>
                )}
              </div>

              {/* Barra inferior de ações e navegação */}
              <div className="relative z-10 mt-8 pt-4 border-t border-[#c8a962]/20 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onToggle(selectedMilestone.key)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all flex items-center gap-2 ${
                    isSelectedDone
                      ? 'bg-emerald-950/70 hover:bg-emerald-900/70 text-emerald-300 border-emerald-500/50'
                      : 'bg-[#c8a962] hover:bg-[#e2c779] text-[#17120c] border-[#f5e3a3] shadow-lg'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isSelectedDone
                      ? 'Capítulo Concluído (Desmarcar)'
                      : 'Marcar Capítulo como Concluído'}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={selectedIndex <= 0}
                    onClick={() =>
                      selectedIndex > 0 &&
                      setSelectedKey(filteredMilestones[selectedIndex - 1].key)
                    }
                    className="min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold bg-black/45 hover:bg-white/10 disabled:opacity-35 disabled:pointer-events-none text-gray-200 border border-[#c8a962]/25 flex items-center gap-1 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Anterior</span>
                  </button>
                  <button
                    type="button"
                    disabled={selectedIndex >= filteredMilestones.length - 1}
                    onClick={() =>
                      selectedIndex < filteredMilestones.length - 1 &&
                      setSelectedKey(filteredMilestones[selectedIndex + 1].key)
                    }
                    className="min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold bg-black/45 hover:bg-white/10 disabled:opacity-35 disabled:pointer-events-none text-gray-200 border border-[#c8a962]/25 flex items-center gap-1 transition-colors"
                  >
                    <span>Próximo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
