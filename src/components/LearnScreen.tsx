import { useRef, useState } from "react";
import {
  arabicFor,
  HARAKAT,
  isHeavyReading,
  LETTERS,
  LEVELS,
  phonetic,
  type HarakatId,
  type Level,
  type RobotTheme,
} from "../data/game";
import type { SoundName } from "../hooks/useGameAudio";
import { HijaiyahGlyph } from "./HijaiyahSvg";
import { CITY_HERO_IMAGE } from "../assets/images";
import { Robot } from "./Robot";
import { GameButton, Icon, SoundToggle } from "./ui";
import { cn } from "../utils/cn";

type LearnProps = {
  robot: RobotTheme;
  soundOn: boolean;
  onToggleSound: () => void;
  onBack: () => void;
  onPlayLevel: (level: Level) => void;
  play: (name: SoundName) => void;
  speak: (arabic: string, fallback: string) => void;
};

const harakatOrder: HarakatId[] = [
  "fathah",
  "kasroh",
  "dhammah",
  "fathah-tanwin",
  "kasroh-tanwin",
  "dhammah-tanwin",
];

export function LearnScreen({
  robot,
  soundOn,
  onToggleSound,
  onBack,
  onPlayLevel,
  play,
  speak,
}: LearnProps) {
  const [harakat, setHarakat] = useState<HarakatId>("fathah");
  const [selectedId, setSelectedId] = useState("ba");
  const glyphRef = useRef<HTMLDivElement | null>(null);
  const letter = LETTERS.find((item) => item.id === selectedId) ?? LETTERS[1];
  const info = HARAKAT[harakat];
  const practiceLevel = LEVELS.find((level) => level.harakat === harakat) ?? LEVELS[0];

  const say = (id: string, nextHarakat: HarakatId = harakat) => {
    const target = LETTERS.find((item) => item.id === id) ?? LETTERS[1];
    setSelectedId(target.id);
    play("select");
    speak(arabicFor(target, nextHarakat), phonetic(target, nextHarakat));
  };

  const move = (direction: number) => {
    const currentIndex = LETTERS.findIndex((item) => item.id === letter.id);
    const nextIndex = (currentIndex + direction + LETTERS.length) % LETTERS.length;
    say(LETTERS[nextIndex].id);
  };

  const downloadSvg = async () => {
    const svg = glyphRef.current?.querySelector("svg");
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", "512");
    clone.setAttribute("height", "512");

    // Ambil font Arab 700 yang sudah tertanam dalam CSS lokal agar SVG unduhan
    // tetap membawa font yang sama, tanpa mengandalkan berkas font yang terpisah.
    const fontFace = Array.from(document.styleSheets)
      .flatMap((sheet) => {
        try {
          return Array.from(sheet.cssRules);
        } catch {
          return [];
        }
      })
      .find((rule) => {
        if (rule.type !== CSSRule.FONT_FACE_RULE) return false;
        const face = (rule as CSSFontFaceRule).style;
        return face.fontFamily.includes("Scheherazade New") && face.fontWeight === "700";
      }) as CSSFontFaceRule | undefined;

    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    const fontSource = fontFace?.style.getPropertyValue("src");
    const embeddedFont = fontSource
      ? `@font-face{font-family:'Scheherazade New';font-style:normal;font-weight:700;src:${fontSource};}`
      : "";
    style.textContent = `${embeddedFont} text{font-family:'Scheherazade New','Amiri','Noto Naskh Arabic','Traditional Arabic',serif;font-weight:700;}`;
    clone.insertBefore(style, clone.firstChild);

    const markup = `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(clone)}`;
    const blob = new Blob([markup], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hijaiyah-${letter.name.toLowerCase()}-${harakat}.svg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    play("click");
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${CITY_HERO_IMAGE})` }}
        aria-hidden="true"
      />
      <div className="fixed inset-0 bg-[linear-gradient(180deg,rgba(4,14,44,0.9),rgba(4,13,40,0.96))]" aria-hidden="true" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(53,201,255,0.2),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(255,79,184,0.16),transparent_55%)]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-14 pt-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-xs font-extrabold text-white backdrop-blur transition hover:bg-white/20"
          >
            <Icon name="arrowLeft" className="h-4 w-4" /> Beranda
          </button>
          <div className="hidden rounded-full border border-amber-300/50 bg-amber-300/10 px-3 py-1.5 text-[11px] font-extrabold text-amber-200 sm:block">
            29 huruf · 6 harakat
          </div>
          <SoundToggle enabled={soundOn} onToggle={onToggleSound} />
        </div>

        <header className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-[#0a2458]/80 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.24em] text-cyan-200 backdrop-blur">
            <Icon name="book" className="h-4 w-4 text-amber-300" /> Kamus Huruf SVG
          </div>
          <h1 className="mt-2 leading-[0.92]">
            <span className="title-gold block text-3xl font-extrabold uppercase sm:text-5xl">Kamus Hijaiyah</span>
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm font-semibold text-cyan-100/80">
            Ketuk kartu huruf untuk mendengar bunyinya. Semua 29 huruf digambar sebagai SVG orisinal yang bebas
            royalti.
          </p>
        </header>

        {/* FILTER HARAKAT */}
        <div className="no-scrollbar mt-5 flex snap-x gap-2 overflow-x-auto pb-1">
          {harakatOrder.map((id) => {
            const item = HARAKAT[id];
            const active = harakat === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setHarakat(id);
                  play("click");
                }}
                aria-pressed={active}
                className={cn(
                  "flex min-w-[128px] shrink-0 snap-start items-center gap-2 rounded-2xl border-2 px-3 py-2 text-left transition",
                  active
                    ? "border-amber-300 bg-[linear-gradient(150deg,#ffd23f,#ff9f1a)] text-[#452500] shadow-[0_8px_20px_-8px_rgba(255,180,0,0.8)]"
                    : "border-white/15 bg-white/[0.06] text-white hover:border-cyan-300/50 hover:bg-white/[0.12]",
                )}
              >
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-xl text-base font-extrabold",
                    active ? "bg-white/40 text-[#452500]" : "bg-[#0b2458] text-amber-200",
                  )}
                >
                  {item.vowel}
                </span>
                <span>
                  <span className="block text-[11px] font-extrabold leading-tight">{item.name}</span>
                  <span className={cn("block text-[9px] font-bold uppercase", active ? "text-[#6a3d00]" : "text-cyan-100/50")}>
                    bunyi {item.vowel.toLowerCase()}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_310px]">
          {/* GRID 29 HURUF */}
          <div className="rounded-[1.75rem] border border-white/15 bg-[#081a42]/85 p-3 shadow-[0_24px_60px_-34px_rgba(0,0,0,0.95)] backdrop-blur sm:p-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-1 px-1">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-cyan-200">
                29 Huruf Hijaiyah
              </p>
              <p className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-100/55">
                <Icon name="sound" className="h-3.5 w-3.5 text-amber-300" /> ketuk untuk mendengar
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 min-[420px]:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-5 xl:grid-cols-6">
              {LETTERS.map((item, index) => {
                const active = item.id === letter.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => say(item.id)}
                    aria-label={`Huruf ${item.name}`}
                    aria-pressed={active}
                    className={cn(
                      "group relative rounded-2xl p-0.5 outline-none transition-all duration-200 focus-visible:ring-4 focus-visible:ring-amber-300",
                      active ? "-translate-y-0.5 ring-[3px] ring-amber-300" : "hover:-translate-y-1 hover:ring-2 hover:ring-cyan-300/60",
                    )}
                  >
                    <HijaiyahGlyph letter={item} harakat={harakat} tone={active ? "gold" : "light"} />
                    <span
                      className={cn(
                        "absolute -left-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full text-[8px] font-extrabold",
                        active ? "bg-amber-400 text-[#4a2a00]" : "bg-[#0b2a5f]/80 text-cyan-100",
                      )}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={cn(
                        "absolute -right-0.5 -top-0.5 rounded-md px-1 py-px text-[8px] font-extrabold leading-tight shadow",
                        isHeavyReading(item, harakat) ? "bg-amber-400 text-[#4a2a00]" : "bg-[#0b2a5f] text-white",
                      )}
                    >
                      {phonetic(item, harakat)}
                    </span>
                    <span
                      className={cn(
                        "absolute inset-x-1 bottom-0.5 truncate rounded-md py-0.5 text-center text-[8px] font-extrabold uppercase tracking-wide",
                        active ? "bg-amber-400 text-[#4a2a00]" : "bg-[#0b2a5f]/85 text-cyan-100",
                      )}
                    >
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-cyan-300/20 bg-cyan-400/[0.07] px-3 py-2">
              <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
              <p className="text-[10px] font-semibold leading-snug text-cyan-100/70">
                Kartu huruf dirender sebagai vektor SVG di dalam aplikasi. Huruf yang sama bisa berubah bunyi
                tergantung harakat yang dipilih: {info.name} — {info.hint.toLowerCase()}.
              </p>
            </div>
          </div>

          {/* DETAIL */}
          <aside className="lg:sticky lg:top-4 lg:self-start">
            <div className="relative overflow-hidden rounded-[1.75rem] border-2 border-cyan-300/30 bg-[linear-gradient(165deg,#0b2a66,#081533)] p-4 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.95)]">
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl"
                style={{ background: robot.ring, opacity: 0.25 }}
              />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-cyan-200">Kartu huruf</p>
                  <p className="text-[11px] font-bold text-cyan-100/60">
                    Huruf ke-{LETTERS.findIndex((item) => item.id === letter.id) + 1} dari {LETTERS.length}
                  </p>
                </div>
                <span className="rounded-full border border-amber-300/50 bg-amber-300/10 px-2.5 py-1 text-[10px] font-extrabold text-amber-200">
                  {info.name}
                </span>
              </div>

              <div ref={glyphRef} className="relative mx-auto mt-3 w-full max-w-[210px]">
                <HijaiyahGlyph letter={letter} harakat={harakat} tone="gold" />
              </div>

              <div className="relative mt-3 text-center">
                <p className="font-arabic text-4xl leading-none text-amber-200">{arabicFor(letter, harakat)}</p>
                <p className="mt-1 text-xl font-extrabold text-white">{letter.name}</p>
                <p className="text-sm font-bold text-cyan-200">
                  Bunyi: <span className="text-amber-300">{phonetic(letter, harakat)}</span>
                </p>
                {isHeavyReading(letter, harakat) ? (
                  <p className="mx-auto mt-1 inline-flex items-center gap-1 rounded-full border border-amber-300/50 bg-amber-300/15 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-200">
                    Huruf tebal · fathah dibaca “O”
                  </p>
                ) : (
                  <p className="mt-0.5 text-[10px] font-semibold text-cyan-100/60">{info.hint}</p>
                )}
              </div>

              <div className="mt-3 flex gap-2">
                <GameButton full onClick={() => say(letter.id)} className="flex-1">
                  <Icon name="sound" className="h-5 w-5" /> Dengarkan Bunyi
                </GameButton>
                <button
                  type="button"
                  onClick={downloadSvg}
                  aria-label={`Unduh kartu SVG huruf ${letter.name}`}
                  title="Unduh kartu SVG"
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border-2 border-white/25 bg-white/10 text-cyan-100 transition hover:bg-white/20"
                >
                  <Icon name="download" className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-1 text-center text-[9px] font-semibold text-cyan-100/50">
                Kartu vektor SVG · bebas royalti
              </p>

              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => move(-1)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-white/20 bg-white/10 py-2 text-[10px] font-extrabold text-white transition hover:bg-white/20"
                >
                  <Icon name="arrowLeft" className="h-3.5 w-3.5" /> Sebelumnya
                </button>
                <button
                  type="button"
                  onClick={() => move(1)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-white/20 bg-white/10 py-2 text-[10px] font-extrabold text-white transition hover:bg-white/20"
                >
                  Berikutnya <Icon name="arrowRight" className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-2">
                <div className="robot-idle h-20 w-20 shrink-0">
                  <Robot theme={robot} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-amber-300">Uji di arena</p>
                  <p className="text-[10px] font-semibold leading-snug text-cyan-100/75">
                    Praktikkan {info.name} bersama {robot.name}.
                  </p>
                  <button
                    type="button"
                    onClick={() => onPlayLevel(practiceLevel)}
                    className="mt-1 inline-flex items-center gap-1 rounded-lg bg-cyan-400/20 px-2 py-1 text-[10px] font-extrabold text-cyan-100 transition hover:bg-cyan-400/30"
                  >
                    <Icon name="play" filled className="h-3 w-3" /> Level {practiceLevel.id}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
