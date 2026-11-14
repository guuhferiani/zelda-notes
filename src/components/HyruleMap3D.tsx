import React, { useMemo, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Sparkles as DreiSparkles } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Bug, Heart, Music, Flag } from 'lucide-react';

export interface Map3DZoneStats {
  id: string;
  label: string;
  x: number; // 0-100 %
  y: number; // 0-100 %
  skulltulasCollected: number;
  skulltulasTotal: number;
  heartsCollected: number;
  heartsTotal: number;
  songsLearned: number;
  songsTotal: number;
  milestonesCompleted: number;
  milestonesTotal: number;
  isComplete: boolean;
}

interface HyruleMap3DProps {
  zones: Map3DZoneStats[];
  selectedZoneId: string;
  onSelectZone: (zoneId: string) => void;
  showPins: boolean;
  hideCompletedZones: boolean;
  visibleLayers: {
    skulltulas: boolean;
    hearts: boolean;
    songs: boolean;
    milestones: boolean;
  };
  isNight: boolean;
  resetSignal: number;
}

const MAP_WIDTH = 12;
const MAP_DEPTH = 9;

// Converte coordenadas percentuais (0..100) do mapa para coordenadas 3D no plano
function percentToWorld(xPct: number, yPct: number): [number, number] {
  const wx = ((xPct - 50) / 100) * MAP_WIDTH;
  const wz = ((yPct - 50) / 100) * MAP_DEPTH;
  return [wx, wz];
}

// Calcula a altura do relevo 3D para cada ponto (xPct, yPct) de Hyrule
export function getTerrainHeight(xPct: number, yPct: number): number {
  const gaussian = (cx: number, cy: number, rx: number, ry: number, amp: number) => {
    const dx = (xPct - cx) / rx;
    const dy = (yPct - cy) / ry;
    return amp * Math.exp(-(dx * dx + dy * dy));
  };

  let h = 0.08;
  // Montanha da Morte (pico vulcânico alto ao nordeste)
  h += gaussian(76, 15, 16, 14, 1.35);
  // Cratera afundada no topo do vulcão
  h -= gaussian(77, 13, 4.5, 4, 0.35);
  // Cadeia de montanhas Zora / Leste
  h += gaussian(88, 38, 12, 18, 0.72);
  // Platô do Castelo de Hyrule
  h += gaussian(45, 20, 14, 10, 0.45);
  // Colina de Kakariko
  h += gaussian(68, 34, 11, 9, 0.38);
  // Cânions e platôs do Deserto Gerudo (Oeste)
  h += gaussian(14, 38, 14, 22, 0.55);
  // Colinas suaves da Floresta Kokiri (Sudeste)
  h += gaussian(78, 76, 16, 14, 0.32);
  // Bacia afundada do Lago Hylia (Sudoeste)
  h -= gaussian(32, 78, 16, 13, 0.32);

  // Micro-ondulação orgânica do terreno
  h += 0.04 * Math.sin(xPct * 0.25) * Math.cos(yPct * 0.25);

  return Math.max(-0.22, h);
}

const HyruleTerrainMesh: React.FC<{ isNight: boolean }> = ({ isNight }) => {
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load('/images/hyrule-map.jpg');
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, []);

  const geometry = useMemo(() => {
    const segX = 128;
    const segY = 96;
    const geo = new THREE.PlaneGeometry(MAP_WIDTH, MAP_DEPTH, segX, segY);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vz = pos.getZ(i);
      const xPct = (vx / MAP_WIDTH) * 100 + 50;
      const yPct = (vz / MAP_DEPTH) * 100 + 50;
      pos.setY(i, getTerrainHeight(xPct, yPct));
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      texture.dispose();
    };
  }, [geometry, texture]);

  return (
    <group>
      {/* Terreno 3D principal com textura do pergaminho */}
      <mesh geometry={geometry} receiveShadow castShadow>
        <meshStandardMaterial
          map={texture}
          roughness={0.82}
          metalness={0.08}
          color={isNight ? '#a8b8d8' : '#ffffff'}
        />
      </mesh>

      {/* Base física estilo maquete / relíquia Sheikah */}
      <mesh position={[0, -0.35, 0]} receiveShadow>
        <boxGeometry args={[MAP_WIDTH + 0.16, 0.52, MAP_DEPTH + 0.16]} />
        <meshStandardMaterial color="#1f160e" roughness={0.75} metalness={0.25} />
      </mesh>

      {/* Moldura dourada ao redor da maquete */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[MAP_WIDTH + 0.24, 0.08, MAP_DEPTH + 0.24]} />
        <meshStandardMaterial color="#c8a962" roughness={0.4} metalness={0.65} />
      </mesh>
    </group>
  );
};

// Controlador de câmera com foco suave ao selecionar região
const CameraRig: React.FC<{
  selectedZone: Map3DZoneStats | undefined;
  resetSignal: number;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}> = ({ selectedZone, resetSignal, controlsRef }) => {
  const { camera } = useThree();
  const desiredTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.2, 0));
  const desiredCamPosRef = useRef<THREE.Vector3 | null>(null);
  const isAnimatingRef = useRef<boolean>(false);

  useEffect(() => {
    desiredTargetRef.current.set(0, 0.2, 0);
    desiredCamPosRef.current = new THREE.Vector3(0, 8.6, 8.2);
    isAnimatingRef.current = true;
  }, [resetSignal]);

  useEffect(() => {
    if (!selectedZone) return;
    const [wx, wz] = percentToWorld(selectedZone.x, selectedZone.y);
    const wy = getTerrainHeight(selectedZone.x, selectedZone.y);
    desiredTargetRef.current.set(wx * 0.45, wy * 0.5, wz * 0.45);
    isAnimatingRef.current = true;
  }, [selectedZone]);

  useFrame((_, delta) => {
    if (!isAnimatingRef.current || !controlsRef.current) return;
    const step = Math.min(1, delta * 4.5);

    controlsRef.current.target.lerp(desiredTargetRef.current, step);
    if (desiredCamPosRef.current) {
      camera.position.lerp(desiredCamPosRef.current, step);
      if (camera.position.distanceTo(desiredCamPosRef.current) < 0.08) {
        desiredCamPosRef.current = null;
      }
    }

    controlsRef.current.update();
    if (
      controlsRef.current.target.distanceTo(desiredTargetRef.current) < 0.03 &&
      !desiredCamPosRef.current
    ) {
      isAnimatingRef.current = false;
    }
  });

  return null;
};

// Marcador 3D flutuante com haste até o solo
const ZonePin3D: React.FC<{
  zone: Map3DZoneStats;
  isSelected: boolean;
  onSelect: () => void;
  visibleLayers: HyruleMap3DProps['visibleLayers'];
}> = ({ zone, isSelected, onSelect, visibleLayers }) => {
  const [wx, wz] = percentToWorld(zone.x, zone.y);
  const groundY = getTerrainHeight(zone.x, zone.y);
  const pinY = groundY + (isSelected ? 0.95 : 0.72);

  const hasAnyBadge =
    (visibleLayers.skulltulas && zone.skulltulasTotal > 0) ||
    (visibleLayers.hearts && zone.heartsTotal > 0) ||
    (visibleLayers.songs && zone.songsTotal > 0) ||
    (visibleLayers.milestones && zone.milestonesTotal > 0);

  return (
    <group position={[wx, 0, wz]}>
      {/* Ponto luminoso ancorado no solo 3D */}
      <mesh position={[0, groundY + 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.15, 24]} />
        <meshBasicMaterial
          color={isSelected ? '#fef08a' : zone.isComplete ? '#34d399' : '#c8a962'}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Haste vertical conectando o solo ao card flutuante */}
      <mesh position={[0, groundY + (pinY - groundY) / 2, 0]}>
        <cylinderGeometry args={[0.014, 0.014, pinY - groundY, 8]} />
        <meshBasicMaterial
          color={isSelected ? '#fef08a' : zone.isComplete ? '#34d399' : '#c8a962'}
          transparent
          opacity={0.75}
        />
      </mesh>

      <Html position={[0, pinY, 0]} center distanceFactor={10} zIndexRange={[20, 0]}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`group focus:outline-none transition-transform duration-200 ${
            isSelected ? 'scale-110' : 'hover:scale-105'
          }`}
        >
          <div
            className={`rounded-lg overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.85)] border transition-colors ${
              isSelected
                ? 'border-[#fef08a] ring-2 ring-[#f0d98c]/50'
                : zone.isComplete
                ? 'border-emerald-400/80'
                : 'border-[#c8a962]/90 group-hover:border-[#f0d98c]'
            }`}
          >
            <div
              className={`px-2 py-0.5 text-[10px] font-bold whitespace-nowrap leading-tight text-center ${
                zone.isComplete
                  ? 'bg-emerald-900/95 text-emerald-100'
                  : 'bg-gradient-to-b from-[#efe0b9] to-[#d6be86] text-[#2b1e0f]'
              }`}
            >
              {zone.label}
            </div>
            {hasAnyBadge && (
              <div className="bg-[#120e0a]/95 px-2 py-1 flex items-center justify-center gap-2 text-[9px] font-mono font-bold">
                {visibleLayers.skulltulas && zone.skulltulasTotal > 0 && (
                  <span className="flex items-center gap-0.5 text-[#facc15]">
                    <Bug className="w-2.5 h-2.5" />
                    {zone.skulltulasCollected}/{zone.skulltulasTotal}
                  </span>
                )}
                {visibleLayers.hearts && zone.heartsTotal > 0 && (
                  <span className="flex items-center gap-0.5 text-red-400">
                    <Heart className="w-2.5 h-2.5 fill-red-400" />
                    {zone.heartsCollected}/{zone.heartsTotal}
                  </span>
                )}
                {visibleLayers.songs && zone.songsTotal > 0 && (
                  <span className="flex items-center gap-0.5 text-sky-400">
                    <Music className="w-2.5 h-2.5" />
                    {zone.songsLearned}/{zone.songsTotal}
                  </span>
                )}
                {visibleLayers.milestones && zone.milestonesTotal > 0 && (
                  <span className="flex items-center gap-0.5 text-emerald-400">
                    <Flag className="w-2.5 h-2.5" />
                    {zone.milestonesCompleted}/{zone.milestonesTotal}
                  </span>
                )}
              </div>
            )}
          </div>
        </button>
      </Html>
    </group>
  );
};

export const HyruleMap3D: React.FC<HyruleMap3DProps> = ({
  zones,
  selectedZoneId,
  onSelectZone,
  showPins,
  hideCompletedZones,
  visibleLayers,
  isNight,
  resetSignal
}) => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  if (!webglSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 text-center text-xs text-zinc-300 bg-[#1a140e]">
        WebGL não está disponível neste dispositivo. Alterne para o modo 2D no botão superior.
      </div>
    );
  }

  const selectedZone = zones.find((z) => z.id === selectedZoneId);
  const [kokiriX, kokiriZ] = percentToWorld(76, 74);
  const [volcanoX, volcanoZ] = percentToWorld(76, 15);

  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 8.6, 8.2], fov: 42, near: 0.1, far: 60 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={[isNight ? '#070b14' : '#13100c']} />
        <fog attach="fog" args={[isNight ? '#070b14' : '#13100c', 16, 34]} />

        {/* Iluminação Dinâmica Dia / Noite */}
        <ambientLight intensity={isNight ? 0.55 : 0.95} color={isNight ? '#93c5fd' : '#fff7ed'} />
        <directionalLight
          position={isNight ? [-6, 10, -4] : [8, 12, 6]}
          intensity={isNight ? 1.1 : 1.85}
          color={isNight ? '#818cf8' : '#fef3c7'}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <hemisphereLight
          args={[isNight ? '#3b82f6' : '#fde68a', '#1c1917', isNight ? 0.35 : 0.45]}
        />

        <HyruleTerrainMesh isNight={isNight} />

        {/* Partículas vivas: Fadas na Floresta Kokiri e Brasas na Montanha da Morte */}
        <group position={[kokiriX, 0.85, kokiriZ]}>
          <DreiSparkles
            count={18}
            scale={[2.2, 0.8, 1.8]}
            size={2.4}
            speed={0.45}
            color="#a7f3d0"
            opacity={0.75}
          />
        </group>
        <group position={[volcanoX, 1.75, volcanoZ]}>
          <DreiSparkles
            count={16}
            scale={[1.4, 1.1, 1.4]}
            size={2.8}
            speed={0.6}
            color="#fb923c"
            opacity={0.85}
          />
        </group>

        {/* Pins 3D das regiões */}
        {showPins &&
          zones.map((zone) => {
            if (hideCompletedZones && zone.isComplete) return null;
            return (
              <ZonePin3D
                key={zone.id}
                zone={zone}
                isSelected={zone.id === selectedZoneId}
                onSelect={() => onSelectZone(zone.id)}
                visibleLayers={visibleLayers}
              />
            );
          })}

        <CameraRig
          selectedZone={selectedZone}
          resetSignal={resetSignal}
          controlsRef={controlsRef}
        />

        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.08}
          minDistance={4.2}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2.25}
          minPolarAngle={0.2}
        />
      </Canvas>
    </div>
  );
};

export default HyruleMap3D;
