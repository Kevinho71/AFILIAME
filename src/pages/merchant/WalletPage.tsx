import { Link } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Coins,
  Info,
  Landmark,
  QrCode,
  RefreshCcw,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  InfoNote,
  PageHeader,
  SectionTitle,
  StatCard,
} from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { bob, usdc } from "@/lib/format";
import { merchantOffers, totalEscrow } from "@/lib/selectors";
import { cn } from "@/lib/utils";

const KIND = {
  liberacion: { label: "Liberación", tone: "success" as const, icon: ShieldCheck },
  retiro: { label: "Retiro", tone: "info" as const, icon: Landmark },
  pago_qr: { label: "Pago QR", tone: "gold" as const, icon: QrCode },
  deposito: { label: "Depósito", tone: "success" as const, icon: ArrowDownLeft },
};

export function WalletPage() {
  const walletUsdc = useAppStore((state) => state.walletUsdc);
  const walletTx = useAppStore((state) => state.walletTx);
  const rate = useAppStore((state) => state.rate);
  const cycleRate = useAppStore((state) => state.cycleRate);
  const offers = useAppStore((state) => state.offers);
  const escrow = totalEscrow(merchantOffers(offers));

  const actions = [
    {
      title: "Depositar saldo",
      body: "Genera un QR y paga desde tu banco. El monto se convierte directo a dólares digitales.",
      icon: Banknote,
      cta: "Depositar",
      to: "/panel/billetera/depositar",
    },
    {
      title: "Retirar a mi banco",
      body: "Convierte a bolivianos y transfiere a tu cuenta. Muestra cotización y comisión.",
      icon: Landmark,
      cta: "Retirar",
      to: "/panel/billetera/retirar",
    },
    {
      title: "Pagar a un QR",
      body: "Paga a un proveedor en bolivianos usando tu saldo, con el monto y la comisión a la vista.",
      icon: QrCode,
      cta: "Pagar con QR",
      to: "/panel/billetera/pagar-qr",
    },
    {
      title: "Mantener saldo",
      body: "Deja tu saldo en dólares digitales. Conserva valor y no genera intereses.",
      icon: Coins,
      cta: "Mantener",
      to: null,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Billetera"
        subtitle="Tu saldo en dólares digitales, el dinero por liberar y el historial de movimientos."
        action={
          <Button variant="outline" size="sm" onClick={() => toast.info(`Tasa actualizada: 1 USDC = Bs ${cycleRate()}`)}>
            <RefreshCcw className="size-4" aria-hidden="true" />
            Actualizar cotización
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        <StatCard
          label="Saldo disponible"
          value={usdc(walletUsdc)}
          hint={`≈ ${bob(walletUsdc * rate)} a la tasa ilustrativa`}
          icon={Wallet}
          tone="brand"
        />
        <StatCard
          label="En garantía"
          value={usdc(escrow)}
          hint={`≈ ${bob(escrow * rate)} · se libera al completar cada grupo`}
          icon={ShieldCheck}
          tone="gold"
        />
        <StatCard
          label="Tasa de referencia"
          value={`Bs ${rate}`}
          hint="Definida con el socio de liquidez · valor ilustrativo"
          icon={RefreshCcw}
          className="col-span-2 xl:col-span-1"
        />
      </div>

      <InfoNote tone="warn" icon={Info}>
        Este saldo no genera intereses. Los fondos de garantía de tus clientes son intocables y no se
        usan para ningún otro fin.
      </InfoNote>

      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title}>
              <CardContent className="flex h-full flex-col p-4">
                <span className="flex size-9 items-center justify-center rounded-lg bg-brand-soft text-brand-deep">
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[14px] font-semibold text-ink">{item.title}</p>
                <p className="mt-1 flex-1 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
                {item.to ? (
                  <Button asChild size="sm" className="mt-3 w-full">
                    <Link to={item.to}>{item.cta}</Link>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 w-full"
                    onClick={() =>
                      toast.success("Saldo mantenido", {
                        description: "No hay retiro ni conversión: tu saldo queda en dólares digitales.",
                      })
                    }
                  >
                    {item.cta}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div>
        <SectionTitle hint="Liberaciones, retiros, depósitos y pagos">Historial</SectionTitle>

        {/* Escritorio: tabla */}
        <Card className="hidden md:block">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Movimiento</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="text-right">Bolivianos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {walletTx.map((tx) => {
                  const meta = KIND[tx.kind];
                  const Icon = meta.icon;
                  const positive = tx.usdc > 0;
                  return (
                    <TableRow key={tx.id}>
                      <TableCell className="num text-[12.5px] text-muted-foreground">{tx.date}</TableCell>
                      <TableCell>
                        <p className="text-[13px] font-medium text-ink">{tx.title}</p>
                        <p className="text-[11.5px] text-muted-foreground">{tx.subtitle}</p>
                        <p className="font-mono text-[10.5px] text-muted-foreground/80">{tx.ref}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={meta.tone}>
                          <Icon className="size-3.5" aria-hidden="true" />
                          {meta.label}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={cn(
                          "num text-right text-[13.5px] font-medium",
                          positive ? "text-success" : "text-ink",
                        )}
                      >
                        <span className="inline-flex items-center gap-1">
                          {positive ? (
                            <ArrowUpRight className="size-3.5" aria-hidden="true" />
                          ) : (
                            <ArrowDownRight className="size-3.5" aria-hidden="true" />
                          )}
                          {usdc(tx.usdc, true)}
                        </span>
                        {tx.feeUsdc ? (
                          <span className="block text-[11px] text-muted-foreground">
                            comisión {usdc(tx.feeUsdc)}
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell className="num text-right text-[12.5px] text-muted-foreground">
                        {tx.bob >= 0 ? bob(tx.bob) : `− ${bob(Math.abs(tx.bob))}`}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Móvil: lista de tarjetas */}
        <div className="space-y-2.5 md:hidden">
          {walletTx.map((tx) => {
            const meta = KIND[tx.kind];
            const Icon = meta.icon;
            const positive = tx.usdc > 0;
            return (
              <Card key={tx.id}>
                <CardContent className="p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-ink">{tx.title}</p>
                      <p className="mt-0.5 text-[11.5px] text-muted-foreground">{tx.subtitle}</p>
                      <p className="mt-0.5 font-mono text-[10.5px] text-muted-foreground/80">
                        {tx.ref} · {tx.date}
                      </p>
                    </div>
                    <Badge variant={meta.tone} className="shrink-0">
                      <Icon className="size-3.5" aria-hidden="true" />
                      {meta.label}
                    </Badge>
                  </div>
                  <Separator className="my-2.5" />
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={cn(
                        "num inline-flex items-center gap-1 text-[14px] font-semibold",
                        positive ? "text-success" : "text-ink",
                      )}
                    >
                      {positive ? (
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      ) : (
                        <ArrowDownRight className="size-3.5" aria-hidden="true" />
                      )}
                      {usdc(tx.usdc, true)}
                    </span>
                    <span className="num text-[12.5px] text-muted-foreground">
                      {tx.bob >= 0 ? bob(tx.bob) : `− ${bob(Math.abs(tx.bob))}`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <p className="text-[13px] font-semibold text-ink">Regla de recepción</p>
            <p className="mt-1 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
              Hoy recibes todo en dólares digitales. Puedes definir un reparto automático, por ejemplo
              50% se queda en USDC y 50% va a tu banco, desde Configuración.
            </p>
            <Button asChild size="sm" variant="outline" className="mt-3">
              <Link to="/panel/configuracion">Definir reparto</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
              <Banknote className="size-4 text-brand/70" aria-hidden="true" />
              Cuenta bancaria de destino
            </p>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              Banco Fassil · cuenta de ahorro •• 4417
            </p>
            <Separator className="my-3" />
            <p className="text-[11.5px] leading-relaxed text-muted-foreground">
              Los retiros usan esta cuenta. Si la cambias, la verificación se repite antes de operar.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
