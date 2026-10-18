import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BadgePlus,
  CircleSlash,
  Copy,
  MoreHorizontal,
  PauseCircle,
  Play,
  Plus,
  Settings2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CuposProgress } from "@/components/shared/CuposProgress";
import { OfferStatusPill } from "@/components/shared/status";
import { EmptyState, PageHeader, StatCard } from "@/components/shared/pieces";
import { useAppStore, escrowOf } from "@/store/useAppStore";
import { bob, usdc } from "@/lib/format";
import { available, merchantOffers, paidCount } from "@/lib/selectors";
import type { Offer } from "@/lib/types";

export function Offers() {
  const offers = useAppStore((state) => state.offers);
  const rate = useAppStore((state) => state.rate);
  const setOfferStatus = useAppStore((state) => state.setOfferStatus);
  const [closing, setClosing] = useState<Offer | null>(null);
  const mine = merchantOffers(offers);

  const inEscrow = mine.reduce((total, offer) => total + escrowOf(offer), 0);
  const filled = mine.reduce((total, offer) => total + paidCount(offer), 0);
  const openOffers = mine.filter((offer) => available(offer) > 0 && offer.status !== "pausada");

  const pauseOrResume = (offer: Offer) => {
    if (offer.status === "pausada") {
      setOfferStatus(offer.id, "llenandose");
      toast.success("Oferta reanudada");
    } else {
      setOfferStatus(offer.id, "pausada");
      toast.info("Oferta pausada", {
        description: "No recibe nuevos cupos mientras esté pausada.",
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Mis ofertas"
        subtitle="Todas tus anualidades divididas en cupos, con su estado y el dinero en garantía."
        action={
          <Button asChild>
            <Link to="/panel/ofertas/nueva">
              <Plus className="size-4" aria-hidden="true" />
              Crear oferta
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Ofertas publicadas" value={String(mine.length)} hint="Incluye cerradas y pausadas" icon={BadgePlus} />
        <StatCard label="Cupos pagados" value={String(filled)} hint="Clientes que ya entraron a un grupo" icon={Settings2} />
        <StatCard
          label="En garantía"
          value={usdc(inEscrow)}
          hint={`≈ ${bob(inEscrow * rate)} por liberar`}
          tone="gold"
          className="col-span-2 sm:col-span-1"
        />
      </div>

      {openOffers.length > 0 && (
        <p className="text-[12.5px] text-muted-foreground">
          {openOffers.length} {openOffers.length === 1 ? "oferta sigue" : "ofertas siguen"} juntando
          cupos.
        </p>
      )}

      {mine.length === 0 ? (
        <EmptyState
          icon={BadgePlus}
          title="Todavía no publicaste ofertas"
          description="Crea tu primera anualidad dividida en cupos y define el plazo para completar el grupo."
          action={
            <Button asChild>
              <Link to="/panel/ofertas/nueva">Crear oferta</Link>
            </Button>
          }
        />
      ) : (
        <>
          {/* Escritorio: tabla */}
          <Card className="hidden md:block">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Oferta</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Llenado</TableHead>
                    <TableHead>Cierra</TableHead>
                    <TableHead className="text-right">En garantía</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mine.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell>
                        <p className="text-[13.5px] font-medium text-ink">{offer.title}</p>
                        <p className="text-[11.5px] text-muted-foreground">
                          {offer.cupos.length} cupos de {bob(offer.cupos[0].priceBob)} · {offer.business}
                        </p>
                      </TableCell>
                      <TableCell>
                        <OfferStatusPill status={offer.status} />
                      </TableCell>
                      <TableCell className="min-w-[160px]">
                        <CuposProgress offer={offer} showLabel={false} />
                        <p className="mt-1.5 text-[11.5px] text-muted-foreground">
                          {paidCount(offer)}/{offer.cupos.length} llenos · {available(offer)} libres
                        </p>
                      </TableCell>
                      <TableCell className="num text-[12.5px] text-muted-foreground">
                        {offer.deadline.split("-").reverse().join("/")}
                      </TableCell>
                      <TableCell className="num text-right text-[13px]">
                        {usdc(escrowOf(offer))}
                        <span className="block text-[11px] text-muted-foreground">
                          {bob(escrowOf(offer) * rate)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          <Button asChild size="sm" variant="outline">
                            <Link to={`/panel/ofertas/${offer.id}`}>
                              <MoreHorizontal className="size-3.5" aria-hidden="true" />
                              Gestionar
                            </Link>
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            aria-label={`Duplicar ${offer.title}`}
                            onClick={() =>
                              toast.success("Oferta duplicada", {
                                description: "Se creó un borrador con los mismos datos.",
                              })
                            }
                          >
                            <Copy className="size-3.5" aria-hidden="true" />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            aria-label={`${offer.status === "pausada" ? "Reanudar" : "Pausar"} ${offer.title}`}
                            disabled={["reembolsada", "finalizada"].includes(offer.status)}
                            onClick={() => pauseOrResume(offer)}
                          >
                            {offer.status === "pausada" ? (
                              <Play className="size-3.5" aria-hidden="true" />
                            ) : (
                              <PauseCircle className="size-3.5" aria-hidden="true" />
                            )}
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            aria-label={`Cerrar ${offer.title}`}
                            disabled={["reembolsada", "finalizada"].includes(offer.status)}
                            onClick={() => setClosing(offer)}
                          >
                            <CircleSlash className="size-3.5" aria-hidden="true" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Móvil: tarjetas */}
          <div className="space-y-3 md:hidden">
            {mine.map((offer) => (
              <Card key={offer.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-ink">{offer.title}</p>
                      <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                        {offer.cupos.length} cupos de {bob(offer.cupos[0].priceBob)}
                      </p>
                    </div>
                    <OfferStatusPill status={offer.status} />
                  </div>

                  <div className="mt-3">
                    <CuposProgress offer={offer} showLabel={false} />
                    <p className="mt-1.5 text-[11.5px] text-muted-foreground">
                      {paidCount(offer)}/{offer.cupos.length} llenos · {available(offer)} libres
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-paper-deep/50 px-3 py-2.5 text-[12px] text-muted-foreground">
                    <span className="num">Cierra {offer.deadline.split("-").reverse().join("/")}</span>
                    <span className="num font-medium text-ink">
                      {usdc(escrowOf(offer))} <span className="text-muted-foreground">en garantía</span>
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Button asChild size="sm" variant="outline" className="flex-1">
                      <Link to={`/panel/ofertas/${offer.id}`}>Gestionar</Link>
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Duplicar ${offer.title}`}
                      onClick={() => toast.success("Oferta duplicada")}
                    >
                      <Copy className="size-3.5" aria-hidden="true" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`${offer.status === "pausada" ? "Reanudar" : "Pausar"} ${offer.title}`}
                      disabled={["reembolsada", "finalizada"].includes(offer.status)}
                      onClick={() => pauseOrResume(offer)}
                    >
                      {offer.status === "pausada" ? (
                        <Play className="size-3.5" aria-hidden="true" />
                      ) : (
                        <PauseCircle className="size-3.5" aria-hidden="true" />
                      )}
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Cerrar ${offer.title}`}
                      disabled={["reembolsada", "finalizada"].includes(offer.status)}
                      onClick={() => setClosing(offer)}
                    >
                      <CircleSlash className="size-3.5" aria-hidden="true" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <div className="rounded-2xl border border-dashed border-border bg-card/60 p-4">
        <p className="text-[13px] font-medium text-ink">Estados de una oferta</p>
        <p className="mt-1 text-pretty text-[12px] leading-relaxed text-muted-foreground">
          Borrador → Publicada → Llenándose → Completa → Liberada → En curso → Finalizada. Si el plazo
          vence sin completarse, pasa a Vencida y luego a Reembolsada.
        </p>
      </div>

      <Dialog open={Boolean(closing)} onOpenChange={(open) => !open && setClosing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cerrar la oferta</DialogTitle>
            <DialogDescription>
              Cerrar una oferta con cupos pagados devuelve el dinero a todas las personas y afecta tu
              reputación.
            </DialogDescription>
          </DialogHeader>

          {closing && (
            <div className="space-y-2 rounded-xl border border-border/80 bg-paper-deep/50 p-3.5 text-[12.5px] leading-relaxed text-muted-foreground">
              <p>
                <span className="font-medium text-ink">{closing.title}</span> tiene{" "}
                {paidCount(closing)} cupos pagados ({usdc(escrowOf(closing))} en garantía).
              </p>
              <ul className="space-y-1">
                <li>• Todos los usuarios reciben reembolso total a su medio de pago original.</li>
                <li>
                  • Si la garantía ya se liberó, corresponde una penalización del 10% del monto
                  liberado y una incidencia en tu reputación.
                </li>
                <li>• Los cupos disponibles desaparecen del feed inmediatamente.</li>
              </ul>
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setClosing(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (closing) {
                  setOfferStatus(closing.id, "reembolsada");
                  toast.warning("Oferta cerrada", {
                    description: "Los pagos en garantía se devuelven a su origen.",
                  });
                }
                setClosing(null);
              }}
            >
              Cerrar oferta y reembolsar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Badge variant="outline" className="mx-auto flex w-fit">
        1 USDC =  {bob(rate)}
      </Badge>
    </div>
  );
}
