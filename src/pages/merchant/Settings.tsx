import { useState } from "react";
import {
  Banknote,
  BellRing,
  Coins,
  Landmark,
  ScanLine,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { DemoNote, InfoNote, MoneyRow, PageHeader, SectionTitle } from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { BUSINESS } from "@/lib/data";
import { bob, usdc } from "@/lib/format";
import { cn } from "@/lib/utils";

type Rule = "bolivianos" | "usdc" | "mixto";

export function Settings() {
  const rate = useAppStore((state) => state.rate);
  const walletUsdc = useAppStore((state) => state.walletUsdc);
  const [rule, setRule] = useState<Rule>("usdc");
  const [share, setShare] = useState("50");

  const sharePct = Math.min(100, Math.max(0, Number(share) || 0));
  const toBank = Math.round(walletUsdc * (sharePct / 100) * 100) / 100;
  const toWallet = Math.round((walletUsdc - toBank) * 100) / 100;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Configuración"
        subtitle="Equipo, cuenta bancaria, regla de recepción de fondos y notificaciones."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <SectionTitle hint="Accesos y permisos">Equipo</SectionTitle>
            <div className="space-y-2">
              {[
                {
                  name: BUSINESS.owner,
                  role: "Dueño · acceso total",
                  icon: Banknote,
                  badge: "Propietario",
                },
                {
                  name: "Sofía Ríos",
                  role: "Recepción · solo activar cupos",
                  icon: ScanLine,
                  badge: "Validador",
                },
                {
                  name: "Equipo de administración",
                  role: "Ofertas, billetera y reportes",
                  icon: Users,
                  badge: "Administrador",
                },
              ].map((member) => {
                const Icon = member.icon;
                return (
                  <div
                    key={member.name}
                    className="flex items-center gap-3 rounded-xl border border-border/80 px-3.5 py-3"
                  >
                    <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                      <Icon className="size-4.5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-ink">{member.name}</p>
                      <p className="text-[11.5px] text-muted-foreground">{member.role}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto shrink-0">
                      {member.badge}
                    </Badge>
                  </div>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => toast.info("Invitación enviada")}
            >
              <UserPlus className="size-4" aria-hidden="true" />
              Invitar a un validador
            </Button>
            <InfoNote tone="neutral" className="mt-3" icon={ShieldCheck}>
              El rol Validador solo escanea códigos y activa cupos: no ve montos ni datos
              bancarios.
            </InfoNote>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <SectionTitle>Cuenta bancaria de destino</SectionTitle>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="bank">Banco</Label>
                <select
                  id="bank"
                  defaultValue="Fassil"
                  className="h-11 w-full rounded-xl border border-input bg-card px-3 text-[15px]"
                >
                  <option value="Fassil">Banco Fassil</option>
                  <option value="BNB">Banco Nacional de Bolivia</option>
                  <option value="Union">Banco Unión</option>
                </select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <select
                    id="type"
                    defaultValue="Ahorro"
                    className="h-11 w-full rounded-xl border border-input bg-card px-3 text-[15px]"
                  >
                    <option value="Ahorro">Ahorro</option>
                    <option value="Corriente">Corriente</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">Número</Label>
                  <Input id="number" defaultValue="•••• 4417" />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info("Cuenta guardada · se pedirá reverificación")}
              >
                <Landmark className="size-4" aria-hidden="true" />
                Guardar cuenta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-5">
          <SectionTitle hint="Se aplica en cada liberación">Regla de recepción de fondos</SectionTitle>
          <RadioGroup value={rule} onValueChange={(value) => setRule(value as Rule)}>
            {[
              {
                value: "bolivianos",
                title: "Todo a bolivianos",
                body: "Cada liberación se convierte y se transfiere automáticamente a tu banco.",
              },
              {
                value: "usdc",
                title: "Todo en dólares digitales",
                body: "Recibes en tu billetera y decides después si mantienes, retiras o pagas un QR.",
              },
              {
                value: "mixto",
                title: "Reparto combinado",
                body: "Defines qué porcentaje va a tu banco y qué porcentaje se queda en tu billetera.",
              },
            ].map((option) => (
              <label
                key={option.value}
                htmlFor={`rule-${option.value}`}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors",
                  rule === option.value ? "border-primary bg-brand-soft/50" : "border-border/80 bg-card",
                )}
              >
                <RadioGroupItem value={option.value} id={`rule-${option.value}`} className="mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[13.5px] font-medium text-ink">{option.title}</p>
                  <p className="text-[11.5px] leading-relaxed text-muted-foreground">{option.body}</p>
                </div>
              </label>
            ))}
          </RadioGroup>

          {rule === "mixto" && (
            <div className="mt-4 grid gap-4 rounded-2xl border border-border/80 bg-paper-deep/40 p-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="share">Porcentaje a tu banco</Label>
                <Input
                  id="share"
                  inputMode="numeric"
                  value={share}
                  onChange={(event) => setShare(event.target.value.replace(/\D/g, "").slice(0, 3))}
                />
                <p className="text-[11.5px] text-muted-foreground">
                  El resto se queda en tu billetera en dólares digitales.
                </p>
              </div>
              <div>
                <p className="text-[11.5px] font-medium uppercase tracking-wide text-muted-foreground">
                  Vista previa con tu saldo
                </p>
                <MoneyRow label={`A tu banco (${sharePct}%)`} value={`${usdc(toBank)} ≈ ${bob(toBank * rate)}`} />
                <MoneyRow label={`Se queda en billetera (${100 - sharePct}%)`} value={usdc(toWallet)} />
                <MoneyRow label="Total" value={usdc(walletUsdc)} strong />
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              onClick={() =>
                toast.success("Regla de recepción guardada", {
                  description:
                    rule === "bolivianos"
                      ? "Cada liberación se convertirá a bolivianos."
                      : rule === "usdc"
                        ? "Recibirás todo en dólares digitales."
                        : `${sharePct}% va a tu banco y ${100 - sharePct}% se queda en la billetera.`,
                })
              }
            >
              Guardar regla
            </Button>
            <Badge variant="soft">
              <Coins className="size-3.5" aria-hidden="true" />
              Tasa de referencia: Bs {rate} por USDC
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <SectionTitle>Notificaciones</SectionTitle>
          <div className="space-y-2">
            {[
              { label: "Nuevo cupo pagado en una de mis ofertas", on: true },
              { label: "Grupo completo y garantía liberada", on: true },
              { label: "Recordatorios 48 y 24 horas antes del cierre", on: true },
              { label: "Resumen semanal de llenado e ingresos", on: false },
              { label: "Avisos de cesión o reasignación de cupos", on: true },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/80 px-3.5 py-3"
              >
                <p className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
                  <BellRing className="size-3.5 shrink-0 text-brand/70" aria-hidden="true" />
                  {item.label}
                </p>
                <Switch defaultChecked={item.on} aria-label={item.label} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-[13px] font-semibold text-ink">Legal y cumplimiento</p>
          <p className="mt-1 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
            La custodia de fondos, la conversión entre bolivianos y dólares digitales y el tratamiento
            de criptoactivos están pendientes de validación con asesoría legal en Bolivia. Afíliame publicará las condiciones validadas antes del lanzamiento.
          </p>
          <Separator className="my-3" />
          <Button variant="outline" size="sm" onClick={() => toast.info("Solicitar documentos legales")}>
            Ver documentos de la cuenta
          </Button>
        </CardContent>
      </Card>

      <DemoNote>
        Los cambios se aplican a las próximas liberaciones de tus ofertas.
      </DemoNote>
    </div>
  );
}
