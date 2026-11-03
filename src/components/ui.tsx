import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/cn";

export type IconName =
  | "gamepad"
  | "sound"
  | "mute"
  | "star"
  | "list"
  | "arrowRight"
  | "arrowLeft"
  | "home"
  | "map"
  | "book"
  | "play"
  | "lock"
  | "check"
  | "close"
  | "sparkles"
  | "trophy"
  | "replay"
  | "bolt"
  | "target"
  | "heart"
  | "info"
  | "clock"
  | "download";

const iconPaths: Record<IconName, ReactNode> = {
  gamepad: (
    <>
      <path d="M7 8h10a4 4 0 0 1 3.9 3.1l1 4.4A2.8 2.8 0 0 1 17.1 19c-.9 0-1.7-.4-2.2-1.2L14 16h-4l-.9 1.8A2.6 2.6 0 0 1 6.9 19a2.8 2.8 0 0 1-2.8-3.5l1-4.4A4 4 0 0 1 7 8Z" />
      <path d="M8 11v4M6 13h4" strokeLinecap="round" />
      <path d="M16 12.5h.01M18 14.5h.01" strokeLinecap="round" />
    </>
  ),
  sound: (
    <>
      <path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" />
      <path d="M15 9a4 4 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" strokeLinecap="round" />
    </>
  ),
  mute: (
    <>
      <path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" />
      <path d="m16 9 5 6M21 9l-5 6" strokeLinecap="round" />
    </>
  ),
  star: <path d="M12 2.6 15 9l7 .9-5.1 4.9 1.3 7-6.2-3.4L5.8 21.8 7.1 14.8 2 9.9 9 9Z" />,
  list: (
    <>
      <rect x="4" y="3.5" width="16" height="17" rx="3" />
      <path d="m8 9 1.6 1.6L12.5 7.5M8 16l1.6 1.6 2.9-3.1" strokeLinecap="round" />
      <path d="M15 10h2.5M15 17h2.5" strokeLinecap="round" />
    </>
  ),
  arrowRight: <path d="M4 12h15m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />,
  arrowLeft: <path d="M20 12H5m6-6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />,
  home: <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" strokeLinejoin="round" />,
  map: (
    <>
      <path d="M3 6.5 8 4l8 3 5-2.5V18l-5 2.5-8-3L3 20Z" strokeLinejoin="round" />
      <path d="M8 4v13.5M16 7v13.5" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z" strokeLinejoin="round" />
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5A2.5 2.5 0 0 1 4 20.5Z" strokeLinejoin="round" />
      <path d="M8 7h8M8 10.5h5" strokeLinecap="round" />
    </>
  ),
  play: <path d="M7 4.8v14.4L19.5 12 7 4.8Z" strokeLinejoin="round" />,
  lock: (
    <>
      <rect x="4.5" y="10" width="15" height="11" rx="3" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" strokeLinecap="round" />
      <path d="M12 14.5v2.5" strokeLinecap="round" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" strokeLinecap="round" strokeLinejoin="round" />,
  close: <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />,
  sparkles: (
    <>
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" strokeLinejoin="round" />
      <path d="m19 15 .9 2.1 2.1.9-2.1.9L19 21l-.9-2.1L16 18l2.1-.9Z" strokeLinejoin="round" />
      <path d="m5 3 .7 1.8L7.5 5.5 5.7 6.2 5 8l-.7-1.8L2.5 5.5l1.8-.7Z" strokeLinejoin="round" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" strokeLinejoin="round" />
      <path d="M8 5H4v1a4 4 0 0 0 4 4M16 5h4v1a4 4 0 0 1-4 4" strokeLinecap="round" />
      <path d="M12 13v4M8 21h8M9.5 17h5l.5 4h-6Z" strokeLinejoin="round" />
    </>
  ),
  replay: (
    <>
      <path d="M4 11a8 8 0 1 1 2.5 5.7" strokeLinecap="round" />
      <path d="M4 4v7h7" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  bolt: <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" strokeLinejoin="round" />,
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  heart: <path d="M12 20s-8-4.8-8-10a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.2-8 10-8 10Z" strokeLinejoin="round" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.5h.01" strokeLinecap="round" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12m-5-5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 20h16" strokeLinecap="round" />
    </>
  ),
};

export function Icon({
  name,
  className,
  filled = false,
  strokeWidth = 1.9,
}: {
  name: IconName;
  className?: string;
  filled?: boolean;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-5 w-5", className)}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "blue" | "teal" | "white" | "ghost" | "pink";
  size?: "sm" | "md" | "lg";
  full?: boolean;
  children: ReactNode;
};

const buttonSizes = {
  sm: "min-h-10 px-3.5 text-xs",
  md: "min-h-12 px-5 text-sm",
  lg: "min-h-14 px-7 text-base sm:text-lg",
};

const buttonVariants = {
  primary:
    "bg-gradient-to-b from-[#ffe571] via-[#ffc52c] to-[#ffa417] text-[#462800] border-b-[6px] border-[#c46b00] shadow-[0_12px_28px_-8px_rgba(255,166,0,0.65)] hover:brightness-105 active:border-b-2",
  blue:
    "bg-gradient-to-b from-[#56d3ff] via-[#1a99ff] to-[#0a63ec] text-white border-b-[6px] border-[#073c9c] shadow-[0_12px_28px_-8px_rgba(20,120,255,0.75)] hover:brightness-105 active:border-b-2",
  teal:
    "bg-gradient-to-b from-[#78f7cf] via-[#1fd6a6] to-[#04a97e] text-[#013a2b] border-b-[6px] border-[#01775d] shadow-[0_12px_28px_-8px_rgba(20,220,170,0.55)] hover:brightness-105 active:border-b-2",
  pink:
    "bg-gradient-to-b from-[#ffa4dd] via-[#ff54b9] to-[#e519a0] text-white border-b-[6px] border-[#9c0b67] shadow-[0_12px_28px_-8px_rgba(255,60,180,0.6)] hover:brightness-105 active:border-b-2",
  white:
    "bg-gradient-to-b from-white to-[#e3f1ff] text-[#0b2d5e] border-b-[6px] border-[#9dc4ea] shadow-[0_12px_28px_-10px_rgba(2,20,60,0.45)] hover:brightness-105 active:border-b-2",
  ghost:
    "bg-white/10 text-white border-2 border-white/25 backdrop-blur-sm hover:bg-white/20",
};

export function GameButton({
  variant = "primary",
  size = "md",
  full = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "relative inline-flex select-none items-center justify-center gap-2 rounded-2xl font-extrabold tracking-wide transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 disabled:saturate-50",
        buttonSizes[size],
        buttonVariants[variant],
        full && "w-full",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function StarRow({
  count,
  total = 3,
  className,
  starClassName,
}: {
  count: number;
  total?: number;
  className?: string;
  starClassName?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)} aria-label={`${count} dari ${total} bintang`}>
      {Array.from({ length: total }).map((_, index) => (
        <Icon
          key={index}
          name="star"
          filled
          className={cn(
            "h-5 w-5 transition",
            index < count
              ? "text-amber-300 drop-shadow-[0_2px_3px_rgba(120,70,0,0.45)]"
              : "text-slate-500/45",
            starClassName,
          )}
        />
      ))}
    </div>
  );
}

export function SoundToggle({
  enabled,
  onToggle,
  className,
  dark = false,
}: {
  enabled: boolean;
  onToggle: () => void;
  className?: string;
  dark?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={enabled ? "Matikan suara" : "Nyalakan suara"}
      aria-pressed={enabled}
      title={enabled ? "Suara aktif" : "Suara mati"}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-full border-2 px-3 text-xs font-extrabold transition hover:scale-105 active:scale-95",
        dark
          ? "border-[#0d3e7c]/15 bg-white text-[#0b2d5e] shadow-md"
          : "border-white/25 bg-white/12 text-white backdrop-blur-sm",
        className,
      )}
    >
      <Icon name={enabled ? "sound" : "mute"} className="h-5 w-5" />
      <span className="hidden sm:inline">{enabled ? "Suara On" : "Suara Off"}</span>
    </button>
  );
}

export function BrandMark({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl border-2 border-white/50 bg-gradient-to-br from-[#45c7ff] to-[#0d5cff] text-white shadow-[0_5px_0_#083b9e]">
        <Icon name="gamepad" className="h-6 w-6" strokeWidth={2.1} />
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-amber-300" />
      </span>
      <div className="leading-none">
        <p
          className={cn(
            "text-[10px] font-extrabold uppercase tracking-[0.22em]",
            light ? "text-cyan-200" : "text-cyan-100/80",
          )}
        >
          Game Interaktif
        </p>
        <p className="mt-1 text-sm font-extrabold tracking-wide text-white sm:text-base">
          Robot <span className="text-amber-300">Hijaiyah</span>
        </p>
      </div>
    </div>
  );
}

export function CelebrationSparkles({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      {[
        [8, 18, 10, 1.2],
        [86, 12, 7, 0.7],
        [16, 74, 6, 0.4],
        [78, 68, 9, 1.6],
        [48, 8, 5, 0.9],
        [92, 42, 5, 1.9],
        [30, 40, 4, 2.3],
      ].map(([left, top, size, delay], idx) => (
        <span
          key={idx}
          className="sparkle-dot absolute rounded-full bg-amber-200"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: size,
            height: size,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
}
