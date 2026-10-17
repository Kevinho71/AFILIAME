import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Compass,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { QrFrame } from "@/components/shared/QrFrame";
import { EmptyState, InfoNote, MoneyRow, PageHeader, SectionTitle } from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { bob, shortDate } from "@/lib/format";
import { cupoById } from "@/lib/selectors";

type Status = "esperando" | "confirmando" | "confirmado" | "expirado";

const QR_SECONDS = 300;

export function Payment() {
  const { cupoId } = useParams();
  const navigate = useNavigate();

  const offers = useAppStore((state) => state.offers);
  const buyCupo = useAppStore((state) => state.buyCupo);

  const found = cupoById(offers, cupoId);

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
        description: `Pagaste ${bob(amountBob)}. Tu pago ya está protegido.`,
      });
    }, 1800);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Pago del cupo"
        subtitle={`${offer.business} · ${cupo.label}`}
        back={`/oferta/${offer.id}/reservar`}
      />

      <div className="grid gap-5 lg:grid-cols-[1.45fr_1fr] lg:items-start">
        <div className="space-y-4">
          {status === "confirmado" ? (
            <Card className="border-success/25">
              <CardContent className="p-6 text-center">
                <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-soft text-success">
                  <CheckCircle2 className="size-7" aria-hidden="true" />
                </span>
                <h2 className="mt-3 font-display text-[22px]">Pago confirmado</h2>
                <p className="mx-auto mt-2 max-w-md text-pretty text-[13px] leading-relaxed text-muted-foreground">
                  Pagaste {bob(amountBob)} por {cupo.label}. Tu pago ya está protegido y no llega al
                  negocio hasta que el grupo se complete.
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <Button onClick={() => navigate(`/reservado/${cupo.id}`)}>
                    Ver mi cupo
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to={`/oferta/${offer.id}`}>Volver a la oferta</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Escanea con tu app bancaria
                    </p>
                    <p className="num mt-1 font-display text-[30px] leading-none">{bob(amountBob)}</p>
                  </div>
                  <Badge variant={status === "expirado" ? "danger" : "warn"}>
                    <Clock className="size-3.5" aria-hidden="true" />
                    {status === "expirado" ? "QR expirado" : `${minutes}:${secs}`}
                  </Badge>
                </div>

                <div className="mt-5 flex justify-center">
                  <QrFrame
                    value={`AFILIAME-QR|${offer.id}|${cupo.id}|${amountBob}|BOB|QR-BOLIVIA`}
                    muted={status === "expirado"}
                    caption="QR bancario"
                  />
                </div>

                <div className="mt-5 space-y-2 rounded-xl border border-border/70 bg-paper-deep/50 p-4">
                  {[
                    "Abre la app de tu banco y entra a pagos con QR.",
                    "Escanea el código y verifica que el monto sea el correcto.",
                    "Confirma el pago: el cupo queda reservado a tu nombre.",
                  ].map((step, index) => (
                    <p
                      key={step}
                      className="flex gap-2.5 text-[12.5px] leading-relaxed text-muted-foreground"
                    >
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
                    <Button
                      className="flex-1"
                      disabled={status === "confirmando"}
                      onClick={confirmPayment}
                    >
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
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Tu reserva
                  </p>
                  <p className="mt-1 text-[14px] font-semibold text-ink">{offer.title}</p>
                  <p className="text-[12px] text-muted-foreground">
                    {cupo.label} · {shortDate(cupo.start)} al {shortDate(cupo.end)}
                  </p>
                </div>
                <Badge variant="soft">
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  Protegido
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <SectionTitle>Desglose</SectionTitle>
              <MoneyRow label="Precio del cupo" value={bob(amountBob)} />
              <MoneyRow label="Comisión para ti" value="Bs 0" tone="success" />
              <MoneyRow label="Total a pagar" value={bob(amountBob)} strong />
            </CardContent>
          </Card>

          <Accordion
            type="single"
            collapsible
            className="rounded-2xl border border-border/80 bg-card px-4"
          >
            <AccordionItem value="despues">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-brand" aria-hidden="true" />
                  Qué pasa después de pagar
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  El grupo sigue juntando cupos hasta el {shortDate(offer.deadline)}. Si se completa,
                  el negocio cobra el año completo y tu pase digital queda listo. Si no se completa,
                  el reembolso vuelve solo a tu cuenta de origen.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <InfoNote tone="neutral" icon={TimerReset}>
            Reembolso en 24 a 72 horas hábiles, sin comisión, si el grupo no se completa.
          </InfoNote>

          {status !== "confirmado" && (
            <Button variant="ghost" className="w-full" onClick={() => navigate(`/oferta/${offer.id}`)}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Volver sin pagar
            </Button>
          )}

          <p className="text-center text-[11px] text-muted-foreground">
            <QrCode className="mr-1 inline size-3.5" aria-hidden="true" />
            El precio queda fijo en bolivianos al momento de pagar.
          </p>
        </aside>
      </div>
    </div>
  );
}
