import robotBiruImg from "../assets/robots/robot-biru.webp?inline";
import robotLawanImg from "../assets/robots/robot-lawan.webp?inline";
import robotMerahImg from "../assets/robots/robot-merah.webp?inline";
import robotPinkImg from "../assets/robots/robot-pink.webp?inline";
import robotUnguImg from "../assets/robots/robot-ungu.webp?inline";

export type HarakatId =
  | "fathah"
  | "kasroh"
  | "dhammah"
  | "fathah-tanwin"
  | "kasroh-tanwin"
  | "dhammah-tanwin";

export type HijaiyahLetter = {
  id: string;
  arabic: string;
  name: string;
  translit: string;
};

export type Harakat = {
  id: HarakatId;
  name: string;
  arabic: string;
  mark: string;
  hint: string;
  vowel: string;
  tanwin: boolean;
};

export const HARAKAT: Record<HarakatId, Harakat> = {
  fathah: {
    id: "fathah",
    name: "Fathah",
    arabic: "فَتْحَة",
    mark: "\u064E",
    hint: "Baris di atas, bunyinya A",
    vowel: "A",
    tanwin: false,
  },
  kasroh: {
    id: "kasroh",
    name: "Kasroh",
    arabic: "كَسْرَة",
    mark: "\u0650",
    hint: "Baris di bawah, bunyinya I",
    vowel: "I",
    tanwin: false,
  },
  dhammah: {
    id: "dhammah",
    name: "Dhammah",
    arabic: "ضَمَّة",
    mark: "\u064F",
    hint: "Tanda kecil di atas, bunyinya U",
    vowel: "U",
    tanwin: false,
  },
  "fathah-tanwin": {
    id: "fathah-tanwin",
    name: "Fathah Tanwin",
    arabic: "فَتْحَة تَنْوِين",
    mark: "\u064B",
    hint: "Fathah dobel, bunyinya AN",
    vowel: "AN",
    tanwin: true,
  },
  "kasroh-tanwin": {
    id: "kasroh-tanwin",
    name: "Kasroh Tanwin",
    arabic: "كَسْرَة تَنْوِين",
    mark: "\u064D",
    hint: "Kasroh dobel, bunyinya IN",
    vowel: "IN",
    tanwin: true,
  },
  "dhammah-tanwin": {
    id: "dhammah-tanwin",
    name: "Dhammah Tanwin",
    arabic: "ضَمَّة تَنْوِين",
    mark: "\u064C",
    hint: "Dhammah dobel, bunyinya UN",
    vowel: "UN",
    tanwin: true,
  },
};

/** 29 huruf hijaiyah (termasuk Hamzah). Semua digambar sebagai SVG di dalam aplikasi. */
export const LETTERS: HijaiyahLetter[] = [
  { id: "alif", arabic: "ا", name: "Alif", translit: "" },
  { id: "ba", arabic: "ب", name: "Ba", translit: "B" },
  { id: "ta", arabic: "ت", name: "Ta", translit: "T" },
  { id: "tsa", arabic: "ث", name: "Tsa", translit: "TS" },
  { id: "jim", arabic: "ج", name: "Jim", translit: "J" },
  { id: "ha", arabic: "ح", name: "Ha", translit: "H" },
  { id: "kha", arabic: "خ", name: "Kho", translit: "KH" },
  { id: "dal", arabic: "د", name: "Dal", translit: "D" },
  { id: "dzal", arabic: "ذ", name: "Dzal", translit: "DZ" },
  { id: "ra", arabic: "ر", name: "Ra", translit: "R" },
  { id: "zay", arabic: "ز", name: "Zay", translit: "Z" },
  { id: "sin", arabic: "س", name: "Sin", translit: "S" },
  { id: "syin", arabic: "ش", name: "Syin", translit: "SY" },
  { id: "shad", arabic: "ص", name: "Shad", translit: "SH" },
  { id: "dhad", arabic: "ض", name: "Dhad", translit: "DH" },
  { id: "tha", arabic: "ط", name: "Tha", translit: "TH" },
  { id: "zha", arabic: "ظ", name: "Zha", translit: "ZH" },
  { id: "ain", arabic: "ع", name: "Ain", translit: "" },
  { id: "ghain", arabic: "غ", name: "Ghain", translit: "GH" },
  { id: "fa", arabic: "ف", name: "Fa", translit: "F" },
  { id: "qaf", arabic: "ق", name: "Qaf", translit: "Q" },
  { id: "kaf", arabic: "ك", name: "Kaf", translit: "K" },
  { id: "lam", arabic: "ل", name: "Lam", translit: "L" },
  { id: "mim", arabic: "م", name: "Mim", translit: "M" },
  { id: "nun", arabic: "ن", name: "Nun", translit: "N" },
  { id: "wau", arabic: "و", name: "Wau", translit: "W" },
  { id: "ha2", arabic: "ه", name: "Ha", translit: "H" },
  { id: "ya", arabic: "ي", name: "Ya", translit: "Y" },
  { id: "hamzah", arabic: "ء", name: "Hamzah", translit: "" },
];

/** Huruf mirip: dipakai sebagai pengecoh jawaban agar anak berlatih membedakan bentuk. */
const SIMILAR: Record<string, string[]> = {
  alif: ["lam", "dal", "hamzah"],
  ba: ["ta", "tsa", "nun"],
  ta: ["ba", "tsa", "nun"],
  tsa: ["ta", "ba", "syin"],
  jim: ["ha", "kha", "tsa"],
  ha: ["jim", "kha", "ain"],
  kha: ["ha", "jim", "ghain"],
  dal: ["dzal", "ra", "wau"],
  dzal: ["dal", "zay", "ra"],
  ra: ["zay", "dal", "wau"],
  zay: ["ra", "dal", "syin"],
  sin: ["syin", "shad", "nun"],
  syin: ["sin", "shad", "tsa"],
  shad: ["dhad", "sin", "syin"],
  dhad: ["shad", "tha", "zha"],
  tha: ["zha", "dhad", "ta"],
  zha: ["tha", "dhad", "ain"],
  ain: ["ghain", "ha", "hamzah"],
  ghain: ["ain", "kha", "fa"],
  fa: ["qaf", "ghain", "wau"],
  qaf: ["fa", "wau", "kaf"],
  kaf: ["lam", "qaf", "ha2"],
  lam: ["kaf", "alif", "nun"],
  mim: ["nun", "wau", "ha2"],
  nun: ["mim", "ba", "ta"],
  wau: ["qaf", "fa", "ra"],
  ha2: ["mim", "kaf", "wau"],
  ya: ["ba", "ta", "nun"],
  hamzah: ["alif", "ain", "wau"],
};

export function arabicFor(letter: HijaiyahLetter, harakat: HarakatId) {
  return `${letter.arabic}${HARAKAT[harakat].mark}`;
}

/**
 * Huruf tebal yang harakat fathah-nya dibaca "O" (cara baca TPA/Iqro).
 * ضَ = DHO · صَ = SO · غَ = GHO · ظَ = ZO · قَ = QO · رَ = RO · خَ = KHO · طَ = THO
 * Fathah tanwin ikut menyesuaikan: ضً = DHON, خً = KHON, طً = THON, dst.
 */
export const FATHAH_O: Record<string, string> = {
  dhad: "DHO",
  shad: "SO",
  ghain: "GHO",
  zha: "ZO",
  qaf: "QO",
  ra: "RO",
  kha: "KHO",
  tha: "THO",
};

export function isHeavyReading(letter: HijaiyahLetter, harakat: HarakatId) {
  return Boolean(FATHAH_O[letter.id]) && (harakat === "fathah" || harakat === "fathah-tanwin");
}

export function pronunciation(letter: HijaiyahLetter, harakat: HarakatId) {
  const heavy = FATHAH_O[letter.id];
  if (heavy && harakat === "fathah") return heavy;
  if (heavy && harakat === "fathah-tanwin") return `${heavy}N`;
  const vowel = HARAKAT[harakat].vowel;
  if (!letter.translit) return vowel; // alif, ain, hamzah
  return `${letter.translit}${vowel}`;
}

export function phonetic(letter: HijaiyahLetter, harakat: HarakatId) {
  return pronunciation(letter, harakat);
}

export type Level = {
  id: number;
  title: string;
  harakat: HarakatId;
  arabic: string;
  description: string;
  targets: string[];
  from: string;
  to: string;
  tag: string;
};

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "Fathah",
    harakat: "fathah",
    arabic: "فَتْحَة",
    description: "Baris di atas, bunyinya A",
    targets: ["alif", "ba", "ta", "tsa", "jim", "ha", "kha", "dal", "dzal", "ra"],
    from: "#1d7bff",
    to: "#35e0ff",
    tag: "Langkah pertama",
  },
  {
    id: 2,
    title: "Kasroh",
    harakat: "kasroh",
    arabic: "كَسْرَة",
    description: "Baris di bawah, bunyinya I",
    targets: ["zay", "sin", "syin", "shad", "dhad", "tha", "zha", "ain", "ghain", "fa"],
    from: "#00a78e",
    to: "#5cf0b4",
    tag: "Baris bawah",
  },
  {
    id: 3,
    title: "Dhammah",
    harakat: "dhammah",
    arabic: "ضَمَّة",
    description: "Tanda kecil di atas, bunyinya U",
    targets: ["qaf", "kaf", "lam", "mim", "nun", "wau", "ha2", "ya", "hamzah", "ba"],
    from: "#7a45ff",
    to: "#c26bff",
    tag: "Baris depan",
  },
  {
    id: 4,
    title: "Fathah Tanwin",
    harakat: "fathah-tanwin",
    arabic: "فَتْحَة تَنْوِين",
    description: "Fathah dobel, bunyinya AN",
    targets: ["ba", "ta", "jim", "dal", "ra", "sin", "ain", "fa", "ya", "mim"],
    from: "#ff8a00",
    to: "#ffd23f",
    tag: "Dua baris atas",
  },
  {
    id: 5,
    title: "Kasroh Tanwin",
    harakat: "kasroh-tanwin",
    arabic: "كَسْرَة تَنْوِين",
    description: "Kasroh dobel, bunyinya IN",
    targets: ["tsa", "ha", "kha", "dzal", "zay", "syin", "shad", "qaf", "kaf", "nun"],
    from: "#ff3d9a",
    to: "#ff8ec9",
    tag: "Dua baris bawah",
  },
  {
    id: 6,
    title: "Dhammah Tanwin",
    harakat: "dhammah-tanwin",
    arabic: "ضَمَّة تَنْوِين",
    description: "Dhammah dobel, bunyinya UN",
    targets: ["dhad", "tha", "zha", "ghain", "lam", "wau", "ha2", "ta", "ba", "jim"],
    from: "#ff4d4d",
    to: "#ffa45c",
    tag: "Misi terakhir",
  },
];

export type RobotId = "merah" | "biru" | "pink" | "ungu";

export type Point = { x: number; y: number };

/** Tampilan robot — dipakai robot pemain dan robot lawan. */
export type RobotLook = {
  name: string;
  /** Gambar robot transparan pada kanvas persegi. */
  image: string;
  /** Posisi ujung senjata (persen dari kotak gambar). */
  muzzle: Point;
  /** Titik sasaran laser di badan robot (persen dari kotak gambar). */
  core: Point;
  primary: string;
  secondary: string;
  light: string;
  glow: string;
  ring: string;
};

export type RobotTheme = RobotLook & {
  id: RobotId;
  colorName: string;
  title: string;
  power: string;
};

export type EnemyTheme = RobotLook & {
  title: string;
  power: string;
};

/** Semua robot pahlawan memakai desain yang sama — hanya warnanya berbeda. */
const HERO_MUZZLE: Point = { x: 82.8, y: 30 };
const HERO_CORE: Point = { x: 37.7, y: 46.6 };

export const ROBOTS: RobotTheme[] = [
  {
    id: "merah",
    colorName: "Merah",
    name: "Robo Api",
    title: "Si Cepat & Berani",
    power: "Laser Merah",
    image: robotMerahImg,
    muzzle: HERO_MUZZLE,
    core: HERO_CORE,
    primary: "#e8283a",
    secondary: "#a3132a",
    light: "#ff8a7d",
    glow: "#ffb347",
    ring: "#ff5a5a",
  },
  {
    id: "biru",
    colorName: "Biru",
    name: "Robo Kilat",
    title: "Si Cerdas & Tenang",
    power: "Laser Biru",
    image: robotBiruImg,
    muzzle: HERO_MUZZLE,
    core: HERO_CORE,
    primary: "#2563ff",
    secondary: "#1238b0",
    light: "#8ab4ff",
    glow: "#5ee7ff",
    ring: "#4f8dff",
  },
  {
    id: "pink",
    colorName: "Pink",
    name: "Robo Pelangi",
    title: "Si Ceria & Ramah",
    power: "Laser Pink",
    image: robotPinkImg,
    muzzle: HERO_MUZZLE,
    core: HERO_CORE,
    primary: "#ff4fb8",
    secondary: "#c31c8c",
    light: "#ffb3e6",
    glow: "#ff9bf0",
    ring: "#ff8ad8",
  },
  {
    id: "ungu",
    colorName: "Ungu",
    name: "Robo Galaksi",
    title: "Si Hebat & Pemberani",
    power: "Laser Ungu",
    image: robotUnguImg,
    muzzle: HERO_MUZZLE,
    core: HERO_CORE,
    primary: "#8f3bff",
    secondary: "#5a1fcb",
    light: "#cdb4ff",
    glow: "#c49bff",
    ring: "#b18aff",
  },
];

export const ENEMY_THEME: EnemyTheme = {
  name: "Robo Bayangan",
  title: "Penjaga Huruf",
  power: "Laser Jahat",
  image: robotLawanImg,
  muzzle: { x: 11.1, y: 30.6 },
  core: { x: 62.7, y: 49.4 },
  primary: "#4b5263",
  secondary: "#2a2f3c",
  light: "#9aa6c2",
  glow: "#ff4d5e",
  ring: "#ff5f70",
};

export type Question = {
  key: string;
  target: HijaiyahLetter;
  options: HijaiyahLetter[];
  correctIndex: number;
  prompt: string;
  harakat: HarakatId;
};

export function buildQuestions(level: Level): Question[] {
  return level.targets.map((targetId, index) => {
    const target = LETTERS.find((l) => l.id === targetId) ?? LETTERS[0];
    const prompt = pronunciation(target, level.harakat);
    const similar = SIMILAR[target.id] ?? [];

    const candidates = [
      ...similar,
      ...LETTERS.map((l) => l.id).filter((id) => id !== target.id),
    ];

    const distractors: HijaiyahLetter[] = [];
    for (const id of candidates) {
      if (distractors.length >= 2) break;
      const letter = LETTERS.find((l) => l.id === id);
      if (!letter) continue;
      if (letter.id === target.id) continue;
      if (distractors.some((d) => d.id === letter.id)) continue;
      if (pronunciation(letter, level.harakat) === prompt) continue;
      distractors.push(letter);
    }

    let options: HijaiyahLetter[];
    if (level.id === 1 && index === 0) {
      // Contoh soal pertama: tampil "A" dengan pilihan Alif, Ba, Ta.
      const ba = LETTERS.find((l) => l.id === "ba")!;
      const ta = LETTERS.find((l) => l.id === "ta")!;
      options = [target, ba, ta];
    } else {
      const correctPos = (index * 2 + level.id) % 3;
      options = [...distractors];
      options.splice(correctPos, 0, target);
    }

    return {
      key: `${level.id}-${target.id}`,
      target,
      options,
      correctIndex: options.findIndex((o) => o.id === target.id),
      prompt,
      harakat: level.harakat,
    };
  });
}

export type LevelResult = { stars: number; bestScore: number; done: boolean };
export type Progress = Record<number, LevelResult>;

export function starsFor(correct: number) {
  if (correct >= 9) return 3;
  if (correct >= 7) return 2;
  return 1;
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem("robot-hijaiyah-progress-v1");
    return raw ? (JSON.parse(raw) as Progress) : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress: Progress) {
  try {
    localStorage.setItem("robot-hijaiyah-progress-v1", JSON.stringify(progress));
  } catch {
    // penyimpanan opsional — game tetap berjalan tanpa localStorage
  }
}
