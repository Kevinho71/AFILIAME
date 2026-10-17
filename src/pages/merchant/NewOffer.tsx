import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarRange,
  Check,
  Coins,
  Layers,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Chip, DemoNote, InfoNote, MoneyRow, PageHeader, SectionTitle } from "@/components/shared/pieces";
import { useAppStore, PLATFORM_FEE } from "@/store/useAppStore";
import { bob, usdc } from "@/lib/format";
import { cn } from "@/lib/utils";

const STEPS = [
  "Datos del servicio",
  "Precio y descuento",
  "División en cupos",
  "Reglas y liberación",
  "Revisión y publicación",
];

const CATEGORIES = ["gimnasio", "coworking", "club", "academia", "parqueo", "otros"] as const;

export function NewOffer() {
  const navigate = useNavigate();
  const rate = useAppStore((state) => state.rate);
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    service: "Anualidad de gimnasio",
    category: "gimnasio" as (typeof CATEGORIES)[number],
    city: "Tarija",
    address: "Av. Las Américas 235",
    hours: "Lun a Sáb · 06:00 a 22:00",
    description:
      "Acceso a sala de musculación, clases grupales y evaluación física durante tu periodo.",
    annual: "1800",
    monthly: "200",
    split: "periodo" as "periodo" | "franja" | "personalizada",
    cupos: "3",
    deadlineDays: "5",
    release: "completa" as "completa" | "escalonada",
    changes: "Se permite ceder el cupo con aprobación del negocio.",
    requirements: "Carnet de identidad vigente y verificación al momento de reservar.",
  });

  const update = <K extends keyof typeof data>(key: K, value: (typeof data)[K]) =>
    setData((current) => ({ ...current, [key]: value }));

  const numbers = useMemo(() => {
    const annual = Number(data.annual) || 0;
    const monthly = Number(data.monthly) || 0;
    const cupos = Math.max(1, Number(data.cupos) || 1);
    const pricePerCupo = Math.round((annual / cupos) * 100) / 100;
    const compare = monthly * 4;
    const saving = compare > pricePerCupo ? Math.round(((compare - pricePerCupo) / compare) * 100) : 0;
    const escrow = Math.round((annual / rate) * 100) / 100;
    const fee = Math.round(escrow * PLATFORM_FEE * 100) / 100;
    return { annual, monthly, cupos, pricePerCupo, compare, saving, escrow, fee, net: Math.round((escrow - fee) * 100) / 100 };
  }, [data.annual, data.monthly, data.cupos, rate]);

  const cupoLabels = useMemo(() => {
    const count = numbers.cupos;
    if (data.split === "franja") {
      const franjas = ["Mañana · 07:00 a 10:00", "Tarde · 15:00 a 18:00", "Noche · 19:00 a 22:00"];
      return Array.from({ length: count }, (_, index) => franjas[index % franjas.length]);
    }
    if (data.split === "periodo") {
      const periods = [
        "01 nov – 28 feb",
        "01 mar – 30 jun",
        "01 jul – 31 oct",
        "01 nov – 31 ene",
        "01 feb – 30 abr",
        "01 may – 31 jul",
      ];
      return Array.from({ length: count }, (_, index) => periods[index % periods.length]);
    }
    return Array.from({ length: count }, (_, index) => `Cupo personalizado ${index + 1}`);
  }, [numbers.cupos, data.split]);

  const canContinue =
    step === 0
      ? data.service.trim().length > 2 && data.address.trim().length > 3
      : step === 1
        ? numbers.annual > 0 && numbers.monthly > 0
        : step === 2
          ? numbers.cupos >= 2
          : true;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Crear oferta"
        subtitle="Cinco pasos para publicar tu anualidad dividida en cupos, con simulación del ingreso antes de publicar."
        back="/panel/ofertas"
        action={<Badge variant="soft">Asistente de 5 pasos</Badge>}
      />

      <ol className="scrollbar-thin flex gap-2 overflow-x-auto pb-1">
        {STEPS.map((label, index) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => index <= step && setStep(index)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
                index === step
                  ? "border-primary bg-primary text-primary-foreground"
                  : index < step
                    ? "cursor-pointer border-brand/30 bg-brand-soft text-brand-deep"
                    : "border-border bg-card text-muted-foreground",
              )}
            >
              <span className="num">{index + 1}</span>
              {label}
            </button>
          </li>
        ))}
      </ol>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardContent className="p-5">
            {step === 0 && (
              <div className="space-y-4">
                <SectionTitle>Datos del servicio</SectionTitle>
                <div className="space-y-2">
                  <Label htmlFor="service">Nombre del servicio</Label>
                  <Input
                    id="service"
                    value={data.service}
                    onChange={(event) => update("service", event.target.value)}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <select
                      id="category"
                      value={data.category}
                      onChange={(event) => update("category", event.target.value as typeof data.category)}
                      className="h-11 w-full rounded-xl border border-input bg-card px-3 text-[15px]"
                    >
                      {CATEGORIES.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input id="city" value={data.city} onChange={(event) => update("city", event.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={data.address}
                    onChange={(event) => update("address", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">Horarios de atención</Label>
                  <Input id="hours" value={data.hours} onChange={(event) => update("hours", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Qué incluye</Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(event) => update("description", event.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <SectionTitle>Precio anual y descuento</SectionTitle>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="annual">Precio de la anualidad (Bs)</Label>
                    <Input
                      id="annual"
                      inputMode="numeric"
                      value={data.annual}
                      onChange={(event) => update("annual", event.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthly">Tarifa mensual de referencia (Bs)</Label>
                    <Input
                      id="monthly"
                      inputMode="numeric"
                      value={data.monthly}
                      onChange={(event) => update("monthly", event.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/80 bg-paper-deep/50 p-3.5">
                    <p className="text-[11.5px] text-muted-foreground">Pagando mes a mes</p>
                    <p className="num mt-1 font-display text-[22px] text-muted-foreground/70 line-through">
                      {bob(numbers.compare)}
                    </p>
                    <p className="text-[11.5px] text-muted-foreground">
                      {bob(numbers.monthly)} × 4 meses
                    </p>
                  </div>
                  <div className="rounded-xl border border-brand/30 bg-brand-soft/60 p-3.5">
                    <p className="text-[11.5px] text-brand-deep">Tarifa anual dividida</p>
                    <p className="num mt-1 font-display text-[22px] text-brand-deep">
                      {bob(numbers.pricePerCupo)}
                    </p>
                    <p className="text-[11.5px] font-medium text-brand">
                      {numbers.saving}% de ahorro para el cliente
                    </p>
                  </div>
                </div>

                <InfoNote tone="info" icon={Sparkles}>
                  El cliente siempre ve su ahorro frente a la tarifa mensual. El descuento anual es lo
                  que hace atractiva la compra del cupo.
                </InfoNote>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <SectionTitle>División en cupos</SectionTitle>
                <RadioGroup value={data.split} onValueChange={(value) => update("split", value as typeof data.split)}>
                  {[
                    { value: "periodo", label: "Por periodo", body: "Cada persona cumple 4 meses del año (recomendado)." },
                    { value: "franja", label: "Por franja horaria", body: "Mañana, tarde o noche para llenar horas valle." },
                    { value: "personalizada", label: "Personalizada", body: "Tú defines el nombre de cada cupo." },
                  ].map((option) => (
                    <label
                      key={option.value}
                      htmlFor={`split-${option.value}`}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors",
                        data.split === option.value
                          ? "border-primary bg-brand-soft/50"
                          : "border-border/80 bg-card",
                      )}
                    >
                      <RadioGroupItem value={option.value} id={`split-${option.value}`} className="mt-0.5" />
                      <div>
                        <p className="text-[13.5px] font-medium text-ink">{option.label}</p>
                        <p className="text-[11.5px] text-muted-foreground">{option.body}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>

                <div className="space-y-2">
                  <Label htmlFor="cupos">Número de cupos</Label>
                  <Input
                    id="cupos"
                    inputMode="numeric"
                    value={data.cupos}
                    onChange={(event) => update("cupos", event.target.value.replace(/\D/g, "").slice(0, 2))}
                  />
                  <p className="text-[11.5px] text-muted-foreground">
                    Para periodos de 4 meses se recomiendan 3 cupos que cubren el año completo.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[13px] font-medium text-ink">Vista previa</p>
                  {cupoLabels.map((label, index) => (
                    <div
                      key={`${label}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-card px-3.5 py-3"
                    >
                      <span className="flex items-center gap-2 text-[12.5px] text-ink">
                        <Layers className="size-3.5 text-muted-foreground" aria-hidden="true" />
                        {label}
                      </span>
                      <span className="num text-[13px] font-semibold text-ink">
                        {bob(numbers.pricePerCupo)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <SectionTitle>Reglas y liberación</SectionTitle>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Plazo de llenado (días)</Label>
                  <select
                    id="deadline"
                    value={data.deadlineDays}
                    onChange={(event) => update("deadlineDays", event.target.value)}
                    className="h-11 w-full rounded-xl border border-input bg-card px-3 text-[15px]"
                  >
                    {["3", "5", "7", "10", "15"].map((item) => (
                      <option key={item} value={item}>
                        {item} días
                      </option>
                    ))}
                  </select>
                  <p className="text-[11.5px] text-muted-foreground">
                    El plazo debe estar entre 3 y 15 días. Sin cupos completos al vencer, se devuelve
                    todo sin cargo.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[13px] font-medium text-ink">Tipo de liberación</p>
                  <RadioGroup
                    value={data.release}
                    onValueChange={(value) => update("release", value as typeof data.release)}
                  >
                    <label
                      htmlFor="rel-completa"
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5",
                        data.release === "completa" ? "border-primary bg-brand-soft/50" : "border-border/80 bg-card",
                      )}
                    >
                      <RadioGroupItem value="completa" id="rel-completa" className="mt-0.5" />
                      <div>
                        <p className="text-[13.5px] font-medium text-ink">Liberación completa</p>
                        <p className="text-[11.5px] text-muted-foreground">
                          Todo al negocio cuando el grupo se completa. Es la opción por defecto.
                        </p>
                      </div>
                    </label>
                    <label
                      htmlFor="rel-escalonada"
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5",
                        data.release === "escalonada" ? "border-primary bg-brand-soft/50" : "border-border/80 bg-card",
                      )}
                    >
                      <RadioGroupItem value="escalonada" id="rel-escalonada" className="mt-0.5" />
                      <div>
                        <p className="flex items-center gap-2 text-[13.5px] font-medium text-ink">
                          Liberación escalonada
                          <Badge variant="gold">
                            <ShieldCheck className="size-3.5" aria-hidden="true" />
                            Sello Pago Protegido
                          </Badge>
                        </p>
                        <p className="text-[11.5px] text-muted-foreground">
                          Cada cupo se libera al iniciar su periodo. Protege más al cliente y aparece
                          filtrable en el feed.
                        </p>
                      </div>
                    </label>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="changes">Política de cambios</Label>
                  <Textarea
                    id="changes"
                    value={data.changes}
                    onChange={(event) => update("changes", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requirements">Requisitos de uso</Label>
                  <Textarea
                    id="requirements"
                    value={data.requirements}
                    onChange={(event) => update("requirements", event.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <SectionTitle>Revisión</SectionTitle>
                <div className="grid gap-2 text-[12.5px]">
                  <div className="flex justify-between gap-3 rounded-xl border border-border/80 px-3.5 py-2.5">
                    <span className="text-muted-foreground">Servicio</span>
                    <span className="font-medium text-ink">{data.service}</span>
                  </div>
                  <div className="flex justify-between gap-3 rounded-xl border border-border/80 px-3.5 py-2.5">
                    <span className="text-muted-foreground">Categoría y ciudad</span>
                    <span className="font-medium text-ink">
                      {data.category} · {data.city}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3 rounded-xl border border-border/80 px-3.5 py-2.5">
                    <span className="text-muted-foreground">Anualidad y cupos</span>
                    <span className="font-medium text-ink">
                      {bob(numbers.annual)} en {numbers.cupos} cupos de {bob(numbers.pricePerCupo)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3 rounded-xl border border-border/80 px-3.5 py-2.5">
                    <span className="text-muted-foreground">Plazo y liberación</span>
                    <span className="font-medium text-ink">
                      {data.deadlineDays} días · {data.release === "completa" ? "completa" : "escalonada"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3 rounded-xl border border-border/80 px-3.5 py-2.5">
                    <span className="text-muted-foreground">División</span>
                    <span className="font-medium text-ink">
                      {data.split === "periodo" ? "por periodo" : data.split === "franja" ? "por franja" : "personalizada"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {cupoLabels.map((label, index) => (
                    <Chip key={`${label}-chip-${index}`} tone="brand">
                      <Check className="size-3" aria-hidden="true" />
                      {label}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center gap-2">
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep((value) => value - 1)}>
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Atrás
                </Button>
              )}
              {step < STEPS.length - 1 ? (
                <Button
                  className="ml-auto"
                  disabled={!canContinue}
                  onClick={() => setStep((value) => value + 1)}
                >
                  Continuar
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              ) : (
                <Button
                  className="ml-auto"
                  onClick={() => {
                    toast.success("Oferta publicada", {
                      description: `${data.service} ya aparece en el feed con ${numbers.cupos} cupos.`,
                    });
                    navigate("/panel/ofertas");
                  }}
                >
                  <Rocket className="size-4" aria-hidden="true" />
                  Publicar oferta
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Card>
            <CardContent className="p-4">
              <SectionTitle hint="Antes de publicar">Simulación de ingreso</SectionTitle>
              <MoneyRow label="Anualidad cobrada" value={bob(numbers.annual)} />
              <MoneyRow
                label="Cupos y precio"
                hint={`${numbers.cupos} cupos de ${bob(numbers.pricePerCupo)}`}
                value={bob(numbers.annual)}
              />
              <Separator className="my-2" />
              <MoneyRow label="Entra a la garantía" hint={`Bs ${rate} por USDC`} value={usdc(numbers.escrow)} />
              <MoneyRow
                label={`Comisión de plataforma (${Math.round(PLATFORM_FEE * 100)}%)`}
                value={`− ${usdc(numbers.fee)}`}
              />
              <MoneyRow label="Recibes al liberar" value={usdc(numbers.net)} strong />
              <MoneyRow
                label="Equivalente en bolivianos"
                hint="Convertido a la tasa ilustrativa"
                value={bob(numbers.net * rate)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
                <Users className="size-4 text-brand/70" aria-hidden="true" />
                Cuánto tarda en llenarse
              </p>
              <p className="mt-1.5 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
                Con un plazo de {data.deadlineDays} días y {numbers.cupos} cupos, tus clientes verán
                recordatorios 48 y 24 horas antes del cierre. Si el grupo se completa antes, la
                garantía se libera el mismo día.
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                <CalendarRange className="size-3.5" aria-hidden="true" />
                Los periodos se generan automáticamente según la división elegida.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gold/25 bg-gold-soft/40">
            <CardContent className="p-4">
              <p className="flex items-center gap-2 text-[13px] font-semibold text-warn">
                <Coins className="size-4" aria-hidden="true" />
                Recuerda
              </p>
              <ul className="mt-1.5 space-y-1 text-[12px] leading-relaxed text-gold/90">
                <li>• Los fondos en garantía no se usan para otro fin ni generan rendimiento.</li>
                <li>• La comisión se descuenta recién en la liberación.</li>
                <li>• El precio por cupo se calcula como la anualidad dividida entre los cupos.</li>
              </ul>
            </CardContent>
          </Card>

          <DemoNote>
            Revisa el resumen antes de publicar: después podrás pausar, duplicar o cerrar la oferta cuando quieras.
          </DemoNote>

          <Button variant="ghost" asChild className="w-full">
            <Link to="/panel/ofertas">Ver mis ofertas actuales</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
