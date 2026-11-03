import { useState, type ReactNode } from "react";
import {
  ENEMY_THEME,
  LEVELS,
  LETTERS,
  ROBOTS,
  type Level,
  type Progress,
  type RobotId,
  type RobotLook,
  type RobotTheme,
} from "../data/game";
import { HijaiyahGlyph } from "./HijaiyahSvg";
import { CITY_HERO_IMAGE } from "../assets/images";
import { Robot, RobotColorPicker } from "./Robot";
import { GameButton, Icon, SoundToggle, StarRow } from "./ui";
import { cn } from "../utils/cn";

type HomeProps = {
  selectedRobot: RobotTheme;
  onSelectRobot: (id: RobotId) => void;
  onStart: () => void;
  onOpenMap: () => void;
  onOpenLearn: () => void;
  onOpenHelp: () => void;
  onPickLevel: (level: Level) => void;
  soundOn: boolean;
  onToggleSound: () => void;
  progress: Progress;
  onDemoAnswer: (correct: boolean) => void;
  onPronounce: () => void;
};

const demoOptions = [
  LETTERS.find((l) => l.id === "alif")!,
  LETTERS.find((l) => l.id === "ba")!,
  LETTERS.find((l) => l.id === "ta")!,
];

const stats = [
  { icon: "star" as const, value: "6", label: "Level" },
  { icon: "list" as const, value: "10", label: "Soal / Level" },
  { icon: "book" as const, value: "29", label: "Huruf" },
];

export function HomeScreen({
  selectedRobot,
  onSelectRobot,
  onStart,
  onOpenMap,
  onOpenLearn,
  onOpenHelp,
  onPickLevel,
  soundOn,
  onToggleSound,
  progress,
  onDemoAnswer,
  onPronounce,
}: HomeProps) {
  const [demoPick, setDemoPick] = useState<string | null>(null);
  const totalStars = Object.values(progress).reduce((sum, item) => sum + (item?.stars ?? 0), 0);
  const hasProgress = Object.keys(progress).length > 0;

  return (
    <div className="relative overflow-hidden">
      {/* HERO */}
      <section className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${CITY_HERO_IMAGE})` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,15,48,0.5)_0%,rgba(4,15,48,0.18)_28%,rgba(5,18,54,0.72)_72%,#040d2a_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(38,190,255,0.25),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(124,58,237,0.25),transparent_55%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 lg:pb-16">
          {/* NAV */}
          <div className="flex items-center justify-between gap-3 py-3">
            <BrandPill />
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-2 md:flex">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-2 rounded-xl border-2 border-amber-300/80 bg-gradient-to-b from-[#1c2f69] to-[#0a1740] px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_6px_16px_rgba(0,0,0,0.35)]"
                  >
                    <Icon name={stat.icon} filled className="h-4 w-4 text-amber-300" />
                    <span className="text-sm font-extrabold leading-none text-white">{stat.value}</span>
                    <span className="text-[10px] font-bold leading-tight text-cyan-100/80">{stat.label}</span>
                  </div>
                ))}
              </div>
              <SoundToggle enabled={soundOn} onToggle={onToggleSound} />
            </div>
          </div>

          {/* TITLE */}
          <div className="mx-auto mt-3 max-w-4xl text-center sm:mt-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/40 bg-[#0b2463]/80 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-cyan-100 shadow-lg backdrop-blur-sm sm:text-xs">
              <Icon name="gamepad" className="h-4 w-4 text-amber-300" />
              Game Interaktif
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
              Usia 5–6 Tahun
            </div>
            <h1 className="leading-[0.85]">
              <span className="title-gold block text-[2.5rem] font-extrabold uppercase leading-[0.9] tracking-tight sm:text-6xl lg:text-7xl">
                Petualangan
              </span>
              <span className="title-blue mt-1 block text-[2.8rem] font-extrabold uppercase leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
                Robot Hijaiyah
              </span>
            </h1>
            <p className="mt-3 flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-[#061a44]/75 px-3 py-1 text-[10px] font-bold tracking-wide text-white/90 shadow-md backdrop-blur-sm sm:text-xs">
                Created by: <span className="font-extrabold text-amber-300">Widodo Guru SD</span>
              </span>
            </p>
            <div className="relative mx-auto mt-4 inline-flex max-w-xl items-center gap-2 rounded-2xl border-2 border-cyan-300/60 bg-[#08285f]/80 px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_10px_28px_rgba(0,20,60,0.5)] backdrop-blur-sm">
              <Icon name="sparkles" className="h-4 w-4 shrink-0 text-amber-300" />
              <p className="text-xs font-bold leading-snug text-white sm:text-base">
                Belajar huruf hijaiyah sambil bertualang dan bertarung!
              </p>
            </div>
          </div>

          {/* ROBOT VS ROBOT — layar kecil */}
          <div className="mx-auto mt-5 max-w-md lg:hidden">
            <div className="grid grid-cols-[1fr_auto_1fr] items-end">
              <MiniFighter theme={selectedRobot} name={selectedRobot.name} accent="cyan" />
              <span className="mb-14 grid h-12 w-12 place-items-center rounded-full border-[3px] border-white bg-gradient-to-b from-[#ffe571] to-[#ff8a00] text-base font-extrabold text-[#4a1d00] shadow-[0_5px_0_#a34a00]">
                VS
              </span>
              <MiniFighter theme={ENEMY_THEME} name={ENEMY_THEME.name} accent="rose" />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-cyan-100/85">
                Warna robotmu:
              </span>
              <RobotColorPicker selectedId={selectedRobot.id} onSelect={onSelectRobot} size="sm" />
            </div>
          </div>

          {/* DEMO STAGE */}
          <div className="mt-6 grid items-end gap-4 lg:mt-3 lg:grid-cols-[270px_minmax(0,1fr)_270px]">
            <HeroRobot
              theme={selectedRobot}
              name={selectedRobot.name}
              message="Aku siap menembak laser!"
              className="hidden lg:flex"
              accent="cyan"
              footer={
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-cyan-100/85">
                    Pilih warna robot
                  </span>
                  <RobotColorPicker selectedId={selectedRobot.id} onSelect={onSelectRobot} size="sm" />
                </div>
              }
            />

            <div className="relative">
              <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-cyan-400/15 blur-2xl" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[1.75rem] border-2 border-cyan-200/60 bg-[linear-gradient(160deg,#0b2a66_0%,#0a1d4d_55%,#101c4f_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_24px_60px_-18px_rgba(0,0,0,0.8)] sm:p-5">
                <div className="shop-stripe pointer-events-none absolute inset-x-0 top-0 h-16 opacity-20" />
                <div className="relative flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#4a2a00] shadow">
                    <Icon name="sparkles" className="h-3.5 w-3.5" /> Contoh Misi
                  </span>
                  <span className="rounded-full border border-cyan-300/40 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-bold text-cyan-100">
                    Level 1 · Fathah
                  </span>
                </div>

                <div className="relative mt-4 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={onPronounce}
                    aria-label="Dengarkan bunyi huruf"
                    className="group relative grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-white/60 bg-gradient-to-b from-[#45c7ff] to-[#0a63ec] text-white shadow-[0_5px_0_#083b9e] transition hover:scale-105 active:scale-95"
                  >
                    <Icon name="sound" className="h-6 w-6" />
                    <span className="pulse-ring pointer-events-none absolute h-14 w-14 rounded-full border-2 border-cyan-300" />
                  </button>
                  <div className="relative flex-1 rounded-2xl border-2 border-cyan-300/60 bg-[#04123a] px-4 py-3 text-center shadow-inner">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-200/80">Bunyi huruf</p>
                    <p className="text-4xl font-extrabold text-white sm:text-5xl">A</p>
                    <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-amber-300" />
                  </div>
                </div>

                <p className="relative mt-3 text-center text-[11px] font-bold text-cyan-100/90 sm:text-xs">
                  Klik kartu huruf yang berbunyi <span className="text-amber-300">“A”</span>
                </p>

                <div className="relative mt-3 grid grid-cols-3 gap-2 sm:gap-3">
                  {demoOptions.map((letter) => {
                    const selected = demoPick === letter.id;
                    const isCorrect = letter.id === "alif";
                    return (
                      <button
                        key={letter.id}
                        type="button"
                        onClick={() => {
                          setDemoPick(letter.id);
                          onDemoAnswer(isCorrect);
                        }}
                        className={cn(
                          "relative rounded-2xl p-1 transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300",
                          selected && isCorrect && "scale-[1.03] ring-4 ring-emerald-300",
                          selected && !isCorrect && "ring-4 ring-rose-400",
                          !selected && "ring-2 ring-transparent hover:-translate-y-1 hover:ring-amber-300/80",
                        )}
                        aria-label={`Pilih huruf ${letter.name}`}
                      >
                        <HijaiyahGlyph letter={letter} harakat="fathah" tone={selected && isCorrect ? "gold" : "light"} />
                        {selected && (
                          <span
                            className={cn(
                              "absolute -right-1.5 -top-1.5 grid h-7 w-7 place-items-center rounded-full border-2 border-white text-white shadow-md",
                              isCorrect ? "bg-emerald-500" : "bg-rose-500",
                            )}
                          >
                            <Icon name={isCorrect ? "check" : "close"} className="h-4 w-4" strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <p className="relative mt-3 min-h-[18px] text-center text-[11px] font-bold">
                  {demoPick === "alif" && (
                    <span className="text-emerald-300">Hebat! Itu huruf Alif. Robot menembak laser! ⚡</span>
                  )}
                  {demoPick && demoPick !== "alif" && (
                    <span className="text-rose-200">Belum tepat. Yang berbunyi “A” adalah Alif.</span>
                  )}
                  {!demoPick && <span className="text-cyan-100/70">Ayo coba kartu di atas!</span>}
                </p>
              </div>
            </div>

            <HeroRobot
              theme={ENEMY_THEME}
              name={ENEMY_THEME.name}
              message="Ayo kalahkan aku!"
              className="hidden lg:flex"
              accent="rose"
            />
          </div>

          {/* CTA */}
          <div className="mx-auto mt-5 flex max-w-3xl flex-col items-stretch gap-2.5 sm:mt-7 sm:flex-row sm:items-center sm:justify-center">
            <GameButton size="lg" onClick={onStart} className="w-full sm:w-auto">
              <Icon name="play" filled className="h-5 w-5" />
              {hasProgress ? "Lanjutkan Misi" : "Mulai Misi"}
              <Icon name="arrowRight" className="h-5 w-5" />
            </GameButton>
            <GameButton size="lg" variant="white" onClick={onOpenMap} className="w-full sm:w-auto">
              <Icon name="map" className="h-5 w-5" />
              Peta 6 Level
            </GameButton>
            <button
              type="button"
              onClick={onOpenHelp}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/25 bg-white/10 px-4 py-3 text-xs font-extrabold text-white backdrop-blur transition hover:bg-white/20"
            >
              <Icon name="info" className="h-4 w-4" /> Cara Main
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-semibold text-cyan-100/75">
            <span className="inline-flex items-center gap-1">
              <Icon name="check" className="h-3.5 w-3.5 text-emerald-300" /> Tanpa iklan
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon name="sound" className="h-3.5 w-3.5 text-amber-300" /> Ada suara pelafalan
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon name="star" filled className="h-3.5 w-3.5 text-amber-300" /> {totalStars}/18 bintang
            </span>
          </div>
        </div>
      </section>

      {/* ROBOT PICKER */}
      <section className="relative mx-auto max-w-7xl px-4 pb-4 sm:px-6" id="pilih-robot">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-cyan-300">Pilih Pahlawanmu</p>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Pilih Warna Robotmu!</h2>
          </div>
          <p className="text-xs font-semibold text-cyan-100/70">
            Merah, biru, pink, atau ungu — semua siap menembakkan blaster laser!
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {ROBOTS.map((robot) => {
            const active = robot.id === selectedRobot.id;
            return (
              <button
                key={robot.id}
                type="button"
                onClick={() => onSelectRobot(robot.id)}
                aria-pressed={active}
                className={cn(
                  "group relative overflow-hidden rounded-[1.75rem] border-2 p-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300",
                  active
                    ? "-translate-y-1 border-amber-300 shadow-[0_0_0_4px_rgba(255,210,63,0.22),0_22px_40px_-18px_rgba(0,0,0,0.9)]"
                    : "border-white/20 hover:-translate-y-1 hover:border-white/50",
                )}
                style={{
                  background: `linear-gradient(155deg, ${robot.primary}55 0%, #0a1b49 48%, #071433 100%)`,
                }}
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl transition group-hover:opacity-90"
                  style={{ background: robot.ring, opacity: 0.28 }}
                />
                <div className="relative flex items-start justify-between">
                  <span
                    className="rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white/90"
                    style={{ color: robot.glow }}
                  >
                    {robot.power}
                  </span>
                  {active && (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-300 text-[#4a2a00] shadow">
                      <Icon name="check" className="h-4 w-4" strokeWidth={3} />
                    </span>
                  )}
                </div>
                <div className="relative mx-auto mt-1 aspect-square w-full max-w-[160px] transition duration-300 group-hover:scale-[1.04] sm:max-w-[200px]">
                  <div className={active ? "robot-idle h-full w-full" : "h-full w-full"}>
                    <Robot theme={robot} />
                  </div>
                </div>
                <div className="relative">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em]" style={{ color: robot.ring }}>
                    Robot {robot.colorName}
                  </p>
                  <p className="text-base font-extrabold leading-tight text-white">{robot.name}</p>
                  <p className="text-[11px] font-semibold text-cyan-100/75">{robot.title}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: robot.ring }} />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-amber-200">
                      {active ? "Dipilih" : "Pilih"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* LEVEL TRACK */}
      <section className="relative mx-auto mt-8 max-w-7xl px-4 sm:px-6">
        <div className="rounded-[1.75rem] border border-white/15 bg-[#081a42]/80 p-4 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur sm:p-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-amber-300">Peta Petualangan</p>
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">6 Level Harakat Hijaiyah</h2>
            </div>
            <GameButton size="sm" variant="ghost" onClick={onOpenMap}>
              Lihat Peta <Icon name="arrowRight" className="h-4 w-4" />
            </GameButton>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            {LEVELS.map((level) => {
              const done = progress[level.id];
              return (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => onPickLevel(level)}
                  className="group relative overflow-hidden rounded-2xl border-2 border-white/15 bg-white/[0.06] p-3 text-left transition hover:-translate-y-1 hover:border-cyan-300/70 hover:bg-white/[0.11] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/60"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-1.5"
                    style={{ background: `linear-gradient(90deg, ${level.from}, ${level.to})` }}
                  />
                  <div className="flex items-center justify-between">
                    <span
                      className="grid h-7 w-7 place-items-center rounded-lg text-xs font-extrabold text-[#08122b]"
                      style={{ background: `linear-gradient(160deg, ${level.to}, ${level.from})` }}
                    >
                      {level.id}
                    </span>
                    {done?.done ? (
                      <span className="rounded-full bg-emerald-400/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-200">
                        Selesai
                      </span>
                    ) : (
                      <Icon name="play" filled className="h-3.5 w-3.5 text-white/40 group-hover:text-amber-300" />
                    )}
                  </div>
                  <p className="mt-2 text-sm font-extrabold leading-tight text-white">{level.title}</p>
                  <p className="font-arabic text-lg leading-none text-cyan-200/90">{level.arabic}</p>
                  <StarRow count={done?.stars ?? 0} starClassName="h-3.5 w-3.5" className="mt-1.5" />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* LEARN TEASER */}
      <section className="relative mx-auto mt-8 max-w-7xl px-4 pb-12 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] border-2 border-cyan-300/30 bg-[linear-gradient(120deg,#0b2a66_0%,#0a1a47_55%,#241149_100%)] p-5 sm:p-7">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-amber-300">Kamus Huruf</p>
              <h2 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
                Kenalan dengan <span className="text-cyan-300">29 Huruf Hijaiyah</span>
              </h2>
              <p className="mt-1.5 max-w-xl text-sm font-semibold text-cyan-100/80">
                Setiap huruf digambar sebagai kartu SVG yang tajam dan bebas royalti. Dengarkan bunyinya, lalu
                temukan hurufnya di arena!
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {[
                  { icon: "book" as const, label: "29 kartu SVG" },
                  { icon: "sound" as const, label: "Suara pelafalan" },
                  { icon: "star" as const, label: "6 macam harakat" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.07] px-3 py-2 text-[11px] font-bold text-white"
                  >
                    <Icon name={item.icon} className="h-4 w-4 text-amber-300" /> {item.label}
                  </div>
                ))}
              </div>
              <GameButton variant="teal" className="mt-4" onClick={onOpenLearn}>
                <Icon name="book" className="h-5 w-5" /> Buka Kamus Huruf
              </GameButton>
            </div>
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7 sm:gap-2">
              {LETTERS.slice(0, 14).map((letter) => (
                <div key={letter.id} className="transition hover:-translate-y-1">
                  <HijaiyahGlyph letter={letter} harakat="fathah" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <footer className="flex flex-col items-center justify-between gap-2 pt-6 text-center text-[11px] font-semibold text-cyan-100/50 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} Petualangan Robot Hijaiyah · Created by: Widodo Guru SD</p>
          <p>Ilustrasi robot &amp; kartu huruf SVG orisinal, bebas royalti · Untuk anak usia 5–6 tahun</p>
        </footer>
      </section>
    </div>
  );
}

function HeroRobot({
  theme,
  name,
  message,
  className,
  accent,
  footer,
}: {
  theme: RobotLook;
  name: string;
  message: string;
  className?: string;
  accent: "cyan" | "rose";
  footer?: ReactNode;
}) {
  return (
    <div className={cn("relative flex-col items-center", className)}>
      <div
        className={cn(
          "relative z-10 mb-1 max-w-[200px] rounded-2xl border-2 bg-[#061a44]/90 px-3 py-2 text-center text-[11px] font-bold leading-snug text-white shadow-xl backdrop-blur",
          accent === "cyan" ? "border-cyan-300/60" : "border-rose-400/60",
        )}
      >
        {message}
        <span
          className={cn(
            "absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 bg-[#061a44]",
            accent === "cyan" ? "border-cyan-300/60" : "border-rose-400/60",
          )}
        />
      </div>
      <div className="relative aspect-square w-full">
        <span
          className="absolute bottom-[3%] left-1/2 h-[8%] w-[60%] -translate-x-1/2 rounded-[50%] bg-black/45 blur-md"
          aria-hidden="true"
        />
        <div
          className={cn(
            "h-full w-full drop-shadow-[0_20px_25px_rgba(0,0,0,0.55)]",
            accent === "cyan" ? "robot-idle" : "robot-idle-slow",
          )}
        >
          <Robot theme={theme} />
        </div>
        <div
          className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white backdrop-blur",
            accent === "cyan" ? "border-cyan-300/50 bg-cyan-500/25" : "border-rose-400/50 bg-rose-500/25",
          )}
        >
          {name}
        </div>
      </div>
      {footer && <div className="mt-3">{footer}</div>}
    </div>
  );
}

function MiniFighter({ theme, name, accent }: { theme: RobotLook; name: string; accent: "cyan" | "rose" }) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative aspect-square w-full max-w-[190px]">
        <span
          className="absolute bottom-[3%] left-1/2 h-[8%] w-[60%] -translate-x-1/2 rounded-[50%] bg-black/45 blur-md"
          aria-hidden="true"
        />
        <div
          className={cn(
            "h-full w-full drop-shadow-[0_14px_18px_rgba(0,0,0,0.55)]",
            accent === "cyan" ? "robot-idle" : "robot-idle-slow",
          )}
        >
          <Robot theme={theme} />
        </div>
      </div>
      <span
        className={cn(
          "-mt-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white backdrop-blur",
          accent === "cyan" ? "border-cyan-300/50 bg-cyan-500/25" : "border-rose-400/50 bg-rose-500/25",
        )}
      >
        {name}
      </span>
    </div>
  );
}

function BrandPill() {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-white/30 bg-[#071b4a]/70 py-2 pl-2 pr-3 shadow-lg backdrop-blur">
      <span className="relative grid h-10 w-10 place-items-center rounded-xl border-2 border-white/50 bg-gradient-to-br from-[#45c7ff] to-[#0d5cff] text-white shadow-[0_4px_0_#083b9e]">
        <Icon name="gamepad" className="h-5 w-5" />
      </span>
      <div className="leading-none">
        <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-cyan-200">Game Interaktif</p>
        <p className="mt-0.5 text-xs font-extrabold text-white sm:text-sm">
          Robot <span className="text-amber-300">Hijaiyah</span>
        </p>
      </div>
    </div>
  );
}
