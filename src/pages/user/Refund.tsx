import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  Banknote,
  Compass,
  Info,
  RotateCcw,
  Timer,
  TrendingDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OfferCard } from "@/components/shared/OfferCard";
import { EmptyState, InfoNote, MoneyRow, PageHeader, SectionTitle } from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { bob, shortDate } from "@/lib/format";
import { cupoById } from "@/lib/selectors";

export function Refund() {
  const { cupoId } = useParams();
  const offers = useAppStore((state) => state.offers);
  const payments = useAppStore((state) => state.payments);
  const found = cupoById(offers, cupoId);

  if (!found) {
    return (
      <EmptyState
        icon={Compass}
        title="No encontramos ese reembolso"
        description="Vuelve a Mis cupos para revisar tus devoluciones."
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
  const similar = offers
    .filter((item) => item.id !== offer.id && item.public && item.category === offer.category)
    .slice(0, 2);
  const fallback = offers.filter((item) => item.id !== offer.id && item.public).slice(0, 2);
  const suggestions = similar.length > 0 ? similar : fallback;

  return (
    <div className="space-y-5">
      <PageHeader
        title="No se completó el grupo"
        subtitle="Reembolsamos tu pago automáticamente. No tienes que hacer ningún trámite."
        back="/mis-cupos"
      />

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger">
              <RotateCcw className="size-6" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-[20px] leading-tight">
                Te devolvimos {bob(cupo.priceBob)}
              </p>
              <p className="text-[12.5px] text-muted-foreground">
                {offer.business} · {cupo.label}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge variant="danger">Reembolsado</Badge>
                {payment && <Badge variant="outline">Operación {payment.ref}</Badge>}
              </div>
            </div>
          </div>

          <Separator className="my-4" />
          <MoneyRow label="Monto devuelto" value={bob(cupo.priceBob)} />
          <MoneyRow label="Medio" hint="Cuenta de origen · Banco Fassil •• 4417" value="Mismo medio de pago" />
          <MoneyRow
            label="Comisión de devolución"
            value="Bs 0"
            tone="success"
            hint="La plataforma absorbe la diferencia de tipo de cambio"
          />
          <MoneyRow
            label="Plazo del reembolso"
            hint={payment?.refundedAt ? `Procesado el ${payment.refundedAt}` : "24 a 72 horas hábiles"}
            value="Automático"
            strong
          />
        </CardContent>
      </Card>

      <div className="grid gap-2 sm:grid-cols-3">
        {[
          { icon: Banknote, title: "Mismo origen", body: "Si pagaste por QR en bolivianos, vuelve a ese mismo QR." },
          { icon: Timer, title: "24 a 72 horas", body: "El plazo se muestra también en tu comprobante." },
          { icon: TrendingDown, title: "Sin penalización", body: "El usuario nunca paga por un grupo que no se llenó." },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-xl border border-border/80 bg-card p-3.5">
              <Icon className="size-4 text-brand/70" aria-hidden="true" />
              <p className="mt-2 text-[13px] font-medium text-ink">{item.title}</p>
              <p className="text-[11.5px] leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          );
        })}
      </div>

      <InfoNote tone="neutral" icon={Info}>
        El grupo de {offer.business} cerró el {shortDate(offer.deadline)} con cupos libres. Tu reserva
        quedó sin efecto y el cupo volvió a la oferta.
      </InfoNote>

      <div>
        <SectionTitle hint="Mismas categorías y precio similar">Ofertas similares</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {suggestions.map((item) => (
            <OfferCard key={item.id} offer={item} />
          ))}
        </div>
      </div>

      <Button variant="outline" className="w-full" asChild>
        <Link to="/explorar">
          Volver a Explorar
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Button>
    </div>
  );
}
