import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  CalendarCheck,
  Flag,
  Gauge,
  ListChecks,
  LogIn,
  RefreshCcw,
  Repeat,
  ShieldCheck,
  Sparkles,
  UserPlus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store/useAppStore";
import { offerById } from "@/lib/selectors";
import { bob } from "@/lib/format";
import { cn } from "@/lib/utils";

export function DemoPanel() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const offers = useAppStore((state) => state.offers);
  const rate = useAppStore((state) => state.rate);
  const role = useAppStore((state) => state.role);
  const activeOfferId = useAppStore((state) => state.activeOfferId);
  const fillOneCupo = useAppStore((state) => state.fillOneCupo);
  const fillAllCupos = useAppStore((state) => state.fillAllCupos);
  const advanceToDeadline = useAppStore((state) => state.advanceToDeadline);
  const cycleRate = useAppStore((state) => state.cycleRate);
  const startPeriod = useAppStore((state) => state.startPeriod);
  const reset = useAppStore((state) => state.reset);

  const offer = offerById(offers, activeOfferId);
  const availableCupos = offer?.cupos.filter((cupo) => cupo.status === "disponible").length ?? 0;

  const action = (
    icon: typeof Sparkles,
    label: string,
    hint: string,
    onClick: () => void,
    disabled?: boolean,
  ) => {
    const Icon = icon;
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "flex w-full cursor-pointer items-start gap-2.5 rounded-xl border border-transparent px-2.5 py-2 text-left transition-colors hover:border-brand/25 hover:bg-brand-soft/60",
          disabled && "cursor-not-allowed opacity-45 hover:border-transparent hover:bg-transparent",
        )}
      >
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-[13px] font-medium text-ink">{label}</span>
          <span className="block text-[11px] leading-snug text-muted-foreground">{hint}</span>
        </span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-20 right-3 z-50 flex flex-col items-end gap-2 md:bottom-6 md:right-6">
      {open && (
        <div className="w-[320px] overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_60px_-25px_rgba(0,0,0,0.75)]">
          <div className="flex items-center gap-2 border-b border-border/80 bg-brand-soft/70 px-3.5 py-3">
            <Gauge className="size-4 text-brand" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-ink">Panel de control</p>
              <p className="truncate text-[11px] text-muted-foreground">
                Oferta en foco: {offer?.business ?? "—"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ml-auto cursor-pointer rounded-lg p-1 text-muted-foreground transition-colors hover:bg-brand/15 hover:text-ink"
              aria-label="Cerrar panel de control"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="scrollbar-thin max-h-[62vh] overflow-y-auto p-2">
            <p className="px-2.5 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Simular eventos
            </p>
            {action(
              UserPlus,
              "Llenar un cupo",
              availableCupos > 0
                ? `Quedan ${availableCupos} cupos libres en ${offer?.business}`
                : "No quedan cupos disponibles en la oferta en foco",
              () => {
                const result = offer ? fillOneCupo(offer.id) : null;
                if (!result) {
                  toast.info("No quedan cupos disponibles en esta oferta");
                  return;
                }
                if (result.released) {
                  toast.success(`Grupo completo en ${offer?.business}`, {
                    description: "La garantía se liberó al negocio y los pases están listos.",
                  });
                } else {
                  toast.success(`${result.name} pagó su cupo`, {
                    description: "El pago entró a la garantía. El grupo sigue llenándose.",
                  });
                }
              },
              availableCupos === 0,
            )}
            {action(
              ListChecks,
              "Llenar todos los cupos",
              "Completa el grupo y libera la garantía",
              () => {
                if (!offer) return;
                const result = fillAllCupos(offer.id);
                if (result.filled === 0) {
                  toast.info("Esta oferta no tiene cupos libres");
                  return;
                }
                toast.success(`Grupo completo en ${offer.business}`, {
                  description: result.released
                    ? "La garantía se liberó al negocio (menos la comisión del 3%)."
                    : "Los cupos se completaron.",
                });
              },
              availableCupos === 0,
            )}
            {action(
              Flag,
              "Avanzar hasta el vencimiento",
              "Las ofertas sin completar se reembolsan",
              () => {
                const result = advanceToDeadline();
                toast.warning(`Venció el plazo en ${result.expired.length} ofertas`, {
                  description: result.refundedMine
                    ? `Reembolso automático de ${bob(result.refundedMine)} a los usuarios.`
                    : "Se devolvió cada pago a su origen, sin cargo.",
                });
              },
            )}
            {action(
              CalendarCheck,
              "Iniciar el periodo",
              "Activa los pases de la oferta en foco",
              () => {
                if (!offer) return;
                const started = startPeriod(offer.id);
                if (started) {
                  toast.success(`Periodo en curso en ${offer.business}`);
                } else {
                  toast.info("La oferta debe estar llena y liberada para iniciar el periodo");
                }
              },
            )}
            <Separator className="my-2" />
            {action(
              RefreshCcw,
              "Cambiar tasa de cambio",
              `Ahora: 1 USDC = Bs ${rate}`,
              () => {
                const next = cycleRate();
                toast.info(`Nueva tasa: 1 USDC = Bs ${next}`, {
                  description: "Los pagos ya realizados mantienen su tasa fija.",
                });
              },
            )}
            {action(
              Repeat,
              "Cambiar de cuenta",
              `Sesión actual: ${role === "user" ? "cliente" : "negocio"}`,
              () => navigate("/?login=1"),
            )}
            {action(RefreshCcw, "Reiniciar datos", "Vuelve al estado inicial del recorrido", () => {
              if (!window.confirm("¿Reiniciar todos los datos del recorrido?")) return;
              reset();
              navigate("/explorar");
              toast.success("Datos reiniciados");
            })}
            <Separator className="my-2" />
            <p className="px-2.5 pb-1 pt-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Atajos
            </p>
            <div className="flex flex-wrap gap-1.5 px-2.5 pb-2 pt-1">
              <Button size="sm" variant="outline" onClick={() => navigate(`/oferta/${activeOfferId}`)}>
                Oferta en foco
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate(`/garantia/${activeOfferId}`)}>
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Ver garantía
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate("/panel/billetera")}>
                Billetera
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate("/panel/billetera/pagar-qr")}>
                Pagar QR
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link to="/?login=1">
                  <LogIn className="size-3.5" aria-hidden="true" />
                  Cambiar de cuenta
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-brand/35 bg-card/95 py-2.5 pl-3 pr-4 text-[12.5px] font-semibold text-brand shadow-[0_0_26px_-8px_rgba(52,227,155,0.55)] backdrop-blur transition-colors hover:bg-brand/10"
      >
        <Sparkles className="size-4" aria-hidden="true" />
        {open ? "Ocultar panel" : "Panel de control"}
      </button>
    </div>
  );
}
