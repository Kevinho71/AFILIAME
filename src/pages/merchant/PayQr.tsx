import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  Camera,
  Coins,
  Info,
  QrCode,
  ScanLine,
  Store,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QrFrame } from "@/components/shared/QrFrame";
import { DemoNote, InfoNote, MoneyRow, PageHeader, SectionTitle } from "@/components/shared/pieces";
import { useAppStore, CONVERSION_MARGIN } from "@/store/useAppStore";
import { bob, usdc } from "@/lib/format";
import { cn } from "@/lib/utils";

const SAMPLES = [
  { id: "q1", merchant: "Ferretería Andina", amount: 450, concept: "Materiales de mantenimiento" },
  { id: "q2", merchant: "Distribuidora del Sur", amount: 320, concept: "Insumos de limpieza" },
  { id: "q3", merchant: "Servicios Eléctricos Tarija", amount: 780, concept: "Reparación de luminarias" },
];

export function PayQr() {
  const walletUsdc = useAppStore((state) => state.walletUsdc);
  const rate = useAppStore((state) => state.rate);
  const payQr = useAppStore((state) => state.payQr);
  const [selected, setSelected] = useState(SAMPLES[0]);
  const [receipt, setReceipt] = useState<{ usdc: number; feeBob: number; totalBob: number; ref: string } | null>(null);

  const feeBob = selected.amount * CONVERSION_MARGIN;
  const totalBob = selected.amount + feeBob;
  const usdcNeeded = Math.round((totalBob / rate) * 100) / 100;
  const insufficient = usdcNeeded > walletUsdc;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Pagar a un QR"
        subtitle="Usa tu saldo en dólares digitales para pagar en bolivianos a cualquier QR, convirtiendo solo el monto necesario."
        back="/panel/billetera"
        action={
          <Badge variant="soft">
            <Wallet className="size-3.5" aria-hidden="true" />
            {usdc(walletUsdc)}
          </Badge>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <Card>
          <CardContent className="p-5">
            <SectionTitle>Escanear el QR del proveedor</SectionTitle>
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-paper-deep/50 p-5">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-soft text-brand-deep">
                <ScanLine className="size-7" aria-hidden="true" />
              </span>
              <p className="text-center text-[12.5px] leading-relaxed text-muted-foreground">
                Apunta la cámara al QR del proveedor o elige uno de los códigos de ejemplo.
              </p>
              <Button onClick={() => toast.info("Escaneo con cámara disponible en la app móvil")}>
                <Camera className="size-4" aria-hidden="true" />
                Escanear con la cámara
              </Button>
            </div>

            <div className="mt-4">
              <SectionTitle>Códigos de ejemplo</SectionTitle>
              <div className="space-y-2">
                {SAMPLES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => {
                      setSelected(sample);
                      toast.info(`QR leído: ${sample.merchant}`);
                    }}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors",
                      selected.id === sample.id
                        ? "border-primary bg-brand-soft/50"
                        : "border-border/80 bg-card hover:bg-secondary/40",
                    )}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                      <Store className="size-4.5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-medium text-ink">{sample.merchant}</span>
                      <span className="block text-[11.5px] text-muted-foreground">{sample.concept}</span>
                    </span>
                    <span className="num shrink-0 text-[13.5px] font-semibold text-ink">
                      {bob(sample.amount, true)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    QR leído
                  </p>
                  <p className="mt-1 font-display text-[20px] leading-tight">{selected.merchant}</p>
                  <p className="text-[12px] text-muted-foreground">{selected.concept}</p>
                </div>
                <QrFrame
                  value={`AFILIAME-QR|${selected.id}|${selected.merchant}|${selected.amount}|BOB`}
                  size={92}
                  caption="QR del proveedor"
                />
              </div>

              <Separator className="my-4" />

              <MoneyRow label="Monto del QR" value={bob(selected.amount, true)} />
              <MoneyRow
                label={`Margen de conversión (${Math.round(CONVERSION_MARGIN * 100)}%)`}
                hint="Cubre la operación de cambio"
                value={bob(feeBob, true)}
              />
              <MoneyRow label="Total a pagar" value={bob(totalBob, true)} strong />
              <Separator className="my-3" />
              <MoneyRow
                label="Se descuentan de tu saldo"
                hint={`Tasa de referencia: Bs ${rate} por USDC`}
                value={usdc(usdcNeeded)}
              />
              <MoneyRow
                label="Saldo después del pago"
                value={usdc(Math.round((walletUsdc - usdcNeeded) * 100) / 100)}
              />

              {insufficient && (
                <InfoNote tone="danger" className="mt-3" icon={Info}>
                  Tu saldo no alcanza. Completa un grupo para liberar más fondos o retira menos antes
                  de pagar.
                </InfoNote>
              )}

              <Button
                className="mt-4 w-full"
                disabled={insufficient}
                onClick={() => {
                  const result = payQr(selected.amount, selected.merchant);
                  if (!result) {
                    toast.error("No pudimos procesar el pago");
                    return;
                  }
                  setReceipt(result);
                  toast.success("QR pagado", {
                    description: `${bob(result.totalBob, true)} pagados a ${selected.merchant}.`,
                  });
                }}
              >
                <QrCode className="size-4" aria-hidden="true" />
                Pagar {bob(totalBob, true)}
              </Button>
            </CardContent>
          </Card>

          <InfoNote tone="neutral" icon={Coins}>
            Se convierte únicamente el monto necesario para pagar el QR. El saldo que no usas
            permanece en dólares digitales y no genera intereses.
          </InfoNote>

          <DemoNote>
            El pago se liquida con un socio de liquidez y llega a la cuenta del proveedor en bolivianos.
          </DemoNote>
        </div>
      </div>

      <Dialog open={Boolean(receipt)} onOpenChange={(open) => !open && setReceipt(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pago confirmado</DialogTitle>
            <DialogDescription>
              {selected.merchant} recibió el pago en bolivianos. Tu saldo ya está actualizado.
            </DialogDescription>
          </DialogHeader>
          {receipt && (
            <div className="space-y-1">
              <div className="mb-3 flex items-center gap-2 rounded-xl border border-success/25 bg-success-soft/60 px-3.5 py-3">
                <BadgeCheck className="size-4.5 text-success" aria-hidden="true" />
                <p className="text-[12.5px] text-success">Comprobante {receipt.ref} · simulación</p>
              </div>
              <MoneyRow label="Monto pagado al QR" value={bob(selected.amount, true)} />
              <MoneyRow label="Margen de conversión" value={bob(receipt.feeBob, true)} />
              <MoneyRow label="Total debitado" value={usdc(receipt.usdc)} strong />
              <MoneyRow label="Nuevo saldo" value={usdc(Math.round((walletUsdc - receipt.usdc) * 100) / 100)} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceipt(null)}>
              Cerrar
            </Button>
            <Button asChild>
              <Link to="/panel/billetera">Volver a la billetera</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
