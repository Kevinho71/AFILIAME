import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  Compass,
  PiggyBank,
  ShieldCheck,
  TrendingDown,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EmptyState, MoneyRow, PageHeader, SectionTitle } from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { USER } from "@/lib/data";
import { bob, shortDate } from "@/lib/format";
import { compareBob, offerById } from "@/lib/selectors";
import { savingsBob } from "@/lib/pricing";
import { cupoWhen } from "@/lib/usage";
import { cn } from "@/lib/utils";

export function ChooseCupo() {
  const { offerId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const offers = useAppStore((state) => state.offers);
  const setActiveOffer = useAppStore((state) => state.setActiveOffer);

  const offer = offerById(offers, offerId);
  const availableCupos = useMemo(
    () => offer?.cupos.filter((cupo) => cupo.status === "disponible") ?? [],
    [offer],
  );

  const [selected, setSelected] = useState(searchParams.get("cupo") ?? availableCupos[0]?.id ?? "");

  useEffect(() => {
    if (offerId) setActiveOffer(offerId);
  }, [offerId, setActiveOffer]);

  if (!offer) {
    return (
      <EmptyState
        icon={Compass}
        title="No encontramos esta oferta"
        description="Vuelve al feed y elige otra oferta."
        action={
          <Button asChild>
            <Link to="/explorar">Volver a Explorar</Link>
          </Button>
        }
      />
    );
  }

  if (availableCupos.length === 0) {
    return (
      <div className="space-y-4">
        <PageHeader title="Sin cupos disponibles" back={`/oferta/${offer.id}`} />
        <EmptyState
          icon={Users}
          title={`${offer.business} ya completó sus cupos`}
          description="Esta oferta no tiene cupos libres por ahora. Mira otras ofertas similares o vuelve cuando el negocio publique un nuevo ciclo."
          action={
            <Button asChild>
              <Link to="/explorar">Ver otras ofertas</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const cupo = offer.cupos.find((item) => item.id === selected) ?? availableCupos[0];
  const price = cupo.priceBob;
  const normal = compareBob(offer);
  const saving = savingsBob(offer);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Elige tu cupo"
        subtitle={`${offer.business} · ${offer.title}`}
        back={`/oferta/${offer.id}`}
      />

      <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr] lg:items-start">
        <div className="space-y-4">
          <SectionTitle hint="Cada persona ocupa un cupo">Cupos libres</SectionTitle>
          <p className="rounded-xl border border-border/70 bg-card px-3.5 py-3 text-[12.5px] leading-relaxed text-muted-foreground">
            <span className="font-medium text-ink">{offer.cupoUnit}. </span>
            {offer.usageNote}
          </p>
          <RadioGroup value={cupo.id} onValueChange={setSelected}>
            {availableCupos.map((item) => {
              const active = item.id === cupo.id;
              return (
                <label
                  key={item.id}
                  htmlFor={item.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors",
                    active
                      ? "border-brand/40 bg-brand-soft/50"
                      : "border-border/80 bg-card hover:bg-secondary/40",
                  )}
                >
                  <RadioGroupItem value={item.id} id={item.id} className="mt-1" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-ink">{item.label}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                      <CalendarDays className="size-3.5" aria-hidden="true" />
                      {cupoWhen(offer, item)}
                    </p>
                  </div>
                  <span className="num shrink-0 text-[15px] font-semibold text-ink">
                    {bob(item.priceBob)}
                  </span>
                </label>
              );
            })}
          </RadioGroup>

          <Card>
            <CardContent className="p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Compara antes de decidir
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border/80 bg-paper-deep/60 p-4">
                  <p className="text-[12px] text-muted-foreground">Pagando mes a mes</p>
                  <p className="num mt-2 font-display text-[24px] text-muted-foreground/80 line-through">
                    {bob(normal)}
                  </p>
                  <p className="mt-1 text-[11.5px] leading-snug text-muted-foreground">
                    Bs {offer.monthlyBob} × {offer.compareMonths} meses
                  </p>
                </div>
                <div className="rounded-xl border border-brand/30 bg-brand-soft/60 p-4">
                  <p className="text-[12px] text-brand">Con tu cupo</p>
                  <p className="num mt-2 font-display text-[24px] text-brand">{bob(price)}</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-brand">
                    <TrendingDown className="size-3.5" aria-hidden="true" />
                    Ahorras {bob(saving)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Accordion type="single" collapsible className="rounded-2xl border border-border/80 bg-card px-4">
            <AccordionItem value="despues">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-brand" aria-hidden="true" />
                  Qué pasa después de pagar
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ol className="space-y-2">
                  {[
                    "Tu pago queda protegido y no llega al negocio todavía.",
                    `Si el grupo se completa antes del ${shortDate(offer.deadline)}, el negocio cobra el año completo y tu código de activación queda listo.`,
                    "Si no se completa, te devolvemos el pago completo en 24 a 72 horas hábiles, sin comisión.",
                  ].map((item, index) => (
                    <li key={item} className="flex gap-3">
                      <span className="num flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[11px] font-semibold text-brand">
                        {index + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <aside className="lg:sticky lg:top-24">
          <Card className="glow">
            <CardContent className="p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Tu reserva
              </p>
              <p className="mt-2 font-display text-[18px] leading-tight">{cupo.label}</p>

              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="num text-[13px] text-muted-foreground line-through">{bob(normal)}</p>
                <p className="num font-display text-[28px] leading-none text-brand">{bob(price)}</p>
              </div>
              <Badge variant="soft" className="mt-2">
                <PiggyBank className="size-3.5" aria-hidden="true" />
                Ahorras {bob(saving)}
              </Badge>

              <Separator className="my-4" />
              <MoneyRow label="Cupo seleccionado" value={bob(price)} />
              <MoneyRow label="Comisión para ti" value="Bs 0" tone="success" />
              <MoneyRow label="Total a pagar" value={bob(price)} strong />

              <Button className="mt-4 w-full" onClick={() => navigate(`/pago/${cupo.id}`)}>
                Pagar por QR
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>

              <p className="mt-3 flex items-start gap-1.5 text-[11.5px] leading-relaxed text-muted-foreground">
                <BadgeCheck className="mt-0.5 size-3.5 shrink-0 text-brand" aria-hidden="true" />
                El cupo queda a nombre de {USER.name}, con identidad verificada.
              </p>
            </CardContent>
          </Card>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-[11.5px] text-muted-foreground">
            <ChevronDown className="size-3.5" aria-hidden="true" />
            Puedes cancelar sin cargo mientras el grupo no se complete.
          </p>
        </aside>
      </div>
    </div>
  );
}
