import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Compass,
  MessageCircle,
  Share2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CuposProgress } from "@/components/shared/CuposProgress";
import { EmptyState, InfoNote, MoneyRow, PageHeader, SectionTitle } from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { bob, daysLeft, shortDate } from "@/lib/format";
import { available, cupoById } from "@/lib/selectors";

export function Reserved() {
  const { cupoId } = useParams();
  const offers = useAppStore((state) => state.offers);
  const payments = useAppStore((state) => state.payments);
  const found = cupoById(offers, cupoId);

  if (!found) {
    return (
      <EmptyState
        icon={Compass}
        title="No encontramos esa reserva"
        description="Vuelve a tus cupos para ver el estado de tus reservas."
        action={
          <Button asChild>
            <Link to="/mis-cupos">Ver Mis cupos</Link>
          </Button>
        }
      />
    );
  }

  const { offer, cupo } = found;
  const payment = payments.find((item) => item.cupoId === cupo.id);
  const free = available(offer);
  const complete = free === 0;
  const days = daysLeft(offer.deadline);
  const shareText = encodeURIComponent(
    `Me sumé a un cupo de ${offer.business} en Afíliame. Faltan ${free} para completar el grupo: ${offer.title} · ${bob(cupo.priceBob)} por ${cupo.label}.`,
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Tu cupo está reservado"
        subtitle="Tu pago quedó protegido. Ahora el grupo tiene que completarse antes del plazo."
      />

      <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr] lg:items-start">
        <div className="space-y-4">
          <Card className="border-brand/30 bg-brand-soft/40">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
                  <CheckCircle2 className="size-6" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-[19px] leading-tight">{offer.business}</p>
                  <p className="text-[12.5px] text-muted-foreground">
                    {cupo.label} · {shortDate(cupo.start)} al {shortDate(cupo.end)}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Badge variant="info">
                      <ShieldCheck className="size-3.5" aria-hidden="true" />
                      Pago protegido
                    </Badge>
                    {payment && <Badge variant="outline">Operación {payment.ref}</Badge>}
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <MoneyRow label="Pagaste" value={bob(cupo.priceBob)} />
              <MoneyRow
                label="Estado del grupo"
                value={complete ? "Grupo completo" : `Faltan ${free} cupos`}
                hint={days > 0 ? `Cierra el ${shortDate(offer.deadline)}` : "El plazo ya venció"}
                strong
              />
            </CardContent>
          </Card>

          <div>
            <SectionTitle hint={days > 0 ? `Quedan ${days} días` : "El plazo ya venció"}>
              Progreso del grupo
            </SectionTitle>
            <Card>
              <CardContent className="p-4">
                <CuposProgress offer={offer} />
                <p className="mt-3 flex items-start gap-2 text-[11.5px] leading-relaxed text-muted-foreground">
                  <Users className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                  Por privacidad no mostramos quién ocupa cada cupo.
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <SectionTitle>Qué pasa ahora</SectionTitle>
            <ol className="space-y-2">
              {[
                "Tu pago queda protegido y no llega al negocio todavía.",
                `Si el grupo se completa antes del ${shortDate(offer.deadline)}, el negocio cobra el año completo y tu pase digital queda listo.`,
                "Si no se completa, te devolvemos el pago completo en 24 a 72 horas hábiles, sin comisión.",
              ].map((item, index) => (
                <li key={item} className="flex gap-3 rounded-xl border border-border/80 bg-card p-3.5">
                  <span className="num flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[12px] font-semibold text-brand">
                    {index + 1}
                  </span>
                  <p className="text-pretty text-[12.5px] leading-relaxed text-muted-foreground">{item}</p>
                </li>
              ))}
            </ol>
          </div>

          <InfoNote tone="info" icon={Bell}>
            Tienes 24 horas para arrepentirte sin penalización: si cancelas, te devolvemos todo aunque
            el grupo ya esté completo.
          </InfoNote>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <Card>
            <CardContent className="p-4">
              <p className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
                <Users className="size-4 text-brand" aria-hidden="true" />
                Ayuda a llenar el grupo
              </p>
              <p className="mt-1 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
                Comparte la oferta por WhatsApp: mientras más rápido se llenen los cupos, antes se
                libera el pago al negocio y se emite tu pase.
              </p>
              <Button asChild className="mt-3 w-full">
                <a href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Compartir por WhatsApp
                </a>
              </Button>
              <Button
                variant="outline"
                className="mt-2 w-full"
                onClick={() => navigator.clipboard?.writeText(shareText)}
              >
                <Share2 className="size-4" aria-hidden="true" />
                Copiar mensaje
              </Button>

              <Separator className="my-4" />

              <p className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <CalendarDays className="size-3.5" aria-hidden="true" />
                {cupo.label}
              </p>
            </CardContent>
          </Card>

          {complete ? (
            <Button className="w-full" asChild>
              <Link to={`/pase/${cupo.id}`}>
                Ver mi pase digital
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            <Button className="w-full" asChild>
              <Link to={`/esperando/${offer.id}`}>
                Seguir el progreso del grupo
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          )}

          <Button variant="outline" className="w-full" asChild>
            <Link to={`/comprobante/${cupo.id}`}>Ver comprobante</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
