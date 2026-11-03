import { useId } from "react";
import { arabicFor, HARAKAT, type HarakatId, type HijaiyahLetter } from "../data/game";
import { cn } from "../utils/cn";

type GlyphProps = {
  letter: HijaiyahLetter;
  harakat: HarakatId;
  className?: string;
  tone?: "light" | "blue" | "gold";
};

/**
 * Kartu huruf hijaiyah dalam format SVG murni (bebas royalti).
 * Huruf asli Arab dirender di dalam SVG sehingga tetap tajam di semua ukuran.
 */
export function HijaiyahGlyph({ letter, harakat, className, tone = "light" }: GlyphProps) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cardId = `card-${rawId}`;
  const shineId = `shine-${rawId}`;

  const backgrounds = {
    light: ["#fffdf4", "#e4f4ff"],
    blue: ["#d9f1ff", "#a3d4ff"],
    gold: ["#fff6cc", "#ffdf7a"],
  }[tone];

  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={`Huruf hijaiyah ${letter.name} berharakat ${HARAKAT[harakat].name}`}
    >
      <title>{`Huruf ${letter.name} — ${HARAKAT[harakat].name}`}</title>
      <defs>
        <linearGradient id={cardId} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor={backgrounds[0]} />
          <stop offset="100%" stopColor={backgrounds[1]} />
        </linearGradient>
        <linearGradient id={shineId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x="4" y="4" width="192" height="192" rx="36" fill={`url(#${cardId})`} />
      <rect
        x="4"
        y="4"
        width="192"
        height="192"
        rx="36"
        fill="none"
        stroke="#0e3c7a"
        strokeOpacity="0.16"
        strokeWidth="3"
      />
      <path
        d="M18 46 Q18 18 46 18 H154 Q182 18 182 46 V72 Q120 46 18 84 Z"
        fill={`url(#${shineId})`}
        opacity="0.55"
      />
      <path
        d="M24 170 Q100 190 176 170"
        stroke="#9bd4ff"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />
      <text
        x="100"
        y="116"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Scheherazade New', 'Amiri', 'Noto Naskh Arabic', 'Traditional Arabic', serif"
        fontSize={letter.id === "hamzah" ? 168 : 118}
        fontWeight="700"
        fill="#0b2a5f"
      >
        {arabicFor(letter, harakat)}
      </text>
      <rect
        x="4"
        y="4"
        width="192"
        height="192"
        rx="36"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.55"
        strokeWidth="2"
      />
    </svg>
  );
}

type CardProps = {
  letter: HijaiyahLetter;
  harakat: HarakatId;
  className?: string;
  onClick?: () => void;
  tone?: "light" | "blue" | "gold";
};

export function HijaiyahCard({ letter, harakat, className, onClick, tone }: CardProps) {
  if (!onClick) {
    return (
      <div className={cn("aspect-square w-full", className)}>
        <HijaiyahGlyph letter={letter} harakat={harakat} tone={tone} />
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Pilih huruf ${letter.name}`}
      className={cn(
        "group aspect-square w-full rounded-[1.6rem] outline-none transition-transform duration-200 hover:-translate-y-1 focus-visible:ring-4 focus-visible:ring-amber-300 active:translate-y-0",
        className,
      )}
    >
      <HijaiyahGlyph letter={letter} harakat={harakat} tone={tone} />
    </button>
  );
}
