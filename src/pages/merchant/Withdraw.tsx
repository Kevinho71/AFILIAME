import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftRight,
  BadgeCheck,
  Clock,
  Landmark,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DemoNote, InfoNote, MoneyRow, PageHeader, SectionTitle } from "@/components/shared/pieces";
import { useAppStore, CONVERSION_MARGIN } from "@/store/useAppStore";
import { bob, usdc } from "@/lib/format";

const QUOTE_SECONDS = 60;

export function Withdraw() {
  const walletUsdc = useAppStore((state) => state.walletUsdc);
  const rate = useAppStore((state) => state.rate);
  const withdraw = useAppStore((state) => state.withdraw);

  const [amount, setAmount] = useState(String(Math.floor(walletUsdc * 100) / 100));
  const [seconds, setSeconds] = useState(QUOTE_SECONDS);
  const [receipt, setReceipt] = useState<{ bobNet: number; feeBob: number; ref: string } | null>(null);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  const parsed = Number(amount.replace(",", ".")) || 0;
  const bobGross = parsed * rate;
  const feeBob = bobGross * CONVERSION_MARGIN;
  const bobNet = bobGross - feeBob;
  const invalid = parsed <= 0 || parsed > walletUsdc;
  const expired = seconds <= 0;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Retirar a mi banco"
        subtitle="Convierte tu saldo en dólares digitales a bolivianos y transfiérelo a tu cuenta de destino."
        back="/panel/billetera"
        action={
          <Badge variant="soft">
            <Landmark className="size-3.5" aria-hidden="true" />
            Banco Fassil •• 4417
          </Badge>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardContent className="p-5">
            <SectionTitle>Monto a retirar</SectionTitle>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="amount">Monto en dólares digitales (USDC)</Label>
                <div className="flex gap-2">
                  <Input
                    id="amount"
                    inputMode="decimal"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value.replace(/[^\d.,]/g, ""))}
                  />
                  <Button
                    variant="outline"
                    onClick={() => setAmount(String(Math.floor(walletUsdc * 100) / 100))}
                  >
                    Todo
                  </Button>
                </div>
                <p className="text-[11.5px] text-muted-foreground">
                  Disponible: {usdc(walletUsdc)} · {bob(walletUsdc * rate)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dest">Cuenta de destino</Label>
                <select
                  id="dest"
                  defaultValue="fassil"
                  className="h-11 w-full rounded-xl border border-input bg-card px-3 text-[15px]"
                >
                  <option value="fassil">Banco Fassil · ahorro •• 4417 (verificada)</option>
                  <option value="bnb">Banco Nacional de Bolivia · •• 2109</option>
                </select>
                <p className="text-[11.5px] text-muted-foreground">
                  Los cambios de cuenta requieren reverificación antes de operar.
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-1">
              <MoneyRow label="Monto a convertir" value={usdc(parsed)} />
              <MoneyRow label="Tasa ilustrativa" value={`Bs ${rate} por USDC`} />
              <MoneyRow label="Monto bruto en bolivianos" value={bob(bobGross, true)} />
              <MoneyRow
                label={`Margen de conversión (${Math.round(CONVERSION_MARGIN * 100)}%)`}
                hint="Cubre la operación con el socio de liquidez"
                value={`− ${bob(feeBob, true)}`}
              />
              <MoneyRow label="Recibirás en tu cuenta" value={bob(bobNet, true)} strong />
              <MoneyRow
                label="Tiempo estimado"
                hint="Se acredita en horario bancario"
                value="Hasta 24 horas hábiles"
              />
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button
                className="flex-1"
                disabled={invalid || expired}
                onClick={() => {
                  const result = withdraw(parsed);
                  if (!result) {
                    toast.error("No pudimos procesar el retiro");
                    return;
                  }
                  setReceipt({ bobNet: result.bobNet, feeBob: result.feeBob, ref: "RET-4K21-8874" });
                  setSeconds(QUOTE_SECONDS);
                  toast.success("Retiro en proceso", {
                    description: `${usdc(parsed)} se convierten y llegan a tu cuenta en bolivianos.`,
                  });
                }}
              >
                <ArrowLeftRight className="size-4" aria-hidden="true" />
                Confirmar retiro
              </Button>
              <Button variant="outline" onClick={() => setSeconds(QUOTE_SECONDS)}>
                <RefreshCcw className="size-4" aria-hidden="true" />
                Actualizar cotización
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
                  <Clock className="size-4 text-brand/70" aria-hidden="true" />
                  Vigencia de la cotización
                </p>
                <Badge variant={expired ? "danger" : "warn"}>
                  {expired ? "Expirada" : `0:${String(seconds).padStart(2, "0")}`}
                </Badge>
              </div>
              <p className="mt-2 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
                La tasa se congela mientras la cotización está vigente. Si expira, actualízala para
                confirmar el retiro con el valor del momento.
              </p>
              {expired && (
                <Button variant="outline" size="sm" className="mt-3" onClick={() => setSeconds(QUOTE_SECONDS)}>
                  Generar nueva cotización
                </Button>
              )}
            </CardContent>
          </Card>

          <InfoNote tone="neutral" icon={ShieldCheck}>
            Este saldo no genera intereses. El margen de conversión y la tasa de referencia los define el socio de liquidez.
          </InfoNote>

          <Card>
            <CardContent className="p-4">
              <p className="text-[13px] font-semibold text-ink">¿Necesitas bolivianos para pagar hoy?</p>
              <p className="mt-1 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
                En lugar de retirar y luego pagar, puedes pagar directo a un QR y convertir solo el
                monto necesario.
              </p>
              <Button asChild size="sm" variant="outline" className="mt-3">
                <Link to="/panel/billetera/pagar-qr">Pagar a un QR</Link>
              </Button>
            </CardContent>
          </Card>

          <DemoNote>
            El retiro se acredita en tu cuenta dentro del horario de operación bancaria.
          </DemoNote>
        </div>
      </div>

      <Dialog open={Boolean(receipt)} onOpenChange={(open) => !open && setReceipt(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Retiro enviado</DialogTitle>
            <DialogDescription>
              Tu saldo se convirtió a bolivianos y está en camino a tu cuenta.
            </DialogDescription>
          </DialogHeader>
          {receipt && (
            <div className="space-y-1">
              <div className="mb-3 flex items-center gap-2 rounded-xl border border-success/25 bg-success-soft/60 px-3.5 py-3">
                <BadgeCheck className="size-4.5 text-success" aria-hidden="true" />
                <p className="text-[12.5px] text-success">
                  Comprobante {receipt.ref} · simulación
                </p>
              </div>
              <MoneyRow label="Monto convertido" value={usdc(parsed)} />
              <MoneyRow label="Margen de conversión" value={bob(receipt.feeBob, true)} />
              <MoneyRow label="Total a tu cuenta" value={bob(receipt.bobNet, true)} strong />
              <MoneyRow label="Destino" value="Banco Fassil •• 4417" />
              <MoneyRow label="Acreditación" value="Hasta 24 horas hábiles" />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceipt(null)}>
              Ver mi billetera
            </Button>
            <Button asChild>
              <Link to="/panel/billetera/pagar-qr">Pagar un QR</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
