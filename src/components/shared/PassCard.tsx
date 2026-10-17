import { BadgeCheck, CalendarDays, Clock3, MapPin, ShieldCheck } from "lucide-react";
import { QrFrame } from "@/components/shared/QrFrame";
import { BusinessMark } from "@/components/shared/BusinessMark";
import { Badge } from "@/components/ui/badge";
import { CupoStatusPill } from "@/components/shared/status";
import type { Cupo, Offer } from "@/lib/types";
import { shortDate } from "@/lib/format";

export type PassVariant = "pendiente" | "activo" | "por_vencer" | "finalizado";

export function passVariant(offer: Offer, cupo: Cupo): PassVariant {
  if (cupo.status === "finalizado" || offer.status === "finalizada") return "finalizado";
  if (cupo.status === "activo") return "activo";
  if (cupo.status === "en_cesion") return "pendiente";
  return "pendiente";
}

const VARIANT_COPY: Record<PassVariant, { label: string; badge: "success" | "info" | "warn" | "muted"; note: string }> = {
  pendiente: {
    label: "Pase emitido · aún no inicia",
    badge: "info",
    note: "Tu pase se activa automáticamente el primer día de tu periodo.",
  },
  activo: {
    label: "Pase activo",
    badge: "success",
    note: "Muestra este QR en recepción cada vez que ingreses.",
  },
  por_vencer: {
    label: "Pase activo",
    badge: "success",
    note: "Tu periodo está en curso. Muestra este QR en recepción.",
  },
  finalizado: {
    label: "Pase finalizado",
    badge: "muted",
    note: "Este periodo ya terminó. Puedes calificar al negocio desde Mis cupos.",
  },
};

export function PassCard({
  offer,
  cupo,
  compact = false,
}: {
  offer: Offer;
  cupo: Cupo;
  compact?: boolean;
}) {
  const variant = passVariant(offer, cupo);
  const copy = VARIANT_COPY[variant];
  const name = cupo.participant?.name ?? "Beneficiario";

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-3 border-b border-border/70 bg-brand-soft/70 px-4 py-3">
        <BusinessMark theme={offer.theme} name={offer.business} size="sm" className="size-9" />
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-semibold text-ink">{offer.business}</p>
          <p className="truncate text-[12px] text-muted-foreground">{offer.title}</p>
        </div>
        <Badge variant={copy.badge} className="ml-auto shrink-0">
          <BadgeCheck className="size-3.5" aria-hidden="true" />
          {copy.label}
        </Badge>
      </div>

      <div className="grid gap-5 p-4 sm:grid-cols-[auto_1fr] sm:items-center">
        <QrFrame
          value={`PASE-AF|${offer.id}|${cupo.id}|${name}|${cupo.start}|${cupo.end}`}
          size={compact ? 128 : 150}
          muted={variant === "finalizado"}
          caption="Pase digital"
        />
        <div className="space-y-3">
          <div>
            <p className="text-[11.5px] uppercase tracking-wide text-muted-foreground">Beneficiario</p>
            <p className="text-[15px] font-semibold text-ink">{name}</p>
          </div>
          <div className="grid gap-2.5 text-[12.5px] text-muted-foreground">
            <p className="flex items-center gap-2">
              <CalendarDays className="size-4 shrink-0 text-brand/70" aria-hidden="true" />
              <span>
                <span className="text-ink">{cupo.label}</span> · {shortDate(cupo.start)} al {shortDate(cupo.end)}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-brand/70" aria-hidden="true" />
              {offer.address}
            </p>
            <p className="flex items-center gap-2">
              <Clock3 className="size-4 shrink-0 text-brand/70" aria-hidden="true" />
              {offer.hours}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <CupoStatusPill status={cupo.status} />
            <Badge variant="outline">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Identidad verificada
            </Badge>
          </div>
          <p className="text-pretty text-[12px] leading-relaxed text-muted-foreground">{copy.note}</p>
        </div>
      </div>

      <div className="border-t border-border/70 bg-paper/60 px-4 py-3">
        <p className="text-[11.5px] font-medium text-muted-foreground">
          Reglas del negocio
        </p>
        <ul className="mt-1.5 space-y-1">
          {offer.rules.slice(0, 3).map((rule) => (
            <li key={rule} className="flex gap-2 text-[12px] leading-relaxed text-muted-foreground">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-brand/50" aria-hidden="true" />
              {rule}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
