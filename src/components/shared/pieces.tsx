import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Info, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function PageHeader({
  title,
  subtitle,
  back,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        {back && (
          <Link
            to={back}
            className="mb-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Volver
          </Link>
        )}
        <h1 className="text-balance text-[26px] leading-[1.15]">{title}</h1>
        {subtitle && (
          <p className="mt-1.5 max-w-2xl text-pretty text-[13.5px] leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </header>
  );
}

export function SectionTitle({
  children,
  hint,
  className,
}: {
  children: React.ReactNode;
  hint?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 flex items-end justify-between gap-3", className)}>
      <h2 className="text-[17px] leading-tight">{children}</h2>
      {hint && <span className="text-[12.5px] text-muted-foreground">{hint}</span>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: LucideIcon;
  tone?: "default" | "brand" | "gold";
  className?: string;
}) {
  const tones = {
    default: "bg-card border-border/80",
    brand: "bg-brand-soft border-brand/30",
    gold: "bg-gold-soft border-gold/25",
  } as const;
  const iconTones = {
    default: "bg-secondary text-muted-foreground",
    brand: "bg-brand/15 text-brand",
    gold: "bg-gold/15 text-gold",
  } as const;
  return (
    <div className={cn("rounded-2xl border p-4", tones[tone], className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        {Icon && (
          <span className={cn("flex size-8 items-center justify-center rounded-lg", iconTones[tone])}>
            <Icon className="size-4" aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="num mt-3 font-display text-[24px] leading-none text-ink">{value}</div>
      {hint && <p className="mt-2 text-[12.5px] leading-snug text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function InfoNote({
  children,
  tone = "info",
  icon: Icon = Info,
  className,
}: {
  children: React.ReactNode;
  tone?: "info" | "warn" | "success" | "danger" | "neutral";
  icon?: LucideIcon;
  className?: string;
}) {
  const tones = {
    info: "bg-info-soft/70 text-info border-info/25",
    warn: "bg-warn-soft text-warn border-gold/25",
    success: "bg-success-soft text-success border-success/25",
    danger: "bg-danger-soft text-danger border-danger/25",
    neutral: "bg-secondary/70 text-muted-foreground border-border",
  } as const;
  return (
    <div className={cn("flex gap-2.5 rounded-xl border px-3.5 py-3 text-[12.5px] leading-relaxed", tones[tone], className)}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="text-pretty">{children}</div>
    </div>
  );
}

export function MoneyRow({
  label,
  value,
  hint,
  strong,
  tone,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
  strong?: boolean;
  tone?: "default" | "success" | "danger";
  className?: string;
}) {
  const tones = {
    default: "text-ink",
    success: "text-success",
    danger: "text-danger",
  } as const;
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 py-2",
        strong && "border-t border-border/80 pt-3",
        className,
      )}
    >
      <div className="min-w-0">
        <div className={cn("text-[13.5px]", strong ? "font-semibold text-ink" : "text-muted-foreground")}>
          {label}
        </div>
        {hint && <div className="mt-0.5 text-[11.5px] leading-snug text-muted-foreground/90">{hint}</div>}
      </div>
      <div
        className={cn(
          "num shrink-0 text-right",
          strong ? "font-display text-[19px]" : "text-[13.5px] font-medium",
          tones[tone ?? "default"],
        )}
      >
        {value}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/60 px-6 py-10 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-muted-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="font-display text-[17px] text-ink">{title}</p>
        <p className="mx-auto mt-1 max-w-sm text-pretty text-[13px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

export function DemoNote({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-start gap-1.5 text-[11.5px] leading-relaxed text-muted-foreground", className)}>
      <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-brand/70" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export function DemoTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-dashed border-gold/30 bg-gold-soft px-3.5 py-3 text-[12.5px] leading-relaxed text-warn">
      <Badge variant="gold" className="mt-0.5 shrink-0">
        Tip
      </Badge>
      <span className="text-pretty">{children}</span>
    </div>
  );
}

export function Chip({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "brand" | "gold";
  className?: string;
}) {
  const tones = {
    neutral: "bg-secondary/80 text-muted-foreground",
    brand: "bg-brand-soft text-brand-deep",
    gold: "bg-gold-soft text-warn",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
