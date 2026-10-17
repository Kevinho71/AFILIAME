import {
  Dumbbell,
  Flower2,
  Laptop,
  Music4,
  SquareParking,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeVisual {
  from: string;
  to: string;
  icon: LucideIcon;
  ink: string;
}

export const THEME_VISUALS: Record<string, ThemeVisual> = {
  gym: { from: "#33604f", to: "#14312a", icon: Dumbbell, ink: "#dff0e6" },
  cowork: { from: "#b0603a", to: "#74321d", icon: Laptop, ink: "#fbeade" },
  pool: { from: "#35738f", to: "#16475c", icon: Waves, ink: "#dff0f6" },
  dance: { from: "#7b4a7d", to: "#472a4a", icon: Music4, ink: "#f4e6f5" },
  yoga: { from: "#7d9170", to: "#4a6045", icon: Flower2, ink: "#eef4e9" },
  parking: { from: "#5b6674", to: "#2d353f", icon: SquareParking, ink: "#e6eaf0" },
};

const visual = (theme: string) => THEME_VISUALS[theme] ?? THEME_VISUALS.gym;

export function BusinessMark({
  theme,
  name,
  size = "md",
  className,
  showIcon = true,
}: {
  theme: string;
  name: string;
  size?: "sm" | "md" | "lg" | "hero";
  className?: string;
  showIcon?: boolean;
}) {
  const { from, to, icon: Icon, ink } = visual(theme);
  const sizes = {
    sm: "size-10 rounded-xl",
    md: "h-16 w-full rounded-xl",
    lg: "h-32 w-full rounded-xl",
    hero: "h-44 w-full rounded-xl",
  } as const;
  const iconSizes = {
    sm: "size-5",
    md: "size-7",
    lg: "size-10",
    hero: "size-12",
  } as const;

  return (
    <div
      className={cn("relative overflow-hidden", sizes[size], className)}
      style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
      aria-hidden="true"
    >
      <div className="grain absolute inset-0 opacity-70" />
      <div
        className="absolute -right-6 -top-8 size-28 rounded-full opacity-25"
        style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }}
      />
      {showIcon && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="flex items-center justify-center rounded-full p-2"
            style={{ background: "rgba(255,255,255,0.14)", color: ink }}
          >
            <Icon className={iconSizes[size]} strokeWidth={1.7} />
          </span>
        </div>
      )}
      {size === "hero" && (
        <span className="absolute bottom-3 left-4 font-display text-lg text-white/90">{name}</span>
      )}
    </div>
  );
}

export function CategoryIcon({ theme, className }: { theme: string; className?: string }) {
  const Icon = visual(theme).icon;
  return <Icon className={cn("size-4", className)} aria-hidden="true" />;
}
