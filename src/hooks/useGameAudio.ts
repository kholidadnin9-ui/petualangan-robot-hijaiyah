import { useCallback, useEffect, useRef } from "react";

export type SoundName =
  | "click"
  | "select"
  | "correct"
  | "wrong"
  | "laser"
  | "enemyLaser"
  | "win"
  | "star";

type Voice = {
  synth: SpeechSynthesis | null;
};

export function useGameAudio(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const voiceRef = useRef<Voice>({ synth: null });

  const ensureContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctxRef.current = new Ctor();
    }
    if (ctxRef.current.state === "suspended") {
      void ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const blip = useCallback(
    (
      ctx: AudioContext,
      frequency: number,
      start: number,
      duration: number,
      type: OscillatorType,
      volume: number,
      endFrequency?: number,
    ) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + start);
      if (endFrequency) {
        oscillator.frequency.exponentialRampToValueAtTime(
          Math.max(endFrequency, 30),
          ctx.currentTime + start + duration,
        );
      }
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(ctx.currentTime + start);
      oscillator.stop(ctx.currentTime + start + duration + 0.04);
    },
    [],
  );

  const play = useCallback(
    (name: SoundName) => {
      if (!enabled) return;
      const ctx = ensureContext();
      if (!ctx) return;
      switch (name) {
        case "click":
          blip(ctx, 640, 0, 0.07, "square", 0.035);
          break;
        case "select":
          blip(ctx, 560, 0, 0.08, "triangle", 0.05);
          blip(ctx, 840, 0.07, 0.1, "triangle", 0.05);
          break;
        case "correct":
          blip(ctx, 523, 0, 0.12, "sine", 0.08);
          blip(ctx, 659, 0.1, 0.12, "sine", 0.08);
          blip(ctx, 784, 0.2, 0.24, "sine", 0.09);
          break;
        case "wrong":
          blip(ctx, 220, 0, 0.16, "sawtooth", 0.045, 160);
          blip(ctx, 150, 0.14, 0.2, "sawtooth", 0.04, 110);
          break;
        case "laser":
          blip(ctx, 1400, 0, 0.3, "sawtooth", 0.055, 180);
          blip(ctx, 900, 0, 0.26, "square", 0.03, 240);
          break;
        case "enemyLaser":
          blip(ctx, 780, 0, 0.32, "sawtooth", 0.05, 120);
          break;
        case "win":
          [523, 659, 784, 1046].forEach((note, i) => {
            blip(ctx, note, i * 0.13, 0.24, "triangle", 0.09);
          });
          break;
        case "star":
          blip(ctx, 1200, 0, 0.1, "sine", 0.05);
          blip(ctx, 1600, 0.08, 0.16, "sine", 0.05);
          break;
        default:
          break;
      }
    },
    [blip, enabled, ensureContext],
  );

  const speak = useCallback(
    (arabic: string, fallback: string) => {
      if (!enabled) return;
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      const synth = window.speechSynthesis;
      voiceRef.current.synth = synth;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance();
      const voices = synth.getVoices();
      const arabicVoice = voices.find((voice) => voice.lang?.toLowerCase().startsWith("ar"));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
        utterance.lang = arabicVoice.lang;
        utterance.text = arabic;
        utterance.rate = 0.7;
      } else {
        const indonesian = voices.find((voice) => voice.lang?.toLowerCase().startsWith("id"));
        if (indonesian) utterance.voice = indonesian;
        utterance.lang = indonesian?.lang ?? "id-ID";
        // Suara bahasa Indonesia: "qo" dibaca "ko" agar mendekati bunyi huruf Qaf.
        utterance.text = fallback.toLowerCase().replace(/'/g, "").replace(/-/g, " ").replace(/q/g, "k");
        utterance.rate = 0.78;
      }
      utterance.pitch = 1.15;
      utterance.volume = 1;
      synth.speak(utterance);
    },
    [enabled],
  );

  useEffect(() => {
    if (!enabled && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, [enabled]);

  return { play, speak };
}
