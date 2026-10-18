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
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { EmptyState, InfoNote, PageHeader, SectionTitle } from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { initials, shortDate } from "@/lib/format";
import { merchantOffers } from "@/lib/selectors";
import { cn } from "@/lib/utils";
import type { Cupo, Offer } from "@/lib/types";

type Result = "por_activar" | "ya_activado" | "fuera_periodo" | "no_habilitado";

interface Activation {
  id: string;
  name: string;
  business: string;
  time: string;
  result: Result;
}

const RESULT_META: Record<Result, { label: string; tone: "success" | "warn" | "danger" | "info"; icon: typeof BadgeCheck; note: string }> = {
  por_activar: {
    label: "Listo para activar",
    tone: "info",
    icon: QrCode,
    note: "Verifica que la persona coincida con el titular y el carnet. Al confirmar, el código se quema y el cliente queda inscrito.",
  },
  ya_activado: {
    label: "Ya activado",
    tone: "success",
    icon: BadgeCheck,
    note: "Este cupo ya fue activado. El beneficiario entra con el sistema de acceso del negocio.",
  },
  fuera_periodo: {
    label: "Cupo vencido",
    tone: "warn",
    icon: CalendarX,
    note: "El ciclo de este cupo ya terminó: ya no se puede activar.",
  },
  no_habilitado: {
    label: "No habilitado",
    tone: "danger",
    icon: CircleSlash,
    note: "El pago sigue protegido: el grupo todavía no se completa o el cupo no está habilitado para activarse.",
  },
};

function evaluate(offer: Offer, cupo: Cupo): Result {
  if (cupo.status === "activado") return "ya_activado";
  if (cupo.status === "emitido") return "por_activar";
  if (cupo.status === "en_garantia" && ["liberada", "en_curso"].includes(offer.status)) return "por_activar";
  if (cupo.status === "finalizado") return "fuera_periodo";
  return "no_habilitado";
}

export function Validate() {
  const offers = useAppStore((state) => state.offers);
  const activateCupo = useAppStore((state) => state.activateCupo);
  const [query, setQuery] = useState("");
  const [current, setCurrent] = useState<{ offer: Offer; cupo: Cupo } | null>(null);
  const [scanning, setScanning] = useState(false);
  const [log, setLog] = useState<Activation[]>([
    { id: "a1", name: "Andrea Rojas", business: "Gimnasio PowerFit", time: "Hoy · 08:12", result: "no_habilitado" },
    { id: "a2", name: "Diego Salazar", business: "Gimnasio PowerFit", time: "Ayer · 19:05", result: "fuera_periodo" },
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

  const select = (item: { offer: Offer; cupo: Cupo }) => {
    setCurrent(item);
    setScanning(false);
  };

  const scanCode = () => {
    if (scanning) return;
    setScanning(true);
    window.setTimeout(() => {
      const pending =
        candidates.find(({ offer, cupo }) => evaluate(offer, cupo) === "por_activar") ?? candidates[0];
      if (pending) {
        setCurrent(pending);
        toast.info("Código escaneado", {
          description: `${pending.cupo.participant?.name} · ${pending.offer.business}`,
        });
      } else {
        toast.info("No hay códigos para escanear");
      }
      setScanning(false);
    }, 900);
  };

  const confirmActivation = () => {
    if (!current) return;
    const result = evaluate(current.offer, current.cupo);
    if (result !== "por_activar") return;
    const ok = activateCupo(current.cupo.id);
    if (!ok) return;
    setLog((entries) => [
      {
        id: `a-${Date.now()}`,
        name: current.cupo.participant?.name ?? "Sin nombre",
        business: current.offer.business,
        time: "Ahora",
        result: "ya_activado",
      },
      ...entries,
    ]);
    setCurrent({
      offer: current.offer,
      cupo: { ...current.cupo, status: "activado" as const },
    });
    toast.success("Cupo activado", {
      description: `${current.cupo.participant?.name} quedó inscrito. El código ya no sirve.`,
    });
  };

  const result = current ? evaluate(current.offer, current.cupo) : null;

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        title="Activar cupo"
        subtitle="Vista de recepción: escanea el código de acceso único del beneficiario. Al confirmar, el código se quema y el cliente queda inscrito."
        action={
          <Badge variant="soft">
            <ScanLine className="size-3.5" aria-hidden="true" />
            Sub-rol Validador
          </Badge>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          {/* Escáner */}
          <Card>
            <CardContent className="p-4 sm:p-5">
              <SectionTitle>Escanear código de acceso</SectionTitle>
              <div
                className={cn(
                  "relative mx-auto flex aspect-[4/3] w-full max-w-[340px] flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-dashed bg-paper-deep/60",
                  scanning ? "border-brand/50" : "border-border",
                )}
              >
                {/* Guías de esquina */}
                <span className="absolute left-3 top-3 size-6 rounded-tl-lg border-l-2 border-t-2 border-brand" aria-hidden="true" />
                <span className="absolute right-3 top-3 size-6 rounded-tr-lg border-r-2 border-t-2 border-brand" aria-hidden="true" />
                <span className="absolute bottom-3 left-3 size-6 rounded-bl-lg border-b-2 border-l-2 border-brand" aria-hidden="true" />
                <span className="absolute bottom-3 right-3 size-6 rounded-br-lg border-b-2 border-r-2 border-brand" aria-hidden="true" />

                <QrCode className={cn("size-14 text-brand/80", scanning && "animate-pulse")} aria-hidden="true" />
                <p className="max-w-[220px] text-center text-[12px] leading-relaxed text-muted-foreground">
                  {scanning
                    ? "Leyendo el código…"
                    : "Apunta la cámara al código del beneficiario para verificar su acceso."}
                </p>
                {scanning && (
                  <span className="absolute inset-x-8 h-0.5 animate-pulse rounded-full bg-brand" aria-hidden="true" />
                )}
              </div>

              <Button className="mt-3 w-full" disabled={scanning} onClick={scanCode}>
                <ScanLine className="size-4" aria-hidden="true" />
                {scanning ? "Escaneando…" : "Escanear código"}
              </Button>
            </CardContent>
          </Card>

          {/* Búsqueda por nombre */}
          <Card>
            <CardContent className="p-4 sm:p-5">
              <SectionTitle hint="Sin cámara">Buscar por nombre</SectionTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Nombre del beneficiario o negocio"
                  className="pl-9"
                  aria-label="Buscar código por nombre"
                />
              </div>

              <div className="mt-3 space-y-2">
                {visible.length === 0 ? (
                  <EmptyState
                    icon={ScanLine}
                    title="Sin resultados"
                    description="No encontramos códigos con ese nombre. Prueba con otro beneficiario."
                  />
                ) : (
                  visible.map(({ offer, cupo }) => (
                    <button
                      key={cupo.id}
                      type="button"
                      onClick={() => select({ offer, cupo })}
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
        </div>

        <div className="space-y-4">
          {/* Resultado */}
          {!current || !result ? (
            <Card>
              <CardContent className="p-5">
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-paper-deep/50 px-5 py-10 text-center">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                    <ScanLine className="size-7" aria-hidden="true" />
                  </span>
                  <p className="font-display text-[17px]">Esperando un código</p>
                  <p className="max-w-xs text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
                    Escanea el código del beneficiario para verificar identidad y vigencia.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card
              className={cn(
                "border-2",
                result === "por_activar"
                  ? "border-brand/30 bg-brand-soft/40"
                  : result === "ya_activado"
                    ? "border-success/25 bg-success-soft/40"
                    : result === "fuera_periodo"
                      ? "border-gold/25 bg-warn-soft/50"
                      : "border-danger/25 bg-danger-soft/40",
              )}
            >
              <CardContent className="p-4 sm:p-5">
                {(() => {
                  const meta = RESULT_META[result];
                  const Icon = meta.icon;
                  return (
                    <>
                      <div className="flex items-start gap-3">
                        <span
                          className={cn(
                            "flex size-12 shrink-0 items-center justify-center rounded-full",
                            result === "por_activar"
                              ? "bg-brand text-primary-foreground"
                              : result === "ya_activado"
                                ? "bg-success text-primary-foreground"
                                : result === "fuera_periodo"
                                  ? "bg-gold text-[#2b1e00]"
                                  : "bg-danger text-[#2b0a06]",
                          )}
                        >
                          <Icon className="size-6" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="font-display text-[18px] leading-tight">{meta.label}</p>
                          <p className="text-[12.5px] text-muted-foreground">
                            {current.cupo.participant?.name} · {current.offer.business}
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
                        {meta.note}
                      </p>

                      <Separator className="my-3" />

                      <div className="space-y-2 text-[12.5px] text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <BadgeCheck className="size-3.5 text-brand/70" aria-hidden="true" />
                          Identidad verificada · compara con el carnet
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock className="size-3.5 text-brand/70" aria-hidden="true" />
                          Vigencia: {shortDate(current.offer.validFrom)} – {shortDate(current.offer.validTo)}
                        </p>
                        <p className="flex items-center gap-2">
                          <ShieldCheck className="size-3.5 text-brand/70" aria-hidden="true" />
                          Código {current.cupo.id.toUpperCase()} · {current.cupo.label}
                        </p>
                      </div>

                      {result === "por_activar" && (
                        <Button className="mt-4 w-full" onClick={confirmActivation}>
                          <Sparkles className="size-4" aria-hidden="true" />
                          Confirmar activación
                        </Button>
                      )}
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          <InfoNote tone="neutral" icon={ShieldCheck}>
            El código es de un solo uso: al confirmar, queda inutilizable y el beneficiario pasa a
            usar el sistema de acceso del negocio. No ves montos ni saldos.
          </InfoNote>

          {/* Registro */}
          <div>
            <SectionTitle hint="Últimos movimientos">Registro de activaciones</SectionTitle>
            <div className="space-y-2">
              {log.slice(0, 8).map((entry) => {
                const meta = RESULT_META[entry.result];
                const Icon = meta.icon;
                return (
                  <Card key={entry.id}>
                    <CardContent className="flex items-center gap-3 p-3.5">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-ink">{entry.name}</p>
                        <p className="text-[11.5px] text-muted-foreground">
                          {entry.business} · {entry.time}
                        </p>
                      </div>
                      <Badge variant={meta.tone} className="shrink-0">
                        {meta.label}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
