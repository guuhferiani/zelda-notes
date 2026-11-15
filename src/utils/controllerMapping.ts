import { useEffect, useState } from 'react';
import { OcarinaButton } from '../types';

export type ControllerPreference = 'auto' | 'ps5' | 'nintendo' | 'n64';
export type ResolvedController = 'ps5' | 'nintendo' | 'n64';

const STORAGE_KEY = 'zelda_notes_controller_pref';

export interface ControllerPrompt {
  symbol: string;
  shortName: string;
  title: string;
  badgeClass: string;
}

export function detectControllerFromGamepad(pad: Gamepad | null): ResolvedController | null {
  if (!pad) return null;
  const id = (pad.id || '').toLowerCase();

  if (
    id.includes('dualsense') ||
    id.includes('dualshock') ||
    id.includes('sony') ||
    id.includes('playstation') ||
    id.includes('054c') ||
    id.includes('wireless controller')
  ) {
    return 'ps5';
  }

  if (
    id.includes('nintendo') ||
    id.includes('switch') ||
    id.includes('pro controller') ||
    id.includes('joy-con') ||
    id.includes('057e')
  ) {
    return 'nintendo';
  }

  return null;
}

export function useControllerLayout() {
  const [preference, setPreferenceState] = useState<ControllerPreference>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'auto' || saved === 'ps5' || saved === 'nintendo' || saved === 'n64') {
        return saved;
      }
    } catch {
      // ignora erro de storage
    }
    return 'auto';
  });

  const [detectedGamepad, setDetectedGamepad] = useState<{
    type: ResolvedController;
    name: string;
  } | null>(null);

  const setPreference = (pref: ControllerPreference) => {
    setPreferenceState(pref);
    try {
      localStorage.setItem(STORAGE_KEY, pref);
    } catch {
      // ignora erro de storage
    }
  };

  useEffect(() => {
    const scanGamepads = () => {
      if (typeof navigator === 'undefined' || !navigator.getGamepads) return;
      const pads = navigator.getGamepads();
      for (const pad of pads) {
        if (pad && pad.connected) {
          const detected = detectControllerFromGamepad(pad);
          if (detected) {
            setDetectedGamepad({ type: detected, name: pad.id });
            return;
          }
        }
      }
      setDetectedGamepad(null);
    };

    scanGamepads();
    window.addEventListener('gamepadconnected', scanGamepads);
    window.addEventListener('gamepaddisconnected', scanGamepads);

    // Alguns navegadores só expõem o gamepad após o primeiro botão pressionado
    const interval = window.setInterval(scanGamepads, 2000);

    return () => {
      window.removeEventListener('gamepadconnected', scanGamepads);
      window.removeEventListener('gamepaddisconnected', scanGamepads);
      window.clearInterval(interval);
    };
  }, []);

  const resolvedLayout: ResolvedController =
    preference === 'auto' ? (detectedGamepad?.type ?? 'n64') : preference;

  return {
    preference,
    setPreference,
    detectedGamepad,
    resolvedLayout,
  };
}

export function getControllerPrompt(
  button: OcarinaButton,
  layout: ResolvedController
): ControllerPrompt {
  if (layout === 'ps5') {
    const map: Record<OcarinaButton, ControllerPrompt> = {
      A: {
        symbol: 'L1',
        shortName: 'Botão L1',
        title: 'PS5: L1 — Nota mais grave (A do N64)',
        badgeClass: 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400',
      },
      DOWN: {
        symbol: 'R1',
        shortName: 'Botão R1',
        title: 'PS5: R1 — C-Baixo',
        badgeClass: 'bg-amber-500 hover:bg-amber-400 text-sheikah-darkest border-amber-300',
      },
      RIGHT: {
        symbol: '○',
        shortName: 'Botão ○',
        title: 'PS5: ○ (Círculo) — C-Direita',
        badgeClass: 'bg-amber-500 hover:bg-amber-400 text-sheikah-darkest border-amber-300',
      },
      LEFT: {
        symbol: '□',
        shortName: 'Botão □',
        title: 'PS5: □ (Quadrado) — C-Esquerda',
        badgeClass: 'bg-amber-500 hover:bg-amber-400 text-sheikah-darkest border-amber-300',
      },
      UP: {
        symbol: '△',
        shortName: 'Botão △',
        title: 'PS5: △ (Triângulo) — C-Cima',
        badgeClass: 'bg-amber-500 hover:bg-amber-400 text-sheikah-darkest border-amber-300',
      },
    };
    return map[button];
  }

  if (layout === 'nintendo') {
    const map: Record<OcarinaButton, ControllerPrompt> = {
      A: {
        symbol: 'L',
        shortName: 'Botão L',
        title: 'Nintendo: L — Nota mais grave (A do N64)',
        badgeClass: 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400',
      },
      DOWN: {
        symbol: 'R',
        shortName: 'Botão R',
        title: 'Nintendo: R — C-Baixo',
        badgeClass: 'bg-amber-500 hover:bg-amber-400 text-sheikah-darkest border-amber-300',
      },
      RIGHT: {
        symbol: 'A',
        shortName: 'Botão A',
        title: 'Nintendo: A — C-Direita',
        badgeClass: 'bg-amber-500 hover:bg-amber-400 text-sheikah-darkest border-amber-300',
      },
      LEFT: {
        symbol: 'Y',
        shortName: 'Botão Y',
        title: 'Nintendo: Y — C-Esquerda',
        badgeClass: 'bg-amber-500 hover:bg-amber-400 text-sheikah-darkest border-amber-300',
      },
      UP: {
        symbol: 'X',
        shortName: 'Botão X',
        title: 'Nintendo: X — C-Cima',
        badgeClass: 'bg-amber-500 hover:bg-amber-400 text-sheikah-darkest border-amber-300',
      },
    };
    return map[button];
  }

  // N64 Clássico
  const map: Record<OcarinaButton, ControllerPrompt> = {
    A: {
      symbol: 'A',
      shortName: 'Botão A',
      title: 'Botão A (Azul)',
      badgeClass: 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400',
    },
    UP: {
      symbol: '▲',
      shortName: 'C-Cima',
      title: 'C-Cima (Amarelo)',
      badgeClass: 'bg-amber-500 hover:bg-amber-400 text-sheikah-darkest border-amber-300',
    },
    LEFT: {
      symbol: '◀',
      shortName: 'C-Esq',
      title: 'C-Esquerda (Amarelo)',
      badgeClass: 'bg-amber-500 hover:bg-amber-400 text-sheikah-darkest border-amber-300',
    },
    RIGHT: {
      symbol: '▶',
      shortName: 'C-Dir',
      title: 'C-Direita (Amarelo)',
      badgeClass: 'bg-amber-500 hover:bg-amber-400 text-sheikah-darkest border-amber-300',
    },
    DOWN: {
      symbol: '▼',
      shortName: 'C-Baixo',
      title: 'C-Baixo (Amarelo)',
      badgeClass: 'bg-amber-500 hover:bg-amber-400 text-sheikah-darkest border-amber-300',
    },
  };
  return map[button];
}
