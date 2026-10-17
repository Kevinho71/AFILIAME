import { Link, useParams } from "react-router-dom";
import {
  BadgeCheck,
  CalendarPlus,
  Compass,
  DoorOpen,
  Flag,
  Info,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PassCard } from "@/components/shared/PassCard";
import { DemoTip, EmptyState, InfoNote, PageHeader, SectionTitle } from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { bob, shortDate } from "@/lib/format";
import { cupoById } from "@/lib/selectors";

function buildIcs(offerTitle: string, location: string, start: string, end: string) {
  const stamp = (iso: string) => `${iso.replace(/-/g, "")}T090000`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Afiliame//ES",
    "BEGIN:VEVENT",
    `SUMMARY:Cupo ${offerTitle}`,
    `LOCATION:${location}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    "DESCRIPTION:Cupo reservado en Afíliame.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function Pass() {
  const { cupoId } = useParams();
  const offers = useAppStore((state) => state.offers);
  const found = cupoById(offers, cupoId);

  if (!found) {
    return (
      <EmptyState
        icon={Compass}
        title="No encontramos ese pase"
        description="Vuelve a Mis cupos para ver tus pases disponibles."
        action={
          <Button asChild>
            <Link to="/mis-cupos">Ver Mis cupos</Link>
          </Button>
        }
      />
    );
  }

  const { offer, cupo } = found;
  const issued = ["liberada", "en_curso"].includes(offer.status) || cupo.status === "activo";
  const active = cupo.status === "activo";

  const download = () => {
    const blob = new Blob([buildIcs(offer.title, offer.address, cupo.start, cupo.end)], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cupo-${offer.id}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Evento descargado", { description: "Se agregó el periodo de tu cupo al calendario." });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={active ? "Acceso listo" : issued ? "Pase emitido" : "Tu cupo reservado"}
        subtitle={`${offer.business} · ${cupo.label}`}
        back="/mis-cupos"
      />

      {issued && (
        <Card className="relative overflow-hidden border-success/25 bg-success-soft/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <span className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-success text-primary-foreground">
                <Sparkles className="size-6" aria-hidden="true" />
                <span className="absolute inset-0 animate-ping rounded-full bg-success/30" />
              </span>
              <div>
                <p className="font-display text-[18px] leading-tight">Grupo completo</p>
                <p className="text-[12.5px] text-muted-foreground">
                  La garantía se liberó al negocio y tu pase está {active ? "activo" : "emitido"}.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <PassCard offer={offer} cupo={cupo} />

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button className="flex-1" onClick={download}>
          <CalendarPlus className="size-4" aria-hidden="true" />
          Añadir al calendario
        </Button>
        <Button variant="outline" asChild>
          <Link to={`/garantia/${offer.id}`}>
            <ShieldCheck className="size-4" aria-hidden="true" />
            Ver garantía
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={`/comprobante/${cupo.id}`}>Comprobante</Link>
        </Button>
      </div>

      <div>
        <SectionTitle>Cómo entrar</SectionTitle>
        <div className="space-y-2">
          {[
            { icon: DoorOpen, title: "Muestra el QR en recepción", body: "El validador lo escanea y confirma que estás habilitado." },
            { icon: BadgeCheck, title: "Pase nominal", body: `El pase está a nombre de ${cupo.participant?.name ?? "el beneficiario"}.` },
            { icon: MapPin, title: "Ubicación y horario", body: `${offer.address} · ${offer.hours}` },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex gap-3 rounded-xl border border-border/80 bg-card p-3.5">
                <Icon className="mt-0.5 size-4 shrink-0 text-brand/70" aria-hidden="true" />
                <div>
                  <p className="text-[13.5px] font-medium text-ink">{item.title}</p>
                  <p className="text-pretty text-[12px] leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!active && (
        <InfoNote tone="info" icon={Info}>
          Tu periodo empieza el {shortDate(cupo.start)}. El pase se activa solo ese día; puedes
          mostrarlo igual para verificar tus datos.
        </InfoNote>
      )}

      <div className="rounded-2xl border border-border/80 bg-card p-4">
        <p className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
          <Flag className="size-4 text-warn" aria-hidden="true" />
          ¿El negocio no abre o no presta el servicio?
        </p>
        <p className="mt-1 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
          Puedes abrir una disputa desde Perfil. La plataforma reembolsa los periodos no prestados y
          puede retener la liberación de los periodos pendientes.
        </p>
        <Button variant="outline" size="sm" className="mt-3" asChild>
          <Link to="/perfil">Reportar un problema</Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">Cupo pagado {bob(cupo.priceBob)}</Badge>
        <Badge variant="outline">Periodo {cupo.label}</Badge>
        <Badge variant="soft">Pase digital</Badge>
      </div>

      <DemoTip>
        Muestra este pase en recepción desde el primer día de tu periodo.
      </DemoTip>
    </div>
  );
}
