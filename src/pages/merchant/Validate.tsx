import { useState } from "react";
import {
  BadgeCheck,
  CalendarX,
  CircleSlash,
  Clock,
  QrCode,
  ScanLine,
  Search,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QrFrame } from "@/components/shared/QrFrame";
import { EmptyState, InfoNote, PageHeader, SectionTitle } from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { initials } from "@/lib/format";
import { merchantOffers } from "@/lib/selectors";
import { cn } from "@/lib/utils";
import type { Cupo, Offer } from "@/lib/types";

type Result = "valido" | "fuera_periodo" | "no_habilitado";

interface Visit {
  id: string;
  name: string;
  business: string;
  time: string;
  result: Result;
}

const RESULT_META: Record<Result, { label: string; tone: "success" | "warn" | "danger"; icon: typeof BadgeCheck; note: string }> = {
  valido: {
    label: "Válido · puede ingresar",
    tone: "success",
    icon: BadgeCheck,
    note: "El pase está activo y dentro de su periodo. Registra el ingreso.",
  },
  fuera_periodo: {
    label: "Fuera de periodo",
    tone: "warn",
    icon: CalendarX,
    note: "El cupo pertenece a otro periodo. No corresponde el ingreso hoy.",
  },
  no_habilitado: {
    label: "No habilitado",
    tone: "danger",
    icon: CircleSlash,
    note: "El pago no está en garantía ni el cupo fue liberado.",
  },
};

function evaluate(offer: Offer, cupo: Cupo): Result {
  if (cupo.status === "activo") return "valido";
  if (cupo.status === "en_garantia" && ["liberada", "en_curso"].includes(offer.status)) return "valido";
  if (cupo.status === "en_garantia" || cupo.status === "finalizado") return "fuera_periodo";
  return "no_habilitado";
}

export function Validate() {
  const offers = useAppStore((state) => state.offers);
  const [query, setQuery] = useState("");
  const [current, setCurrent] = useState<{ offer: Offer; cupo: Cupo } | null>(null);
  const [log, setLog] = useState<Visit[]>([
    { id: "v1", name: "Andrea Rojas", business: "Gimnasio PowerFit", time: "Hoy · 08:12", result: "fuera_periodo" },
    { id: "v2", name: "Jorge Salinas", business: "Parqueo Central", time: "Ayer · 19:40", result: "no_habilitado" },
    { id: "v3", name: "Ana Gutiérrez", business: "Parqueo Central", time: "Ayer · 07:05", result: "no_habilitado" },
  ]);

  const candidates = merchantOffers(offers).flatMap((offer) =>
    offer.cupos
      .filter((cupo) => cupo.participant)
      .map((cupo) => ({ offer, cupo })),
  );

  const visible = candidates.filter(({ cupo, offer }) => {
    const term = query.trim().toLowerCase();
    if (!term) return true;
    return (
      (cupo.participant?.name ?? "").toLowerCase().includes(term) ||
      offer.business.toLowerCase().includes(term) ||
      cupo.id.toLowerCase().includes(term)
    );
  });

  const validate = (item: { offer: Offer; cupo: Cupo }) => {
    setCurrent(item);
    const result = evaluate(item.offer, item.cupo);
    setLog((entries) => [
      {
        id: `v-${Date.now()}`,
        name: item.cupo.participant?.name ?? "Sin nombre",
        business: item.offer.business,
        time: "Ahora",
        result,
      },
      ...entries,
    ]);
    if (result === "valido") {
      toast.success(RESULT_META[result].label, { description: item.cupo.participant?.name ?? "" });
    } else if (result === "fuera_periodo") {
      toast.warning(RESULT_META[result].label, { description: item.cupo.participant?.name ?? "" });
    } else {
      toast.error(RESULT_META[result].label, { description: item.cupo.participant?.name ?? "" });
    }
  };

  const result = current ? evaluate(current.offer, current.cupo) : null;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Validar acceso"
        subtitle="Vista de recepción: escanea el pase o busca por nombre. Solo muestra si la persona está habilitada."
        action={
          <Badge variant="soft">
            <ScanLine className="size-3.5" aria-hidden="true" />
            Sub-rol Validador
          </Badge>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <SectionTitle>Buscar un pase</SectionTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Nombre del beneficiario o negocio"
                className="pl-9"
                aria-label="Buscar pase por nombre"
              />
            </div>

            <Button
              variant="outline"
              className="mt-3 w-full"
              onClick={() => toast.info("Selecciona un pase de la lista para validarlo")}
            >
              <QrCode className="size-4" aria-hidden="true" />
              Escanear pase con la cámara
            </Button>

            <div className="mt-4 space-y-2">
              {visible.length === 0 ? (
                <EmptyState
                  icon={ScanLine}
                  title="Sin resultados"
                  description="No encontramos pases con ese nombre. Prueba con otro beneficiario o revisa la lista completa."
                />
              ) : (
                visible.map(({ offer, cupo }) => (
                  <button
                    key={cupo.id}
                    type="button"
                    onClick={() => validate({ offer, cupo })}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors",
                      current?.cupo.id === cupo.id
                        ? "border-primary bg-brand-soft/50"
                        : "border-border/80 bg-card hover:bg-secondary/40",
                    )}
                  >
                    <Avatar className="size-9">
                      <AvatarFallback>{initials(cupo.participant?.name ?? "??")}</AvatarFallback>
                    </Avatar>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-medium text-ink">
                        {cupo.participant?.name}
                      </span>
                      <span className="block text-[11.5px] text-muted-foreground">
                        {offer.business} · {cupo.label}
                      </span>
                    </span>
                    <Badge variant="outline" className="shrink-0 font-mono text-[10.5px]">
                      {cupo.id.toUpperCase()}
                    </Badge>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {!current || !result ? (
            <Card>
              <CardContent className="p-5">
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-paper-deep/50 px-5 py-10 text-center">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                    <ScanLine className="size-7" aria-hidden="true" />
                  </span>
                  <p className="font-display text-[17px]">Esperando un pase</p>
                  <p className="max-w-xs text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
                    Escanea el QR del beneficiario o elige un pase de la lista para ver su estado.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card
              className={cn(
                "border-2",
                result === "valido"
                  ? "border-success/25 bg-success-soft/40"
                  : result === "fuera_periodo"
                    ? "border-gold/25 bg-warn-soft/50"
                    : "border-danger/25 bg-danger-soft/40",
              )}
            >
              <CardContent className="p-5">
                {(() => {
                  const meta = RESULT_META[result];
                  const Icon = meta.icon;
                  return (
                    <>
                      <div className="flex items-start gap-3">
                        <span
                          className={cn(
                            "flex size-12 shrink-0 items-center justify-center rounded-full",
                            result === "valido"
                              ? "bg-success text-primary-foreground"
                              : result === "fuera_periodo"
                                ? "bg-gold text-[#2b1e00]"
                                : "bg-danger text-[#2b0a06]",
                          )}
                        >
                          <Icon className="size-6" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="font-display text-[19px] leading-tight">{meta.label}</p>
                          <p className="text-[12.5px] text-muted-foreground">
                            {current.cupo.participant?.name} · {current.offer.business}
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
                        {meta.note}
                      </p>

                      <Separator className="my-4" />

                      <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
                        <QrFrame
                          value={`PASE-AF|${current.offer.id}|${current.cupo.id}|${current.cupo.participant?.name}`}
                          size={104}
                          caption="Pase verificado"
                        />
                        <div className="space-y-2 text-[12.5px] text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <ShieldCheck className="size-3.5 text-brand/70" aria-hidden="true" />
                            Cupo {current.cupo.id.toUpperCase()} · {current.cupo.label}
                          </p>
                          <p className="flex items-center gap-2">
                            <Clock className="size-3.5 text-brand/70" aria-hidden="true" />
                            {current.offer.hours}
                          </p>
                          <p className="flex items-center gap-2">
                            <BadgeCheck className="size-3.5 text-brand/70" aria-hidden="true" />
                            Identidad verificada
                          </p>
                        </div>
                      </div>

                      {result === "valido" && (
                        <Button
                          className="mt-4 w-full"
                          onClick={() => toast.success("Ingreso registrado", { description: `${current.cupo.participant?.name} ingresó.` })}
                        >
                          Registrar ingreso
                        </Button>
                      )}
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          <InfoNote tone="neutral" icon={ShieldCheck}>
            El rol Validador solo puede escanear pases y consultar si un beneficiario está habilitado.
            No ve montos, ni saldos, ni datos bancarios.
          </InfoNote>
        </div>
      </div>

      <div>
        <SectionTitle hint="Últimos 3 registros de hoy">Registro de visitas</SectionTitle>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Beneficiario</TableHead>
                  <TableHead>Negocio</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Resultado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {log.slice(0, 8).map((visit) => {
                  const meta = RESULT_META[visit.result];
                  const Icon = meta.icon;
                  return (
                    <TableRow key={visit.id}>
                      <TableCell className="text-[13px] font-medium text-ink">{visit.name}</TableCell>
                      <TableCell className="text-[12.5px] text-muted-foreground">{visit.business}</TableCell>
                      <TableCell className="text-[12.5px] text-muted-foreground">{visit.time}</TableCell>
                      <TableCell>
                        <Badge variant={meta.tone}>
                          <Icon className="size-3.5" aria-hidden="true" />
                          {meta.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
