import { Progress } from "@/components/ui/progress";
import type { Offer } from "@/lib/types";
import { paidCount, progressPct } from "@/lib/selectors";
import { cn } from "@/lib/utils";

export function CuposProgress({
  offer,
  showLabel = true,
  className,
  tone,
}: {
  offer: Offer;
  showLabel?: boolean;
  className?: string;
  tone?: "brand" | "warn" | "success";
}) {
  const total = offer.cupos.length;
  const paid = paidCount(offer);
  const pct = progressPct(offer);
  const indicator = {
    brand: "bg-primary",
    warn: "bg-gold",
    success: "bg-success",
  } as const;

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-[12.5px]">
          <span className="font-medium text-ink">
            {paid} de {total} cupos llenos
          </span>
          <span className="num text-muted-foreground">{pct}%</span>
        </div>
      )}
      <Progress
        value={pct}
        indicatorClassName={tone ? indicator[tone] : undefined}
        aria-label={`${paid} de ${total} cupos llenos`}
      />
    </div>
  );
}

export function CupoDots({ offer, className }: { offer: Offer; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {offer.cupos.map((cupo) => {
        const filled = cupo.status !== "disponible";
        return (
          <span
            key={cupo.id}
            title={cupo.label}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              filled ? "bg-primary" : "bg-secondary",
              cupo.status === "reembolsado" && "bg-danger/60",
            )}
          />
        );
      })}
    </div>
  );
}
