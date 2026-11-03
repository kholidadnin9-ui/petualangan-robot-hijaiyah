import { useEffect, useLayoutEffect, useRef, useState, type Ref } from "react";
import {
  arabicFor,
  buildQuestions,
  ENEMY_THEME,
  HARAKAT,
  phonetic,
  starsFor,
  type Level,
  type RobotLook,
  type RobotTheme,
} from "../data/game";
import type { SoundName } from "../hooks/useGameAudio";
import { HijaiyahGlyph } from "./HijaiyahSvg";
import { ARENA_IMAGE } from "../assets/images";
import { Robot } from "./Robot";
import { GameButton, Icon, SoundToggle, StarRow } from "./ui";
import { cn } from "../utils/cn";

export type BattleSummary = {
  levelId: number;
  correct: number;
  score: number;
  stars: number;
  bestStreak: number;
};

type BattleProps = {
  level: Level;
  robot: RobotTheme;
  soundOn: boolean;
  onToggleSound: () => void;
  onExit: () => void;
  onComplete: (summary: BattleSummary) => void;
  play: (name: SoundName) => void;
  speak: (arabic: string, fallback: string) => void;
};

type Feedback = {
  chosenIndex: number;
  correct: boolean;
  correctIndex: number;
};

type Beam = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  length: number;
  angle: number;
  thickness: number;
};

/** Jeda sampai laser mengenai sasaran (sinkron dengan animasi CSS). */
const HIT_DELAY = "0.24s";

export function BattleScreen({
  level,
  robot,
  soundOn,
  onToggleSound,
  onExit,
  onComplete,
  play,
  speak,
}: BattleProps) {
  const [questions] = useState(() => buildQuestions(level));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [playerHp, setPlayerHp] = useState(10);
  const [enemyHp, setEnemyHp] = useState(10);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showAnswerNames, setShowAnswerNames] = useState(false);
  const [beam, setBeam] = useState<Beam | null>(null);
  const completedRef = useRef(false);
  const arenaRef = useRef<HTMLDivElement>(null);
  const playerMuzzleRef = useRef<HTMLSpanElement>(null);
  const playerCoreRef = useRef<HTMLSpanElement>(null);
  const enemyMuzzleRef = useRef<HTMLSpanElement>(null);
  const enemyCoreRef = useRef<HTMLSpanElement>(null);

  const question = questions[index];
  const harakat = HARAKAT[level.harakat];
  const prompt = phonetic(question.target, level.harakat);
  const revealCorrect = feedback !== null;

  const listen = () => {
    play("select");
    speak(arabicFor(question.target, level.harakat), prompt);
  };

  // Bacakan soal otomatis saat berganti (suara bisa dimatikan orang tua).
  useEffect(() => {
    if (!soundOn) return;
    const target = questions[index];
    const timer = window.setTimeout(() => {
      speak(arabicFor(target.target, level.harakat), phonetic(target.target, level.harakat));
    }, 550);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, soundOn, level.harakat]);

  const finish = (finalCorrect: number, finalStreak: number) => {
    if (completedRef.current) return;
    completedRef.current = true;
    play("win");
    onComplete({
      levelId: level.id,
      correct: finalCorrect,
      score: finalCorrect * 10,
      stars: starsFor(finalCorrect),
      bestStreak: finalStreak,
    });
  };

  const nextQuestion = () => {
    if (selected === null) return;
    if (index >= questions.length - 1) {
      finish(correctCount, bestStreak);
      return;
    }
    play("click");
    setIndex((value) => value + 1);
    setSelected(null);
    setFeedback(null);
    setShowAnswerNames(false);
  };

  // Lanjut otomatis, dengan tombol "Lanjut" untuk melewati.
  useEffect(() => {
    if (selected === null) return;
    const timer = window.setTimeout(() => {
      nextQuestion();
    }, 5000);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, index]);

  const handleAnswer = (optionIndex: number) => {
    if (selected !== null) return;
    const isCorrect = optionIndex === question.correctIndex;
    setSelected(optionIndex);
    setFeedback({ chosenIndex: optionIndex, correct: isCorrect, correctIndex: question.correctIndex });
    setShowAnswerNames(true);
    play(isCorrect ? "laser" : "enemyLaser");
    if (isCorrect) {
      window.setTimeout(() => play("correct"), 260);
      setCorrectCount((value) => value + 1);
      setEnemyHp((value) => Math.max(0, value - 1));
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setBestStreak((best) => Math.max(best, nextStreak));
    } else {
      window.setTimeout(() => play("wrong"), 220);
      setPlayerHp((value) => Math.max(0, value - 1));
      setStreak(0);
    }
  };

  // Ukur moncong senjata → sasaran, agar laser tepat keluar dari blaster di semua ukuran layar.
  useLayoutEffect(() => {
    if (!feedback) {
      setBeam(null);
      return;
    }
    const arena = arenaRef.current;
    const from = (feedback.correct ? playerMuzzleRef : enemyMuzzleRef).current;
    const to = (feedback.correct ? enemyCoreRef : playerCoreRef).current;
    if (!arena || !from || !to) return;
    const box = arena.getBoundingClientRect();
    const start = from.getBoundingClientRect();
    const end = to.getBoundingClientRect();
    const x1 = start.left - box.left;
    const y1 = start.top - box.top;
    const x2 = end.left - box.left;
    const y2 = end.top - box.top;
    setBeam({
      x1,
      y1,
      x2,
      y2,
      length: Math.hypot(x2 - x1, y2 - y1),
      angle: (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI,
      thickness: box.width < 640 ? 10 : 14,
    });
  }, [feedback]);

  const playerAttack = feedback?.correct === true;
  const enemyAttack = feedback?.correct === false;
  const attackKey = feedback ? `${index}-${selected}` : "idle";
  const progress = ((index + (selected !== null ? 1 : 0)) / questions.length) * 100;
  const beamColors = playerAttack
    ? { core: robot.glow, edge: robot.primary }
    : { core: "#ffb36b", edge: "#ff2d4a" };

  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${ARENA_IMAGE})` }}
        aria-hidden="true"
      />
      <div className="fixed inset-0 bg-[linear-gradient(180deg,rgba(3,11,36,0.82),rgba(3,11,36,0.93))]" aria-hidden="true" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(53,201,255,0.16),transparent_60%)]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-5xl px-3 pb-8 pt-3 sm:px-5 sm:pt-4">
        {/* HUD */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={onExit}
              aria-label="Kembali ke peta level"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            >
              <Icon name="arrowLeft" className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-extrabold uppercase tracking-[0.2em] text-cyan-300">
                Level {level.id} · {level.title}
              </p>
              <p className="truncate text-sm font-extrabold leading-tight text-white">
                Soal {index + 1} <span className="text-white/50">dari {questions.length}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-xl border border-amber-300/40 bg-[#0a1c48]/80 px-2.5 py-1.5 sm:flex">
              <Icon name="star" filled className="h-4 w-4 text-amber-300" />
              <span className="text-xs font-extrabold text-white">{correctCount * 10}</span>
              <span className="text-[9px] font-bold uppercase text-cyan-100/60">poin</span>
            </div>
            <SoundToggle enabled={soundOn} onToggle={onToggleSound} />
          </div>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <div className="relative h-2.5 flex-1 overflow-hidden rounded-full border border-white/15 bg-white/10">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#35e0ff,#52f7a0,#ffd23f)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] font-extrabold text-cyan-100/70">
            {index + (selected !== null ? 1 : 0)}/{questions.length}
          </span>
        </div>

        {/* ARENA */}
        <div
          ref={arenaRef}
          className="relative overflow-hidden rounded-[1.75rem] border-2 border-cyan-300/40 bg-cover bg-center shadow-[0_0_0_4px_rgba(8,40,94,0.65),0_30px_70px_-30px_rgba(0,0,0,0.95)]"
          style={{ backgroundImage: `url(${ARENA_IMAGE})` }}
        >
          <div className="arena-stage absolute inset-0" aria-hidden="true" />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(4,14,40,0.75),transparent)]"
            aria-hidden="true"
          />

          {/* Sinar laser — di belakang robot & panel soal agar teks soal tidak tertutup */}
          {feedback && beam && (
            <div className="pointer-events-none absolute inset-0 z-[5]" aria-hidden="true">
              <div
                key={`beam-${attackKey}`}
                className="absolute"
                style={{
                  left: beam.x1,
                  top: beam.y1 - beam.thickness / 2,
                  width: beam.length,
                  height: beam.thickness,
                  transform: `rotate(${beam.angle}deg)`,
                  transformOrigin: `0 ${beam.thickness / 2}px`,
                }}
              >
                <div
                  className="laser-beam absolute inset-0 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, #ffffff 0%, ${beamColors.core} 18%, ${beamColors.edge} 72%, #ffffff 100%)`,
                    boxShadow: `0 0 14px 4px ${beamColors.core}cc, 0 0 36px 10px ${beamColors.edge}88`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Kilatan moncong blaster & ledakan di sasaran — di depan robot */}
          {feedback && beam && (
            <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
              <span
                key={`muzzle-${attackKey}`}
                className="impact-burst absolute rounded-full"
                style={{
                  left: beam.x1 - 22,
                  top: beam.y1 - 22,
                  width: 44,
                  height: 44,
                  background: `radial-gradient(circle, #ffffff 0%, ${beamColors.core} 42%, transparent 70%)`,
                }}
              />
              <span
                key={`impact-${attackKey}`}
                className="impact-burst absolute rounded-full"
                style={{
                  left: beam.x2 - 42,
                  top: beam.y2 - 42,
                  width: 84,
                  height: 84,
                  animationDelay: HIT_DELAY,
                  background:
                    "radial-gradient(circle, #fff9c4 0%, #ffd23f 30%, rgba(255,120,40,0.6) 52%, transparent 70%)",
                }}
              />
              <span
                key={`ring-${attackKey}`}
                className="impact-ring absolute rounded-full border-4"
                style={{
                  left: beam.x2 - 28,
                  top: beam.y2 - 28,
                  width: 56,
                  height: 56,
                  borderColor: beamColors.core,
                  animationDelay: HIT_DELAY,
                }}
              />
            </div>
          )}

          <div className="relative z-10 grid grid-cols-2 items-end gap-x-1 gap-y-2 px-2 pb-3 pt-3 sm:gap-x-3 sm:px-3 lg:grid-cols-[1fr_340px_1fr] lg:px-4 lg:pb-5">
            {/* PEMAIN */}
            <div className="order-2 flex min-w-0 flex-col items-center justify-end lg:order-1">
              <HpBar
                name={robot.name}
                hp={playerHp}
                color={robot.ring}
                align="left"
                hit={enemyAttack}
                key={`player-hp-${index}-${playerHp}`}
              />
              <Fighter
                key={`player-${attackKey}`}
                look={robot}
                label={`${robot.name}, robot pemain`}
                tag="Kamu"
                side="left"
                state={playerAttack ? "attack" : enemyAttack ? "hit" : "idle"}
                idle={!feedback}
                muzzleRef={playerMuzzleRef}
                coreRef={playerCoreRef}
              />
            </div>

            {/* KARTU SOAL */}
            <div className="order-1 col-span-2 flex w-full items-end justify-center lg:order-2 lg:col-span-1 lg:h-full">
              <div className="relative w-full max-w-[340px] rounded-2xl border-2 border-cyan-200/70 bg-[linear-gradient(165deg,rgba(10,40,96,0.97),rgba(4,16,50,0.98))] p-2.5 shadow-[0_0_0_3px_rgba(6,25,64,0.7),0_18px_36px_-16px_rgba(0,0,0,0.9)] sm:p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-cyan-400/15 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-cyan-200">
                    <Icon name="target" className="h-3 w-3" /> Bunyi apa ini?
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/50 bg-amber-300/10 px-2 py-0.5 text-[9px] font-extrabold text-amber-200">
                    {harakat.name}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={listen}
                    aria-label="Dengarkan bunyi huruf"
                    className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-white/60 bg-gradient-to-b from-[#45c7ff] to-[#0a63ec] text-white shadow-[0_4px_0_#083b9e] transition hover:scale-105 active:scale-95 sm:h-14 sm:w-14"
                  >
                    <Icon name="sound" className="h-6 w-6" />
                    {soundOn && (
                      <span className="pulse-ring pointer-events-none absolute inset-0 rounded-full border-2 border-cyan-300" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1 rounded-xl border border-cyan-300/40 bg-[#04123a]/90 px-3 py-1.5 text-center shadow-inner">
                    <p className="text-3xl font-extrabold leading-none tracking-wide text-white sm:text-4xl">{prompt}</p>
                    <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-cyan-200/70">
                      dengarkan lalu pilih
                    </p>
                  </div>
                </div>
                <p className="mt-1.5 text-center text-[10px] font-semibold text-cyan-100/75">
                  Cari kartu huruf yang berbunyi <span className="font-extrabold text-amber-300">“{prompt}”</span>
                </p>
              </div>
            </div>

            {/* LAWAN */}
            <div className="order-3 flex min-w-0 flex-col items-center justify-end">
              <HpBar
                name={ENEMY_THEME.name}
                hp={enemyHp}
                color={ENEMY_THEME.ring}
                align="right"
                hit={playerAttack}
                key={`enemy-hp-${index}-${enemyHp}`}
              />
              <Fighter
                key={`enemy-${attackKey}`}
                look={ENEMY_THEME}
                label={`${ENEMY_THEME.name}, robot lawan`}
                tag="Lawan"
                side="right"
                state={enemyAttack ? "attack" : playerAttack ? "hit" : "idle"}
                idle={!feedback}
                muzzleRef={enemyMuzzleRef}
                coreRef={enemyCoreRef}
              />
            </div>
          </div>
        </div>

        {/* FEEDBACK */}
        <div className="mt-3 min-h-[68px]">
          {!feedback && (
            <div className="flex h-full items-center gap-2.5 rounded-2xl border border-cyan-300/25 bg-[#071c4b]/90 px-3 py-2.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cyan-400/15 text-cyan-200">
                <Icon name="info" className="h-5 w-5" />
              </span>
              <p className="text-[11px] font-semibold leading-snug text-cyan-50/85 sm:text-xs">
                Pilih satu kartu huruf di bawah. Jawaban benar = robotmu menembakkan blaster laser!
                {streak > 1 && <span className="ml-1 font-extrabold text-amber-300">🔥 {streak} benar beruntun!</span>}
              </p>
            </div>
          )}
          {feedback && (
            <div
              className={cn(
                "pop-in flex flex-col gap-2 rounded-2xl border-2 px-3 py-2.5 sm:flex-row sm:items-center",
                feedback.correct
                  ? "border-emerald-300/60 bg-[linear-gradient(120deg,rgba(4,80,60,0.95),rgba(5,50,72,0.95))]"
                  : "border-rose-300/60 bg-[linear-gradient(120deg,rgba(84,12,42,0.95),rgba(52,14,55,0.95))]",
              )}
              role="status"
              aria-live="polite"
            >
              <span
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-full text-white shadow",
                  feedback.correct ? "bg-emerald-500" : "bg-rose-500",
                )}
              >
                <Icon name={feedback.correct ? "check" : "close"} className="h-6 w-6" strokeWidth={3} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold text-white sm:text-sm">
                  {feedback.correct
                    ? `Tepat! Bunyi “${prompt}” adalah huruf ${question.target.name}. Laser meluncur! ⚡`
                    : `Belum tepat. Itu huruf ${question.options[feedback.chosenIndex].name}.`}
                </p>
                <p className="text-[11px] font-semibold text-white/75">
                  {feedback.correct ? (
                    <span className="inline-flex items-center gap-1">
                      <StarRow count={Math.min(3, Math.max(1, Math.ceil(streak / 3)))} starClassName="h-3.5 w-3.5" />
                      +10 poin untukmu!
                    </span>
                  ) : (
                    <>
                      Jawaban yang benar adalah <b className="text-amber-300">huruf {question.target.name}</b>. Ingat
                      bentuknya ya!
                    </>
                  )}
                </p>
              </div>
              <GameButton
                size="sm"
                variant={feedback.correct ? "teal" : "white"}
                onClick={nextQuestion}
                className="shrink-0"
              >
                {index === questions.length - 1 ? "Lihat Hasil" : "Lanjut"}
                <Icon name="arrowRight" className="h-4 w-4" />
              </GameButton>
            </div>
          )}
        </div>

        {/* PILIHAN JAWABAN */}
        <div className="mt-3 rounded-[1.75rem] border-2 border-cyan-300/30 bg-[#061a44]/95 p-2.5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.9)] sm:p-4">
          <div className="flex items-center justify-between gap-2 px-1">
            <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-cyan-200 sm:text-[11px]">
              <Icon name="sparkles" className="h-3.5 w-3.5 text-amber-300" /> Pilih huruf hijaiyah
            </p>
            <p className="text-[10px] font-bold text-cyan-100/55">{harakat.hint}</p>
          </div>
          <div className="mx-auto mt-2 grid max-w-[560px] grid-cols-3 gap-2 sm:gap-3">
            {question.options.map((letter, optionIndex) => {
              const isChosen = selected === optionIndex;
              const isCorrectOption = optionIndex === question.correctIndex;
              const dimmed = revealCorrect && !isChosen && !isCorrectOption;
              const showCorrect = revealCorrect && isCorrectOption;
              return (
                <button
                  key={`${question.key}-${letter.id}`}
                  type="button"
                  onClick={() => handleAnswer(optionIndex)}
                  disabled={revealCorrect}
                  aria-label={`Pilih huruf ${letter.name}`}
                  className={cn(
                    "group relative rounded-[1.4rem] p-1 outline-none transition-all duration-200 focus-visible:ring-4 focus-visible:ring-amber-300",
                    !revealCorrect && "hover:-translate-y-1 hover:scale-[1.02] active:translate-y-0",
                    dimmed && "scale-95 opacity-40 saturate-50",
                    showCorrect && "scale-[1.03] ring-4 ring-emerald-300",
                    isChosen && !isCorrectOption && "ring-4 ring-rose-400",
                  )}
                >
                  <span
                    className={cn(
                      "absolute -left-1 -top-1 z-10 grid h-7 w-7 place-items-center rounded-full border-2 border-white text-[11px] font-extrabold shadow-md",
                      showCorrect
                        ? "bg-emerald-500 text-white"
                        : isChosen && !isCorrectOption
                          ? "bg-rose-500 text-white"
                          : "bg-[#0d2f6b] text-cyan-100",
                    )}
                  >
                    {showCorrect ? (
                      <Icon name="check" className="h-4 w-4" strokeWidth={3} />
                    ) : isChosen && !isCorrectOption ? (
                      <Icon name="close" className="h-4 w-4" strokeWidth={3} />
                    ) : (
                      ["A", "B", "C"][optionIndex]
                    )}
                  </span>
                  <HijaiyahGlyph letter={letter} harakat={level.harakat} tone={showCorrect ? "gold" : "light"} />
                  {showAnswerNames && (
                    <span
                      className={cn(
                        "absolute inset-x-2 bottom-2 rounded-lg py-0.5 text-center text-[9px] font-extrabold uppercase tracking-wide",
                        showCorrect ? "bg-emerald-600/95 text-white" : "bg-[#0b2a5f]/90 text-cyan-100",
                      )}
                    >
                      {letter.name}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2 px-1 text-[10px] font-semibold text-cyan-100/50">
          <span>
            Level {level.id} · {harakat.name}
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon name="clock" className="h-3.5 w-3.5" /> lanjut otomatis setelah jawaban
          </span>
        </div>
      </div>
    </div>
  );
}

function Fighter({
  look,
  label,
  tag,
  side,
  state,
  idle,
  muzzleRef,
  coreRef,
}: {
  look: RobotLook;
  label: string;
  tag: string;
  side: "left" | "right";
  state: "idle" | "attack" | "hit";
  idle: boolean;
  muzzleRef: Ref<HTMLSpanElement>;
  coreRef: Ref<HTMLSpanElement>;
}) {
  const isPlayer = side === "left";
  return (
    <div
      className={cn(
        "relative mt-0.5 aspect-square w-[136px] sm:w-[178px] lg:w-[250px]",
        state === "attack" && (isPlayer ? "recoil-left" : "recoil-right"),
        state === "hit" && "robot-hit",
      )}
      style={state === "hit" ? { animationDelay: HIT_DELAY } : undefined}
    >
      <span
        className="absolute bottom-[2%] left-1/2 h-[8%] w-[58%] -translate-x-1/2 rounded-[50%] bg-black/55 blur-[4px]"
        aria-hidden="true"
      />
      <div className={cn("relative h-full w-full", idle && (isPlayer ? "robot-idle" : "robot-idle-slow"))}>
        <Robot
          theme={look}
          label={label}
          className="drop-shadow-[0_12px_14px_rgba(0,0,0,0.5)]"
          imgClassName={state === "hit" ? "hit-flash" : undefined}
        >
          <span
            ref={muzzleRef}
            className="absolute h-px w-px"
            style={{ left: `${look.muzzle.x}%`, top: `${look.muzzle.y}%` }}
          />
          <span
            ref={coreRef}
            className="absolute h-px w-px"
            style={{ left: `${look.core.x}%`, top: `${look.core.y}%` }}
          />
        </Robot>
      </div>
      {state === "hit" && (
        <span
          className={cn(
            "damage-float pointer-events-none absolute top-0 rounded-lg px-2 py-0.5 text-xs font-extrabold shadow-lg",
            isPlayer ? "right-2 bg-rose-500 text-white" : "left-2 bg-amber-400 text-[#4a2a00]",
          )}
          style={{ animationDelay: HIT_DELAY }}
        >
          -10
        </span>
      )}
      <span
        className={cn(
          "absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide backdrop-blur",
          isPlayer ? "border-white/25 bg-[#06173f]/90 text-white" : "border-rose-300/30 bg-[#2a0f24]/90 text-rose-100",
        )}
      >
        {tag}
      </span>
    </div>
  );
}

function HpBar({
  name,
  hp,
  color,
  align,
  hit,
}: {
  name: string;
  hp: number;
  color: string;
  align: "left" | "right";
  hit: boolean;
}) {
  return (
    <div
      className={cn(
        "w-full max-w-[190px] rounded-xl border border-white/20 bg-[#04122f]/85 px-1.5 py-1 backdrop-blur-sm",
        hit && "border-rose-400/70",
      )}
    >
      <div className={cn("flex items-center gap-1", align === "right" && "flex-row-reverse")}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
        <span className="truncate text-[8px] font-extrabold uppercase tracking-wide text-white sm:text-[9px]">{name}</span>
        <span className={cn("text-[8px] font-extrabold text-cyan-200/80", align === "right" ? "mr-auto" : "ml-auto")}>
          {hp * 10}
        </span>
      </div>
      <div className={cn("mt-0.5 flex gap-[2px]", align === "right" && "flex-row-reverse")}>
        {Array.from({ length: 10 }).map((_, segment) => (
          <span
            key={segment}
            className={cn("h-1.5 flex-1 rounded-sm transition-colors duration-300", segment >= hp && "bg-white/10")}
            style={segment < hp ? { background: color } : undefined}
          />
        ))}
      </div>
    </div>
  );
}
