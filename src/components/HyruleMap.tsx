import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bug,
  Heart,
  Music,
  Flag,
  Map as MapIcon,
  CheckCircle2,
  Sparkles,
  Compass,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Moon,
  User,
  Eye,
  EyeOff,
  SlidersHorizontal
} from 'lucide-react';
import { SkulltulaItem, HeartPieceItem, OcarinaSong, StoryMilestone } from '../types';

interface HyruleMapProps {
  skulltulas: SkulltulaItem[];
  collectedSkulltulaIds: number[];
  onToggleSkulltula: (id: number) => void;
  heartPieces: HeartPieceItem[];
  collectedHeartIds: number[];
  onToggleHeartPiece: (id: number) => void;
  songs: OcarinaSong[];
  learnedSongIds: string[];
  onToggleSong: (songId: string) => void;
  milestones: StoryMilestone[];
  completedEventKeys: string[];
  onToggleEvent: (eventKey: string) => void;
}

interface MapZone {
  id: string;
  label: string;
  subtitle: string;
  regions: string[];
  songIds: string[];
  milestoneKeys: string[];
  x: number; // % on map
  y: number; // % on map
}

interface SubLandmark {
  id: string;
  zoneId: string;
  label: string;
  x: number;
  y: number;
}

type StatusFilter = 'all' | 'pending' | 'completed';

interface PinLayerVisibility {
  skulltulas: boolean;
  hearts: boolean;
  songs: boolean;
  milestones: boolean;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

const MAP_ZONES: MapZone[] = [
  {
    id: 'death-mountain',
    label: 'Montanha da Morte',
    subtitle: 'Goron City, Trilha, Cratera, Dodongo & Fire Temple',
    regions: ['Death Mountain Trail', 'Goron City', 'Death Mountain Crater', 'Dodongos Cavern', 'Fire Temple'],
    songIds: ['bolero-of-fire'],
    milestoneKeys: ['dodongos_cavern_cleared', 'fire_temple_cleared'],
    x: 72,
    y: 16
  },
  {
    id: 'castle-market',
    label: 'Castelo & Mercado',
    subtitle: 'Market, Hyrule Castle & Outside Ganon Castle',
    regions: ['Market', 'Hyrule Castle', 'Outside Ganon Castle'],
    songIds: ['zeldas-lullaby', 'song-of-time', 'prelude-of-light'],
    milestoneKeys: [
      'met_princess_zelda',
      'door_of_time_opened',
      'master_sword_drawn',
      'light_arrows_obtained',
      'ganon_castle_final_battle'
    ],
    x: 45,
    y: 22
  },
  {
    id: 'kakariko',
    label: 'Kakariko & Cemitério',
    subtitle: 'Kakariko, Graveyard, Poço & Shadow Temple',
    regions: ['Kakariko Village', 'Graveyard', 'Bottom of the Well', 'Shadow Temple'],
    songIds: ['suns-song', 'song-of-storms', 'nocturne-of-shadow'],
    milestoneKeys: ['bottom_of_well_lens', 'shadow_temple_cleared'],
    x: 68,
    y: 35
  },
  {
    id: 'zora',
    label: 'Domínio Zora',
    subtitle: 'Zora River, Domain, Fountain, Jabu-Jabu & Ice Cavern',
    regions: ['Zoras River', 'Zoras Domain', 'Zoras Fountain', 'Inside Jabu-Jabu', 'Ice Cavern'],
    songIds: ['serenade-of-water'],
    milestoneKeys: ['jabu_jabu_cleared', 'ice_cavern_iron_boots'],
    x: 84,
    y: 48
  },
  {
    id: 'gerudo',
    label: 'Deserto & Vale Gerudo',
    subtitle: 'Gerudo Valley, Fortress, Wasteland, Colossus & Spirit Temple',
    regions: ['Gerudo Valley', 'Gerudo Fortress', 'Haunted Wasteland', 'Desert Colossus', 'Spirit Temple'],
    songIds: ['requiem-of-spirit'],
    milestoneKeys: ['gerudo_fortress_rescued', 'spirit_temple_cleared'],
    x: 16,
    y: 46
  },
  {
    id: 'hyrule-field',
    label: 'Planície & Rancho',
    subtitle: 'Hyrule Field & Lon Lon Ranch',
    regions: ['Hyrule Field', 'Lon Lon Ranch'],
    songIds: ['eponas-song'],
    milestoneKeys: [],
    x: 46,
    y: 50
  },
  {
    id: 'lost-woods',
    label: 'Floresta Kokiri',
    subtitle: 'Kokiri Forest, Deku Tree, Lost Woods & Forest Temple',
    regions: ['Kokiri Forest', 'Inside the Deku Tree', 'Lost Woods', 'Sacred Forest Meadow', 'Forest Temple'],
    songIds: ['sarias-song', 'minuet-of-forest'],
    milestoneKeys: ['deku_tree_cleared', 'forest_temple_cleared'],
    x: 76,
    y: 74
  },
  {
    id: 'lake-hylia',
    label: 'Lago Hylia',
    subtitle: 'Lake Hylia & Water Temple',
    regions: ['Lake Hylia', 'Water Temple'],
    songIds: [],
    milestoneKeys: ['water_temple_cleared'],
    x: 32,
    y: 78
  }
];

// Marcos detalhados que aparecem ao aproximar o zoom (>= 160%)
const SUB_LANDMARKS: SubLandmark[] = [
  { id: 'temple-of-time', zoneId: 'castle-market', label: 'Templo do Tempo', x: 52, y: 26 },
  { id: 'lon-lon', zoneId: 'hyrule-field', label: 'Rancho Lon Lon', x: 48, y: 58 },
  { id: 'dodongo', zoneId: 'death-mountain', label: 'Caverna Dodongo', x: 73, y: 24 },
  { id: 'windmill', zoneId: 'kakariko', label: 'Moinho & Poço', x: 64, y: 31 },
  { id: 'zora-waterfall', zoneId: 'zora', label: 'Cachoeira Zora', x: 89, y: 42 },
  { id: 'deku-tree', zoneId: 'lost-woods', label: 'Grande Árvore Deku', x: 83, y: 80 },
  { id: 'water-temple', zoneId: 'lake-hylia', label: 'Ilha do Templo da Água', x: 25, y: 78 },
  { id: 'spirit-temple', zoneId: 'gerudo', label: 'Colosso do Deserto', x: 10, y: 56 }
];

function getAgeLabel(age: 'child' | 'adult' | 'both'): string {
  if (age === 'child') return 'Criança';
  if (age === 'adult') return 'Adulto';
  return 'Ambos';
}

export const HyruleMap: React.FC<HyruleMapProps> = ({
  skulltulas,
  collectedSkulltulaIds,
  onToggleSkulltula,
  heartPieces,
  collectedHeartIds,
  onToggleHeartPiece,
  songs,
  learnedSongIds,
  onToggleSong,
  milestones,
  completedEventKeys,
  onToggleEvent
}) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>('death-mountain');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [showPins, setShowPins] = useState<boolean>(true);
  const [hideCompletedZones, setHideCompletedZones] = useState<boolean>(false);
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  const [visibleLayers, setVisibleLayers] = useState<PinLayerVisibility>({
    skulltulas: true,
    hearts: true,
    songs: true,
    milestones: true
  });

  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const detailsPanelRef = useRef<HTMLDivElement>(null);
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef<number>(1);
  const dragRef = useRef<{ active: boolean; startX: number; startY: number; origX: number; origY: number }>({
    active: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0
  });

  // Limita o pan mantendo o pergaminho preenchido sem bordas vazias ao dar zoom
  const clampPan = useCallback((x: number, y: number, targetZoom: number) => {
    if (targetZoom <= 1 || !mapContainerRef.current) return { x: 0, y: 0 };
    const { width, height } = mapContainerRef.current.getBoundingClientRect();
    const maxX = ((targetZoom - 1) * width) / 2;
    const maxY = ((targetZoom - 1) * height) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y))
    };
  }, []);

  const applyZoom = useCallback(
    (nextZoom: number, focalPoint?: { clientX: number; clientY: number }) => {
      const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(nextZoom.toFixed(2))));
      if (focalPoint && mapContainerRef.current) {
        const rect = mapContainerRef.current.getBoundingClientRect();
        const offsetX = focalPoint.clientX - (rect.left + rect.width / 2);
        const offsetY = focalPoint.clientY - (rect.top + rect.height / 2);
        setZoom((prevZoom) => {
          const ratio = clamped / prevZoom;
          setPan((prevPan) =>
            clampPan(
              offsetX - (offsetX - prevPan.x) * ratio,
              offsetY - (offsetY - prevPan.y) * ratio,
              clamped
            )
          );
          return clamped;
        });
      } else {
        setZoom(clamped);
        setPan((prev) => clampPan(prev.x, prev.y, clamped));
      }
    },
    [clampPan]
  );

  // Zoom suave em direção ao ponteiro do mouse
  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.18 : 0.85;
      setZoom((prevZoom) => {
        const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number((prevZoom * factor).toFixed(2))));
        const rect = el.getBoundingClientRect();
        const offsetX = e.clientX - (rect.left + rect.width / 2);
        const offsetY = e.clientY - (rect.top + rect.height / 2);
        const ratio = next / prevZoom;
        setPan((prevPan) =>
          clampPan(
            offsetX - (offsetX - prevPan.x) * ratio,
            offsetY - (offsetY - prevPan.y) * ratio,
            next
          )
        );
        return next;
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [clampPan]);

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const focusMapPoint = useCallback(
    (xPct: number, yPct: number, minZoom: number) => {
      if (!mapContainerRef.current) return;
      const { width, height } = mapContainerRef.current.getBoundingClientRect();
      setZoom((prevZoom) => {
        const nextZoom = Math.max(prevZoom, minZoom);
        const targetX = ((50 - xPct) / 100) * width * nextZoom;
        const targetY = ((50 - yPct) / 100) * height * nextZoom;
        setPan(clampPan(targetX, targetY, nextZoom));
        return nextZoom;
      });
    },
    [clampPan]
  );

  const handleSelectZone = (
    zone: MapZone,
    scrollToDetails = false,
    customFocus?: { x: number; y: number; minZoom: number }
  ) => {
    setSelectedZoneId(zone.id);
    setShowFilterMenu(false);

    if (customFocus) {
      focusMapPoint(customFocus.x, customFocus.y, customFocus.minZoom);
    } else {
      focusMapPoint(zone.x, zone.y, 2);
    }

    if (scrollToDetails && window.innerWidth < 1024) {
      detailsPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[data-filter-menu]')) return;
    setShowFilterMenu(false);
    e.currentTarget.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 2) {
      const pts = Array.from(pointersRef.current.values());
      pinchStartDistRef.current = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchStartZoomRef.current = zoom;
      dragRef.current.active = false;
      setIsDragging(false);
      return;
    }

    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: pan.x,
      origY: pan.y
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 2 && pinchStartDistRef.current) {
      const pts = Array.from(pointersRef.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const scaleRatio = dist / pinchStartDistRef.current;
      applyZoom(pinchStartZoomRef.current * scaleRatio);
      return;
    }

    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPan(clampPan(dragRef.current.origX + dx, dragRef.current.origY + dy, zoom));
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) {
      pinchStartDistRef.current = null;
    }
    if (pointersRef.current.size === 0) {
      dragRef.current.active = false;
      setIsDragging(false);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[data-filter-menu]')) return;
    if (zoom > 1.2) {
      handleResetView();
      return;
    }
    applyZoom(2.2, { clientX: e.clientX, clientY: e.clientY });
  };

  const toggleLayer = (key: keyof PinLayerVisibility) => {
    setVisibleLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalItems = skulltulas.length + heartPieces.length + songs.length + milestones.length;
  const totalCollected =
    collectedSkulltulaIds.length +
    collectedHeartIds.length +
    learnedSongIds.length +
    completedEventKeys.length;
  const totalPercent = totalItems > 0 ? Math.round((totalCollected / totalItems) * 100) : 0;

  const getZoneStats = (zone: MapZone) => {
    const zSkulltulas = skulltulas.filter((s) => zone.regions.includes(s.region));
    const zHearts = heartPieces.filter((h) => zone.regions.includes(h.region));
    const zSongs = songs.filter((s) => zone.songIds.includes(s.id));
    const zMilestones = milestones.filter((m) => zone.milestoneKeys.includes(m.key));

    const collectedS = zSkulltulas.filter((s) => collectedSkulltulaIds.includes(s.id)).length;
    const collectedH = zHearts.filter((h) => collectedHeartIds.includes(h.id)).length;
    const learnedS = zSongs.filter((s) => learnedSongIds.includes(s.id)).length;
    const completedM = zMilestones.filter((m) => completedEventKeys.includes(m.key)).length;

    const totalInZone = zSkulltulas.length + zHearts.length + zSongs.length + zMilestones.length;
    const collectedInZone = collectedS + collectedH + learnedS + completedM;
    const isComplete = totalInZone > 0 && collectedInZone === totalInZone;

    return {
      zSkulltulas,
      zHearts,
      zSongs,
      zMilestones,
      collectedS,
      collectedH,
      learnedS,
      completedM,
      isComplete
    };
  };

  const selectedZone = MAP_ZONES.find((z) => z.id === selectedZoneId) || MAP_ZONES[0];
  const selectedStats = getZoneStats(selectedZone);

  const filterById = <T,>(items: T[], getId: (item: T) => string | number, completedSet: Set<string | number>) => {
    if (statusFilter === 'pending') return items.filter((i) => !completedSet.has(getId(i)));
    if (statusFilter === 'completed') return items.filter((i) => completedSet.has(getId(i)));
    return items;
  };

  const collectedSkulltulaSet = new Set<string | number>(collectedSkulltulaIds);
  const collectedHeartSet = new Set<string | number>(collectedHeartIds);
  const learnedSongSet = new Set<string | number>(learnedSongIds);
  const completedEventSet = new Set<string | number>(completedEventKeys);

  const visibleSkulltulas = filterById(selectedStats.zSkulltulas, (i) => i.id, collectedSkulltulaSet);
  const visibleHearts = filterById(selectedStats.zHearts, (i) => i.id, collectedHeartSet);
  const visibleSongs = filterById(selectedStats.zSongs, (i) => i.id, learnedSongSet);
  const visibleMilestones = filterById(selectedStats.zMilestones, (i) => i.key, completedEventSet);

  const showDetailedLandmarks = zoom >= 1.6;

  return (
    <div className="space-y-5">
      {/* Cabeçalho estilo Mapa Oficial */}
      <div className="bg-gradient-to-b from-[#2c2115] to-[#17120c] border border-[#c8a962]/40 p-5 sm:p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#c8a962] font-semibold">
              The Legend of Zelda: Ocarina of Time
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-hylian flex items-center gap-2 mt-0.5">
              <MapIcon className="w-5 h-5 text-[#e2c779]" />
              <span>Mapa Vivo de Hyrule</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Aproxime até 400% para revelar locais detalhados, arraste para explorar Hyrule e alterne entre Dia e Noite.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto bg-black/40 border border-[#c8a962]/30 rounded-xl px-4 py-2.5">
            <Compass className="w-5 h-5 text-[#e2c779]" />
            <div>
              <div className="text-[11px] text-gray-400">Total concluído</div>
              <div className="text-lg font-bold text-[#f0d98c] font-mono">{totalPercent}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra rápida de regiões */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {MAP_ZONES.map((zone) => {
          const stats = getZoneStats(zone);
          const isSelected = zone.id === selectedZoneId;
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => handleSelectZone(zone)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#c8a962]/20 border-[#f0d98c] text-[#f0d98c] shadow-[0_0_12px_rgba(240,217,140,0.2)]'
                  : stats.isComplete
                  ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                  : 'bg-[#17130e] border-[#c8a962]/30 text-zinc-300 hover:border-[#c8a962]/70'
              }`}
            >
              <span>{zone.label}</span>
              {stats.isComplete && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Mapa Ilustrado Vivo + Painel Lateral */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pergaminho Vivo com Zoom Profundo (até 400%), Nuvens e Atmosfera */}
        <div
          ref={mapContainerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onDoubleClick={handleDoubleClick}
          className="lg:col-span-7 relative rounded-2xl border-2 border-[#c8a962]/70 bg-[#1a140e] overflow-hidden shadow-2xl aspect-[4/3] select-none touch-none cursor-grab active:cursor-grabbing"
        >
          {/* Botão Dia / Noite no canto superior esquerdo */}
          <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 bg-[#17120c]/90 border border-[#c8a962]/50 rounded-xl p-1 shadow-lg backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setIsNightMode((prev) => !prev)}
              title={isNightMode ? 'Mudar para Dia' : 'Mudar para Noite'}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors ${
                isNightMode
                  ? 'bg-indigo-500/25 text-indigo-200'
                  : 'text-amber-300 hover:bg-[#c8a962]/15'
              }`}
            >
              {isNightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              <span>{isNightMode ? 'Noite' : 'Dia'}</span>
            </button>
          </div>

          {/* Controles de Visibilidade, Filtro e Zoom */}
          <div className="absolute top-3 right-3 z-30 flex flex-col items-end gap-2">
            <div className="flex items-center gap-1 bg-[#17120c]/90 border border-[#c8a962]/50 rounded-xl p-1 shadow-lg backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setShowPins((prev) => !prev)}
                title={showPins ? 'Ocultar marcadores do mapa' : 'Mostrar marcadores do mapa'}
                className={`p-1.5 rounded-lg transition-colors ${
                  showPins
                    ? 'text-[#f0d98c] hover:bg-[#c8a962]/20'
                    : 'bg-[#c8a962]/25 text-amber-200'
                }`}
              >
                {showPins ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setShowFilterMenu((prev) => !prev)}
                title="Filtrar ícones do mapa"
                className={`p-1.5 rounded-lg transition-colors ${
                  showFilterMenu
                    ? 'bg-[#c8a962]/25 text-amber-200'
                    : 'text-[#f0d98c] hover:bg-[#c8a962]/20'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>

              <span className="w-px h-4 bg-[#c8a962]/30 mx-0.5" />

              <button
                type="button"
                onClick={() => applyZoom(zoom * 1.3)}
                title="Aproximar"
                className="p-1.5 rounded-lg text-[#f0d98c] hover:bg-[#c8a962]/20 transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <span className="px-1 text-[11px] font-mono font-semibold text-[#e2c779] min-w-[40px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => applyZoom(zoom / 1.3)}
                title="Afastar"
                className="p-1.5 rounded-lg text-[#f0d98c] hover:bg-[#c8a962]/20 transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              {(zoom > 1 || pan.x !== 0 || pan.y !== 0) && (
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

            {/* Popover de Filtro de Camadas */}
            {showFilterMenu && (
              <div
                data-filter-menu
                className="w-56 rounded-xl bg-[#17120c]/95 border border-[#c8a962]/60 p-3 shadow-2xl backdrop-blur-md space-y-2 text-xs"
              >
                <div className="font-bold text-[#f0d98c] uppercase tracking-wider text-[10px] pb-1 border-b border-[#c8a962]/20">
                  Ícones no Mapa
                </div>
                {(
                  [
                    { key: 'skulltulas', label: 'Skulltulas', icon: Bug, color: 'text-[#e2c779]' },
                    { key: 'hearts', label: 'Peças de Coração', icon: Heart, color: 'text-red-400' },
                    { key: 'songs', label: 'Canções da Ocarina', icon: Music, color: 'text-sky-400' },
                    { key: 'milestones', label: 'Marcos da História', icon: Flag, color: 'text-emerald-400' }
                  ] as const
                ).map((item) => {
                  const Icon = item.icon;
                  const active = visibleLayers[item.key];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => toggleLayer(item.key)}
                      className="w-full flex items-center justify-between py-1 px-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <span className="flex items-center gap-2 text-zinc-200">
                        <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                        {item.label}
                      </span>
                      <span
                        className={`w-7 h-4 rounded-full p-0.5 transition-colors flex items-center ${
                          active ? 'bg-emerald-500/80 justify-end' : 'bg-zinc-700 justify-start'
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full bg-white shadow" />
                      </span>
                    </button>
                  );
                })}

                <div className="pt-1.5 border-t border-[#c8a962]/20">
                  <button
                    type="button"
                    onClick={() => setHideCompletedZones((prev) => !prev)}
                    className="w-full flex items-center justify-between py-1 px-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <span className="text-zinc-300">Ocultar regiões 100%</span>
                    <span
                      className={`w-7 h-4 rounded-full p-0.5 transition-colors flex items-center ${
                        hideCompletedZones ? 'bg-[#c8a962] justify-end' : 'bg-zinc-700 justify-start'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full bg-white shadow" />
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Camada transformável com profundidade e atmosfera viva */}
          <div
            className={`relative w-full h-full ${
              isDragging ? 'transition-none' : 'transition-transform duration-200 ease-out'
            }`}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center'
            }}
          >
            <img
              src="/images/hyrule-map.jpg"
              alt="Mapa Ilustrado de Hyrule"
              draggable={false}
              className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-500 ${
                isNightMode ? 'brightness-75 contrast-110 saturate-75 hue-rotate-[195deg]' : ''
              }`}
            />

            {/* Efeitos vivos sobre o mapa (vulcão, fadas, água e névoa de borda) */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Brilho vulcânico na Montanha da Morte */}
              <div
                className="absolute w-24 h-24 rounded-full bg-orange-500/20 blur-2xl animate-pulse"
                style={{ left: '72%', top: '8%', transform: 'translate(-50%, -50%)' }}
              />
              {/* Aura mágica / fadas na Floresta Kokiri */}
              <div
                className="absolute w-28 h-24 rounded-full bg-emerald-400/15 blur-2xl animate-pulse"
                style={{ left: '78%', top: '76%', transform: 'translate(-50%, -50%)' }}
              />
              {/* Reflexo suave no Lago Hylia */}
              <div
                className="absolute w-32 h-24 rounded-full bg-sky-400/10 blur-xl animate-pulse"
                style={{ left: '28%', top: '80%', transform: 'translate(-50%, -50%)' }}
              />
            </div>

            {/* Névoa suave nas bordas como no app oficial */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_45px_rgba(24,18,12,0.75)]" />

            {/* Sub-locais detalhados quando aproxima o zoom (>= 160%) */}
            {showPins &&
              showDetailedLandmarks &&
              SUB_LANDMARKS.map((lm) => {
                const parentZone = MAP_ZONES.find((z) => z.id === lm.zoneId);
                if (!parentZone) return null;
                return (
                  <button
                    key={lm.id}
                    type="button"
                    onClick={() =>
                      handleSelectZone(parentZone, true, { x: lm.x, y: lm.y, minZoom: 2.8 })
                    }
                    style={{ left: `${lm.x}%`, top: `${lm.y}%`, transform: `translate(-50%, -50%) scale(${1 / Math.sqrt(zoom)})` }}
                    className="absolute z-10 px-2 py-0.5 rounded bg-[#f5ecd0]/95 border border-[#78350f] text-[#2b1e0f] text-[9px] font-bold shadow-md hover:bg-white transition-all whitespace-nowrap"
                  >
                    {lm.label}
                  </button>
                );
              })}

            {/* Pins Clicáveis das Regiões (contra-escalam levemente para manter nitidez no zoom) */}
            {showPins &&
              MAP_ZONES.map((zone) => {
                const stats = getZoneStats(zone);
                if (hideCompletedZones && stats.isComplete) return null;

                const isSelected = zone.id === selectedZoneId;
                const hasAnyBadge =
                  (visibleLayers.skulltulas && stats.zSkulltulas.length > 0) ||
                  (visibleLayers.hearts && stats.zHearts.length > 0) ||
                  (visibleLayers.songs && stats.zSongs.length > 0) ||
                  (visibleLayers.milestones && stats.zMilestones.length > 0);

                const pinCounterScale = 1 / Math.pow(zoom, 0.55);

                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => handleSelectZone(zone, true)}
                    style={{
                      left: `${zone.x}%`,
                      top: `${zone.y}%`,
                      transform: `translate(-50%, -50%) scale(${pinCounterScale * (isSelected ? 1.08 : 1)})`
                    }}
                    className={`absolute group focus:outline-none transition-transform duration-200 ${
                      isSelected ? 'z-20' : 'hover:scale-105 z-10'
                    }`}
                  >
                    <div
                      className={`rounded-lg overflow-hidden shadow-[0_6px_16px_rgba(0,0,0,0.75)] border transition-colors ${
                        isSelected
                          ? 'border-[#fef08a] ring-2 ring-[#f0d98c]/50'
                          : stats.isComplete
                          ? 'border-emerald-400/80'
                          : 'border-[#c8a962]/85 group-hover:border-[#f0d98c]'
                      }`}
                    >
                      <div
                        className={`px-2 py-0.5 sm:px-2.5 text-[10px] sm:text-[11px] font-bold whitespace-nowrap leading-tight text-center ${
                          stats.isComplete
                            ? 'bg-emerald-900/95 text-emerald-100'
                            : 'bg-gradient-to-b from-[#efe0b9] to-[#d6be86] text-[#2b1e0f]'
                        }`}
                      >
                        {zone.label}
                      </div>

                      {hasAnyBadge && (
                        <div className="bg-[#120e0a]/95 px-2 py-1 flex items-center justify-center gap-2 text-[9px] sm:text-[10px] font-mono font-bold">
                          {visibleLayers.skulltulas && stats.zSkulltulas.length > 0 && (
                            <span className="flex items-center gap-0.5 text-[#facc15]">
                              <Bug className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              {stats.collectedS}/{stats.zSkulltulas.length}
                            </span>
                          )}
                          {visibleLayers.hearts && stats.zHearts.length > 0 && (
                            <span className="flex items-center gap-0.5 text-red-400">
                              <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-red-400" />
                              {stats.collectedH}/{stats.zHearts.length}
                            </span>
                          )}
                          {visibleLayers.songs && stats.zSongs.length > 0 && (
                            <span className="flex items-center gap-0.5 text-sky-400">
                              <Music className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              {stats.learnedS}/{stats.zSongs.length}
                            </span>
                          )}
                          {visibleLayers.milestones && stats.zMilestones.length > 0 && (
                            <span className="flex items-center gap-0.5 text-emerald-400">
                              <Flag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              {stats.completedM}/{stats.zMilestones.length}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Atalho rápido para voltar à visão geral de Hyrule quando ampliado */}
          {zoom > 1.2 && (
            <button
              type="button"
              onClick={handleResetView}
              className="absolute bottom-3 left-3 z-30 px-3 py-1.5 rounded-xl bg-[#17120c]/90 hover:bg-[#17120c] border border-[#c8a962]/60 text-[11px] font-semibold text-[#f0d98c] shadow-lg backdrop-blur-sm flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Visão Geral de Hyrule</span>
            </button>
          )}
        </div>

        {/* Painel de Detalhes da Região Selecionada */}
        <div
          ref={detailsPanelRef}
          className="lg:col-span-5 bg-[#17130e] border border-[#c8a962]/40 rounded-2xl p-5 space-y-4 shadow-xl"
        >
          <div className="border-b border-[#c8a962]/20 pb-3 space-y-3">
            <div>
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

            {/* Filtro rápido por status */}
            <div className="flex items-center gap-1.5 bg-black/35 p-1 rounded-xl border border-[#c8a962]/20">
              {([
                { id: 'all', label: 'Todos' },
                { id: 'pending', label: 'Pendentes' },
                { id: 'completed', label: 'Concluídos' }
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-colors ${
                    statusFilter === tab.id
                      ? 'bg-[#c8a962]/25 text-[#f0d98c] border border-[#c8a962]/40'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 max-h-[430px] overflow-y-auto pr-1">
            {visibleSkulltulas.length === 0 &&
              visibleHearts.length === 0 &&
              visibleSongs.length === 0 &&
              visibleMilestones.length === 0 && (
                <div className="text-center py-8 text-xs text-zinc-400 border border-dashed border-[#c8a962]/25 rounded-xl">
                  Nenhum item encontrado neste filtro para {selectedZone.label}.
                </div>
              )}

            {/* Skulltulas da Região */}
            {visibleSkulltulas.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#e2c779] mb-2 flex items-center gap-1.5">
                  <Bug className="w-3.5 h-3.5" />
                  <span>Skulltulas ({selectedStats.collectedS}/{selectedStats.zSkulltulas.length})</span>
                </h4>
                <div className="space-y-2">
                  {visibleSkulltulas.map((item) => {
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
                        <div className="flex-1 text-xs leading-snug space-y-1">
                          <div>
                            <span className="font-semibold text-[#e2c779] mr-1.5">[{item.region}]</span>
                            <span className={collected ? 'line-through' : ''}>{item.location}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-zinc-400">
                            {item.requirement && (
                              <span className="px-1.5 py-0.5 rounded bg-black/40 border border-zinc-700/60">
                                {item.requirement}
                              </span>
                            )}
                            {item.timeOfDay !== 'both' && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/40 border border-zinc-700/60">
                                {item.timeOfDay === 'night' ? (
                                  <Moon className="w-2.5 h-2.5 text-indigo-300" />
                                ) : (
                                  <Sun className="w-2.5 h-2.5 text-amber-300" />
                                )}
                                {item.timeOfDay === 'night' ? 'Noite' : 'Dia'}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/40 border border-zinc-700/60">
                              <User className="w-2.5 h-2.5 text-emerald-300" />
                              {getAgeLabel(item.linkAge)}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Peças de Coração da Região */}
            {visibleHearts.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-red-400" />
                  <span>Peças de Coração ({selectedStats.collectedH}/{selectedStats.zHearts.length})</span>
                </h4>
                <div className="space-y-2">
                  {visibleHearts.map((item) => {
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
                        <div className="flex-1 text-xs leading-snug space-y-1">
                          <div>
                            <span className="font-semibold text-red-300 mr-1.5">[{item.region}]</span>
                            <span className={collected ? 'line-through' : ''}>{item.location}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-zinc-400">
                            {item.requirement && (
                              <span className="px-1.5 py-0.5 rounded bg-black/40 border border-zinc-700/60">
                                {item.requirement}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/40 border border-zinc-700/60">
                              <User className="w-2.5 h-2.5 text-emerald-300" />
                              {getAgeLabel(item.linkAge)}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Canções da Região */}
            {visibleSongs.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5" />
                  <span>Canções da Ocarina ({selectedStats.learnedS}/{selectedStats.zSongs.length})</span>
                </h4>
                <div className="space-y-2">
                  {visibleSongs.map((song) => {
                    const learned = learnedSongIds.includes(song.id);
                    return (
                      <button
                        key={song.id}
                        type="button"
                        onClick={() => onToggleSong(song.id)}
                        className={`w-full text-left p-3 min-h-[44px] rounded-xl border transition-all flex items-start gap-2.5 ${
                          learned
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-gray-400'
                            : 'bg-sheikah-card/60 border-sheikah-border hover:border-sky-400/50 text-gray-200'
                        }`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            learned ? 'text-emerald-400' : 'text-zinc-600'
                          }`}
                        />
                        <div className="flex-1 text-xs leading-snug space-y-1">
                          <div className="font-semibold text-sky-300">
                            <span className={learned ? 'line-through' : ''}>{song.namePt}</span>
                            <span className="text-[10px] text-zinc-400 font-normal ml-1.5">({song.name})</span>
                          </div>
                          <p className="text-[11px] text-zinc-400">{song.location}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Marcos da História da Região */}
            {visibleMilestones.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                  <Flag className="w-3.5 h-3.5" />
                  <span>Marcos da História ({selectedStats.completedM}/{selectedStats.zMilestones.length})</span>
                </h4>
                <div className="space-y-2">
                  {visibleMilestones.map((milestone) => {
                    const completed = completedEventKeys.includes(milestone.key);
                    return (
                      <button
                        key={milestone.key}
                        type="button"
                        onClick={() => onToggleEvent(milestone.key)}
                        className={`w-full text-left p-3 min-h-[44px] rounded-xl border transition-all flex items-start gap-2.5 ${
                          completed
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-gray-400'
                            : 'bg-sheikah-card/60 border-sheikah-border hover:border-emerald-400/50 text-gray-200'
                        }`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            completed ? 'text-emerald-400' : 'text-zinc-600'
                          }`}
                        />
                        <div className="flex-1 text-xs leading-snug space-y-1">
                          <div className={`font-semibold text-emerald-300 ${completed ? 'line-through' : ''}`}>
                            {milestone.title}
                          </div>
                          <p className="text-[11px] text-zinc-400">{milestone.description}</p>
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
