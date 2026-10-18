import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  CalendarClock,
  CalendarX,
  Check,
  Clock,
  Compass,
  Lock,
  MapPin,
  PiggyBank,
  ShieldCheck,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BusinessMark } from "@/components/shared/BusinessMark";
import { GuaranteeSteps } from "@/components/shared/GuaranteeSteps";
import { CuposProgress } from "@/components/shared/CuposProgress";
import { ReleaseModeIndicator } from "@/components/shared/ReleaseMode";
import { CupoStatusPill, OfferStatusPill } from "@/components/shared/status";
import { EmptyState, MoneyRow, PageHeader, SectionTitle } from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { CATEGORY_LABEL } from "@/lib/data";
import { bob, daysLeft, shortDate } from "@/lib/format";
import { available, compareBob, cupoPrice, offerById } from "@/lib/selectors";
import { savingsBob } from "@/lib/pricing";
import { cupoWhen, validityText } from "@/lib/usage";

const REFUND_RULES = [
  "Grupo incompleto o reserva sin pagar: cancelas cuando quieras y te devolvemos todo.",
  "Primeras 24 horas después de pagar: te arrepientes sin penalización, aunque el grupo ya esté completo.",
  "Grupo completo: puedes ceder el cupo o cancelar con aprobación del negocio.",
  "Una vez arranca el ciclo (o tu periodo, si el cupo tiene fechas): ya no corresponde reembolso, pero puedes ceder el cupo.",
];

export function OfferDetail() {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const offers = useAppStore((state) => state.offers);
  const setActiveOffer = useAppStore((state) => state.setActiveOffer);
  const [protectedOpen, setProtectedOpen] = useState(false);

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
  const normal = compareBob(offer);
  const saving = savingsBob(offer);
  const free = available(offer);
  const days = daysLeft(offer.deadline);

  return (
    <div className="space-y-5">
      <PageHeader title={offer.business} subtitle={offer.tagline} back="/explorar" />

      <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr] lg:items-start">
        <div className="space-y-5">
          <div className="relative">
            <BusinessMark theme={offer.theme} name={offer.business} size="lg" />
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-1.5">
              <OfferStatusPill status={offer.status} className="shadow-sm" />
              <ReleaseModeIndicator offer={offer} className="shadow-sm" />
              <Badge
                variant="outline"
                className="border-white/15 bg-black/45 text-white shadow-sm backdrop-blur"
              >
                <Star className="size-3.5 fill-gold text-gold" aria-hidden="true" />
                {offer.rating} · {offer.reviews} reseñas
              </Badge>
            </div>
          </div>

          <Card>
            <CardContent className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Precio por cupo
              </p>
              <div className="mt-2 flex flex-wrap items-end gap-x-4 gap-y-2">
                <span className="num font-display text-[38px] leading-none text-brand">
                  {bob(price)}
                </span>
                <span className="num text-[15px] text-muted-foreground line-through">
                  {bob(normal)}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[12px] font-semibold text-brand">
                  <PiggyBank className="size-3.5" aria-hidden="true" />
                  Ahorras {bob(saving)}
                </span>
              </div>
              <p className="mt-3 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
                La anualidad cuesta {bob(offer.annualBob)} y se divide en {offer.cupos.length} cupos.
                Pagando mes a mes, {offer.compareMonths} meses costarían {bob(normal)}.
              </p>
              <Separator className="my-4" />
              <MoneyRow
                label="Pagas ahora"
                hint="Por QR bancario, en bolivianos y sin comisión para ti"
                value={bob(price)}
                strong
              />
            </CardContent>
          </Card>

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
              <div className="mt-4 h-24 rounded-xl border border-dashed border-border bg-paper-deep/70 grain" />
              <p className="mt-1.5 text-[11px] text-muted-foreground">Ubicación de referencia del local.</p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-card p-4">
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <CalendarClock className="size-3.5" aria-hidden="true" />
                Horarios
              </p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink">{offer.hours}</p>
              <p className="mt-3 flex items-center gap-2 text-[12px] text-muted-foreground">
                <Clock className="size-3.5" aria-hidden="true" />
                Plazo para completar el grupo: {shortDate(offer.deadline)}
              </p>
            </div>
          </div>

          <div>
            <SectionTitle hint={`${free} ${free === 1 ? "cupo libre" : "cupos libres"}`}>
              Cupos de esta oferta
            </SectionTitle>
            <div className="space-y-2">
              {offer.cupos.map((cupo) => (
                <div
                  key={cupo.id}
                  className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/80 bg-card p-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium text-ink">{cupo.label}</p>
                    <p className="text-[11.5px] text-muted-foreground">
                      {cupoWhen(offer, cupo)} · {cupo.status === "disponible" ? "libre" : "ocupado"}
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
                      <Link to={cupo.status === "emitido" || cupo.status === "activado" ? `/pase/${cupo.id}` : `/comprobante/${cupo.id}`}>
                        {cupo.status === "emitido" || cupo.status === "activado" ? "Mi código" : "Mi pago"}
                      </Link>
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>
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
                      El reembolso vuelve a tu cuenta o QR de origen en 24 a 72 horas hábiles, en
                      bolivianos.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="legal">
                  <AccordionTrigger>Marco legal y regulatorio</AccordionTrigger>
                  <AccordionContent>
                    La custodia de fondos y la conversión de moneda están pendientes de validación con
                    asesoría legal en Bolivia.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <Card className="border-brand/25">
            <CardContent className="p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Cómo se usa tu cupo
              </p>
              <p className="mt-2 font-display text-[16px] leading-tight text-ink">{offer.cupoUnit}</p>
              <p className="mt-1.5 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
                {offer.usageNote}
              </p>
              <p className="mt-2 text-[11.5px] text-muted-foreground">{validityText(offer)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Progreso del grupo
              </p>
              <div className="mt-3">
                <CuposProgress offer={offer} />
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
            </CardContent>
          </Card>

          <Card className="glow">
            <CardContent className="p-4">
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <p className="num text-[12.5px] text-muted-foreground line-through">{bob(normal)}</p>
                  <p className="num font-display text-[26px] leading-none text-brand">{bob(price)}</p>
                </div>
                <Badge variant="soft">Ahorras {bob(saving)}</Badge>
              </div>

              <Button
                className="mt-4 w-full"
                disabled={free === 0}
                onClick={() => navigate(`/oferta/${offer.id}/reservar`)}
              >
                {free > 0 ? (
                  <>
                    Reservar cupo
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    <CalendarX className="size-4" aria-hidden="true" />
                    Sin cupos disponibles
                  </>
                )}
              </Button>

              <Dialog open={protectedOpen} onOpenChange={setProtectedOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="mt-2 w-full">
                    <Lock className="size-4" aria-hidden="true" />
                    Tu pago está protegido
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tu pago está protegido</DialogTitle>
                    <DialogDescription>
                      Así funciona hasta que se complete el grupo de {offer.business}.
                    </DialogDescription>
                  </DialogHeader>
                  <GuaranteeSteps />
                </DialogContent>
              </Dialog>

              <Button variant="ghost" className="mt-1 w-full" asChild>
                <Link to={`/garantia/${offer.id}`}>
                  <ShieldCheck className="size-4" aria-hidden="true" />
                  Ver garantía
                </Link>
              </Button>

              <p className="mt-3 text-[11.5px] leading-relaxed text-muted-foreground">
                Pagas en bolivianos por QR. Si el grupo no se completa antes del{" "}
                {shortDate(offer.deadline)}, te devolvemos el pago completo.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>

      <div className="sticky bottom-20 z-20 rounded-2xl border border-border/80 bg-card/95 p-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="num font-display text-[18px] leading-none">{bob(price)}</p>
            <p className="text-[11.5px] text-muted-foreground">
              {free > 0
                ? `${free} cupo${free === 1 ? "" : "s"} disponible${free === 1 ? "" : "s"}`
                : "Sin cupos disponibles"}
            </p>
          </div>
          {free > 0 ? (
            <Button asChild>
              <Link to={`/oferta/${offer.id}/reservar`}>Reservar cupo</Link>
            </Button>
          ) : (
            <Button disabled>Sin cupos</Button>
          )}
        </div>
      </div>
    </div>
  );
}
