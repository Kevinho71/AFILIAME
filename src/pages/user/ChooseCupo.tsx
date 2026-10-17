import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Compass,
  Info,
  Sparkles,
  TrendingDown,
  UserRound,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { EmptyState, InfoNote, MoneyRow, PageHeader, SectionTitle } from "@/components/shared/pieces";
import { GuaranteeSteps } from "@/components/shared/GuaranteeSteps";
import { useAppStore } from "@/store/useAppStore";
import { USER } from "@/lib/data";
import { bob, shortDate, usdc } from "@/lib/format";
import { compareBob, offerById, savingsPct } from "@/lib/selectors";
import { cn } from "@/lib/utils";

export function ChooseCupo() {
  const { offerId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const offers = useAppStore((state) => state.offers);
  const rate = useAppStore((state) => state.rate);
  const setActiveOffer = useAppStore((state) => state.setActiveOffer);

  const offer = offerById(offers, offerId);
  const availableCupos = useMemo(
    () => offer?.cupos.filter((cupo) => cupo.status === "disponible") ?? [],
    [offer],
  );

  const [selected, setSelected] = useState(searchParams.get("cupo") ?? availableCupos[0]?.id ?? "");
  const [who, setWho] = useState<"me" | "other">("me");
  const [otherName, setOtherName] = useState("");

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
  const escrow = Math.round((price / rate) * 100) / 100;
  const saving = savingsPct(offer);
  const compare = compareBob(offer);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Elige tu cupo"
        subtitle={`${offer.business} · ${offer.title}`}
        back={`/oferta/${offer.id}`}
      />

      <div>
        <SectionTitle hint="Cada persona ocupa un cupo">Cupos disponibles</SectionTitle>
        <RadioGroup value={cupo.id} onValueChange={setSelected}>
          {availableCupos.map((item) => {
            const active = item.id === cupo.id;
            return (
              <label
                key={item.id}
                htmlFor={item.id}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors",
                  active ? "border-primary bg-brand-soft/50" : "border-border/80 bg-card hover:bg-secondary/40",
                )}
              >
                <RadioGroupItem value={item.id} id={item.id} className="mt-1" />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-ink">{item.label}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                    <CalendarDays className="size-3.5" aria-hidden="true" />
                    {shortDate(item.start)} al {shortDate(item.end)}
                  </p>
                </div>
                <span className="num shrink-0 text-[15px] font-semibold text-ink">
                  {bob(item.priceBob)}
                </span>
              </label>
            );
          })}
        </RadioGroup>
      </div>

      <Card>
        <CardContent className="p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Compara antes de decidir
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border/80 bg-paper-deep/60 p-3.5">
              <p className="text-[11.5px] text-muted-foreground">Pagando mes a mes</p>
              <p className="num mt-1.5 font-display text-[22px] text-muted-foreground/80 line-through">
                {bob(compare)}
              </p>
              <p className="mt-1 text-[11.5px] leading-snug text-muted-foreground">
                {offer.monthlyBob
                  ? `Bs ${offer.monthlyBob} × ${offer.compareMonths}`
                  : "Tarifa mensual"}
              </p>
            </div>
            <div className="rounded-xl border border-brand/30 bg-brand-soft/60 p-3.5">
              <p className="text-[11.5px] text-brand-deep">Con un cupo</p>
              <p className="num mt-1.5 font-display text-[22px] text-brand-deep">{bob(price)}</p>
              {saving > 0 && (
                <p className="mt-1 inline-flex items-center gap-1 text-[11.5px] font-medium text-brand">
                  <TrendingDown className="size-3.5" aria-hidden="true" />
                  {saving}% menos
                </p>
              )}
            </div>
          </div>
          <Separator className="my-3" />
          <MoneyRow label="Cupo seleccionado" hint={`${cupo.label}`} value={bob(price)} />
          <MoneyRow
            label="Entra a la garantía"
            hint={`Tasa de referencia: Bs ${rate} por USDC`}
            value={usdc(escrow)}
          />
          <MoneyRow label="Comisión para ti" value="Bs 0" tone="success" />
        </CardContent>
      </Card>

      <div>
        <SectionTitle>¿Para quién es el cupo?</SectionTitle>
        <RadioGroup value={who} onValueChange={(value) => setWho(value as "me" | "other")}>
          <label
            htmlFor="who-me"
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors",
              who === "me" ? "border-primary bg-brand-soft/50" : "border-border/80 bg-card",
            )}
          >
            <RadioGroupItem value="me" id="who-me" className="mt-0.5" />
            <div>
              <p className="text-[14px] font-medium text-ink">{USER.name} (tú)</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                Identidad verificada · el pase queda a tu nombre
              </p>
            </div>
          </label>
          <label
            htmlFor="who-other"
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors",
              who === "other" ? "border-primary bg-brand-soft/50" : "border-border/80 bg-card",
            )}
          >
            <RadioGroupItem value="other" id="who-other" className="mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium text-ink">Para otra persona</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                Puede pagar alguien desde el exterior en dólares digitales
              </p>
              {who === "other" && (
                <div className="mt-3 space-y-2">
                  <Label htmlFor="beneficiary">Nombre del beneficiario</Label>
                  <Input
                    id="beneficiary"
                    placeholder="Ej. Javier Fernández"
                    value={otherName}
                    onChange={(event) => setOtherName(event.target.value)}
                  />
                </div>
              )}
            </div>
          </label>
        </RadioGroup>
        <InfoNote className="mt-3" tone="neutral" icon={Info}>
          El cupo es nominal: queda a nombre del beneficiario y no se transfiere sin aprobación del
          negocio.
        </InfoNote>
      </div>

      <div>
        <SectionTitle>Qué pasa después de pagar</SectionTitle>
        <GuaranteeSteps />
      </div>

      <div className="sticky bottom-20 z-20 rounded-2xl border border-border/80 bg-card/95 p-3 backdrop-blur md:bottom-2">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="num font-display text-[18px] leading-none">{bob(price)}</p>
            <p className="truncate text-[11.5px] text-muted-foreground">
              {cupo.label}
              {who === "other" && otherName ? ` · para ${otherName}` : ""}
            </p>
          </div>
          <Button
            onClick={() =>
              navigate(
                `/pago/${cupo.id}${who === "other" ? "?pager=external" : ""}`,
              )
            }
          >
            Pagar por QR
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
          <Sparkles className="size-3.5 text-brand/70" aria-hidden="true" />
          Pagas en bolivianos, sin comisión para ti.
        </p>
      </div>

      <div className="flex items-center gap-2 text-[11.5px] text-muted-foreground">
        <BadgeCheck className="size-3.5 text-brand/70" aria-hidden="true" />
        Verificación de identidad completada · <UserRound className="size-3.5" aria-hidden="true" />
        Reserva nominal
        <Badge variant="outline" className="ml-auto">
          {offer.cupos.length} cupos en total
        </Badge>
      </div>
    </div>
  );
}
