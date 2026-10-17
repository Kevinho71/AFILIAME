import { HandCoins, Lock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function GuaranteeSteps({ compact = false }: { compact?: boolean }) {
  const steps = [
    {
      icon: Lock,
      title: "Pagas tu parte",
      body: "Tu pago queda guardado en una garantía. No llega al negocio todavía.",
    },
    {
      icon: ShieldCheck,
      title: "Esperamos al grupo",
      body: "Si se completan los cupos antes del plazo, el negocio recibe todo junto.",
    },
    {
      icon: HandCoins,
      title: "O te devolvemos",
      body: "Si el grupo no se completa, el reembolso vuelve solo a tu cuenta de origen.",
    },
  ];

  return (
    <ol className={cn("grid gap-3", compact ? "sm:grid-cols-3" : "sm:grid-cols-3")}>
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <li
            key={step.title}
            className="relative rounded-xl border border-border/80 bg-card p-4"
          >
            <span className="num absolute right-3 top-3 text-[11px] font-semibold text-muted-foreground/60">
              Paso {index + 1}
            </span>
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand-soft text-brand-deep">
              <Icon className="size-4.5" aria-hidden="true" />
            </span>
            <p className="mt-3 text-[14px] font-semibold text-ink">{step.title}</p>
            <p className="mt-1 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
              {step.body}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
