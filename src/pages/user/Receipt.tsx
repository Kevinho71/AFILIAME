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
import { EmptyState, MoneyRow, PageHeader } from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { bob, shortDate } from "@/lib/format";
import { cupoById } from "@/lib/selectors";

export function Receipt() {
  const { cupoId } = useParams();
  const offers = useAppStore((state) => state.offers);
  const payments = useAppStore((state) => state.payments);
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
  const state = ["liberada", "en_curso", "finalizada"].includes(offer.status)
    ? "Entregado al negocio"
    : cupo.status === "reembolsado"
      ? "Devuelto al cliente"
      : "Protegido";

  return (
    <div className="space-y-5">
      <PageHeader
        title="Comprobante"
        subtitle="Este recibo resume tu operación y el estado de tu pago."
        back="/mis-cupos"
      />

      <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr] lg:items-start">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <ReceiptIcon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display text-[18px] leading-tight">Comprobante de cupo</p>
                  <p className="text-[11.5px] text-muted-foreground">Emitido por Afíliame</p>
                </div>
              </div>
              <Badge
                variant={state === "Protegido" ? "info" : state === "Devuelto al cliente" ? "danger" : "success"}
              >
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
              <MoneyRow label="Medio de pago" value="QR bancario" />
            </div>

            <Separator className="my-4" />

            <MoneyRow label="Monto pagado" value={bob(cupo.priceBob)} />
            <MoneyRow label="Comisión para el cliente" value="Bs 0" tone="success" />
            <MoneyRow
              label="Estado del pago"
              value={state}
              strong
              hint={
                state === "Protegido"
                  ? `Se entrega al negocio si los ${offer.cupos.length} cupos se completan antes del ${shortDate(offer.deadline)}`
                  : state === "Entregado al negocio"
                    ? "El grupo se completó y el negocio recibió el año completo"
                    : "El grupo no se completó y se devolvió el pago"
              }
            />

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button asChild className="flex-1">
                <Link to={`/garantia/${offer.id}`}>
                  <ShieldCheck className="size-4" aria-hidden="true" />
                  Ver garantía
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
                    description: "También lo enviamos a tu correo registrado.",
                  })
                }
              >
                <Download className="size-4" aria-hidden="true" />
                PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <Card>
            <CardContent className="p-4">
              <p className="text-[13.5px] font-semibold text-ink">Para qué sirve este comprobante</p>
              <ul className="mt-2 space-y-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                <li>• Identifica tu operación y tu cupo si necesitas reclamar.</li>
                <li>• Muestra el estado de tu pago y cuándo se entrega al negocio.</li>
                <li>• Detalla el reembolso si el grupo no se completa.</li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
