import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  Globe,
  Loader2,
  QrCode,
  RefreshCcw,
  ShieldCheck,
  TimerReset,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrFrame } from "@/components/shared/QrFrame";
import { DemoTip, EmptyState, InfoNote, MoneyRow, PageHeader, SectionTitle } from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { USER } from "@/lib/data";
import { bob, shortDate, usdc } from "@/lib/format";
import { cupoById } from "@/lib/selectors";

type Status = "esperando" | "confirmando" | "confirmado" | "expirado";

const QR_SECONDS = 300;

export function Payment() {
  const { cupoId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const offers = useAppStore((state) => state.offers);
  const rate = useAppStore((state) => state.rate);
  const buyCupo = useAppStore((state) => state.buyCupo);

  const found = cupoById(offers, cupoId);
  const external = searchParams.get("pager") === "external";

  const [method, setMethod] = useState<"qr" | "usdc">(external ? "usdc" : "qr");
  const [status, setStatus] = useState<Status>("esperando");
  const [seconds, setSeconds] = useState(QR_SECONDS);

  useEffect(() => {
    if (status !== "esperando") return;
    if (seconds <= 0) {
      setStatus("expirado");
      return;
    }
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds, status]);

  if (!found) {
    return (
      <EmptyState
        icon={Compass}
        title="No encontramos ese cupo"
        description="La reserva que buscas no está disponible."
        action={
          <Button asChild>
            <Link to="/explorar">Volver a Explorar</Link>
          </Button>
        }
      />
    );
  }

  const { offer, cupo } = found;
  const amountBob = cupo.priceBob;
  const amountUsdc = Math.round((amountBob / rate) * 100) / 100;
  const escrowTotal = offer.cupos.reduce((total, item) => total + (item.escrowUsdc ?? 0), 0);
  const projectedUsdc = amountUsdc + escrowTotal;
  const projectNet = Math.round(projectedUsdc * 0.97 * 100) / 100;

  const minutes = Math.floor(seconds / 60);
  const secs = String(seconds % 60).padStart(2, "0");

  const confirmPayment = () => {
    setStatus("confirmando");
    window.setTimeout(() => {
      const result = buyCupo(cupo.id);
      if (!result) {
        setStatus("esperando");
        toast.error("No pudimos registrar el pago. Intenta de nuevo.");
        return;
      }
      setStatus("confirmado");
      toast.success("Pago confirmado", {
        description:
          method === "qr"
            ? `Pagaste ${bob(amountBob)}. Tu pago ya está en garantía.`
            : `Se pagaron ${usdc(amountUsdc)} desde una cuenta en el exterior.`,
      });
    }, 1800);
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Pago del cupo" subtitle={`${offer.business} · ${cupo.label}`} back={`/oferta/${offer.id}/reservar`} />

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Resumen de tu reserva
              </p>
              <p className="mt-1 text-[14.5px] font-semibold text-ink">{offer.title}</p>
              <p className="text-[12px] text-muted-foreground">
                {cupo.label} · {shortDate(cupo.start)} al {shortDate(cupo.end)}
              </p>
            </div>
            <Badge variant="soft">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              En garantía al pagar
            </Badge>
          </div>
        </CardContent>
      </Card>

      {status === "confirmado" ? (
        <Card className="border-success/25">
          <CardContent className="p-5 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-soft text-success">
              <CheckCircle2 className="size-7" aria-hidden="true" />
            </span>
            <h2 className="mt-3 font-display text-[22px]">Pago confirmado</h2>
            <p className="mx-auto mt-2 max-w-sm text-pretty text-[13px] leading-relaxed text-muted-foreground">
              {method === "qr"
                ? `Pagaste ${bob(amountBob)} desde tu cuenta bancaria.`
                : `Se confirmaron ${usdc(amountUsdc)} desde una cuenta en el exterior.`}{" "}
              Tu pago ya está en garantía y no llega al negocio hasta que el grupo se complete.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={() => navigate(`/reservado/${cupo.id}`)}>
                Ver mi cupo reservado
                <ArrowRight className="size-4" aria-hidden="true" />
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
      ) : (
        <Tabs value={method} onValueChange={(value) => setMethod(value as "qr" | "usdc")}>
          <TabsList className="w-full">
            <TabsTrigger value="qr">
              <QrCode className="size-3.5" aria-hidden="true" />
              QR en bolivianos
            </TabsTrigger>
            <TabsTrigger value="usdc">
              <Globe className="size-3.5" aria-hidden="true" />
              Pagar con USDC
            </TabsTrigger>
          </TabsList>

          <TabsContent value="qr">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Escanea con tu app bancaria
                    </p>
                    <p className="num mt-1 font-display text-[28px] leading-none">{bob(amountBob)}</p>
                  </div>
                  <Badge variant={status === "expirado" ? "danger" : "warn"}>
                    <Clock className="size-3.5" aria-hidden="true" />
                    {status === "expirado" ? "QR expirado" : `${minutes}:${secs}`}
                  </Badge>
                </div>

                <div className="mt-4 flex justify-center">
                  <QrFrame
                    value={`AFILIAME-QR|${offer.id}|${cupo.id}|${amountBob}|BOB|QR-BOLIVIA`}
                    muted={status === "expirado"}
                    caption="QR bancario"
                  />
                </div>

                <div className="mt-4 space-y-2 rounded-xl border border-border/70 bg-paper-deep/50 p-3.5">
                  {[
                    "Abre la app de tu banco y entra a pagos con QR.",
                    "Escanea el código y verifica que el monto sea el correcto.",
                    "Confirma el pago: el cupo queda reservado a tu nombre.",
                  ].map((step, index) => (
                    <p key={step} className="flex gap-2 text-[12.5px] leading-relaxed text-muted-foreground">
                      <span className="num flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-ink">
                        {index + 1}
                      </span>
                      {step}
                    </p>
                  ))}
                </div>

                {status === "expirado" ? (
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Button
                      onClick={() => {
                        setSeconds(QR_SECONDS);
                        setStatus("esperando");
                      }}
                    >
                      <RefreshCcw className="size-4" aria-hidden="true" />
                      Generar nuevo QR
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to={`/oferta/${offer.id}`}>Volver a la oferta</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Button className="flex-1" disabled={status === "confirmando"} onClick={confirmPayment}>
                      {status === "confirmando" ? (
                        <>
                          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                          Confirmando el pago…
                        </>
                      ) : (
                        <>
                          <BadgeCheck className="size-4" aria-hidden="true" />
                          Ya pagué el QR
                        </>
                      )}
                    </Button>
                    <Button variant="ghost" asChild>
                      <Link to={`/oferta/${offer.id}`}>Cancelar</Link>
                    </Button>
                  </div>
                )}

                <p className="mt-3 text-[11.5px] leading-relaxed text-muted-foreground">
                  Si no pagas, el cupo vuelve a estar disponible cuando vence el QR, sin cargo.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usdc">
            <Card>
              <CardContent className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Pago desde el exterior
                </p>
                <p className="num mt-1 font-display text-[28px] leading-none">{usdc(amountUsdc)}</p>
                <p className="mt-1 text-[12.5px] text-muted-foreground">
                  Equivale a {bob(amountBob)} · tasa ilustrativa Bs {rate} por USDC
                </p>

                <div className="mt-4 rounded-xl border border-border/70 bg-paper-deep/50 p-3.5">
                  <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                    Ideal si quien paga vive fuera del país: un familiar paga el cupo en dólares
                    digitales y entra directo a la garantía, sin conversión.
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 rounded-xl border border-border/80 px-3.5 py-3">
                    <Globe className="size-4 text-brand/70" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-ink">Pagador externo</p>
                      <p className="text-[11.5px] text-muted-foreground">
                        Carla Fernández · cuenta en el exterior
                      </p>
                    </div>
                    <Badge variant="info" className="ml-auto">
                      USDC
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-border/80 px-3.5 py-3">
                    <Building2 className="size-4 text-brand/70" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-ink">Beneficiario del cupo</p>
                      <p className="text-[11.5px] text-muted-foreground">
                        {external ? "Javier Fernández" : USER.name}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  className="mt-4 w-full"
                  disabled={status === "confirmando"}
                  onClick={confirmPayment}
                >
                  {status === "confirmando" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      Confirmando…
                    </>
                  ) : (
                    <>
                      <BadgeCheck className="size-4" aria-hidden="true" />
                      Confirmar pago en USDC
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <div>
        <SectionTitle>Desglose</SectionTitle>
        <Card>
          <CardContent className="p-4">
            <MoneyRow label="Precio del cupo" value={bob(amountBob)} />
            <MoneyRow label="Comisión para el usuario" value="Bs 0" tone="success" />
            <MoneyRow
              label="Entra a la garantía"
              hint={`Tasa fija al momento de pagar: Bs ${rate} por USDC`}
              value={usdc(amountUsdc)}
            />
            <MoneyRow
              label={`Total en garantía del grupo (con tu cupo)`}
              value={usdc(projectedUsdc)}
            />
            <MoneyRow
              label="Recibiría el negocio al completarse"
              hint="Menos la comisión de plataforma del 3%"
              value={usdc(projectNet)}
              strong
            />
          </CardContent>
        </Card>
      </div>

      <InfoNote tone="neutral" icon={TimerReset}>
        Si el grupo no se completa antes del {shortDate(offer.deadline)}, te devolvemos los{" "}
        {bob(amountBob)} a tu cuenta o QR de origen en 24 a 72 horas hábiles, sin comisión.
      </InfoNote>

      <DemoTip>
        Al confirmar el pago, tu cupo queda reservado y el dinero entra en garantía hasta que el grupo se complete.
      </DemoTip>

      {status !== "confirmado" && (
        <Button variant="ghost" className="w-full" onClick={() => navigate(`/oferta/${offer.id}`)}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver sin pagar
        </Button>
      )}

      <Separator />
      <p className="text-center text-[11px] text-muted-foreground">
        Los precios están en bolivianos y la tasa de referencia se muestra antes de confirmar.
      </p>
    </div>
  );
}
