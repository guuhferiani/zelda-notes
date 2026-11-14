import { OcarinaButton, OcarinaNotePitch, OcarinaScoreNote } from '../types';

export const PITCH_FREQS: Record<OcarinaNotePitch, number> = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  'F#4': 369.99,
  G4: 392.0,
  A4: 440.0,
  Bb4: 466.16,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
};

export const PITCH_LABEL: Record<OcarinaNotePitch, string> = {
  C4: 'C',
  D4: 'D',
  E4: 'E',
  F4: 'F',
  'F#4': 'F#',
  G4: 'G',
  A4: 'A',
  Bb4: 'Bb',
  B4: 'B',
  C5: 'C',
  D5: 'D',
  E5: 'E',
};

export const BUTTON_TO_PITCH: Record<OcarinaButton, OcarinaNotePitch> = {
  A: 'D4',
  DOWN: 'F4',
  RIGHT: 'A4',
  LEFT: 'B4',
  UP: 'D5',
};

// Dedilhado visual na Ocarina (indices dos 7 furos: 0..6 da esquerda para direita)
// Furos acesos representam os dedos levantados / aberturas ativas para produzir a nota
export const PITCH_FINGERING: Record<OcarinaNotePitch, number[]> = {
  C4: [],
  D4: [6],
  E4: [5, 6],
  F4: [4, 5, 6],
  'F#4': [3, 5, 6],
  G4: [3, 4, 5, 6],
  A4: [2, 3, 4, 5],
  Bb4: [1, 2, 4, 5],
  B4: [1, 2, 3, 4],
  C5: [0, 1, 2, 3],
  D5: [0, 1, 2, 4, 5],
  E5: [0, 1, 3, 4, 5, 6],
};

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!sharedAudioCtx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

/**
 * Sintetizador acústico de Ocarina (ressonador de Helmholtz + vibrato + sopro).
 * Retorna função de parada antecipada caso o usuário pause/feche o player.
 */
export function playOcarinaPitch(pitch: OcarinaNotePitch, duration = 0.42): () => void {
  const ctx = getAudioContext();
  if (!ctx) return () => {};

  const now = ctx.currentTime;
  const freq = PITCH_FREQS[pitch] ?? 440;
  const safeDuration = Math.max(0.14, duration);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1900, now);
  filter.Q.setValueAtTime(1.2, now);

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.0001, now);
  masterGain.gain.linearRampToValueAtTime(0.28, now + 0.04);
  masterGain.gain.setValueAtTime(0.24, now + Math.max(0.05, safeDuration - 0.08));
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + safeDuration);

  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(freq * 0.985, now);
  osc1.frequency.exponentialRampToValueAtTime(freq, now + 0.03);

  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(freq * 2, now);
  const osc2Gain = ctx.createGain();
  osc2Gain.gain.setValueAtTime(0.12, now);

  const osc3 = ctx.createOscillator();
  osc3.type = 'sine';
  osc3.frequency.setValueAtTime(freq * 3, now);
  const osc3Gain = ctx.createGain();
  osc3Gain.gain.setValueAtTime(0.03, now);

  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.setValueAtTime(5.2, now);
  lfoGain.gain.setValueAtTime(0, now);
  lfoGain.gain.linearRampToValueAtTime(3.2, now + 0.12);
  lfo.connect(lfoGain);
  lfoGain.connect(osc1.frequency);

  const bufferSize = Math.floor(ctx.sampleRate * 0.12);
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  const breath = ctx.createBufferSource();
  breath.buffer = noiseBuffer;
  const breathFilter = ctx.createBiquadFilter();
  breathFilter.type = 'bandpass';
  breathFilter.frequency.setValueAtTime(freq * 1.8, now);
  breathFilter.Q.setValueAtTime(2.5, now);
  const breathGain = ctx.createGain();
  breathGain.gain.setValueAtTime(0.035, now);
  breathGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

  osc1.connect(filter);
  osc2.connect(osc2Gain);
  osc2Gain.connect(filter);
  osc3.connect(osc3Gain);
  osc3Gain.connect(filter);
  breath.connect(breathFilter);
  breathFilter.connect(breathGain);
  breathGain.connect(filter);

  filter.connect(masterGain);
  masterGain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc3.start(now);
  lfo.start(now);
  breath.start(now);

  osc1.stop(now + safeDuration + 0.03);
  osc2.stop(now + safeDuration + 0.03);
  osc3.stop(now + safeDuration + 0.03);
  lfo.stop(now + safeDuration + 0.03);
  breath.stop(now + 0.12);

  return () => {
    try {
      const t = ctx.currentTime;
      masterGain.gain.cancelScheduledValues(t);
      masterGain.gain.setValueAtTime(Math.max(0.0001, masterGain.gain.value), t);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
      osc1.stop(t + 0.05);
      osc2.stop(t + 0.05);
      osc3.stop(t + 0.05);
      lfo.stop(t + 0.05);
    } catch {
      // ignora se já parou
    }
  };
}

export function playOcarinaButton(button: OcarinaButton, duration = 0.42): () => void {
  return playOcarinaPitch(BUTTON_TO_PITCH[button], duration);
}

/**
 * Converte a lista simples de botões N64 (notes) em uma partitura com timestamps
 * caso a música não possua introScore customizado.
 */
export function buildIntroScoreFromButtons(buttons: OcarinaButton[]): OcarinaScoreNote[] {
  let cursor = 0.4;
  return buttons.map((btn, idx) => {
    const isLast = idx === buttons.length - 1;
    const dur = isLast ? 0.85 : 0.38;
    const item: OcarinaScoreNote = {
      pitch: BUTTON_TO_PITCH[btn],
      start: cursor,
      duration: dur,
      button: btn,
    };
    cursor += dur + 0.12;
    return item;
  });
}
