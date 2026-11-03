import type { ReactNode } from "react";
import { ROBOTS, type RobotId, type RobotLook } from "../data/game";
import { Icon } from "./ui";
import { cn } from "../utils/cn";

type RobotProps = {
  theme: RobotLook;
  className?: string;
  imgClassName?: string;
  label?: string;
  children?: ReactNode;
};

/**
 * Karakter robot bergaya 3D: gambar transparan pada kanvas persegi.
 * Satu desain dengan 4 pilihan warna (merah, biru, pink, ungu) + 1 robot lawan.
 * `children` dipakai untuk titik jangkar (moncong senjata / sasaran laser).
 */
export function Robot({ theme, className, imgClassName, label, children }: RobotProps) {
  return (
    <div className={cn("relative h-full w-full", className)}>
      <img
        src={theme.image}
        alt={`Robot ${label ?? theme.name}`}
        draggable={false}
        decoding="async"
        className={cn("pointer-events-none h-full w-full select-none object-contain", imgClassName)}
      />
      {children}
    </div>
  );
}

type ColorPickerProps = {
  selectedId: RobotId;
  onSelect: (id: RobotId) => void;
  size?: "sm" | "md";
  className?: string;
};

/** Tombol bulat pilihan warna robot: merah, biru, pink, ungu. */
export function RobotColorPicker({ selectedId, onSelect, size = "md", className }: ColorPickerProps) {
  return (
    <div role="radiogroup" aria-label="Pilih warna robot" className={cn("flex items-center gap-2", className)}>
      {ROBOTS.map((robot) => {
        const active = robot.id === selectedId;
        return (
          <button
            key={robot.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`Robot warna ${robot.colorName}`}
            title={`Robot ${robot.colorName}`}
            onClick={() => onSelect(robot.id)}
            className={cn(
              "grid shrink-0 place-items-center rounded-full border-2 shadow-[0_4px_10px_rgba(0,0,0,0.4)] transition hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/70 active:scale-95",
              size === "sm" ? "h-8 w-8" : "h-10 w-10",
              active ? "scale-110 border-white ring-4 ring-amber-300/60" : "border-white/50",
            )}
            style={{
              background: `radial-gradient(circle at 35% 30%, ${robot.light} 0%, ${robot.primary} 52%, ${robot.secondary} 100%)`,
            }}
          >
            {active && <Icon name="check" className="h-4 w-4 text-white drop-shadow" strokeWidth={3.2} />}
          </button>
        );
      })}
    </div>
  );
}
