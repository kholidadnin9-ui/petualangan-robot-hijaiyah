import { useCallback, useEffect, useMemo, useState } from "react";
import {
  arabicFor,
  ENEMY_THEME,
  LEVELS,
  loadProgress,
  ROBOTS,
  saveProgress,
  type Level,
  type Progress,
  type RobotId,
} from "./data/game";
import { useGameAudio } from "./hooks/useGameAudio";
import { BattleScreen, type BattleSummary } from "./components/BattleScreen";
import { HomeScreen } from "./components/HomeScreen";
import { LearnScreen } from "./components/LearnScreen";
import { LevelMapScreen } from "./components/LevelMapScreen";
import { ResultScreen } from "./components/ResultScreen";
import { GameButton, Icon } from "./components/ui";

type Screen = "home" | "map" | "play" | "learn" | "result";

function readRobot(): RobotId {
  try {
    const saved = localStorage.getItem("robot-hijaiyah-robot-v1");
    if (saved && ROBOTS.some((robot) => robot.id === saved)) return saved as RobotId;
  } catch {
    // abaikan
  }
  return "biru";
}

function readSound() {
  try {
    return localStorage.getItem("robot-hijaiyah-sound-v1") !== "off";
  } catch {
    return true;
  }
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [robotId, setRobotId] = useState<RobotId>(readRobot);
  const [soundOn, setSoundOn] = useState<boolean>(readSound);
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [currentLevel, setCurrentLevel] = useState<Level>(LEVELS[0]);
  const [summary, setSummary] = useState<BattleSummary | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [session, setSession] = useState(0);

  const { play, speak } = useGameAudio(soundOn);
  const robot = useMemo(() => ROBOTS.find((item) => item.id === robotId) ?? ROBOTS[1], [robotId]);
  const hasProgress = Object.keys(progress).length > 0;

  useEffect(() => {
    try {
      localStorage.setItem("robot-hijaiyah-robot-v1", robotId);
    } catch {
      // penyimpanan opsional
    }
  }, [robotId]);

  useEffect(() => {
    try {
      localStorage.setItem("robot-hijaiyah-sound-v1", soundOn ? "on" : "off");
    } catch {
      // penyimpanan opsional
    }
  }, [soundOn]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [screen]);

  // Muat semua gambar robot lebih awal agar ganti warna terasa instan.
  useEffect(() => {
    [...ROBOTS.map((item) => item.image), ENEMY_THEME.image].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (!helpOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setHelpOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [helpOpen]);

  const startLevel = useCallback(
    (level: Level) => {
      play("select");
      setCurrentLevel(level);
      setSummary(null);
      setSession((value) => value + 1);
      setScreen("play");
    },
    [play],
  );

  const handleComplete = useCallback(
    (result: BattleSummary) => {
      setProgress((previous) => {
        const old = previous[result.levelId];
        const next: Progress = {
          ...previous,
          [result.levelId]: {
            stars: Math.max(old?.stars ?? 0, result.stars),
            bestScore: Math.max(old?.bestScore ?? 0, result.score),
            done: true,
          },
        };
        saveProgress(next);
        return next;
      });
      setSummary(result);
      setScreen("result");
    },
    [],
  );

  const handleSelectRobot = useCallback(
    (id: RobotId) => {
      setRobotId(id);
      play("select");
    },
    [play],
  );

  const handleToggleSound = useCallback(() => {
    setSoundOn((value) => {
      if (!value) {
        window.setTimeout(() => play("select"), 80);
      }
      return !value;
    });
  }, [play]);

  const handleResetProgress = useCallback(() => {
    setProgress({});
    saveProgress({});
    play("click");
  }, [play]);



  const openHelp = useCallback(() => {
    play("click");
    setHelpOpen(true);
  }, [play]);

  const home = (
    <HomeScreen
      selectedRobot={robot}
      onSelectRobot={handleSelectRobot}
      onStart={() => {
        if (hasProgress) {
          play("select");
          setScreen("map");
        } else {
          startLevel(LEVELS[0]);
        }
      }}
      onOpenMap={() => {
        play("select");
        setScreen("map");
      }}
      onOpenLearn={() => {
        play("select");
        setScreen("learn");
      }}
      onOpenHelp={openHelp}
      onPickLevel={startLevel}
      soundOn={soundOn}
      onToggleSound={handleToggleSound}
      progress={progress}
      onDemoAnswer={(correct) => {
        if (correct) {
          play("correct");
          speak(arabicFor(fathahAlif, "fathah"), "A");
        } else {
          play("wrong");
        }
      }}
      onPronounce={() => {
        play("select");
        speak("اَ", "A");
      }}
    />
  );

  return (
    <div className="min-h-screen bg-[#040d2a] font-sans text-white">
      {screen === "home" && home}

      {screen === "map" && (
        <LevelMapScreen
          selectedRobot={robot}
          onSelectRobot={handleSelectRobot}
          onPlayLevel={startLevel}
          onHome={() => {
            play("click");
            setScreen("home");
          }}
          onLearn={() => {
            play("select");
            setScreen("learn");
          }}
          onResetProgress={handleResetProgress}
          soundOn={soundOn}
          onToggleSound={handleToggleSound}
          progress={progress}
        />
      )}

      {screen === "play" && (
        <BattleScreen
          key={`battle-${currentLevel.id}-${session}`}
          level={currentLevel}
          robot={robot}
          soundOn={soundOn}
          onToggleSound={handleToggleSound}
          onExit={() => {
            play("click");
            setScreen("map");
          }}
          onComplete={handleComplete}
          play={play}
          speak={speak}
        />
      )}

      {screen === "learn" && (
        <LearnScreen
          robot={robot}
          soundOn={soundOn}
          onToggleSound={handleToggleSound}
          onBack={() => {
            play("click");
            setScreen("home");
          }}
          onPlayLevel={startLevel}
          play={play}
          speak={speak}
        />
      )}

      {screen === "result" && summary && (
        <ResultScreen
          summary={summary}
          level={LEVELS.find((level) => level.id === summary.levelId) ?? currentLevel}
          robot={robot}
          soundOn={soundOn}
          onToggleSound={handleToggleSound}
          onReplay={() => startLevel(LEVELS.find((level) => level.id === summary.levelId) ?? currentLevel)}
          onNextLevel={startLevel}
          onMap={() => {
            play("click");
            setScreen("map");
          }}
        />
      )}

      {screen === "result" && !summary && (
        <div className="grid min-h-screen place-items-center p-6">
          <GameButton onClick={() => setScreen("map")}>Kembali ke Peta Level</GameButton>
        </div>
      )}

      {helpOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#020a20]/85 p-3 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-title"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setHelpOpen(false);
          }}
        >
          <div className="pop-in relative my-6 w-full max-w-lg overflow-hidden rounded-[1.75rem] border-2 border-cyan-300/40 bg-[linear-gradient(165deg,#0b2a66,#061634)] p-5 shadow-2xl">
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
            <button
              type="button"
              onClick={() => setHelpOpen(false)}
              aria-label="Tutup panduan"
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#4a2a00]">
                <Icon name="gamepad" className="h-3.5 w-3.5" /> Cara Main
              </span>
              <h2 id="help-title" className="mt-2 text-2xl font-extrabold text-white">
                Petualangan Robot Hijaiyah
              </h2>
              <p className="text-xs font-semibold text-cyan-100/70">
                Game belajar huruf hijaiyah untuk anak usia 5–6 tahun. Mainkan bersama pendamping ya!
              </p>

              <div className="mt-3 space-y-2">
                {[
                  {
                    icon: "robot" as const,
                    title: "1. Pilih warna robotmu",
                    text: "Pilih robot merah, biru, pink, atau ungu. Robotmu membawa blaster laser!",
                  },
                  {
                    icon: "sound" as const,
                    title: "2. Dengarkan bunyi huruf",
                    text: "Soal menampilkan bunyi huruf, misalnya “A”. Ketuk tombol speaker untuk mendengarnya lagi.",
                  },
                  {
                    icon: "target" as const,
                    title: "3. Pilih 1 dari 3 kartu",
                    text: "Ketuk gambar huruf hijaiyah yang sesuai. Jawaban benar membuat robotmu menembakkan laser.",
                  },
                  {
                    icon: "star" as const,
                    title: "4. Kumpulkan bintang",
                    text: "Ada 6 level harakat × 10 soal. Jawab benar minimal 9 soal untuk mendapat 3 bintang.",
                  },
                ].map((step) => (
                  <div key={step.title} className="flex gap-2.5 rounded-xl border border-white/10 bg-white/[0.06] p-2.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cyan-400/15 text-cyan-200">
                      <Icon name={step.icon === "robot" ? "gamepad" : step.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-extrabold text-white">{step.title}</p>
                      <p className="text-[11px] font-semibold leading-snug text-cyan-100/70">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-300/30 bg-amber-300/10 px-3 py-2">
                <Icon name="info" className="h-4 w-4 shrink-0 text-amber-300" />
                <p className="text-[10px] font-semibold leading-snug text-amber-100/80">
                  Tidak ada timer dan tidak ada iklan. Progres tersimpan otomatis di perangkat ini. Suara bisa
                  dimatikan kapan saja, termasuk pelafalan huruf.
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <GameButton
                  full
                  onClick={() => {
                    setHelpOpen(false);
                    startLevel(LEVELS[0]);
                  }}
                >
                  <Icon name="play" filled className="h-4 w-4" /> Mulai Level 1
                </GameButton>
                <GameButton full variant="white" onClick={() => setHelpOpen(false)}>
                  Nanti Saja
                </GameButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const fathahAlif = { id: "alif", arabic: "ا", name: "Alif", translit: "" };
