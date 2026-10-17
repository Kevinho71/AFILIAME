import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  CalendarClock,
  Check,
  Clock,
  Compass,
  Info,
  Lock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BusinessMark } from "@/components/shared/BusinessMark";
import { GuaranteeSteps } from "@/components/shared/GuaranteeSteps";
import { CuposProgress } from "@/components/shared/CuposProgress";
import { CupoStatusPill, OfferStatusPill } from "@/components/shared/status";
import { DemoTip, EmptyState, InfoNote, MoneyRow, PageHeader, SectionTitle } from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { CATEGORY_LABEL } from "@/lib/data";
import { bob, daysLeft, initials, shortDate, usdc } from "@/lib/format";
import { available, compareBob, cupoPrice, offerById, savingsPct } from "@/lib/selectors";

const REFUND_RULES = [
  "Grupo incompleto o reserva sin pagar: cancelas cuando quieras y te devolvemos todo.",
  "Primeras 24 horas después de pagar: te arrepientes sin penalización, aunque el grupo ya esté completo.",
  "Grupo completo y garantía no liberada: puedes ceder el cupo o cancelar con aprobación del negocio.",
  "Garantía liberada y periodo no iniciado: ya no hay reembolso automático, pero puedes ceder el cupo.",
  "Periodo en curso o terminado: no corresponde reembolso.",
];

export function OfferDetail() {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const offers = useAppStore((state) => state.offers);
  const rate = useAppStore((state) => state.rate);
  const setActiveOffer = useAppStore((state) => state.setActiveOffer);

  const offer = offerById(offers, offerId);

  useEffect(() => {
    if (offerId) setActiveOffer(offerId);
  }, [offerId, setActiveOffer]);

  if (!offer) {
    return (
      <EmptyState
        icon={Compass}
        title="No encontramos esta oferta"
        description="Puede que haya cambiado de dirección. Vuelve a explorar el feed."
        action={
          <Button asChild>
            <Link to="/explorar">Volver a Explorar</Link>
          </Button>
        }
      />
    );
  }

  const price = cupoPrice(offer);
  const saving = savingsPct(offer);
  const compare = compareBob(offer);
  const free = available(offer);
  const days = daysLeft(offer.deadline);
  const escrowPerCupo = Math.round((price / rate) * 100) / 100;

  return (
    <div className="space-y-5">
      <PageHeader title={offer.business} subtitle={offer.tagline} back="/explorar" />

      <div className="relative">
        <BusinessMark theme={offer.theme} name={offer.business} size="hero" />
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-1.5">
          <OfferStatusPill status={offer.status} className="shadow-sm" />
          {offer.releaseType === "escalonada" && (
            <Badge variant="gold" className="shadow-sm">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Pago Protegido
            </Badge>
          )}
          <Badge variant="outline" className="border-white/15 bg-black/45 text-white shadow-sm backdrop-blur">
            <Star className="size-3.5 fill-gold text-gold" aria-hidden="true" />
            {offer.rating} · {offer.reviews} reseñas
          </Badge>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="sm:col-span-2">
          <CardContent className="p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Precio por cupo
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="num font-display text-[32px] leading-none">{bob(price)}</span>
              {saving > 0 && (
                <span className="text-[12.5px] font-medium text-brand">
                  <Sparkles className="mr-1 inline size-3.5" aria-hidden="true" />
                  {saving}% menos que {bob(compare)} a tarifa mensual
                </span>
              )}
            </div>
            <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
              Anualidad de {bob(offer.annualBob)} dividida en {offer.cupos.length} cupos. Con el
              grupo completo, el negocio cobra el año por adelantado.
            </p>
            <Separator className="my-3" />
            <MoneyRow
              label="Pagas ahora, en bolivianos"
              hint="Por QR bancario, sin comisión adicional para ti"
              value={bob(price)}
              strong
            />
            <MoneyRow
              label="Entra a la garantía"
              hint={`Tasa de referencia: Bs ${rate} por USDC`}
              value={usdc(escrowPerCupo)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Progreso del grupo
            </p>
            <div className="mt-2">
              <CuposProgress offer={offer} tone={free > 0 ? "brand" : "success"} />
            </div>
            <div className="mt-3 flex items-center gap-2 text-[12.5px] text-muted-foreground">
              <Clock className="size-3.5" aria-hidden="true" />
              {days > 0
                ? `Quedan ${days} días para completar el grupo`
                : "El plazo de llenado ya venció"}
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-[12.5px] text-muted-foreground">
              <Users className="size-3.5" aria-hidden="true" />
              {free} {free === 1 ? "cupo disponible" : "cupos disponibles"}
            </div>
            <Button asChild variant="outline" size="sm" className="mt-3 w-full">
              <Link to={`/garantia/${offer.id}`}>
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Ver garantía
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <SectionTitle>Qué incluye</SectionTitle>
        <ul className="grid gap-2 sm:grid-cols-2">
          {offer.includes.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 rounded-xl border border-border/70 bg-card px-3.5 py-2.5 text-[13px] text-ink"
            >
              <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/80 bg-card p-4">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <MapPin className="size-3.5" aria-hidden="true" />
            Ubicación
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink">{offer.address}</p>
          <p className="text-[12px] text-muted-foreground">
            {offer.city} · {CATEGORY_LABEL[offer.category]}
          </p>
          <div className="mt-4 h-28 rounded-xl border border-dashed border-border bg-paper-deep/70 grain" />
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            Ubicación de referencia del local.
          </p>
        </div>
        <div className="rounded-2xl border border-border/80 bg-card p-4">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <CalendarClock className="size-3.5" aria-hidden="true" />
            Horarios y periodos
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink">{offer.hours}</p>
          <ul className="mt-3 space-y-1.5">
            {offer.cupos.map((cupo) => (
              <li key={cupo.id} className="flex items-center justify-between gap-2 text-[12.5px]">
                <span className="text-muted-foreground">
                  {cupo.label} · {shortDate(cupo.start)} al {shortDate(cupo.end)}
                </span>
                <span className="num shrink-0 text-ink">{bob(cupo.priceBob)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <SectionTitle hint={`Plazo de llenado: ${shortDate(offer.deadline)}`}>
          Cupos de esta oferta
        </SectionTitle>
        <div className="space-y-2">
          {offer.cupos.map((cupo) => (
            <div
              key={cupo.id}
              className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/80 bg-card p-3.5"
            >
              <Avatar className="size-9">
                <AvatarFallback>
                  {cupo.participant ? initials(cupo.participant.name) : "—"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-medium text-ink">{cupo.label}</p>
                <p className="text-[11.5px] text-muted-foreground">
                  {shortDate(cupo.start)} al {shortDate(cupo.end)}
                  {cupo.participant ? ` · ${cupo.participant.name}` : " · libre"}
                </p>
              </div>
              <span className="num text-[14px] font-semibold text-ink">{bob(cupo.priceBob)}</span>
              <CupoStatusPill status={cupo.status} />
              {cupo.status === "disponible" ? (
                <Button
                  size="sm"
                  onClick={() => navigate(`/oferta/${offer.id}/reservar?cupo=${cupo.id}`)}
                >
                  Reservar
                </Button>
              ) : cupo.mine ? (
                <Button asChild size="sm" variant="outline">
                  <Link to={cupo.status === "activo" ? `/pase/${cupo.id}` : `/comprobante/${cupo.id}`}>
                    {cupo.status === "activo" ? "Mi pase" : "Mi pago"}
                  </Link>
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>Tu pago está protegido</SectionTitle>
        <GuaranteeSteps />
      </div>

      <Card>
        <CardContent className="p-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="rules">
              <AccordionTrigger>Reglas del negocio</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1.5">
                  {offer.rules.map((rule) => (
                    <li key={rule}>• {rule}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="refund">
              <AccordionTrigger>Política de reembolso y cesión</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1.5">
                  {REFUND_RULES.map((rule) => (
                    <li key={rule}>• {rule}</li>
                  ))}
                </ul>
                <p className="mt-2">
                  El reembolso vuelve a tu cuenta o QR de origen en 24 a 72 horas hábiles, en la
                  misma moneda en que pagaste.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="money">
              <AccordionTrigger>Cómo se mueve el dinero</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1">
                  <MoneyRow label="Cupo pagado por ti" value={bob(price)} />
                  <MoneyRow label="Llega a la garantía" value={usdc(escrowPerCupo)} />
                  <MoneyRow label="Comisión de plataforma (3%)" hint="La asume el negocio" value={usdc(escrowPerCupo * 0.03)} />
                  <MoneyRow
                    label="Recibe el negocio al liberar"
                    value={usdc(escrowPerCupo * 0.97)}
                    strong
                  />
                </div>
                <p className="mt-2">
                  Tú nunca pagas comisión adicional por tu cupo. El saldo en dólares digitales del
                  negocio no genera intereses.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="legal">
              <AccordionTrigger>Marco legal y regulatorio</AccordionTrigger>
              <AccordionContent>
                La custodia de fondos, la conversión de moneda y el tratamiento de criptoactivos
                están pendientes de validación con asesoría legal en Bolivia.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <InfoNote icon={Lock} tone="neutral">
        Tu pago queda en garantía y no se mueve hasta que el grupo se complete o venza el plazo.
        Nunca se usa para generar rendimiento.
      </InfoNote>

      <DemoTip>
        Cuando el grupo se completa, la garantía se libera al negocio y se emiten los pases digitales.
      </DemoTip>

      <div className="sticky bottom-20 z-20 -mx-1 rounded-2xl border border-border/80 bg-card/95 p-3 backdrop-blur md:bottom-2">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="num font-display text-[18px] leading-none">{bob(price)}</p>
            <p className="text-[11.5px] text-muted-foreground">
              {free > 0 ? `${free} cupo${free === 1 ? "" : "s"} disponible${free === 1 ? "" : "s"}` : "Sin cupos disponibles"}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to={`/garantia/${offer.id}`}>
              <Info className="size-4" aria-hidden="true" />
              Garantía
            </Link>
          </Button>
          {free > 0 ? (
            <Button asChild>
              <Link to={`/oferta/${offer.id}/reservar`}>
                Reservar cupo
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            <Button disabled>Sin cupos</Button>
          )}
        </div>
      </div>
    </div>
  );
}
