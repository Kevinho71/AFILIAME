import { Link, useParams } from "react-router-dom";
import {
  Compass,
  FileSearch,
  Fingerprint,
  Link2,
  Lock,
  ShieldCheck,
  Unlock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState, InfoNote, MoneyRow, PageHeader, SectionTitle } from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { bob, shortDate } from "@/lib/format";
import { offerById } from "@/lib/selectors";

const hash = (seed: string) => {
  let value = 0;
  for (let i = 0; i < seed.length; i += 1) value = (value * 31 + seed.charCodeAt(i)) % 1e9;
  const base = value.toString(16).padStart(8, "0");
  return `${base.slice(0, 4)}…${base.slice(-6)}`;
};

export function Guarantee() {
  const { offerId } = useParams();
  const offers = useAppStore((state) => state.offers);
  const offer = offerById(offers, offerId);

  if (!offer) {
    return (
      <EmptyState
        icon={Compass}
        title="No encontramos esa garantía"
        description="Vuelve al feed y abre una oferta para ver su garantía."
        action={
          <Button asChild>
            <Link to="/explorar">Volver a Explorar</Link>
          </Button>
        }
      />
    );
  }

  const deposits = offer.cupos.filter((cupo) => (cupo.escrowUsdc ?? 0) > 0);
  const totalBob = deposits.reduce((sum, cupo) => sum + cupo.priceBob, 0);
  const released = ["liberada", "en_curso", "finalizada"].includes(offer.status);
  const refunded = offer.status === "reembolsada";
  const feeBob = Math.round(totalBob * 0.03);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Garantía de la oferta"
        subtitle={`${offer.business} · ${offer.title}`}
        back={`/oferta/${offer.id}`}
      />

      <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr] lg:items-start">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                    {released ? (
                      <Unlock className="size-5" aria-hidden="true" />
                    ) : (
                      <Lock className="size-5" aria-hidden="true" />
                    )}
                  </span>
                  <div>
                    <p className="font-display text-[18px] leading-tight">
                      {refunded
                        ? "Pagos devueltos"
                        : released
                          ? "Pago entregado al negocio"
                          : "Pago protegido"}
                    </p>
                    <p className="text-[11.5px] text-muted-foreground">
                      {deposits.length} de {offer.cupos.length} cupos pagados
                    </p>
                  </div>
                </div>
                <Badge variant={refunded ? "danger" : released ? "success" : "info"}>
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  {refunded ? "Devuelto" : released ? "Entregado" : "Protegido"}
                </Badge>
              </div>

              <Separator className="my-4" />

              <MoneyRow
                label={released ? "Monto entregado al negocio" : "Monto protegido"}
                value={bob(released ? totalBob - feeBob : totalBob)}
                strong
              />
              <MoneyRow
                label="Comisión de plataforma"
                hint="La asume el negocio, no el cliente"
                value={bob(feeBob)}
              />
              <MoneyRow
                label="Fecha límite del grupo"
                value={shortDate(offer.deadline)}
                hint={released ? `Entregado el ${offer.releasedAt ?? "—"}` : "Se devuelve si no se completa"}
              />
            </CardContent>
          </Card>

          <div>
            <SectionTitle hint="Movimientos de la garantía">Pagos registrados</SectionTitle>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cupo</TableHead>
                      <TableHead>Periodo</TableHead>
                      <TableHead>Fecha de pago</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                      <TableHead className="text-right">Registro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deposits.map((cupo) => (
                      <TableRow key={cupo.id}>
                        <TableCell className="text-[12.5px]">
                          Cupo {cupo.index + 1}
                          {cupo.mine && <span className="ml-1.5 text-[11px] text-brand">(tuyo)</span>}
                        </TableCell>
                        <TableCell className="text-[12.5px]">{cupo.label}</TableCell>
                        <TableCell className="num text-[12.5px]">{cupo.paidAt ?? "—"}</TableCell>
                        <TableCell className="num text-right text-[12.5px]">{bob(cupo.priceBob)}</TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                            <Link2 className="size-3" aria-hidden="true" />
                            {hash(`${offer.id}-${cupo.id}`)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                    {offer.cupos
                      .filter((cupo) => (cupo.escrowUsdc ?? 0) === 0)
                      .map((cupo) => (
                        <TableRow key={cupo.id} className="opacity-60">
                          <TableCell className="text-[12.5px]">Cupo {cupo.index + 1}</TableCell>
                          <TableCell className="text-[12.5px]">{cupo.label}</TableCell>
                          <TableCell className="text-[12.5px]">Pago pendiente</TableCell>
                          <TableCell className="num text-right text-[12.5px]">
                            {bob(cupo.priceBob)} pendientes
                          </TableCell>
                          <TableCell className="text-right text-[11px] text-muted-foreground">
                            sin registro
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <Card>
            <CardContent className="p-4">
              <p className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
                <FileSearch className="size-4 text-brand" aria-hidden="true" />
                Qué significa en simple
              </p>
              <ul className="mt-2 space-y-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                <li>• Tu pago no llega al negocio hasta que el grupo se completa.</li>
                <li>
                  • Se entrega solo si los {offer.cupos.length} cupos se pagan antes del{" "}
                  {shortDate(offer.deadline)}.
                </li>
                <li>• Si no se completa, el pago vuelve automáticamente a su origen.</li>
                <li>• Nadie puede usar ese dinero para otro fin.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
                <Fingerprint className="size-4 text-brand" aria-hidden="true" />
                Por qué se puede verificar
              </p>
              <p className="mt-2 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
                Cada movimiento queda con su registro y se puede auditar por separado. No dependes de
                una captura de pantalla ni de la palabra de la plataforma.
              </p>
            </CardContent>
          </Card>

          <InfoNote tone="info" icon={ShieldCheck}>
            Los identificadores se muestran abreviados. Puedes pedir el detalle completo de tu
            operación desde el comprobante.
          </InfoNote>
        </aside>
      </div>
    </div>
  );
}
