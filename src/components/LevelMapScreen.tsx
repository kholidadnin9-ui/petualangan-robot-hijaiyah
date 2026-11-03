import { useState } from "react";
import {
  LETTERS,
  LEVELS,
  type Level,
  type Progress,
  type RobotId,
  type RobotTheme,
} from "../data/game";
import { HijaiyahGlyph } from "./HijaiyahSvg";
import { CITY_HERO_IMAGE } from "../assets/images";
import { Robot, RobotColorPicker } from "./Robot";
import { GameButton, Icon, SoundToggle, StarRow } from "./ui";

type LevelMapProps = {
  selectedRobot: RobotTheme;
  onSelectRobot: (id: RobotId) => void;
  onPlayLevel: (level: Level) => void;
  onHome: () => void;
  onLearn: () => void;
  onResetProgress: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
  progress: Progress;
};

export function LevelMapScreen({
  selectedRobot,
  onSelectRobot,
  onPlayLevel,
  onHome,
  onLearn,
  onResetProgress,
  soundOn,
  onToggleSound,
  progress,
}: LevelMapProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  const totalStars = Object.values(progress).reduce((sum, item) => sum + (item?.stars ?? 0), 0);
  const finished = Object.values(progress).filter((item) => item?.done).length;
  const nextLevel = LEVELS.find((level) => !progress[level.id]?.done) ?? LEVELS[LEVELS.length - 1];

  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${CITY_HERO_IMAGE})` }}
        aria-hidden="true"
      />
      <div className="fixed inset-0 bg-[linear-gradient(180deg,rgba(4,14,44,0.86),rgba(4,13,40,0.94))]" aria-hidden="true" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(60,200,255,0.2),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.2),transparent_55%)]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-14 pt-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onHome}
            className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-xs font-extrabold text-white backdrop-blur transition hover:bg-white/20"
          >
            <Icon name="arrowLeft" className="h-4 w-4" /> Beranda
          </button>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/50 bg-amber-300/10 px-3 py-1.5 text-[11px] font-extrabold text-amber-200">
              <Icon name="star" filled className="h-3.5 w-3.5" /> {totalStars} / 18 bintang
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/40 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-extrabold text-emerald-200">
              <Icon name="check" className="h-3.5 w-3.5" /> {finished} / 6 level
            </span>
          </div>
          <SoundToggle enabled={soundOn} onToggle={onToggleSound} />
        </div>

        <header className="mx-auto mt-7 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-[#0a2458]/80 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.24em] text-cyan-200 backdrop-blur">
            <Icon name="map" className="h-4 w-4 text-amber-300" /> Misi Robot Hijaiyah
          </div>
          <h1 className="mt-2 leading-[0.9]">
            <span className="title-gold block text-4xl font-extrabold uppercase sm:text-5xl">Peta Petualangan</span>
          </h1>
          <p className="mt-2 text-sm font-semibold text-cyan-100/80 sm:text-base">
            Pilih misi harakatmu. Selesaikan 10 soal di setiap level untuk mengumpulkan bintang!
          </p>
        </header>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_290px]">
          <div className="grid content-start gap-3 sm:grid-cols-2">
            {LEVELS.map((level) => {
              const result = progress[level.id];
              const recommended = nextLevel.id === level.id;
              const sample =
                LETTERS.find((letter) => letter.id === level.targets[0]) ?? LETTERS[1];
              return (
                <div
                  key={level.id}
                  className="group relative overflow-hidden rounded-[1.6rem] border-2 border-white/15 bg-[#081b47]/90 p-3.5 shadow-[0_20px_45px_-28px_rgba(0,0,0,0.9)] transition hover:-translate-y-0.5 hover:border-cyan-300/50"
                >
                  <div
                    className="pointer-events-none absolute -right-10 -top-14 h-36 w-36 rounded-full blur-2xl"
                    style={{ background: `${level.to}44` }}
                  />
                  <div className="relative flex items-start gap-3">
                    <div className="flex h-[74px] w-[74px] shrink-0 flex-col items-center justify-center rounded-2xl border-2 border-white/25 bg-white p-1 shadow-lg">
                      <HijaiyahGlyph letter={sample} harakat={level.harakat} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#08122b]"
                          style={{ background: `linear-gradient(135deg, ${level.to}, ${level.from})` }}
                        >
                          Level {level.id}
                        </span>
                        {recommended && (
                          <span className="rounded-full border border-amber-300/50 bg-amber-300/15 px-2 py-0.5 text-[9px] font-extrabold uppercase text-amber-200">
                            Mulai di sini
                          </span>
                        )}
                        {result?.done && (
                          <span className="rounded-full border border-emerald-300/40 bg-emerald-400/15 px-2 py-0.5 text-[9px] font-extrabold uppercase text-emerald-200">
                            Selesai
                          </span>
                        )}
                      </div>
                      <h2 className="mt-1 text-lg font-extrabold leading-tight text-white">{level.title}</h2>
                      <p className="text-[11px] font-semibold text-cyan-100/70">{level.description}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <StarRow count={result?.stars ?? 0} starClassName="h-4 w-4" />
                        <span className="text-[10px] font-bold text-cyan-100/50">
                          {result ? `Skor terbaik ${result.bestScore}/10` : "10 soal · 3 pilihan"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-3 flex items-center gap-2">
                    <GameButton
                      size="sm"
                      variant={recommended ? "primary" : "blue"}
                      onClick={() => onPlayLevel(level)}
                      className="flex-1"
                    >
                      <Icon name="play" filled className="h-4 w-4" />
                      {result?.done ? "Main Lagi" : "Mulai Misi"}
                    </GameButton>
                    <span className="flex items-center gap-1 rounded-xl border border-white/15 bg-white/[0.06] px-2 py-2 text-[10px] font-bold text-cyan-100/70">
                      <Icon name="target" className="h-4 w-4 text-cyan-300" /> 10
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="space-y-3">
            <div className="relative overflow-hidden rounded-[1.6rem] border-2 border-cyan-300/30 bg-[linear-gradient(160deg,#0b2a66,#091638)] p-4 text-center">
              <div
                className="pointer-events-none absolute -top-12 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-2xl"
                style={{ background: selectedRobot.ring, opacity: 0.25 }}
              />
              <p className="relative text-[10px] font-extrabold uppercase tracking-[0.24em] text-cyan-200">Robotmu</p>
              <div className="relative mx-auto mt-1 aspect-square w-48 drop-shadow-[0_14px_18px_rgba(0,0,0,0.5)]">
                <div className="robot-idle h-full w-full">
                  <Robot theme={selectedRobot} />
                </div>
              </div>
              <p
                className="relative text-[10px] font-extrabold uppercase tracking-[0.18em]"
                style={{ color: selectedRobot.ring }}
              >
                Robot {selectedRobot.colorName}
              </p>
              <p className="relative text-lg font-extrabold leading-tight text-white">{selectedRobot.name}</p>
              <p className="relative text-[11px] font-semibold text-cyan-100/75">{selectedRobot.title}</p>
              <div className="relative mt-3 rounded-xl border border-white/15 bg-white/[0.06] p-2">
                <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-cyan-100/80">
                  Pilih warna robot
                </p>
                <RobotColorPicker
                  selectedId={selectedRobot.id}
                  onSelect={onSelectRobot}
                  size="sm"
                  className="justify-center"
                />
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-white/15 bg-[#081b47]/90 p-4">
              <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.22em] text-amber-300">
                <Icon name="sparkles" className="h-3.5 w-3.5" /> Cara Main
              </p>
              <ol className="mt-2 space-y-2 text-[11px] font-semibold leading-snug text-cyan-50/85">
                {[
                  "Dengarkan bunyi huruf pada kartu soal.",
                  "Pilih 1 dari 3 kartu huruf hijaiyah.",
                  "Jawaban benar = laser menembak robot lawan.",
                  "Kumpulkan 3 bintang di setiap level!",
                ].map((tip, index) => (
                  <li key={tip} className="flex gap-2">
                    <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-cyan-400/20 text-[9px] font-extrabold text-cyan-200">
                      {index + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-[1.6rem] border border-white/15 bg-[#081b47]/90 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-cyan-200">Progres Belajar</p>
                <Icon name="trophy" className="h-4 w-4 text-amber-300" />
              </div>
              <div className="mt-3 space-y-2.5">
                <ProgressRow label="Level selesai" value={finished} total={6} color="#52f7a0" />
                <ProgressRow label="Bintang terkumpul" value={totalStars} total={18} color="#ffd23f" />
              </div>
              <GameButton variant="teal" size="sm" full className="mt-3" onClick={onLearn}>
                <Icon name="book" className="h-4 w-4" /> Kamus 29 Huruf
              </GameButton>
              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="mt-2 w-full rounded-lg px-2 py-1 text-[10px] font-bold text-cyan-100/45 transition hover:text-rose-300"
                >
                  Atur ulang progres
                </button>
              ) : (
                <div className="mt-2 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onResetProgress();
                      setConfirmReset(false);
                    }}
                    className="flex-1 rounded-lg border border-rose-400/50 bg-rose-500/20 px-2 py-1 text-[10px] font-extrabold text-rose-200"
                  >
                    Ya, hapus
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-[10px] font-extrabold text-white"
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] font-bold text-cyan-100/75">
        <span>{label}</span>
        <span className="text-white">
          {value}/{total}
        </span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(value / total) * 100}%`, background: color }}
        />
      </div>
    </div>
  );
}
