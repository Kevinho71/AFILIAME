import { CalendarClock, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { BusinessMark } from "@/components/shared/BusinessMark";
import { CupoDots, CuposProgress } from "@/components/shared/CuposProgress";
import { OfferStatusPill } from "@/components/shared/status";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABEL } from "@/lib/data";
import { bob, daysLeft } from "@/lib/format";
import { available, compareBob, cupoPrice, savingsPct } from "@/lib/selectors";
import type { Offer } from "@/lib/types";

export function offerMeta(offer: Offer) {
  const availableCount = available(offer);
  const closed = ["reembolsada", "finalizada"].includes(offer.status);
  if (closed) return { text: "Cerrada", tone: "muted" as const };
  if (availableCount === 0) return { text: "Cupos completos", tone: "success" as const };
  const days = daysLeft(offer.deadline);
  if (days <= 1) return { text: "Cierra hoy", tone: "warn" as const };
  return { text: `Cierra en ${days} días`, tone: "info" as const };
}

export function OfferCard({ offer }: { offer: Offer }) {
  const meta = offerMeta(offer);
  const price = cupoPrice(offer);
  const saving = savingsPct(offer);
  const compare = compareBob(offer);

  return (
    <Link
      to={`/oferta/${offer.id}`}
      className="group block rounded-2xl border border-border/80 bg-card p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-[0_18px_36px_-22px_rgba(0,0,0,0.7)]"
    >
      <div className="relative">
        <BusinessMark theme={offer.theme} name={offer.business} size="lg" />
        <div className="absolute left-2.5 top-2.5 flex flex-wrap items-center gap-1.5">
          <OfferStatusPill status={offer.status} className="shadow-sm" />
          {offer.releaseType === "escalonada" && (
            <Badge variant="gold" className="shadow-sm">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Pago Protegido
            </Badge>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-ink">{offer.business}</p>
            <p className="mt-0.5 truncate text-[12.5px] text-muted-foreground">{offer.title}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="num font-display text-[19px] leading-none text-ink">{bob(price)}</p>
            <p className="text-[11px] text-muted-foreground">por cupo</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11.5px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" aria-hidden="true" />
            {offer.city} · {CATEGORY_LABEL[offer.category]}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarClock className="size-3.5" aria-hidden="true" />
            {meta.text}
          </span>
          {saving > 0 && (
            <span className="inline-flex items-center gap-1.5 font-medium text-brand">
              <Sparkles className="size-3.5" aria-hidden="true" />
              {saving}% menos que {bob(compare)}
            </span>
          )}
        </div>

        <CuposProgress offer={offer} />
        <CupoDots offer={offer} />
      </div>
    </Link>
  );
}
