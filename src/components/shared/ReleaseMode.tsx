import { Info, ShieldCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Offer } from "@/lib/types";
import { cn } from "@/lib/utils";

export function releaseModeMeta(releaseType: Offer["releaseType"]) {
  if (releaseType === "escalonada") {
    return { label: "Pago Protegido", icon: ShieldCheck, tone: "gold" as const };
  }
  return { label: "Liberación completa", icon: Zap, tone: "soft" as const };
}

/** Sello no clicable (para tarjetas del feed, que ya son un enlace). */
export function ReleaseModeBadge({ offer, className }: { offer: Offer; className?: string }) {
  const meta = releaseModeMeta(offer.releaseType);
  const Icon = meta.icon;
  return (
    <Badge variant={meta.tone} className={className}>
      <Icon className="size-3.5" aria-hidden="true" />
      {meta.label}
    </Badge>
  );
}

/** Indicador clicable: abre un modal que explica los dos modos y cómo protegen el dinero. */
export function ReleaseModeIndicator({ offer, className }: { offer: Offer; className?: string }) {
  const meta = releaseModeMeta(offer.releaseType);
  const Icon = meta.icon;
  const protectedMode = offer.releaseType === "escalonada";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-medium shadow-sm backdrop-blur transition-opacity hover:opacity-90",
            protectedMode
              ? "border-gold/40 bg-gold-soft text-warn"
              : "border-white/15 bg-black/45 text-white",
            className,
          )}
        >
          <Icon className="size-3.5" aria-hidden="true" />
          {meta.label}
          <Info className="size-3.5 opacity-70" aria-hidden="true" />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cómo se entrega el dinero al negocio</DialogTitle>
          <DialogDescription>
            Cada oferta usa uno de dos modos, y el negocio lo elige al publicar. Esta oferta usa{" "}
            <span className="font-medium text-ink">{meta.label}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-xl border border-border/80 bg-card p-3.5">
            <p className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
              <Zap className="size-4 text-brand" aria-hidden="true" />
              Liberación completa
            </p>
            <p className="mt-1 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
              El negocio recibe todo el dinero apenas se completa el grupo. Es el modo por defecto:
              le da liquidez inmediata.
            </p>
          </div>

          <div className="rounded-xl border border-gold/30 bg-gold-soft/40 p-3.5">
            <p className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
              <ShieldCheck className="size-4 text-warn" aria-hidden="true" />
              Pago Protegido (escalonado)
            </p>
            <p className="mt-1 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
              El negocio recibe el dinero por etapas, al inicio de cada periodo. Si cierra antes de
              prestar un periodo, ese dinero no se libera y vuelve al cliente. Protege más tu dinero.
            </p>
          </div>

          <p className="text-pretty text-[11.5px] leading-relaxed text-muted-foreground">
            En ambos casos tu pago queda en garantía hasta que el grupo se completa; la diferencia es
            cuándo y cómo se le entrega al negocio.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
