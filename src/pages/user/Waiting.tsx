import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Compass,
  Info,
  MessageCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CuposProgress } from "@/components/shared/CuposProgress";
import { CupoStatusPill } from "@/components/shared/status";
import { EmptyState, InfoNote, PageHeader, SectionTitle } from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { bob, daysLeft } from "@/lib/format";
import { available, offerById } from "@/lib/selectors";

export function Waiting() {
  const { offerId } = useParams();
  const offers = useAppStore((state) => state.offers);
  const offer = offerById(offers, offerId);

  if (!offer) {
    return (
      <EmptyState
        icon={Compass}
        title="No encontramos esta oferta"
        description="Vuelve a tu lista de cupos para ver tus reservas."
        action={
          <Button asChild>
            <Link to="/mis-cupos">Ver Mis cupos</Link>
          </Button>
        }
      />
    );
  }

  const days = daysLeft(offer.deadline);
  const free = available(offer);
  const complete = free === 0;
  const myCupo = offer.cupos.find((cupo) => cupo.mine);

  return (
    <div className="space-y-5">
      <PageHeader
        title={complete ? "Grupo completo" : "Esperando al grupo"}
        subtitle={`${offer.business} · ${offer.title}`}
        back="/mis-cupos"
      />

      <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr] lg:items-start">
        <div className="space-y-4">
          {complete ? (
            <Card className="border-success/25 bg-success-soft/40">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-success text-primary-foreground">
                    <CheckCircle2 className="size-6" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-[20px] leading-tight">¡Se completaron los cupos!</p>
                    <p className="mt-1 text-pretty text-[13px] leading-relaxed text-muted-foreground">
                      El negocio ya recibió el pago del año completo y los pases digitales están
                      emitidos.
                    </p>
                    {myCupo && (
                      <Button className="mt-3" asChild>
                        <Link to={`/pase/${myCupo.id}`}>
                          Ver mi pase digital
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Progreso del grupo
                    </p>
                    <p className="num mt-1 font-display text-[28px] leading-none">
                      {offer.cupos.length - free}/{offer.cupos.length}
                    </p>
                  </div>
                  <Badge variant={days <= 1 ? "warn" : "info"}>
                    <CalendarClock className="size-3.5" aria-hidden="true" />
                    {days > 0 ? `Quedan ${days} días` : "Plazo vencido"}
                  </Badge>
                </div>
                <div className="mt-4">
                  <CuposProgress offer={offer} showLabel={false} />
                </div>
                <p className="mt-3 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
                  Si en {days} días los {free} cupos que faltan no se completan, el pago se devuelve
                  automáticamente a cada persona.
                </p>
              </CardContent>
            </Card>
          )}

          <div>
            <SectionTitle hint={`${offer.cupos.length - free} de ${offer.cupos.length} ocupados`}>
              Estado de los cupos
            </SectionTitle>
            <div className="space-y-2">
              {offer.cupos.map((cupo) => (
                <div
                  key={cupo.id}
                  className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/80 bg-card p-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium text-ink">
                      Cupo {cupo.index + 1}
                      {cupo.mine && <span className="ml-1.5 text-[11.5px] text-brand">(tuyo)</span>}
                    </p>
                    <p className="text-[11.5px] text-muted-foreground">
                      {cupo.label} · {cupo.status === "disponible" ? "libre" : "ocupado"}
                    </p>
                  </div>
                  <CupoStatusPill status={cupo.status} />
                </div>
              ))}
            </div>
            <p className="mt-2 flex items-start gap-2 text-[11.5px] leading-relaxed text-muted-foreground">
              <Users className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              Por privacidad no mostramos quién ocupa cada cupo.
            </p>
          </div>

          <InfoNote tone="info" icon={Info}>
            Reembolso automático: si el plazo termina sin completar el grupo, cada pago vuelve a su
            cuenta o QR de origen en 24 a 72 horas hábiles. No tienes que reclamar nada.
          </InfoNote>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <Card>
            <CardContent className="p-4">
              <p className="text-[13.5px] font-semibold text-ink">Invita a completar el grupo</p>
              <p className="mt-1 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
                Cada cupo que se ocupa acerca el momento en que el negocio cobra y tu pase queda
                listo.
              </p>
              <Button asChild className="mt-3 w-full">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Faltan ${free} cupos para completar ${offer.business} en Afíliame. Cada cupo cuesta ${bob(offer.cupos[0].priceBob)} y hay devolución automática si no se llena.`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Invitar por WhatsApp
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
                <ShieldCheck className="size-4 text-brand" aria-hidden="true" />
                Pagaste {bob(offer.cupos.find((cupo) => cupo.mine)?.priceBob ?? offer.cupos[0].priceBob)}
              </p>
              <p className="mt-1 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
                El monto queda fijo en bolivianos y se devuelve completo si el grupo no se completa.
              </p>
              <Button asChild variant="outline" className="mt-3 w-full">
                <Link to={`/garantia/${offer.id}`}>Ver garantía</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
