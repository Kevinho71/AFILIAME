import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  Coins,
  HandCoins,
  Lock,
  QrCode,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoginDialog, type LoginMode } from "@/components/auth/LoginDialog";
import { BusinessMark } from "@/components/shared/BusinessMark";
import { CuposProgress } from "@/components/shared/CuposProgress";
import { OfferStatusPill } from "@/components/shared/status";
import { useAppStore } from "@/store/useAppStore";
import { bob } from "@/lib/format";
import { offerById } from "@/lib/selectors";

const MONTHLY = 200;
const ANNUAL = 1800;
const CUPO = 600;
const SHARED_MONTHS = 4;

const STEPS = [
  {
    icon: Sparkles,
    title: "Elige tu cupo",
    body: "Filtra por ciudad, precio y periodo. Cada cupo tiene su propio intervalo: 4 meses, una temporada o una franja horaria.",
  },
  {
    icon: QrCode,
    title: "Paga por QR en bolivianos",
    body: "Escaneas, pagas y listo: sin tarjetas, sin claves y sin comisiones para ti. El precio queda fijo en bolivianos.",
  },
  {
    icon: ShieldCheck,
    title: "Se completa el grupo",
    body: "Tu pago espera en garantía. Si los cupos se llenan antes del plazo, el negocio cobra el año completo por adelantado.",
  },
  {
    icon: CalendarCheck,
    title: "Usa tu pase digital",
    body: "Recibes tu pase con QR para entrar. Si el grupo no se completa, el reembolso vuelve solo a tu cuenta de origen.",
  },
];

export function Welcome() {
  const [searchParams] = useSearchParams();
  const offers = useAppStore((state) => state.offers);
  const role = useAppStore((state) => state.role);
  const setRole = useAppStore((state) => state.setRole);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<LoginMode>("user");

  useEffect(() => {
    if (searchParams.get("login") === "1") {
      setLoginMode(role === "merchant" ? "merchant" : "user");
      setLoginOpen(true);
    }
  }, [searchParams, role]);

  const openLogin = (mode: LoginMode) => {
    setLoginMode(mode);
    setLoginOpen(true);
  };

  const showcase = offerById(offers, "powerfit");
  const savings = Math.round(((MONTHLY * 12 - ANNUAL) / (MONTHLY * 12)) * 100);
  const cupoSavings = MONTHLY * SHARED_MONTHS - CUPO;

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] items-center gap-4 px-4 py-3 sm:px-6">
          <span className="font-display text-[19px] font-bold tracking-[0.16em] text-ink">
            AFÍLIAME
          </span>
          <nav className="ml-4 hidden items-center gap-6 text-[13px] text-muted-foreground md:flex">
            <a href="#precio" className="transition-colors hover:text-ink">
              Anualidad vs. mensualidades
            </a>
            <a href="#como-funciona" className="transition-colors hover:text-ink">
              Cómo funciona
            </a>
            <a href="#audiencias" className="transition-colors hover:text-ink">
              Clientes y negocios
            </a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => openLogin("user")}>
              Ingresar
            </Button>
            <Button size="sm" onClick={() => openLogin("user")}>
              Registrarme
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="grid-lines absolute inset-0 opacity-60" aria-hidden="true" />
          <div
            className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(closest-side, rgba(52,227,155,0.35), transparent)" }}
            aria-hidden="true"
          />
          <div className="relative mx-auto grid max-w-[1180px] gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <Badge variant="soft" className="mb-6">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Anualidades compartidas · pago por QR en bolivianos
              </Badge>

              <p className="font-display text-[clamp(2.9rem,10vw,6.4rem)] font-bold leading-[0.9] tracking-[-0.03em] text-gradient">
                AFÍLIAME
              </p>

              <h1 className="mt-4 text-balance font-display text-[clamp(1.7rem,4.4vw,3rem)] leading-[1.05] text-ink">
                Comparte el año.
                <br />
                Paga tu parte.
              </h1>

              <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
                Gimnasios, coworkings, clubes y academias publican su anualidad dividida en cupos. Tú
                te afilias al periodo que necesitas y pagas <span className="text-ink">solo esos meses</span>,
                pero al precio de anualidad. Sin tarjetas, sin claves, sin letras chiquitas.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button size="xl" onClick={() => openLogin("user")}>
                  Registrarme gratis
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
                <Button size="xl" variant="outline" asChild>
                  <a href="#como-funciona">Ver cómo funciona</a>
                </Button>
              </div>

              <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2.5 text-[12.5px] text-muted-foreground">
                {[
                  { icon: QrCode, label: "Pagas por QR en bolivianos" },
                  { icon: Lock, label: "Tu dinero queda en garantía" },
                  { icon: HandCoins, label: "Reembolso automático" },
                  { icon: Users, label: "Comparte el cupo con quienes necesiten el resto del año" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label} className="flex items-center gap-2">
                      <Icon className="size-3.5 text-brand" aria-hidden="true" />
                      {item.label}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="relative">
              {showcase && (
                <Card className="glow relative overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <BusinessMark theme={showcase.theme} name={showcase.business} size="sm" className="size-11" />
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-semibold text-ink">{showcase.business}</p>
                        <p className="truncate text-[12px] text-muted-foreground">{showcase.title}</p>
                      </div>
                      <OfferStatusPill status={showcase.status} className="ml-auto" />
                    </div>

                    <div className="mt-4">
                      <CuposProgress offer={showcase} tone="brand" />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-brand/30 bg-brand-soft/60 p-3.5">
                        <p className="text-[11px] text-brand">Tu cupo · 4 meses</p>
                        <p className="num mt-1 font-display text-[24px] leading-none text-ink">
                          {bob(CUPO)}
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          en vez de {bob(MONTHLY * SHARED_MONTHS)} pagando mensual
                        </p>
                      </div>
                      <div className="rounded-xl border border-border/80 bg-secondary/60 p-3.5">
                        <p className="text-[11px] text-muted-foreground">Anualidad completa</p>
                        <p className="num mt-1 font-display text-[24px] leading-none text-muted-foreground/80">
                          {bob(ANNUAL)}
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          la cubren 3 personas en total
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 rounded-xl border border-border/70 bg-paper-deep/50 px-3.5 py-3">
                      <ShieldCheck className="size-4 shrink-0 text-brand" aria-hidden="true" />
                      <p className="text-[11.5px] leading-relaxed text-muted-foreground">
                        Tu pago queda protegido hasta que el grupo se complete. Si no se llena, se
                        devuelve completo.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-gold/30 bg-card px-4 py-3 shadow-[0_18px_36px_-22px_rgba(0,0,0,0.7)] sm:block">
                <p className="text-[11px] text-muted-foreground">Ahorro por cupo</p>
                <p className="num font-display text-[18px] leading-none text-gold">
                  {bob(cupoSavings)} menos
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARATIVA */}
        <section id="precio" className="border-b border-border/60 bg-paper-deep">
          <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 sm:py-20">
            <div className="max-w-2xl">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-brand">
                Anualidad vs. 12 mensualidades
              </p>
              <h2 className="mt-3 text-balance font-display text-[clamp(1.6rem,3.6vw,2.4rem)] leading-tight">
                La anualidad siempre fue más barata. El problema era pagarla completa.
              </h2>
              <p className="mt-3 text-pretty text-[14.5px] leading-relaxed text-muted-foreground">
                Ejemplo de un gimnasio: pagar mes a mes cuesta {bob(MONTHLY)} cada mes. La anualidad
                cuesta {bob(ANNUAL)}. Con Afíliame la divides en cupos y pagas solo el tuyo.
              </p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <Card className="border-border/70">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display text-[18px]">Pagando 12 mensualidades</p>
                    <Badge variant="muted">Más caro</Badge>
                  </div>
                  <p className="num mt-4 font-display text-[38px] leading-none text-muted-foreground/70">
                    {bob(MONTHLY * 12)}
                  </p>
                  <p className="mt-1 text-[12.5px] text-muted-foreground">
                    {bob(MONTHLY)} × 12 meses, mes a mes, todo el año
                  </p>
                  <div className="mt-4 flex items-end gap-1" aria-hidden="true">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <span
                        key={index}
                        className="h-10 flex-1 rounded-sm border border-border/60 bg-secondary"
                      />
                    ))}
                  </div>
                  <ul className="mt-4 space-y-2 text-[12.5px] text-muted-foreground">
                    <li className="flex gap-2">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-danger" aria-hidden="true" />
                      Compromiso de 12 meses para conseguir el mejor precio
                    </li>
                    <li className="flex gap-2">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-danger" aria-hidden="true" />
                      Pagas los meses que quizá no uses
                    </li>
                    <li className="flex gap-2">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-danger" aria-hidden="true" />
                      Mensualidad más cara que la tarifa anual
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="glow border-brand/35">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display text-[18px]">Con Afíliame</p>
                    <Badge variant="success">Recomendado</Badge>
                  </div>
                  <p className="num mt-4 font-display text-[38px] leading-none text-ink">
                    {bob(ANNUAL)}
                  </p>
                  <p className="mt-1 text-[12.5px] text-muted-foreground">
                    Año completo al precio de anualidad · {savings}% menos que pagar mensual
                  </p>
                  <div className="mt-4 flex items-end gap-1" aria-hidden="true">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <span
                        key={index}
                        className="h-10 flex-1 rounded-sm border border-brand/25 bg-brand-soft"
                        style={{ opacity: index < 4 ? 1 : 0.35 }}
                      />
                    ))}
                  </div>
                  <div className="mt-4 rounded-xl border border-brand/30 bg-brand-soft/50 p-3.5">
                    <p className="text-[11.5px] text-brand">Tú pagas solo tu cupo</p>
                    <p className="num mt-1 font-display text-[26px] leading-none text-ink">
                      {bob(CUPO)}
                    </p>
                    <p className="mt-1 text-[11.5px] text-muted-foreground">
                      {SHARED_MONTHS} meses · {bob(cupoSavings)} menos que pagarlos sueltos
                    </p>
                  </div>
                  <ul className="mt-4 space-y-2 text-[12.5px] text-muted-foreground">
                    <li className="flex gap-2">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-brand" aria-hidden="true" />
                      El resto del año lo cubren otras personas
                    </li>
                    <li className="flex gap-2">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-brand" aria-hidden="true" />
                      El negocio cobra la anualidad completa por adelantado
                    </li>
                    <li className="flex gap-2">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-brand" aria-hidden="true" />
                      Pago por QR, en bolivianos y sin comisión para ti
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* HOOK */}
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="grid-lines absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="relative mx-auto max-w-[900px] px-4 py-16 text-center sm:px-6 sm:py-20">
            <h2 className="text-balance font-display text-[clamp(1.8rem,4.6vw,3.1rem)] leading-[1.1]">
              ¿Te imaginas pagar tus meses,{" "}
              <span className="text-gradient">pero al precio de anualidad?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
              Eso es exactamente Afíliame. Te afilias al cupo que necesitas, pagas tu parte y dejas
              que otras personas completen el año. El negocio cobra por adelantado, tú dejas de pagar
              de más y nadie tiene que confiar en la palabra del otro.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button size="xl" onClick={() => openLogin("user")}>
                Quiero mi cupo
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
              <Button size="xl" variant="outline" onClick={() => openLogin("merchant")}>
                <Store className="size-4" aria-hidden="true" />
                Tengo un negocio
              </Button>
            </div>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section id="como-funciona" className="border-b border-border/60 bg-paper-deep">
          <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 sm:py-20">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-brand">
              Paso a paso
            </p>
            <h2 className="mt-3 text-balance font-display text-[clamp(1.6rem,3.6vw,2.4rem)] leading-tight">
              Cuatro pasos entre tu precio y tu pase
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="relative rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-brand/35"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="num font-mono text-[12px] text-muted-foreground">
                        0{index + 1}
                      </span>
                    </div>
                    <p className="mt-4 font-display text-[16px] text-ink">{step.title}</p>
                    <p className="mt-2 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* AUDIENCIAS */}
        <section id="audiencias" className="border-b border-border/60">
          <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 sm:py-20">
            <h2 className="text-balance font-display text-[clamp(1.6rem,3.6vw,2.4rem)] leading-tight">
              Dos formas de ganar con el mismo cupo
            </h2>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <Card className="border-border/80">
                <CardContent className="p-6">
                  <Badge variant="soft" className="mb-4">
                    <Users className="size-3.5" aria-hidden="true" />
                    Si eres cliente
                  </Badge>
                  <p className="font-display text-[20px] leading-tight">
                    Paga los meses que vas a usar, con tarifa anual
                  </p>
                  <ul className="mt-4 space-y-2.5 text-[13px] leading-relaxed text-muted-foreground">
                    {[
                      "Precio de anualidad con compromiso corto: 4 meses, una temporada o una franja horaria.",
                      "Pagas por QR en bolivianos, sin tarjetas ni comisiones extra para ti.",
                      "Tu dinero queda en garantía: si el grupo no se completa, se devuelve automáticamente.",
                      "Pase digital con QR para entrar, con tus fechas, reglas y ubicación.",
                      "Puedes ceder tu cupo con aprobación del negocio si ya no lo usarás.",
                    ].map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-5 w-full" onClick={() => openLogin("user")}>
                    Crear mi cuenta gratis
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-brand/35">
                <CardContent className="p-6">
                  <Badge variant="success" className="mb-4">
                    <Store className="size-3.5" aria-hidden="true" />
                    Si tienes un negocio
                  </Badge>
                  <p className="font-display text-[20px] leading-tight">
                    Cobra la anualidad completa sin esperar 12 meses
                  </p>
                  <ul className="mt-4 space-y-2.5 text-[13px] leading-relaxed text-muted-foreground">
                    {[
                      "Ingreso adelantado: cuando el grupo se completa, cobras el año completo de una vez.",
                      "Más clientes: atrae a quien nunca compraría una anualidad completa.",
                      "Llenas capacidad ociosa con cupos por franja horaria a menor precio.",
                      "Tu saldo queda en dólares digitales: mantener, retirar a tu banco o pagar un QR.",
                      "Panel con llenado, clientes nuevos e ingresos anticipados, más validación de accesos.",
                    ].map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-5 w-full" variant="outline" onClick={() => openLogin("merchant")}>
                    Registrar mi negocio
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CONFIANZA */}
        <section className="border-b border-border/60 bg-paper-deep">
          <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 sm:py-20">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: ShieldCheck,
                  title: "Dinero en garantía",
                  body: "Tu pago no llega al negocio hasta que el grupo se completa. Nadie puede disponer de él antes.",
                },
                {
                  icon: HandCoins,
                  title: "Reembolso automático",
                  body: "Si el plazo vence sin completar el grupo, cada pago vuelve a su cuenta de origen en 24 a 72 horas.",
                },
                {
                  icon: ScanLine,
                  title: "Verificable",
                  body: "La garantía es pública y comprobable. No dependes de una captura de pantalla ni de una promesa.",
                },
                {
                  icon: Wallet,
                  title: "Dólares digitales para el negocio",
                  body: "El negocio elige cómo terminar: mantener su saldo, retirarlo a bolivianos o pagar con un QR.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-border/80 bg-card p-5">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <p className="mt-4 font-display text-[16px] text-ink">{item.title}</p>
                    <p className="mt-2 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CIERRE */}
        <section className="relative overflow-hidden">
          <div className="grid-lines absolute inset-0 opacity-40" aria-hidden="true" />
          <div
            className="absolute -bottom-48 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(closest-side, rgba(52,227,155,0.3), transparent)" }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-[900px] px-4 py-16 text-center sm:px-6 sm:py-20">
            <h2 className="text-balance font-display text-[clamp(1.8rem,4.4vw,2.9rem)] leading-[1.1]">
              Empieza con un cupo. Termina usando el año entero.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-[14.5px] leading-relaxed text-muted-foreground">
              Crea tu cuenta, elige tu cupo y paga tu parte. Si eres negocio, publica tu anualidad en
              cupos y cobra por adelantado.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button size="xl" onClick={() => openLogin("user")}>
                <BadgeCheck className="size-4" aria-hidden="true" />
                Registrarme
              </Button>
              <Button size="xl" variant="outline" onClick={() => openLogin("merchant")}>
                <Coins className="size-4" aria-hidden="true" />
                Quiero vender cupos
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70 bg-paper-deep">
        <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="font-display text-[17px] font-bold tracking-[0.16em] text-ink">AFÍLIAME</p>
              <p className="mt-2 max-w-sm text-[12.5px] leading-relaxed text-muted-foreground">
                Anualidades compartidas con pago protegido. Compras meses, no años completos.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-10 gap-y-4 text-[12.5px] text-muted-foreground">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground/70">
                  Producto
                </p>
                <p>
                  <a className="transition-colors hover:text-ink" href="#como-funciona">
                    Cómo funciona
                  </a>
                </p>
                <p>
                  <a className="transition-colors hover:text-ink" href="#precio">
                    Precios y ahorro
                  </a>
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground/70">
                  Cuenta
                </p>
                <p>
                  <Link className="transition-colors hover:text-ink" to="/registro">
                    Registro de clientes
                  </Link>
                </p>
                <p>
                  <Link className="transition-colors hover:text-ink" to="/panel/verificacion">
                    Registro de negocios
                  </Link>
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground/70">
                  Explorar la app
                </p>
                <p>
                  <Link className="transition-colors hover:text-ink" to="/explorar" onClick={() => setRole("user")}>
                    Ver ofertas
                  </Link>
                </p>
                <p>
                  <Link className="transition-colors hover:text-ink" to="/panel" onClick={() => setRole("merchant")}>
                    Panel de negocios
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-border/60 pt-6 text-[11.5px] leading-relaxed text-muted-foreground">
            Afíliame está en fase de validación en Bolivia. Las condiciones legales, regulatorias y de
            conversión de moneda se publicarán antes del lanzamiento. Las cifras y los negocios que se
            muestran en esta versión son datos de ejemplo con fines ilustrativos.
          </div>
        </div>
      </footer>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} mode={loginMode} />
    </div>
  );
}
