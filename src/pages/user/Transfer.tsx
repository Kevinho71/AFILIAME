import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Compass, Info, Repeat2, ShieldCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { EmptyState, InfoNote, MoneyRow, PageHeader, SectionTitle } from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { bob } from "@/lib/format";
import { cupoById } from "@/lib/selectors";

export function Transfer() {
  const { cupoId } = useParams();
  const offers = useAppStore((state) => state.offers);
  const requestTransfer = useAppStore((state) => state.requestTransfer);
  const found = cupoById(offers, cupoId);
  const [price, setPrice] = useState(found ? String(found.cupo.priceBob) : "");

  if (!found) {
    return (
      <EmptyState
        icon={Compass}
        title="No encontramos ese cupo"
        description="Vuelve a Mis cupos para elegir el cupo que quieres ceder."
        action={
          <Button asChild>
            <Link to="/mis-cupos">Ver Mis cupos</Link>
          </Button>
        }
      />
    );
  }

  const { offer, cupo } = found;
  const released = ["liberada", "en_curso"].includes(offer.status);
  const canTransfer =
    cupo.status === "emitido" ||
    cupo.status === "activado" ||
    (cupo.status === "en_garantia" && released);
  const commission = Math.round(Number(price || 0) * 0.025 * 100) / 100;
  const net = Math.round((Number(price || 0) - commission) * 100) / 100;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Ceder mi cupo"
        subtitle="Si ya no vas a usar tu cupo, otra persona puede ocuparlo con la aprobación del negocio."
        back="/mis-cupos"
      />

      {!canTransfer ? (
        <InfoNote tone="warn" icon={Info}>
          Este cupo todavía está en garantía y el grupo no se completó. Para cederlo primero hay que
          liberar la garantía; mientras tanto puedes cancelar la reserva y recibir el reembolso
          completo.
        </InfoNote>
      ) : (
        <>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[14.5px] font-semibold text-ink">{offer.business}</p>
                  <p className="text-[12px] text-muted-foreground">
                    {cupo.label} · pagaste {bob(cupo.priceBob)}
                  </p>
                </div>
                <Badge variant="soft">
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  Cupo liberado
                </Badge>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label htmlFor="price">Precio de cesión (Bs)</Label>
                <Input
                  id="price"
                  inputMode="numeric"
                  value={price}
                  onChange={(event) => setPrice(event.target.value.replace(/\D/g, ""))}
                />
                <p className="text-[11.5px] text-muted-foreground">
                  El precio no puede superar el original ({bob(cupo.priceBob)}) para evitar
                  especulación.
                </p>
              </div>

              <div className="mt-4">
                <MoneyRow label="Precio publicado" value={bob(Number(price || 0))} />
                <MoneyRow
                  label="Comisión de cesión (2,5%)"
                  hint="La paga quien cede, no quien compra"
                  value={`− ${bob(commission)}`}
                />
                <MoneyRow label="Recibirías" value={bob(net)} strong />
              </div>

              <Button
                className="mt-4 w-full"
                disabled={Number(price) <= 0 || Number(price) > cupo.priceBob}
                onClick={() => {
                  requestTransfer(cupo.id, Number(price));
                  toast.success("Cupo publicado en cesión", {
                    description: "El negocio debe aprobar la cesión antes de que alguien lo compre.",
                  });
                }}
              >
                <Repeat2 className="size-4" aria-hidden="true" />
                Publicar mi cupo
              </Button>
            </CardContent>
          </Card>

          {cupo.transfer && (
            <Card className="border-gold/25 bg-gold-soft/50">
              <CardContent className="p-4">
                <p className="flex items-center gap-2 text-[13.5px] font-semibold text-warn">
                  <Repeat2 className="size-4" aria-hidden="true" />
                  Publicación {cupo.transfer.status === "en_revision" ? "en revisión" : cupo.transfer.status}
                </p>
                <p className="mt-1 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
                  Publicaste el cupo por {bob(cupo.transfer.priceBob)}. El negocio revisa la
                  solicitud: puede aprobarla o rechazarla según sus reglas de uso.
                </p>
              </CardContent>
            </Card>
          )}

          <div>
            <SectionTitle>Cómo funciona la cesión</SectionTitle>
            <ol className="space-y-2">
              {[
                "Publicas tu cupo con un precio igual o menor al original.",
                "El negocio revisa y aprueba la cesión. Si rechaza, el cupo sigue siendo tuyo.",
                "Otra persona paga el cupo. El pago entra a la garantía o se libera según la oferta.",
                "Cuando se confirma, el código cambia de titular y recibes tu monto menos la comisión.",
              ].map((item, index) => (
                <li key={item} className="flex gap-3 rounded-xl border border-border/80 bg-card p-3.5">
                  <span className="num flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[12px] font-semibold text-brand-deep">
                    {index + 1}
                  </span>
                  <p className="text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
                    {item}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <InfoNote tone="neutral" icon={Users}>
            Recuerda: un cupo ya liberado no tiene reembolso automático. La cesión es la vía prevista
            por las reglas del modelo y siempre necesita aprobación del negocio.
          </InfoNote>
        </>
      )}

      <Button variant="outline" className="w-full" asChild>
        <Link to="/mis-cupos">Volver a Mis cupos</Link>
      </Button>
    </div>
  );
}
