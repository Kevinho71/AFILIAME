import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownLeft,
  BadgeCheck,
  Banknote,
  Coins,
  Info,
  Landmark,
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
import { QrFrame } from "@/components/shared/QrFrame";
import { DemoNote, InfoNote, MoneyRow, PageHeader, SectionTitle } from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { bob, usdc } from "@/lib/format";

/** Cuenta recaudadora de Afíliame (socio de liquidez) donde el negocio deposita en bolivianos. */
const COLLECTION_ACCOUNT = "Banco Fassil · Cuenta recaudadora Afíliame •• 8890";
const ACCOUNT_HOLDER = "Afíliame (socio de liquidez)";

export function Deposit() {
  const rate = useAppStore((state) => state.rate);
  const walletUsdc = useAppStore((state) => state.walletUsdc);
  const deposit = useAppStore((state) => state.deposit);

  const [amount, setAmount] = useState("600");
  const [receipt, setReceipt] = useState<{ usdc: number; ref: string } | null>(null);

  const parsed = useMemo(() => Number(amount.replace(",", ".")) || 0, [amount]);
  const usdcAmount = useMemo(() => Math.round((parsed / rate) * 100) / 100, [parsed, rate]);
  const ref = useMemo(() => `DEP-${Math.random().toString(16).slice(2, 6).toUpperCase()}-${Math.round(Math.random() * 9000 + 1000)}`, []);
  const invalid = parsed <= 0;

  const confirm = () => {
    const result = deposit(parsed);
    if (!result) {
      toast.error("No pudimos procesar el depósito");
      return;
    }
    setReceipt(result);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Depositar saldo"
        subtitle="Genera un QR para pagar desde tu banco y el monto se convierte automáticamente a dólares digitales."
        back="/panel/billetera"
        action={
          <Badge variant="soft">
            <Banknote className="size-3.5" aria-hidden="true" />
            Bs → USDC · directo
          </Badge>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardContent className="p-4 sm:p-5">
            <SectionTitle>Monto a depositar en bolivianos</SectionTitle>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="deposit-amount">Monto (Bs)</Label>
                <Input
                  id="deposit-amount"
                  inputMode="decimal"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value.replace(/[^\d.,]/g, ""))}
                />
                <p className="text-[11.5px] text-muted-foreground">
                  Disponible a cargar: sin límite mínimo · tasa de referencia Bs {rate} por USDC.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[200, 500, 1000, 2000].map((quick) => (
                  <Button
                    key={quick}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(String(quick))}
                  >
                    {bob(quick)}
                  </Button>
                ))}
              </div>

              <Separator />

              <MoneyRow label="Depositas en bolivianos" value={bob(parsed, true)} />
              <MoneyRow label="Tasa de referencia" value={`Bs ${rate} por USDC`} />
              <MoneyRow
                label="Recibes en tu billetera"
                value={usdc(usdcAmount)}
                strong
              />

              <InfoNote tone="neutral" icon={Coins}>
                Conversión directa a dólares digitales, sin comisión. Tu saldo no genera intereses y
                queda disponible para retirar, pagar un QR o mantenerlo.
              </InfoNote>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Card>
            <CardContent className="p-4 sm:p-5">
              <SectionTitle hint="Escanealo con tu app de banco">QR de depósito</SectionTitle>
              <div className="flex flex-col items-center gap-3">
                <QrFrame
                  value={`AFILIAME-DEP|BANCO FASSIL|${ACCOUNT_HOLDER}|${parsed}|BOB|${ref}`}
                  size={148}
                  caption="Escanea o paga a la cuenta recaudadora"
                />
                <div className="w-full rounded-xl border border-border/80 bg-paper-deep/50 p-3.5">
                  <p className="flex items-center gap-2 text-[12.5px] font-medium text-ink">
                    <Landmark className="size-4 text-brand/70" aria-hidden="true" />
                    {ACCOUNT_HOLDER}
                  </p>
                  <p className="mt-1 text-[12px] text-muted-foreground">{COLLECTION_ACCOUNT}</p>
                  <p className="num mt-1 font-mono text-[11px] text-muted-foreground/80">
                    Referencia: {ref}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" disabled={invalid} onClick={confirm}>
            <ArrowDownLeft className="size-4" aria-hidden="true" />
            Simular pago recibido ({usdc(usdcAmount)})
          </Button>

          <InfoNote tone="info" icon={Info}>
            Al pagar el QR, el socio de liquidez detecta el depósito y convierte los bolivianos a
            dólares digitales en tu billetera. Puede tardar unos minutos en horario bancario.
          </InfoNote>

          <DemoNote>
            En la versión real, la acreditación la confirma el webhook del socio de liquidez. Aquí se
            simula al instante.
          </DemoNote>
        </div>
      </div>

      <Dialog open={Boolean(receipt)} onOpenChange={(open) => !open && setReceipt(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Depósito acreditado</DialogTitle>
            <DialogDescription>
              Tu pago se convirtió a dólares digitales y ya está en tu billetera.
            </DialogDescription>
          </DialogHeader>
          {receipt && (
            <div className="space-y-1">
              <div className="mb-3 flex items-center gap-2 rounded-xl border border-success/25 bg-success-soft/60 px-3.5 py-3">
                <BadgeCheck className="size-4.5 text-success" aria-hidden="true" />
                <p className="text-[12.5px] text-success">Comprobante {receipt.ref} · simulación</p>
              </div>
              <MoneyRow label="Depositaste" value={bob(parsed, true)} />
              <MoneyRow label="Acreditado a tu billetera" value={usdc(receipt.usdc)} strong />
              <MoneyRow label="Nuevo saldo" value={usdc(walletUsdc)} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceipt(null)}>
              Cerrar
            </Button>
            <Button asChild>
              <Link to="/panel/billetera">Ver billetera</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
