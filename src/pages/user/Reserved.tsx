import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  Bell,
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
import { bob, daysLeft, shortDate, usdc } from "@/lib/format";
import { cupoById } from "@/lib/selectors";

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
  const complete = offer.cupos.every((item) => item.status !== "disponible");
  const days = daysLeft(offer.deadline);
  const shareText = encodeURIComponent(
    `Me sumé a un cupo de ${offer.business} en Cupos. Faltan ${offer.cupos.filter((item) => item.status === "disponible").length} para completar el grupo: ${offer.title} · ${bob(cupo.priceBob)} por ${cupo.label}.`,
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Tu pago está en garantía"
        subtitle="Ya reservaste tu cupo. Ahora el grupo tiene que completarse antes del plazo."
      />

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
                  En garantía
                </Badge>
                {payment && <Badge variant="outline">Operación {payment.ref}</Badge>}
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <MoneyRow label="Pagaste" value={bob(cupo.priceBob)} />
          <MoneyRow label="En garantía" hint={`Tasa fija: Bs ${payment?.rate ?? 10} por USDC`} value={usdc(cupo.escrowUsdc ?? 0)} />
          <MoneyRow
            label={complete ? "Estado del grupo" : "Falta completar"}
            value={complete ? "Grupo completo" : `${offer.cupos.filter((item) => item.status === "disponible").length} cupos`}
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
            <CuposProgress offer={offer} tone={complete ? "success" : "brand"} />
            <div className="mt-3 flex items-center gap-1.5">
              {offer.cupos.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-1 flex-col rounded-xl border border-border/70 bg-paper-deep/40 px-2 py-2 text-center"
                >
                  <span className="text-[11px] text-muted-foreground">Cupo {item.index + 1}</span>
                  <span className="mt-0.5 truncate text-[11.5px] font-medium text-ink">
                    {item.participant ? item.participant.name.split(" ")[0] : "Libre"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <SectionTitle>Qué pasa ahora</SectionTitle>
        <ol className="space-y-2">
          {[
            "Tu dinero queda bloqueado en la garantía, no llega al negocio todavía.",
            `Si el grupo se completa antes del ${shortDate(offer.deadline)}, el negocio cobra todo y tu pase digital queda listo.`,
            "Si no se completa, te devolvemos el pago completo en 24 a 72 horas hábiles y sin comisión.",
          ].map((item, index) => (
            <li key={item} className="flex gap-3 rounded-xl border border-border/80 bg-card p-3.5">
              <span className="num flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[12px] font-semibold text-brand-deep">
                {index + 1}
              </span>
              <p className="text-pretty text-[12.5px] leading-relaxed text-muted-foreground">{item}</p>
            </li>
          ))}
        </ol>
      </div>

      <InfoNote tone="info" icon={Bell}>
        Tienes 24 horas para arrepentirte sin penalización: si cancelas, te devolvemos todo aunque el
        grupo ya esté completo.
      </InfoNote>

      <Card>
        <CardContent className="p-4">
          <p className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
            <Users className="size-4 text-brand/70" aria-hidden="true" />
            Ayuda a llenar el grupo
          </p>
          <p className="mt-1 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
            Comparte la oferta por WhatsApp. Mientras más rápido se llenen los cupos, antes se libera
            el pago al negocio y se emite tu pase.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button asChild>
              <a
                href={`https://wa.me/?text=${shareText}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Compartir por WhatsApp
              </a>
            </Button>
            <Button variant="outline" onClick={() => navigator.clipboard?.writeText(shareText)}>
              <Share2 className="size-4" aria-hidden="true" />
              Copiar mensaje
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row">
        {complete ? (
          <Button className="flex-1" asChild>
            <Link to={`/pase/${cupo.id}`}>
              Ver mi pase digital
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        ) : (
          <Button className="flex-1" asChild>
            <Link to={`/esperando/${offer.id}`}>
              Seguir el progreso del grupo
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link to={`/comprobante/${cupo.id}`}>Ver comprobante</Link>
        </Button>
      </div>
    </div>
  );
}
