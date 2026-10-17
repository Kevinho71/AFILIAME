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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CuposProgress } from "@/components/shared/CuposProgress";
import { CupoStatusPill } from "@/components/shared/status";
import { EmptyState, InfoNote, PageHeader, SectionTitle } from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { bob, daysLeft, initials, shortDate } from "@/lib/format";
import { offerById } from "@/lib/selectors";

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
  const free = offer.cupos.filter((cupo) => cupo.status === "disponible").length;
  const complete = free === 0;
  const myCupo = offer.cupos.find((cupo) => cupo.mine);
  const participants = offer.cupos.filter((cupo) => cupo.participant);

  return (
    <div className="space-y-5">
      <PageHeader
        title={complete ? "Grupo completo" : "Esperando al grupo"}
        subtitle={`${offer.business} · ${offer.title}`}
        back="/mis-cupos"
      />

      {complete ? (
        <Card className="border-success/25 bg-success-soft/40">
          <CardContent className="p-5 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success text-primary-foreground">
              <CheckCircle2 className="size-7" aria-hidden="true" />
            </span>
            <h2 className="mt-3 font-display text-[21px]">¡Se completaron los cupos!</h2>
            <p className="mx-auto mt-2 max-w-sm text-pretty text-[13px] leading-relaxed text-muted-foreground">
              La garantía se liberó al negocio y los pases digitales ya están emitidos.
            </p>
            {myCupo && (
              <Button className="mt-4" asChild>
                <Link to={`/pase/${myCupo.id}`}>
                  Ver mi pase digital
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            )}
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
                <p className="num mt-1 font-display text-[26px] leading-none">
                  {offer.cupos.length - free}/{offer.cupos.length}
                </p>
              </div>
              <Badge variant={days <= 1 ? "warn" : "info"}>
                <CalendarClock className="size-3.5" aria-hidden="true" />
                {days > 0 ? `Quedan ${days} días` : "Plazo vencido"}
              </Badge>
            </div>
            <div className="mt-3">
              <CuposProgress offer={offer} showLabel={false} />
            </div>
            <p className="mt-3 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
              Si en {days} días los {free} cupos que faltan no se completan, la garantía se devuelve
              automáticamente a cada persona.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button asChild className="flex-1">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Faltan ${free} cupos para completar ${offer.business} en Cupos. Cada cupo cuesta ${bob(offer.cupos[0].priceBob)} y hay devolución automática si no se llena.`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Invitar por WhatsApp
                </a>
              </Button>
              <Button variant="outline" asChild>
                <Link to={`/garantia/${offer.id}`}>
                  <ShieldCheck className="size-4" aria-hidden="true" />
                  Ver garantía
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <SectionTitle hint={`${participants.length} de ${offer.cupos.length} cupos pagados`}>
          Participantes
        </SectionTitle>
        <div className="space-y-2">
          {offer.cupos.map((cupo) => (
            <div
              key={cupo.id}
              className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-3.5"
            >
              <Avatar>
                <AvatarFallback>
                  {cupo.participant ? initials(cupo.participant.name) : "—"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium text-ink">
                  {cupo.participant?.name ?? "Cupo libre"}
                  {cupo.mine && <span className="ml-1.5 text-[11.5px] text-brand">(tú)</span>}
                </p>
                <p className="text-[11.5px] text-muted-foreground">
                  {cupo.label}
                  {cupo.paidAt ? ` · pagó el ${cupo.paidAt}` : ""}
                </p>
              </div>
              <CupoStatusPill status={cupo.status} />
            </div>
          ))}
        </div>
      </div>

      <InfoNote tone="info" icon={Info}>
        Reembolso automático: si el plazo termina sin completar el grupo, devolvemos cada pago a su
        cuenta o QR de origen en 24 a 72 horas hábiles. No tienes que reclamar nada.
      </InfoNote>

      <InfoNote tone="neutral" icon={Users}>
        Los recordatorios se envían 48 y 24 horas antes del {shortDate(offer.deadline)}.
      </InfoNote>
    </div>
  );
}
