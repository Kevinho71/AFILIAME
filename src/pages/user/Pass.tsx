import { Link, useParams } from "react-router-dom";
import {
  BadgeCheck,
  CalendarPlus,
  Compass,
  DoorOpen,
  Flag,
  Info,
  MapPin,
  ScanLine,
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
import { hasPeriod } from "@/lib/usage";

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
        title="No encontramos ese código"
        description="Vuelve a Mis cupos para ver tus códigos de activación disponibles."
        action={
          <Button asChild>
            <Link to="/mis-cupos">Ver Mis cupos</Link>
          </Button>
        }
      />
    );
  }

  const { offer, cupo } = found;
  const activated = cupo.status === "activado";
  const ready = cupo.status === "emitido";

  const download = () => {
    const from = hasPeriod(offer, cupo) && cupo.start ? cupo.start : offer.validFrom;
    const to = hasPeriod(offer, cupo) && cupo.end ? cupo.end : offer.validTo;
    const blob = new Blob([buildIcs(offer.title, offer.address, from, to)], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cupo-${offer.id}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Evento descargado", {
      description: hasPeriod(offer, cupo)
        ? "Se agregó el periodo de tu cupo al calendario."
        : "Se agregó la vigencia de tu anualidad al calendario.",
    });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={activated ? "Cupo activado" : ready ? "Tu código de activación" : "Tu cupo reservado"}
        subtitle={`${offer.business} · ${cupo.label}`}
        back="/mis-cupos"
      />

      {activated ? (
        <Card className="relative overflow-hidden border-success/25 bg-success-soft/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-success text-primary-foreground">
                <BadgeCheck className="size-6" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-[18px] leading-tight">Cupo activado</p>
                <p className="text-[12.5px] text-muted-foreground">
                  El negocio te inscribió en su sistema. Entra como te indique.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : ready ? (
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
                  La garantía se liberó al negocio y tu código de activación está listo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

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
        <SectionTitle>{activated ? "Qué sigue" : "Cómo activar tu cupo"}</SectionTitle>
        <div className="space-y-2">
          {activated ? (
            <>
              {[
                { icon: BadgeCheck, title: "Ya estás inscrito", body: `El negocio te registró con su propio método (huella, tarjeta, lista…).` },
                { icon: DoorOpen, title: "Entra como te indique", body: `A partir de ahora usas el sistema del negocio, no la app.` },
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
            </>
          ) : (
            <>
              {[
                { icon: DoorOpen, title: "Ve al negocio", body: "La primera vez que vayas, muestra el código en recepción." },
                { icon: ScanLine, title: "El negocio lo escanea", body: "Confirma que eres la persona que pagó, viendo tu nombre e identidad verificada." },
                { icon: BadgeCheck, title: "Queda inutilizable", body: `El código se usa una sola vez y el negocio te inscribe con su propio sistema.` },
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
            </>
          )}
        </div>
      </div>

      {ready && offer.usage === "exclusivo" && cupo.start && (
        <InfoNote tone="info" icon={Info}>
          Tu periodo empieza el {shortDate(cupo.start)}. Puedes activar tu cupo desde ese día en
          recepción.
        </InfoNote>
      )}

      {ready && offer.usage !== "exclusivo" && (
        <InfoNote tone="info" icon={Info}>
          Activa tu cupo en recepción cuando empieces a ir. Es un código de un solo uso: después
          entras con el sistema del negocio.
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
        <Badge variant="outline">{cupo.label}</Badge>
        <Badge variant="soft">{activated ? "Cupo activado" : "Código de activación"}</Badge>
      </div>

      <DemoTip>
        {activated
          ? "Este cupo ya fue activado por el negocio. Entra con el sistema del negocio."
          : "Muestra este código una sola vez en recepción cuando empieces a ir."}
      </DemoTip>
    </div>
  );
}
