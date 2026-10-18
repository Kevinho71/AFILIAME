import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CircleSlash,
  Compass,
  LayoutList,
  RotateCcw,
  Repeat2,
  ShieldCheck,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CupoStatusPill, OfferStatusPill } from "@/components/shared/status";
import { EmptyState, PageHeader } from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { bob, shortDate } from "@/lib/format";
import type { Cupo, Offer } from "@/lib/types";

interface Row {
  offer: Offer;
  cupo: Cupo;
}

const isReleased = (offer: Offer) => ["liberada", "en_curso", "finalizada"].includes(offer.status);

function groupMyCupos(offers: Offer[]) {
  const rows: Row[] = offers.flatMap((offer) =>
    offer.cupos.filter((cupo) => cupo.mine).map((cupo) => ({ offer, cupo })),
  );
  return {
    activos: rows.filter(
      (row) =>
        row.cupo.status === "emitido" ||
        row.cupo.status === "activado" ||
        row.cupo.status === "en_cesion" ||
        (row.cupo.status === "en_garantia" && isReleased(row.offer)),
    ),
    pendientes: rows.filter(
      (row) =>
        (row.cupo.status === "en_garantia" || row.cupo.status === "reservado") &&
        !isReleased(row.offer),
    ),
    finalizados: rows.filter((row) => row.cupo.status === "finalizado"),
    reembolsados: rows.filter((row) => row.cupo.status === "reembolsado"),
  };
}

function CupoRowCard({ row }: { row: Row }) {
  const { offer, cupo } = row;
  const released = isReleased(offer);

  let cta = { to: `/esperando/${offer.id}`, label: "Ver progreso del grupo", icon: ShieldCheck };
  if (cupo.status === "emitido" || cupo.status === "activado" || (cupo.status === "en_garantia" && released)) {
    cta = {
      to: `/pase/${cupo.id}`,
      label: cupo.status === "activado" ? "Cupo activado" : "Ver código de activación",
      icon: BadgeCheck,
    };
  } else if (cupo.status === "reembolsado") {
    cta = { to: `/reembolso/${cupo.id}`, label: "Ver reembolso", icon: RotateCcw };
  } else if (cupo.status === "finalizado") {
    cta = { to: `/comprobante/${cupo.id}`, label: "Ver comprobante", icon: BadgeCheck };
  } else if (cupo.status === "en_cesion") {
    cta = { to: `/ceder/${cupo.id}`, label: "Ver mi publicación", icon: Repeat2 };
  }

  const Icon = cta.icon;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[14.5px] font-semibold text-ink">{offer.business}</p>
            <p className="truncate text-[12px] text-muted-foreground">{offer.title}</p>
          </div>
          <OfferStatusPill status={offer.status} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {cupo.label}
          </span>
          <span className="num inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            {bob(cupo.priceBob)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            {cupo.participant?.name ?? "Sin beneficiario"}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <CupoStatusPill status={cupo.status} />
          {cupo.status === "en_garantia" && released && (
            <Badge variant="gold">Grupo completo · código listo</Badge>
          )}
          {cupo.transfer && <Badge variant="gold">Cesión {cupo.transfer.status}</Badge>}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link to={cta.to}>
              <Icon className="size-3.5" aria-hidden="true" />
              {cta.label}
            </Link>
          </Button>
          {(cupo.status === "emitido" || cupo.status === "activado" || (cupo.status === "en_garantia" && released)) && (
            <Button asChild size="sm" variant="outline">
              <Link to={`/ceder/${cupo.id}`}>
                <Repeat2 className="size-3.5" aria-hidden="true" />
                Ceder cupo
              </Link>
            </Button>
          )}
          {cupo.status === "finalizado" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                toast.success("¡Gracias por tu calificación!", {
                  description: `${offer.business} recibió 5 estrellas.`,
                })
              }
            >
              <Star className="size-3.5" aria-hidden="true" />
              Calificar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function MyCupos() {
  const offers = useAppStore((state) => state.offers);
  const grouped = useMemo(() => groupMyCupos(offers), [offers]);

  const tabs = [
    { value: "activos", label: "Activos", rows: grouped.activos },
    { value: "pendientes", label: "Pendientes", rows: grouped.pendientes },
    { value: "finalizados", label: "Finalizados", rows: grouped.finalizados },
    { value: "reembolsados", label: "Reembolsados", rows: grouped.reembolsados },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Mis cupos"
        subtitle="Todo lo que reservaste, con el estado de tu pago y de tu cupo."
      />

      <Tabs defaultValue="activos">
        <TabsList className="w-full">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5">
              {tab.label}
              <span className="num rounded-full bg-card/80 px-1.5 text-[10.5px] text-muted-foreground">
                {tab.rows.length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.rows.length === 0 ? (
              <EmptyState
                icon={LayoutList}
                title="Nada por aquí"
                description="Cuando reserves un cupo aparecerá en esta pestaña con su estado de pago."
                action={
                  <Button asChild>
                    <Link to="/explorar">
                      <Compass className="size-4" aria-hidden="true" />
                      Explorar ofertas
                    </Link>
                  </Button>
                }
              />
            ) : (
              <div className="space-y-3">
                {tab.rows.map((row) => (
                  <CupoRowCard key={row.cupo.id} row={row} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <div className="rounded-2xl border border-dashed border-border bg-card/60 p-4">
        <p className="flex items-center gap-2 text-[13px] font-medium text-ink">
          <CircleSlash className="size-4 text-muted-foreground" aria-hidden="true" />
          Cupos que ya no se pueden tocar
        </p>
        <p className="mt-1 text-pretty text-[12px] leading-relaxed text-muted-foreground">
          Antes del cierre puedes retirar tu pago: gratis en las primeras 24 h, con 2% de
          penalización después, y en los últimos 3 días solo cediendo tu cupo. Un cupo ya liberado
          no tiene reembolso: si no lo necesitas, publícalo en cesión con la aprobación del negocio
          (comisión del 2% al 3%).
        </p>
        <Button asChild variant="outline" size="sm" className="mt-3">
          <Link to="/oferta/powerfit">
            Ver ejemplo de cesión
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </Button>
        <p className="mt-3 text-[11.5px] text-muted-foreground">
          Última actualización: {shortDate("2026-10-17")}.
        </p>
      </div>
    </div>
  );
}
