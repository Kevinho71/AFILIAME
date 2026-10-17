import { Link, useParams } from "react-router-dom";
import {
  Compass,
  Download,
  ExternalLink,
  Printer,
  Receipt as ReceiptIcon,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DemoNote, EmptyState, MoneyRow, PageHeader } from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { bob, shortDate, usdc } from "@/lib/format";
import { cupoById } from "@/lib/selectors";

export function Receipt() {
  const { cupoId } = useParams();
  const offers = useAppStore((state) => state.offers);
  const payments = useAppStore((state) => state.payments);
  const rate = useAppStore((state) => state.rate);
  const found = cupoById(offers, cupoId);

  if (!found) {
    return (
      <EmptyState
        icon={Compass}
        title="No encontramos ese comprobante"
        description="Vuelve a Mis cupos para revisar tus operaciones."
        action={
          <Button asChild>
            <Link to="/mis-cupos">Ver Mis cupos</Link>
          </Button>
        }
      />
    );
  }

  const { offer, cupo } = found;
  const payment = payments.find((item) => item.cupoId === cupo.id);
  const escrow = cupo.escrowUsdc ?? Math.round((cupo.priceBob / rate) * 100) / 100;
  const state = ["liberada", "en_curso", "finalizada"].includes(offer.status)
    ? "Liberado al negocio"
    : cupo.status === "reembolsado"
      ? "Reembolsado al usuario"
      : "En garantía";

  return (
    <div className="space-y-5">
      <PageHeader
        title="Comprobante y garantía"
        subtitle="Este recibo resume tu operación y el estado de tus fondos."
        back="/mis-cupos"
      />

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand-deep">
                <ReceiptIcon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-[18px] leading-tight">Comprobante de cupo</p>
                <p className="text-[11.5px] text-muted-foreground">
                  Emitido por Afíliame
                </p>
              </div>
            </div>
            <Badge variant={state === "En garantía" ? "info" : state === "Liberado al negocio" ? "success" : "danger"}>
              {state}
            </Badge>
          </div>

          <Separator className="my-4" />

          <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
            <MoneyRow label="Identificador de operación" value={payment?.ref ?? "CUP-0000-0000"} />
            <MoneyRow label="Fecha" value={payment?.date ?? shortDate(offer.deadline)} />
            <MoneyRow label="Negocio" value={offer.business} />
            <MoneyRow label="Cupo" value={cupo.label} />
            <MoneyRow label="Beneficiario" value={cupo.participant?.name ?? "—"} />
            <MoneyRow label="Medio de pago" value={payment?.rate ? `QR bancario · Bs ${payment.rate}/USDC` : "QR bancario"} />
          </div>

          <Separator className="my-4" />

          <MoneyRow label="Monto pagado" value={bob(cupo.priceBob)} />
          <MoneyRow label="Comisión para el usuario" value="Bs 0" tone="success" />
          <MoneyRow label="Equivalente en garantía" value={usdc(escrow)} />
          <MoneyRow
            label="Estado de los fondos"
            value={state}
            strong
            hint={
              state === "En garantía"
                ? `Se libera si los ${offer.cupos.length} cupos se completan antes del ${shortDate(offer.deadline)}`
                : state === "Liberado al negocio"
                  ? "El grupo se completó y la garantía se liberó"
                  : "El grupo no se completó y se devolvió el pago"
            }
          />

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button asChild className="flex-1">
              <Link to={`/garantia/${offer.id}`}>
                <ShieldCheck className="size-4" aria-hidden="true" />
                Ver garantía en la red
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="size-4" aria-hidden="true" />
              Imprimir
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.success("Comprobante descargado", {
                  description: "Puedes imprimirlo o guardarlo desde tu correo.",
                })
              }
            >
              <Download className="size-4" aria-hidden="true" />
              PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-2xl border border-border/80 bg-card p-4">
        <p className="text-[13.5px] font-semibold text-ink">Qué puedes hacer con este comprobante</p>
        <ul className="mt-2 space-y-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
          <li>• Reclamar en caso de disputa: identifica la operación y el cupo exacto.</li>
          <li>• Verificar que tu pago está en garantía y bajo qué condiciones se libera.</li>
          <li>• Mostrar el detalle del reembolso si el grupo no se completa.</li>
        </ul>
      </div>

      <DemoNote>
        Conserva este comprobante: identifica tu operación y sirve para cualquier reclamo.
      </DemoNote>
    </div>
  );
}
