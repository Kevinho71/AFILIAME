import { paidCount } from "@/lib/selectors";
import type { CupoStatus, Offer } from "@/lib/types";
import { cn } from "@/lib/utils";

const SEGMENT: Record<CupoStatus, string> = {
  disponible: "bg-secondary ring-1 ring-inset ring-border",
  reservado: "bg-gold/70",
  en_garantia: "bg-brand",
  emitido: "bg-brand",
  activado: "bg-success",
  finalizado: "bg-brand/70",
  reembolsado: "bg-danger/60",
  en_cesion: "bg-gold/70",
};

/**
 * Una sola barra de cupos, dividida en tantos tramos como cupos tenga la oferta.
 * No muestra quién ocupa cada cupo: solo cuántos están tomados y cuántos quedan libres.
 */
export function CuposProgress({
  offer,
  showLabel = true,
  className,
}: {
  offer: Offer;
  showLabel?: boolean;
  className?: string;
}) {
  const total = offer.cupos.length;
  const paid = paidCount(offer);
  const free = total - paid;

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-[12px]">
          <span className="font-medium text-ink">
            {paid} de {total} cupos ocupados
          </span>
          <span className="text-muted-foreground">
            {free === 0 ? "Grupo completo" : `${free} ${free === 1 ? "libre" : "libres"}`}
          </span>
        </div>
      )}
      <div
        className="flex gap-1.5"
        role="img"
        aria-label={`${paid} de ${total} cupos ocupados`}
      >
        {offer.cupos.map((cupo) => (
          <span
            key={cupo.id}
            className={cn("h-2.5 flex-1 rounded-full transition-colors", SEGMENT[cupo.status])}
          />
        ))}
      </div>
    </div>
  );
}
