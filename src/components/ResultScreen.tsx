import { LETTERS, LEVELS, type Level, type RobotTheme } from "../data/game";
import type { BattleSummary } from "./BattleScreen";
import { HijaiyahGlyph } from "./HijaiyahSvg";
import { ARENA_IMAGE } from "../assets/images";
import { Robot } from "./Robot";
import { GameButton, Icon, SoundToggle, StarRow } from "./ui";

type ResultProps = {
  summary: BattleSummary;
  level: Level;
  robot: RobotTheme;
  soundOn: boolean;
  onToggleSound: () => void;
  onReplay: () => void;
  onNextLevel: (level: Level) => void;
  onMap: () => void;
};

const confettiColors = ["#ffd23f", "#52f7a0", "#35e0ff", "#ff6ad5", "#a78bfa", "#ff7a45"];

export function ResultScreen({
  summary,
  level,
  robot,
  soundOn,
  onToggleSound,
  onReplay,
  onNextLevel,
  onMap,
}: ResultProps) {
  const stars = summary.stars;
  const next = LEVELS.find((item) => item.id === level.id + 1);
  const perfect = summary.correct === 10;
  const title = perfect ? "Sempurna!" : stars === 3 ? "Luar Biasa!" : stars === 2 ? "Hebat Sekali!" : "Misi Selesai!";
  const practiced = level.targets
    .slice(0, 5)
    .map((id) => LETTERS.find((letter) => letter.id === id))
    .filter(Boolean);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${ARENA_IMAGE})` }}
        aria-hidden="true"
      />
      <div className="fixed inset-0 bg-[linear-gradient(180deg,rgba(4,14,44,0.8),rgba(4,13,40,0.94))]" aria-hidden="true" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,210,63,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(82,155,255,0.2),transparent_60%)]" aria-hidden="true" />

      {/* Confetti */}
      <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden" aria-hidden="true">
        {Array.from({ length: 34 }).map((_, index) => {
          const left = (index * 37) % 100;
          const delay = (index % 12) * 0.35;
          const duration = 5 + (index % 7) * 0.65;
          const size = 6 + (index % 4) * 3;
          return (
            <span
              key={index}
              className="confetti-piece absolute top-0 block rounded-sm"
              style={{
                left: `${left}%`,
                width: size,
                height: size * 1.7,
                background: confettiColors[index % confettiColors.length],
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                opacity: 0.85,
              }}
            />
          );
        })}
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-cyan-100 backdrop-blur">
            <Icon name="trophy" className="h-4 w-4 text-amber-300" /> Hasil Misi
          </div>
          <SoundToggle enabled={soundOn} onToggle={onToggleSound} />
        </div>

        <div className="flex flex-1 items-center justify-center py-4">
          <div className="pop-in relative w-full overflow-hidden rounded-[2rem] border-2 border-amber-300/50 bg-[linear-gradient(165deg,rgba(12,42,98,0.97),rgba(5,16,48,0.98))] p-4 text-center shadow-[0_0_0_5px_rgba(8,40,94,0.55),0_35px_80px_-30px_rgba(0,0,0,0.95)] sm:p-7">
            <div className="shop-stripe pointer-events-none absolute inset-x-0 top-0 h-20 opacity-10" />
            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-10 h-52 w-52 rounded-full bg-fuchsia-500/20 blur-3xl" />

            <div className="relative">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-cyan-200">
                Level {level.id} · {level.title}
              </p>
              <h1 className="title-gold mt-1 text-4xl font-extrabold uppercase leading-none sm:text-6xl">{title}</h1>
              <p className="mt-2 text-sm font-semibold text-cyan-100/80">
                {perfect
                  ? "Semua soal benar! Robot lawan berhasil dikalahkan dengan sempurna."
                  : stars === 3
                    ? "Robotmu menang! Kamu sangat hebat mengenali huruf hijaiyah."
                    : stars === 2
                      ? "Robot lawan berhasil dikalahkan. Sedikit lagi menuju 3 bintang!"
                      : "Misi selesai! Terus berlatih, kamu pasti makin pandai."}
              </p>

              <div className="mt-4 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-6">
                <div className="relative h-44 w-44 shrink-0 sm:h-52 sm:w-52">
                  <div className="robot-idle h-full w-full drop-shadow-[0_18px_22px_rgba(0,0,0,0.55)]">
                    <Robot theme={robot} />
                  </div>
                  <span className="absolute -right-1 top-4 rounded-full border border-amber-300/60 bg-amber-400 px-2 py-0.5 text-[10px] font-extrabold text-[#4a2a00] shadow-lg">
                    Menang!
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3].map((star) => (
                      <span
                        key={star}
                        style={{ animationDelay: `${star * 0.18}s` }}
                        className={star <= stars ? "star-pop" : ""}
                      >
                        <Icon
                          name="star"
                          filled
                          className={
                            star <= stars
                              ? "h-14 w-14 text-amber-300 drop-shadow-[0_5px_0_rgba(154,80,0,0.8)] sm:h-16 sm:w-16"
                              : "h-14 w-14 text-white/15 sm:h-16 sm:w-16"
                          }
                        />
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="rounded-xl border border-white/15 bg-white/[0.07] px-3 py-1.5">
                      <p className="text-[9px] font-bold uppercase text-cyan-100/60">Benar</p>
                      <p className="text-lg font-extrabold leading-none text-white">{summary.correct}/10</p>
                    </div>
                    <div className="rounded-xl border border-white/15 bg-white/[0.07] px-3 py-1.5">
                      <p className="text-[9px] font-bold uppercase text-cyan-100/60">Poin</p>
                      <p className="text-lg font-extrabold leading-none text-amber-300">{summary.score}</p>
                    </div>
                    <div className="rounded-xl border border-white/15 bg-white/[0.07] px-3 py-1.5">
                      <p className="text-[9px] font-bold uppercase text-cyan-100/60">Beruntun</p>
                      <p className="text-lg font-extrabold leading-none text-emerald-300">{summary.bestStreak}×</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] p-2.5">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-cyan-200/70">Huruf yang dilatih</p>
                <div className="mt-1.5 flex items-center justify-center gap-1.5">
                  {practiced.map((letter) =>
                    letter ? (
                      <div key={letter.id} className="w-10 sm:w-12">
                        <HijaiyahGlyph letter={letter} harakat={level.harakat} />
                      </div>
                    ) : null,
                  )}
                  <div className="ml-1 text-left">
                    <StarRow count={stars} starClassName="h-3 w-3" />
                    <p className="text-[9px] font-bold text-cyan-100/55">+ huruf lainnya</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
                {next ? (
                  <GameButton size="lg" onClick={() => onNextLevel(next)}>
                    Level {next.id} <Icon name="arrowRight" className="h-5 w-5" />
                  </GameButton>
                ) : (
                  <GameButton size="lg" onClick={onMap}>
                    <Icon name="trophy" className="h-5 w-5" /> Semua Level Selesai!
                  </GameButton>
                )}
                <GameButton size="lg" variant="white" onClick={onReplay}>
                  <Icon name="replay" className="h-5 w-5" /> Main Lagi
                </GameButton>
                <GameButton size="lg" variant="ghost" onClick={onMap}>
                  <Icon name="map" className="h-5 w-5" /> Peta Level
                </GameButton>
              </div>
              <p className="mt-3 text-[10px] font-semibold text-cyan-100/45">
                {next ? `Level ${next.id} menantimu di peta petualangan.` : "Kamu sudah menjelajahi semua harakat. Luar biasa!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
