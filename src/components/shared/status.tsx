import {
  Archive,
  BadgeCheck,
  CalendarCheck,
  Clock,
  CircleDashed,
  PauseCircle,
  QrCode,
  Repeat2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CupoStatus, OfferStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tone = "soft" | "success" | "info" | "warn" | "danger" | "muted" | "gold";

const OFFER_STATUS: Record<OfferStatus, { label: string; tone: Tone; icon: typeof Clock }> = {
  publicada: { label: "Publicada", tone: "info", icon: Sparkles },
  llenandose: { label: "Llenándose", tone: "info", icon: Clock },
  completa: { label: "Grupo completo", tone: "success", icon: BadgeCheck },
  liberada: { label: "Liberada al negocio", tone: "success", icon: ShieldCheck },
  en_curso: { label: "En curso", tone: "success", icon: CalendarCheck },
  finalizada: { label: "Finalizada", tone: "muted", icon: Archive },
  vencida: { label: "Vencida", tone: "warn", icon: TriangleAlert },
  pausada: { label: "Pausada", tone: "muted", icon: PauseCircle },
  reembolsada: { label: "Reembolsada", tone: "danger", icon: RotateCcw },
};

const CUPO_STATUS: Record<CupoStatus, { label: string; tone: Tone; icon: typeof Clock }> = {
  disponible: { label: "Disponible", tone: "muted", icon: CircleDashed },
  reservado: { label: "Reservado · pago pendiente", tone: "warn", icon: Clock },
  en_garantia: { label: "Pagado en garantía", tone: "info", icon: ShieldCheck },
  emitido: { label: "Código listo", tone: "info", icon: QrCode },
  activado: { label: "Activado", tone: "success", icon: BadgeCheck },
  finalizado: { label: "Finalizado", tone: "muted", icon: Archive },
  reembolsado: { label: "Reembolsado", tone: "danger", icon: RotateCcw },
  en_cesion: { label: "En cesión", tone: "gold", icon: Repeat2 },
};

export function OfferStatusPill({
  status,
  className,
}: {
  status: OfferStatus;
  className?: string;
}) {
  const meta = OFFER_STATUS[status];
  const Icon = meta.icon;
  return (
    <Badge variant={meta.tone === "gold" ? "gold" : meta.tone} className={className}>
      <Icon className="size-3.5" aria-hidden="true" />
      {meta.label}
    </Badge>
  );
}

export function CupoStatusPill({
  status,
  className,
}: {
  status: CupoStatus;
  className?: string;
}) {
  const meta = CUPO_STATUS[status];
  const Icon = meta.icon;
  return (
    <Badge variant={meta.tone === "gold" ? "gold" : meta.tone} className={className}>
      <Icon className="size-3.5" aria-hidden="true" />
      {meta.label}
    </Badge>
  );
}

export const offerStatusLabel = (status: OfferStatus) => OFFER_STATUS[status].label;
export const cupoStatusLabel = (status: CupoStatus) => CUPO_STATUS[status].label;

export function Dot({ tone, className }: { tone: Tone; className?: string }) {
  const map: Record<Tone, string> = {
    soft: "bg-brand-soft",
    success: "bg-success",
    info: "bg-info",
    warn: "bg-gold",
    danger: "bg-danger",
    muted: "bg-muted-foreground/60",
    gold: "bg-gold",
  };
  return <span className={cn("size-2 rounded-full", map[tone], className)} aria-hidden="true" />;
}
