import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Camera,
  CheckCircle2,
  CreditCard,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { GuaranteeSteps } from "@/components/shared/GuaranteeSteps";
import { DemoTip, InfoNote } from "@/components/shared/pieces";
import { cn } from "@/lib/utils";

const STEPS = ["Crear tu cuenta", "Verificar tu identidad", "Listo para reservar"];

export function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [carnet, setCarnet] = useState(false);
  const [selfie, setSelfie] = useState(false);

  const canContinue = step === 0 ? phone.trim().length >= 7 : carnet && selfie;

  return (
    <div className="mx-auto max-w-[560px] px-4 py-8 sm:px-6">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="mb-4 inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Volver al inicio
      </button>

      <h1 className="text-balance font-display text-[30px] leading-[1.1]">
        Paga solo tu parte de una anualidad
      </h1>
      <p className="mt-2 text-pretty text-[14px] leading-relaxed text-muted-foreground">
        Reserva un cupo de 4 meses, paga por QR en bolivianos y espera a que el grupo se complete.
        Si no se completa, te devolvemos el dinero.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Progress value={((step + 1) / STEPS.length) * 100} className="h-2" />
        <span className="num shrink-0 text-[12px] text-muted-foreground">
          {step + 1}/{STEPS.length}
        </span>
      </div>

      <Card className="mt-4">
        <CardContent className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Paso {step + 1}
          </p>
          <h2 className="mt-1 font-display text-[20px]">{STEPS[step]}</h2>

          {step === 0 && (
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Número de celular</Label>
                <div className="flex gap-2">
                  <span className="flex h-11 items-center gap-1.5 rounded-xl border border-input bg-secondary/60 px-3 text-[14px] text-muted-foreground">
                    <Phone className="size-3.5" aria-hidden="true" />
                    +591
                  </span>
                  <Input
                    id="phone"
                    inputMode="tel"
                    placeholder="712 34567"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo (opcional)</Label>
                <Input id="email" type="email" placeholder="tucorreo@correo.bo" />
              </div>
              <InfoNote>
                No necesitas billetera, claves ni nada de criptomonedas. Pagas en bolivianos por el
                QR de tu banco.
              </InfoNote>
            </div>
          )}

          {step === 1 && (
            <div className="mt-4 space-y-3">
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                La verificación es obligatoria antes de pagar: cada cupo se asigna a una persona
                identificada y el pase no es transferible sin aprobación del negocio.
              </p>
              {[
                {
                  done: carnet,
                  icon: CreditCard,
                  title: "Carnet de identidad",
                  body: "Foto del anverso y reverso",
                  onSelect: () => {
                    setCarnet(true);
                    toast.success("Documento cargado");
                  },
                },
                {
                  done: selfie,
                  icon: Camera,
                  title: "Selfie de verificación",
                  body: "Para comparar con tu documento",
                  onSelect: () => {
                    setSelfie(true);
                    toast.success("Selfie capturada");
                  },
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={item.onSelect}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors",
                      item.done
                        ? "border-success/25 bg-success-soft/60"
                        : "border-dashed border-border bg-card hover:bg-secondary/50",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-lg",
                        item.done ? "bg-success text-primary-foreground" : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {item.done ? (
                        <CheckCircle2 className="size-5" aria-hidden="true" />
                      ) : (
                        <Icon className="size-5" aria-hidden="true" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13.5px] font-medium text-ink">{item.title}</span>
                      <span className="block text-[11.5px] text-muted-foreground">
                        {item.done ? "Cargado · verificado" : item.body}
                      </span>
                    </span>
                    {!item.done && <Badge variant="muted" className="ml-auto">Toca para simular</Badge>}
                  </button>
                );
              })}
              <DemoTip>
                La verificación se completa con tu carnet y una selfie; en esta versión se marca como cargada al instante.
              </DemoTip>
            </div>
          )}

          {step === 2 && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-success/25 bg-success-soft/60 px-4 py-3">
                <BadgeCheck className="size-5 text-success" aria-hidden="true" />
                <p className="text-[13px] text-success">
                  Tu identidad quedó verificada. Ya puedes reservar y pagar cupos.
                </p>
              </div>
              <p className="font-display text-[17px]">Tu pago queda protegido</p>
              <GuaranteeSteps />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 flex items-center gap-3">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep((value) => value - 1)}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Atrás
          </Button>
        )}
        <Button
          className="ml-auto"
          disabled={!canContinue && step < 2}
          onClick={() => {
            if (step < 2) {
              setStep((value) => value + 1);
              return;
            }
            toast.success("¡Bienvenida, Lucía!", { description: "Explora las ofertas de tu ciudad." });
            navigate("/explorar");
          }}
        >
          {step === 2 ? (
            <>
              <Sparkles className="size-4" aria-hidden="true" />
              Explorar ofertas
            </>
          ) : (
            <>
              Continuar
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>

      <div className="mt-6 flex items-center gap-2 text-[11.5px] text-muted-foreground">
        <ShieldCheck className="size-3.5 text-brand/70" aria-hidden="true" />
        Verificación documental obligatoria para usuarios y negocios (regla del modelo).
      </div>
    </div>
  );
}
