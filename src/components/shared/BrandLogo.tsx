import { cn } from "@/lib/utils";

/** Logo oficial de Afíliame (mint). Se sirve desde /public y respeta el base de GitHub Pages. */
const LOGO_SRC = `${import.meta.env.BASE_URL}${encodeURI("Logo de Afíliame en Verde Menta.png")}`;

export function BrandLogo({ className }: { className?: string }) {
  return (
    <img
      src={LOGO_SRC}
      alt="Afíliame"
      draggable={false}
      className={cn("h-8 w-auto object-contain", className)}
    />
  );
}
