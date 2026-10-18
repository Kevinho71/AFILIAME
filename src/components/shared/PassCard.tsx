import { BadgeCheck, CalendarDays, Clock3, MapPin, ScanLine, ShieldCheck } from "lucide-react";
import { QrFrame } from "@/components/shared/QrFrame";
import { BusinessMark } from "@/components/shared/BusinessMark";
import { Badge } from "@/components/ui/badge";
import { CupoStatusPill } from "@/components/shared/status";
import type { Cupo, Offer } from "@/lib/types";
import { validityText } from "@/lib/usage";
import { cupoWhen } from "@/lib/usage";

export type PassVariant = "por_activar" | "activado" | "finalizado";

export function passVariant(offer: Offer, cupo: Cupo): PassVariant {
  if (cupo.status === "finalizado" || offer.status === "finalizada") return "finalizado";
  if (cupo.status === "activado") return "activado";
  return "por_activar";
}

const VARIANT_COPY: Record<PassVariant, { label: string; badge: "success" | "info" | "muted"; note: string }> = {
  por_activar: {
    label: "Código listo · sin activar",
    badge: "info",
    note: "Muestra este código una sola vez en recepción. Al activarlo queda inutilizable.",
  },
  activado: {
    label: "Activado",
    badge: "success",
    note: "El negocio te inscribió en su propio sistema. Entra como te indique.",
  },
  finalizado: {
    label: "Finalizado",
    badge: "muted",
    note: "Tu cupo ya no está vigente. Puedes calificar al negocio desde Mis cupos.",
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
        {variant === "activado" ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-success/25 bg-success-soft/50 px-6 py-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-success text-primary-foreground">
              <BadgeCheck className="size-6" aria-hidden="true" />
            </span>
            <p className="font-display text-[15px]">Cupo activado</p>
            {cupo.activatedAt && (
              <p className="text-[11.5px] text-muted-foreground">Activado el {cupo.activatedAt}</p>
            )}
          </div>
        ) : (
          <QrFrame
            value={`ACTIVA-AF|${offer.id}|${cupo.id}|${name}|${offer.validTo}`}
            size={compact ? 128 : 150}
            muted={variant === "finalizado"}
            caption="Código de activación · un solo uso"
          />
        )}
        <div className="space-y-3">
          <div>
            <p className="text-[11.5px] uppercase tracking-wide text-muted-foreground">Beneficiario</p>
            <p className="text-[15px] font-semibold text-ink">{name}</p>
          </div>
          <div className="grid gap-2.5 text-[12.5px] text-muted-foreground">
            <p className="flex items-center gap-2">
              <CalendarDays className="size-4 shrink-0 text-brand/70" aria-hidden="true" />
              <span>
                <span className="text-ink">{cupo.label}</span> · {cupoWhen(offer, cupo)}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="size-4 shrink-0 text-brand/70" aria-hidden="true" />
              Anualidad válida {validityText(offer)}
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
          <p className="flex items-start gap-2 text-pretty text-[12px] leading-relaxed text-muted-foreground">
            {variant === "por_activar" && (
              <ScanLine className="mt-0.5 size-3.5 shrink-0 text-brand/70" aria-hidden="true" />
            )}
            {copy.note}
          </p>
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
