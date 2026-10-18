import { CalendarClock, MapPin, PiggyBank } from "lucide-react";
import { Link } from "react-router-dom";
import { BusinessMark } from "@/components/shared/BusinessMark";
import { CuposProgress } from "@/components/shared/CuposProgress";
import { OfferStatusPill } from "@/components/shared/status";
import { ReleaseModeBadge } from "@/components/shared/ReleaseMode";
import { CATEGORY_LABEL } from "@/lib/data";
import { bob, daysLeft } from "@/lib/format";
import { available, compareBob, cupoPrice } from "@/lib/selectors";
import { savingsBob } from "@/lib/pricing";
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
  const normal = compareBob(offer);
  const saving = savingsBob(offer);

  return (
    <Link
      to={`/oferta/${offer.id}`}
      className="group block rounded-2xl border border-border/80 bg-card p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-[0_18px_36px_-22px_rgba(0,0,0,0.7)]"
    >
      <div className="relative">
        <BusinessMark theme={offer.theme} name={offer.business} size="lg" />
        <div className="absolute left-2.5 top-2.5 flex flex-wrap items-center gap-1.5">
          <OfferStatusPill status={offer.status} className="shadow-sm" />
          <ReleaseModeBadge offer={offer} className="shadow-sm" />
        </div>
      </div>

      <div className="mt-3 space-y-3">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-ink">{offer.business}</p>
          <p className="mt-0.5 truncate text-[12.5px] text-muted-foreground">{offer.title}</p>
        </div>

        <div className="rounded-xl border border-border/70 bg-paper-deep/50 px-3.5 py-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Por cupo</p>
              <p className="num mt-1 text-[12.5px] text-muted-foreground line-through">
                {bob(normal)}
              </p>
            </div>
            <p className="num font-display text-[26px] leading-none text-brand">{bob(price)}</p>
          </div>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[11.5px] font-semibold text-brand">
            <PiggyBank className="size-3.5" aria-hidden="true" />
            Ahorras {bob(saving)}
          </p>
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
        </div>

        <CuposProgress offer={offer} />
      </div>
    </Link>
  );
}
