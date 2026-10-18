import { Link } from "react-router-dom";
import {
  Bell,
  BellRing,
  CheckCheck,
  CircleAlert,
  Info,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState, PageHeader } from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/lib/types";

const TONE = {
  info: { icon: Info, className: "bg-info-soft text-info" },
  success: { icon: ShieldCheck, className: "bg-success-soft text-success" },
  warn: { icon: CircleAlert, className: "bg-warn-soft text-warn" },
  danger: { icon: RotateCcw, className: "bg-danger-soft text-danger" },
} as const;

function NoticeItem({ item }: { item: AppNotification }) {
  const tone = TONE[item.tone];
  const Icon = tone.icon;
  const body = (
    <Card className={cn("transition-colors hover:border-brand/35", !item.read && "border-brand/30 bg-brand-soft/25")}>
      <CardContent className="flex gap-3 p-4">
        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", tone.className)}>
          <Icon className="size-4.5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <div className="flex items-start gap-2">
            <p className="text-[13.5px] font-semibold text-ink">{item.title}</p>
            {!item.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-gold" aria-label="Sin leer" />}
          </div>
          <p className="mt-1 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
            {item.body}
          </p>
          <p className="mt-1.5 text-[11px] text-muted-foreground/90">{item.date}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (item.href) {
    return (
      <Link to={item.href} className="block">
        {body}
      </Link>
    );
  }
  return body;
}

export function Notices() {
  const notifications = useAppStore((state) => state.notifications);
  const markRead = useAppStore((state) => state.markNotificationsRead);
  const unread = notifications.filter((item) => !item.read).length;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Avisos"
        subtitle="Todo lo que pasa con tus cupos: reservas, grupos completos, activaciones y reembolsos."
        action={
          <Badge variant={unread > 0 ? "gold" : "muted"}>
            <BellRing className="size-3.5" aria-hidden="true" />
            {unread} sin leer
          </Badge>
        }
      />

      {unread > 0 && (
        <Button variant="outline" size="sm" onClick={markRead}>
          <CheckCheck className="size-4" aria-hidden="true" />
          Marcar todo como leído
        </Button>
      )}

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Sin avisos por ahora"
          description="Cuando reserves un cupo o se complete un grupo, te avisamos aquí."
        />
      ) : (
        <div className="space-y-2.5">
          {notifications.map((item) => (
            <NoticeItem key={item.id} item={item} />
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-dashed border-border bg-card/60 p-4 text-[11.5px] leading-relaxed text-muted-foreground">
        También puedes recibir los avisos por correo, SMS y WhatsApp desde la configuración de tu cuenta.
      </div>
    </div>
  );
}
