import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CircleSlash,
  Coins,
  Compass,
  MessageCircle,
  PauseCircle,
  ShieldCheck,
  Shuffle,
  TriangleAlert,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { CuposProgress } from "@/components/shared/CuposProgress";
import { CupoStatusPill, OfferStatusPill } from "@/components/shared/status";
import { DemoNote, EmptyState, InfoNote, PageHeader, SectionTitle, StatCard } from "@/components/shared/pieces";
import { useAppStore, escrowOf, PLATFORM_FEE } from "@/store/useAppStore";
import { bob, initials, shortDate, usdc } from "@/lib/format";
import { offerById, paidCount, available } from "@/lib/selectors";

export function OfferManage() {
  const { offerId } = useParams();
  const offers = useAppStore((state) => state.offers);
  const rate = useAppStore((state) => state.rate);
  const setOfferStatus = useAppStore((state) => state.setOfferStatus);
  const setActiveOffer = useAppStore((state) => state.setActiveOffer);
  const [cancelOpen, setCancelOpen] = useState(false);
  const offer = offerById(offers, offerId);

  if (!offer) {
    return (
      <EmptyState
        icon={Compass}
        title="No encontramos esa oferta"
        description="Vuelve a tu lista de ofertas para gestionar tus anualidades."
        action={
          <Button asChild>
            <Link to="/panel/ofertas">Ver Mis ofertas</Link>
          </Button>
        }
      />
    );
  }

  const escrow = escrowOf(offer);
  const fee = Math.round(escrow * PLATFORM_FEE * 100) / 100;
  const timeline = [
    { date: shortDate(offer.createdAt), label: "Oferta publicada" },
    ...offer.cupos
      .filter((cupo) => cupo.paidAt)
      .map((cupo) => ({
        date: cupo.paidAt as string,
        label: `Cupo ${cupo.label} pagado por ${cupo.participant?.name ?? "un cliente"}`,
      })),
    ...(offer.releasedAt
      ? [{ date: offer.releasedAt, label: "Garantía liberada a tu billetera" }]
      : [{ date: shortDate(offer.deadline), label: "Fecha límite para completar el grupo" }]),
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title={offer.title}
        subtitle={`${offer.business} · ${offer.cupos.length} cupos de ${bob(offer.cupos[0].priceBob)}`}
        back="/panel/ofertas"
        action={<OfferStatusPill status={offer.status} />}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Progreso"
          value={`${paidCount(offer)}/${offer.cupos.length}`}
          hint={`${available(offer)} cupos libres`}
          icon={Users}
        />
        <StatCard
          label="En garantía"
          value={usdc(escrow)}
          hint={`≈ ${bob(escrow * rate)}`}
          icon={ShieldCheck}
          tone="gold"
        />
        <StatCard
          label="Cierre del grupo"
          value={shortDate(offer.deadline)}
          hint={offer.releasedAt ? `Liberada el ${offer.releasedAt}` : "Reembolso si no se completa"}
          icon={CalendarClock}
        />
        <StatCard
          label={`Comisión (${Math.round(PLATFORM_FEE * 100)}%)`}
          value={usdc(fee)}
          hint={`Recibirías ${usdc(Math.round((escrow - fee) * 100) / 100)} al liberar`}
          icon={Coins}
        />
      </div>

      <Card>
        <CardContent className="p-4">
          <CuposProgress offer={offer} tone={available(offer) === 0 ? "success" : "brand"} />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Mensaje enviado a los participantes")}
            >
              <MessageCircle className="size-3.5" aria-hidden="true" />
              Contactar a todos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveOffer(offer.id)}
            >
              Poner esta oferta en foco
            </Button>
            {offer.status === "pausada" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOfferStatus(offer.id, "llenandose");
                  toast.success("Oferta reanudada");
                }}
              >
                <PauseCircle className="size-3.5" aria-hidden="true" />
                Reanudar
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled={["reembolsada", "finalizada"].includes(offer.status)}
                onClick={() => {
                  setOfferStatus(offer.id, "pausada");
                  toast.info("Oferta pausada");
                }}
              >
                <PauseCircle className="size-3.5" aria-hidden="true" />
                Pausar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-danger hover:bg-danger-soft"
              disabled={["reembolsada", "finalizada"].includes(offer.status)}
              onClick={() => setCancelOpen(true)}
            >
              <CircleSlash className="size-3.5" aria-hidden="true" />
              Cancelar oferta
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <SectionTitle hint={`${paidCount(offer)} de ${offer.cupos.length} pagados`}>
            Participantes
          </SectionTitle>
          <div className="space-y-2.5">
            {offer.cupos.map((cupo) => (
              <Card key={cupo.id}>
                <CardContent className="flex flex-wrap items-center gap-3 p-4">
                  <Avatar className="size-10">
                    <AvatarFallback>
                      {cupo.participant ? initials(cupo.participant.name) : "—"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-semibold text-ink">
                      {cupo.participant?.name ?? "Cupo disponible"}
                    </p>
                    <p className="text-[11.5px] text-muted-foreground">
                      {cupo.label} · {shortDate(cupo.start)} al {shortDate(cupo.end)}
                    </p>
                    {cupo.participant && (
                      <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <BadgeCheck className="size-3.5 text-brand/70" aria-hidden="true" />
                        Identidad verificada
                        {cupo.paidAt ? ` · pagó el ${cupo.paidAt}` : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <CupoStatusPill status={cupo.status} />
                    {cupo.participant && (
                      <>
                        <Button
                          size="icon-sm"
                          variant="outline"
                          aria-label={`Contactar a ${cupo.participant.name}`}
                          onClick={() => toast.success(`Mensaje enviado a ${cupo.participant?.name}`)}
                        >
                          <MessageCircle className="size-3.5" aria-hidden="true" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="outline"
                          aria-label={`Reasignar cupo de ${cupo.participant.name}`}
                          onClick={() =>
                            toast.info("Reasignación solicitada", {
                              description:
                                "El beneficiario debe confirmar antes de cambiar el nombre del pase.",
                            })
                          }
                        >
                          <Shuffle className="size-3.5" aria-hidden="true" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <SectionTitle>Línea de tiempo</SectionTitle>
          <Card>
            <CardContent className="p-4">
              <ol className="space-y-3">
                {timeline.map((event, index) => (
                  <li key={`${event.date}-${index}`} className="flex gap-3">
                    <span className="mt-1 flex flex-col items-center">
                      <span className="size-2.5 rounded-full bg-brand" aria-hidden="true" />
                      {index < timeline.length - 1 && <span className="mt-1 h-full w-px bg-border" />}
                    </span>
                    <div className="pb-1">
                      <p className="text-[12.5px] font-medium text-ink">{event.label}</p>
                      <p className="num text-[11.5px] text-muted-foreground">{event.date}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <InfoNote tone="neutral" className="mt-4" icon={TriangleAlert}>
            Si cancelas una oferta llena: reembolso total a los usuarios, penalización del 10% del
            monto liberado e incidencia en tu reputación.
          </InfoNote>

          <DemoNote className="mt-3">
            Si el plazo vence sin completar el grupo, el reembolso se ejecuta automáticamente para cada cupo pagado.
          </DemoNote>

          <Button asChild variant="outline" className="mt-4 w-full">
            <Link to="/panel/billetera">
              Ir a la billetera
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar la oferta</DialogTitle>
            <DialogDescription>
              Esta acción desiste del grupo completo. Revisa las consecuencias antes de continuar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5 rounded-xl border border-border/80 bg-paper-deep/50 p-3.5 text-[12.5px] leading-relaxed text-muted-foreground">
            <p>• {paidCount(offer)} usuarios reciben reembolso total ({usdc(escrow)} en garantía).</p>
            <p>• La oferta desaparece del feed y no se pueden vender más cupos.</p>
            <p>• Queda registrada una incidencia en tu reputación.</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCancelOpen(false)}>
              Volver
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setOfferStatus(offer.id, "reembolsada");
                setCancelOpen(false);
                toast.warning("Oferta cancelada", {
                  description: "Los reembolsos se procesan a cada usuario.",
                });
              }}
            >
              Confirmar cancelación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Separator />
    </div>
  );
}
