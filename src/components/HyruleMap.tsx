import React, { useState, useRef } from 'react';
import { Bug, Heart, Map as MapIcon, CheckCircle2, Sparkles, Compass, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { SkulltulaItem, HeartPieceItem } from '../types';

interface HyruleMapProps {
  skulltulas: SkulltulaItem[];
  collectedSkulltulaIds: number[];
  onToggleSkulltula: (id: number) => void;
  heartPieces: HeartPieceItem[];
  collectedHeartIds: number[];
  onToggleHeartPiece: (id: number) => void;
}

interface MapZone {
  id: string;
  label: string;
  subtitle: string;
  regions: string[];
  x: number; // % on map
  y: number; // % on map
}

const MAP_ZONES: MapZone[] = [
  {
    id: 'death-mountain',
    label: 'Montanha da Morte',
    subtitle: 'Goron City, Trilha, Cratera, Dodongo & Fire Temple',
    regions: ['Death Mountain Trail', 'Goron City', 'Death Mountain Crater', 'Dodongos Cavern', 'Fire Temple'],
    x: 72,
    y: 16
  },
  {
    id: 'castle-market',
    label: 'Castelo & Mercado',
    subtitle: 'Market, Hyrule Castle & Outside Ganon Castle',
    regions: ['Market', 'Hyrule Castle', 'Outside Ganon Castle'],
    x: 48,
    y: 22
  },
  {
    id: 'kakariko',
    label: 'Kakariko & Cemitério',
    subtitle: 'Kakariko, Graveyard, Poço & Shadow Temple',
    regions: ['Kakariko Village', 'Graveyard', 'Bottom of the Well', 'Shadow Temple'],
    x: 68,
    y: 35
  },
  {
    id: 'zora',
    label: 'Domínio Zora',
    subtitle: 'Zora River, Domain, Fountain, Jabu-Jabu & Ice Cavern',
    regions: ['Zoras River', 'Zoras Domain', 'Zoras Fountain', 'Inside Jabu-Jabu', 'Ice Cavern'],
    x: 84,
    y: 48
  },
  {
    id: 'gerudo',
    label: 'Deserto & Vale Gerudo',
    subtitle: 'Gerudo Valley, Fortress, Wasteland, Colossus & Spirit Temple',
    regions: ['Gerudo Valley', 'Gerudo Fortress', 'Haunted Wasteland', 'Desert Colossus', 'Spirit Temple'],
    x: 16,
    y: 46
  },
  {
    id: 'hyrule-field',
    label: 'Planície & Rancho',
    subtitle: 'Hyrule Field & Lon Lon Ranch',
    regions: ['Hyrule Field', 'Lon Lon Ranch'],
    x: 46,
    y: 48
  },
  {
    id: 'lost-woods',
    label: 'Floresta Kokiri',
    subtitle: 'Kokiri Forest, Deku Tree, Lost Woods & Forest Temple',
    regions: ['Kokiri Forest', 'Inside the Deku Tree', 'Lost Woods', 'Sacred Forest Meadow', 'Forest Temple'],
    x: 76,
    y: 74
  },
  {
    id: 'lake-hylia',
    label: 'Lago Hylia',
    subtitle: 'Lake Hylia & Water Temple',
    regions: ['Lake Hylia', 'Water Temple'],
    x: 34,
    y: 78
  }
];

export const HyruleMap: React.FC<HyruleMapProps> = ({
  skulltulas,
  collectedSkulltulaIds,
  onToggleSkulltula,
  heartPieces,
  collectedHeartIds,
  onToggleHeartPiece
}) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>('death-mountain');
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragRef = useRef<{ active: boolean; startX: number; startY: number; origX: number; origY: number }>({
    active: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0
  });

  const handleZoom = (delta: number) => {
    setZoom((prev) => {
      const next = Math.min(2.2, Math.max(1, Number((prev + delta).toFixed(2))));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const totalItems = skulltulas.length + heartPieces.length;
  const totalCollected = collectedSkulltulaIds.length + collectedHeartIds.length;
  const totalPercent = totalItems > 0 ? Math.round((totalCollected / totalItems) * 100) : 0;

  const getZoneStats = (zone: MapZone) => {
    const zSkulltulas = skulltulas.filter((s) => zone.regions.includes(s.region));
    const zHearts = heartPieces.filter((h) => zone.regions.includes(h.region));
    const collectedS = zSkulltulas.filter((s) => collectedSkulltulaIds.includes(s.id)).length;
    const collectedH = zHearts.filter((h) => collectedHeartIds.includes(h.id)).length;
    const isComplete =
      zSkulltulas.length + zHearts.length > 0 &&
      collectedS === zSkulltulas.length &&
      collectedH === zHearts.length;
    return { zSkulltulas, zHearts, collectedS, collectedH, isComplete };
  };

  const selectedZone = MAP_ZONES.find((z) => z.id === selectedZoneId) || MAP_ZONES[0];
  const selectedStats = getZoneStats(selectedZone);

  return (
    <div className="space-y-6">
      {/* Cabeçalho estilo Mapa Oficial */}
      <div className="bg-gradient-to-b from-[#2c2115] to-[#17120c] border border-[#c8a962]/40 p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#c8a962] font-semibold">
              The Legend of Zelda: Ocarina of Time
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-hylian flex items-center gap-2 mt-0.5">
              <MapIcon className="w-5 h-5 text-[#e2c779]" />
              <span>Mapa Interativo de Hyrule</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Toque em qualquer região no pergaminho para ver Skulltulas e Peças de Coração pendentes.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-black/40 border border-[#c8a962]/30 rounded-xl px-4 py-2.5">
            <Compass className="w-5 h-5 text-[#e2c779]" />
            <div>
              <div className="text-[11px] text-gray-400">Total concluído</div>
              <div className="text-lg font-bold text-[#f0d98c] font-mono">{totalPercent}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa Ilustrado + Painel Lateral */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pergaminho Interativo com Zoom e Pan */}
        <div
          className="lg:col-span-7 relative rounded-2xl border-2 border-[#c8a962]/70 bg-[#1a140e] overflow-hidden shadow-2xl aspect-[4/3] select-none cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => {
            if ((e.target as HTMLElement).closest('button')) return;
            dragRef.current = {
              active: true,
              startX: e.clientX,
              startY: e.clientY,
              origX: pan.x,
              origY: pan.y
            };
          }}
          onPointerMove={(e) => {
            if (!dragRef.current.active || zoom <= 1) return;
            const dx = e.clientX - dragRef.current.startX;
            const dy = e.clientY - dragRef.current.startY;
            setPan({
              x: Math.max(-220, Math.min(220, dragRef.current.origX + dx)),
              y: Math.max(-160, Math.min(160, dragRef.current.origY + dy))
            });
          }}
          onPointerUp={() => {
            dragRef.current.active = false;
          }}
          onPointerLeave={() => {
            dragRef.current.active = false;
          }}
        >
          {/* Controles de Zoom */}
          <div className="absolute top-3 right-3 z-30 flex items-center gap-1 bg-[#17120c]/90 border border-[#c8a962]/50 rounded-xl p-1 shadow-lg backdrop-blur-sm">
            <button
              type="button"
              onClick={() => handleZoom(0.3)}
              title="Aproximar"
              className="p-1.5 rounded-lg text-[#f0d98c] hover:bg-[#c8a962]/20 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleZoom(-0.3)}
              title="Afastar"
              className="p-1.5 rounded-lg text-[#f0d98c] hover:bg-[#c8a962]/20 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            {zoom > 1 && (
              <button
                type="button"
                onClick={handleResetView}
                title="Resetar visão"
                className="p-1.5 rounded-lg text-gray-300 hover:bg-[#c8a962]/20 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Camada transformável (Mapa + Pins) */}
          <div
            className="relative w-full h-full transition-transform duration-150 ease-out"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center'
            }}
          >
            <img
              src="/images/hyrule-map.jpg"
              alt="Mapa Ilustrado de Hyrule"
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />

            {/* Pins Clicáveis das Regiões */}
            {MAP_ZONES.map((zone) => {
              const stats = getZoneStats(zone);
              const isSelected = zone.id === selectedZoneId;
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setSelectedZoneId(zone.id)}
                  style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none transition-transform duration-200 ${
                    isSelected ? 'scale-110 z-20' : 'hover:scale-105 z-10'
                  }`}
                >
                  <div
                    className={`px-2.5 py-1.5 rounded-lg border-2 shadow-lg backdrop-blur-sm transition-colors ${
                      isSelected
                        ? 'bg-[#1a140e]/95 border-[#f0d98c] ring-2 ring-[#f0d98c]/40'
                        : stats.isComplete
                        ? 'bg-emerald-950/90 border-emerald-400/80'
                        : 'bg-[#1a140e]/85 border-[#c8a962]/80 hover:border-[#f0d98c]'
                    }`}
                  >
                    <div className="text-[11px] sm:text-xs font-bold text-[#f7ebd0] whitespace-nowrap leading-tight">
                      {zone.label}
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-1 text-[10px] font-mono font-semibold">
                      <span className="flex items-center gap-0.5 text-[#e2c779]">
                        <Bug className="w-3 h-3" />
                        {stats.collectedS}/{stats.zSkulltulas.length}
                      </span>
                      {stats.zHearts.length > 0 && (
                        <span className="flex items-center gap-0.5 text-red-400">
                          <Heart className="w-3 h-3 fill-red-400" />
                          {stats.collectedH}/{stats.zHearts.length}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Painel de Detalhes da Região Selecionada */}
        <div className="lg:col-span-5 bg-[#17130e] border border-[#c8a962]/40 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="border-b border-[#c8a962]/20 pb-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-[#f0d98c] font-hylian">{selectedZone.label}</h3>
              {selectedStats.isComplete && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <Sparkles className="w-3 h-3" />
                  100%
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{selectedZone.subtitle}</p>
          </div>

          <div className="space-y-4 max-h-[430px] overflow-y-auto pr-1">
            {/* Skulltulas da Região */}
            {selectedStats.zSkulltulas.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#e2c779] mb-2 flex items-center gap-1.5">
                  <Bug className="w-3.5 h-3.5" />
                  <span>Skulltulas ({selectedStats.collectedS}/{selectedStats.zSkulltulas.length})</span>
                </h4>
                <div className="space-y-2">
                  {selectedStats.zSkulltulas.map((item) => {
                    const collected = collectedSkulltulaIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onToggleSkulltula(item.id)}
                        className={`w-full text-left p-3 min-h-[44px] rounded-xl border transition-all flex items-start gap-2.5 ${
                          collected
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-gray-400'
                            : 'bg-sheikah-card/60 border-sheikah-border hover:border-[#c8a962]/60 text-gray-200'
                        }`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            collected ? 'text-emerald-400' : 'text-zinc-600'
                          }`}
                        />
                        <div className="text-xs leading-snug">
                          <span className="font-semibold text-[#e2c779] mr-1.5">[{item.region}]</span>
                          <span className={collected ? 'line-through' : ''}>{item.location}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Peças de Coração da Região */}
            {selectedStats.zHearts.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-red-400" />
                  <span>Peças de Coração ({selectedStats.collectedH}/{selectedStats.zHearts.length})</span>
                </h4>
                <div className="space-y-2">
                  {selectedStats.zHearts.map((item) => {
                    const collected = collectedHeartIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onToggleHeartPiece(item.id)}
                        className={`w-full text-left p-3 min-h-[44px] rounded-xl border transition-all flex items-start gap-2.5 ${
                          collected
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-gray-400'
                            : 'bg-sheikah-card/60 border-sheikah-border hover:border-red-400/50 text-gray-200'
                        }`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            collected ? 'text-emerald-400' : 'text-zinc-600'
                          }`}
                        />
                        <div className="text-xs leading-snug">
                          <span className="font-semibold text-red-300 mr-1.5">[{item.region}]</span>
                          <span className={collected ? 'line-through' : ''}>{item.location}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
