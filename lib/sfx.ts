"use client";

export type SfxType =
  | "hover"
  | "card-hover"
  | "click"
  | "step"
  | "counter"
  | "word-snap"
  | "word-accent"
  | "hero-zoom"
  | "shutter-open"
  | "portal-open"
  | "portal-close"
  | "launch"
  | "theme-light"
  | "theme-dark"
  | "success"
  | "whoosh"
  | "focus";

const STORAGE_KEY = "rohith_sfx_enabled";

// Pentatonic frequencies for Projects 01..06 (C4, D4, E4, G4, A4, C5)
const PENTATONIC_SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];

let audioCtx: AudioContext | null = null;
let sfxEnabled = true;
let iosUnlocked = false;
const lastPlayed: Record<string, number> = {};
const listeners = new Set<(enabled: boolean) => void>();

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  return audioCtx;
}

export function initSfxPreference() {
  if (typeof window === "undefined") return;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      sfxEnabled = saved === "true";
    } else {
      sfxEnabled = true;
    }
  } catch {
    sfxEnabled = true;
  }
}

export function isSfxEnabled(): boolean {
  return sfxEnabled;
}

export function setSfxEnabled(next: boolean) {
  sfxEnabled = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // ignore storage errors
    }
  }
  listeners.forEach((fn) => fn(sfxEnabled));
  if (next) {
    playSfx("theme-light", true);
  }
}

export function subscribeSfx(fn: (enabled: boolean) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function unlockAudioContext() {
  if (typeof window === "undefined") return;
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state !== "running") {
    ctx.resume().catch(() => {});
  }

  // Play a 1-sample silent buffer once on iOS Safari / Android Chrome to unlock Web Audio for subsequent scroll triggers
  if (!iosUnlocked) {
    try {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      if (ctx.state === "running") {
        iosUnlocked = true;
      }
    } catch {
      // ignore unlock errors
    }
  }
}

export function playSfx(type: SfxType, force = false, pitchIndex = 0) {
  if (!sfxEnabled && !force) return;
  if (typeof window === "undefined") return;

  const nowMs = performance.now();
  const cooldowns: Record<SfxType, number> = {
    hover: 55,
    "card-hover": 110,
    click: 45,
    step: 190,
    counter: 165,
    "word-snap": 28,
    "word-accent": 32,
    "hero-zoom": 480,
    "shutter-open": 320,
    "portal-open": 180,
    "portal-close": 180,
    launch: 180,
    "theme-light": 140,
    "theme-dark": 140,
    success: 180,
    whoosh: 180,
    focus: 160,
  };

  if (nowMs - (lastPlayed[type] || 0) < cooldowns[type]) return;
  lastPlayed[type] = nowMs;

  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state !== "running") {
    ctx
      .resume()
      .then(() => {
        if (ctx.state === "running") {
          iosUnlocked = true;
          synthesizeTone(ctx, type, pitchIndex);
        }
      })
      .catch(() => {});
    return;
  }

  synthesizeTone(ctx, type, pitchIndex);
}

function synthesizeTone(
  ctx: AudioContext,
  type: SfxType,
  pitchIndex: number
) {
  const t = ctx.currentTime;

  switch (type) {
    case "hover": {
      // Subtle high-precision studio micro-tick
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1480, t);
      osc.frequency.exponentialRampToValueAtTime(560, t + 0.018);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2400, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.026, t + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.022);
      break;
    }

    case "card-hover": {
      // Deeper warm tactile resonance for project/timeline cards
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(640, t);
      osc.frequency.exponentialRampToValueAtTime(230, t + 0.028);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1350, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.032, t + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.032);
      break;
    }

    case "click": {
      // Dual-layer mechanical tap (transient click + warm body thump)
      const oscTop = ctx.createOscillator();
      const gainTop = ctx.createGain();
      oscTop.type = "sine";
      oscTop.frequency.setValueAtTime(920, t);
      oscTop.frequency.exponentialRampToValueAtTime(220, t + 0.026);

      gainTop.gain.setValueAtTime(0.0001, t);
      gainTop.gain.linearRampToValueAtTime(0.055, t + 0.002);
      gainTop.gain.exponentialRampToValueAtTime(0.0001, t + 0.028);

      oscTop.connect(gainTop);
      gainTop.connect(ctx.destination);
      oscTop.start(t);
      oscTop.stop(t + 0.03);

      const oscSub = ctx.createOscillator();
      const gainSub = ctx.createGain();
      oscSub.type = "sine";
      oscSub.frequency.setValueAtTime(155, t);
      oscSub.frequency.exponentialRampToValueAtTime(58, t + 0.042);

      gainSub.gain.setValueAtTime(0.0001, t);
      gainSub.gain.linearRampToValueAtTime(0.048, t + 0.003);
      gainSub.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

      oscSub.connect(gainSub);
      gainSub.connect(ctx.destination);
      oscSub.start(t);
      oscSub.stop(t + 0.048);
      break;
    }

    case "step": {
      // Rotary detent click when timeline milestones lock in
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(540, t);
      osc.frequency.exponentialRampToValueAtTime(195, t + 0.028);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.04, t + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.032);
      break;
    }

    case "counter": {
      // Crisp mechanical counter tick for stat number counters
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(1650, t);
      osc.frequency.exponentialRampToValueAtTime(620, t + 0.018);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2800, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.038, t + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.022);
      break;
    }

    case "word-snap": {
      // Crisp, ultra-short Apple-picker-wheel tactile tick (14ms) so 1:1 word-by-word scroll never clusters
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(920, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.013);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1750, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.028, t + 0.0015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.016);
      break;
    }

    case "word-accent": {
      // Short, warm harmonic key-lock (24ms) when vermilion accent words snap into place
      const osc = ctx.createOscillator();
      const oscHarm = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, t);
      osc.frequency.exponentialRampToValueAtTime(440, t + 0.024);

      oscHarm.type = "triangle";
      oscHarm.frequency.setValueAtTime(1174.66, t);
      oscHarm.frequency.exponentialRampToValueAtTime(660, t + 0.02);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.034, t + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.026);

      osc.connect(gain);
      oscHarm.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      oscHarm.start(t);
      osc.stop(t + 0.028);
      oscHarm.stop(t + 0.028);
      break;
    }

    case "hero-zoom": {
      // 1A: Cinematic sub-bass + airy filtered camera-zoom whoosh for Hero split/zoom-through
      const dur = 0.34;

      // Layer 1: Warm sub-bass camera push swell
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(105, t);
      sub.frequency.exponentialRampToValueAtTime(230, t + dur * 0.48);
      sub.frequency.exponentialRampToValueAtTime(125, t + dur);

      subGain.gain.setValueAtTime(0.0001, t);
      subGain.gain.linearRampToValueAtTime(0.045, t + dur * 0.32);
      subGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(t);
      sub.stop(t + dur + 0.01);

      // Layer 2: Bandpass-swept airy noise breath
      const sampleRate = ctx.sampleRate;
      const frameCount = Math.floor(sampleRate * dur);
      const noiseBuffer = ctx.createBuffer(1, frameCount, sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.setValueAtTime(2.2, t);
      filter.frequency.setValueAtTime(280, t);
      filter.frequency.exponentialRampToValueAtTime(1180, t + dur * 0.45);
      filter.frequency.exponentialRampToValueAtTime(380, t + dur);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0001, t);
      noiseGain.gain.linearRampToValueAtTime(0.026, t + dur * 0.35);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(t);
      noise.stop(t + dur);
      break;
    }

    case "shutter-open": {
      // Camera aperture blade click + pitch-stepped pentatonic resonance as project image unmasks
      const noteFreq =
        PENTATONIC_SCALE[pitchIndex % PENTATONIC_SCALE.length] || 261.63;

      // 1. Aperture blade transient
      const blade = ctx.createOscillator();
      const bladeGain = ctx.createGain();
      blade.type = "triangle";
      blade.frequency.setValueAtTime(980, t);
      blade.frequency.exponentialRampToValueAtTime(190, t + 0.024);

      bladeGain.gain.setValueAtTime(0.0001, t);
      bladeGain.gain.linearRampToValueAtTime(0.034, t + 0.002);
      bladeGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.026);

      blade.connect(bladeGain);
      bladeGain.connect(ctx.destination);
      blade.start(t);
      blade.stop(t + 0.028);

      // 2. Warm pentatonic chapter swell
      const tone = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const toneGain = ctx.createGain();

      tone.type = "sine";
      tone.frequency.setValueAtTime(noteFreq * 0.96, t + 0.01);
      tone.frequency.exponentialRampToValueAtTime(noteFreq, t + 0.09);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1100, t);

      toneGain.gain.setValueAtTime(0.0001, t + 0.01);
      toneGain.gain.linearRampToValueAtTime(0.036, t + 0.028);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);

      tone.connect(filter);
      filter.connect(toneGain);
      toneGain.connect(ctx.destination);
      tone.start(t + 0.01);
      tone.stop(t + 0.145);
      break;
    }

    case "portal-open":
    case "portal-close": {
      // Two-note case study portal transition chord (rising on open, folding down on close)
      const notes = type === "portal-open" ? [330, 495] : [495, 330];

      // Subtle low body thump
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(135, t);
      sub.frequency.exponentialRampToValueAtTime(52, t + 0.055);
      subGain.gain.setValueAtTime(0.0001, t);
      subGain.gain.linearRampToValueAtTime(0.045, t + 0.004);
      subGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(t);
      sub.stop(t + 0.062);

      // Harmonic interval
      notes.forEach((freq, i) => {
        const start = t + i * 0.05;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(0.042, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.165);
      });
      break;
    }

    case "launch": {
      // Crisp external production site launch double-blip (660Hz -> 1320Hz)
      const notes = [660, 1320];
      notes.forEach((freq, i) => {
        const start = t + i * 0.048;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(0.04, start + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.11);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.115);
      });
      break;
    }

    case "theme-light":
    case "theme-dark": {
      // Two-note harmonic interval (rising for light, falling for dark)
      const notes = type === "theme-light" ? [528, 792] : [792, 528];
      notes.forEach((freq, i) => {
        const start = t + i * 0.055;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(0.042, start + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.13);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.14);
      });
      break;
    }

    case "success": {
      // Crystal confirmation triad arpeggio (email copied / action complete)
      const notes = [587.33, 880, 1174.66];
      notes.forEach((freq, i) => {
        const start = t + i * 0.055;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(0.045, start + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.19);
      });
      break;
    }

    case "whoosh": {
      // Smooth airy sweep for drawer open/close and back-to-top
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(210, t);
      osc.frequency.exponentialRampToValueAtTime(490, t + 0.14);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(900, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.032, t + 0.035);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.17);
      break;
    }

    case "focus": {
      // Subtle lens-focus hum on hero portrait / gallery screenshot hover
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(440, t + 0.07);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.022, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.085);
      break;
    }
  }
}
