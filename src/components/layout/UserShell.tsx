import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ArrowLeftRight, Bell, CircleUser, Compass, LayoutList } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { USER } from "@/lib/data";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/explorar", label: "Explorar", icon: Compass },
  { to: "/mis-cupos", label: "Mis cupos", icon: LayoutList },
  { to: "/avisos", label: "Avisos", icon: Bell },
  { to: "/perfil", label: "Perfil", icon: CircleUser },
];

export function UserShell() {
  const setRole = useAppStore((state) => state.setRole);
  const unread = useAppStore((state) => state.notifications.filter((item) => !item.read).length);
  const location = useLocation();

  useEffect(() => {
    setRole("user");
  }, [setRole]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="min-h-dvh bg-paper-deep pb-24 md:pb-10">
      <div className="mx-auto flex w-full max-w-[560px] flex-col px-0 md:px-4 md:pt-6">
        <div className="overflow-hidden border-border/80 bg-paper md:rounded-3xl md:border md:shadow-[0_24px_60px_-40px_rgba(0,0,0,0.7)]">
          <div className="flex items-center gap-3 border-b border-border/70 bg-card/80 px-4 py-3 backdrop-blur">
            <span className="font-display text-[15px] font-bold tracking-[0.16em] text-ink">
              AFÍLIAME
            </span>
            <Avatar className="size-8">
              <AvatarFallback>{initials(USER.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-ink">{USER.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {USER.city} · identidad verificada
              </p>
            </div>
            <Badge variant="soft" className="ml-auto shrink-0">
              Cliente
            </Badge>
          </div>
          <div className="px-4 py-4 sm:px-5">
            <Outlet />
          </div>
        </div>

        <div className="mt-4 hidden items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/70 px-4 py-3 md:flex">
          <p className="text-[11.5px] leading-relaxed text-muted-foreground">
            Estás en la app de clientes. Para entrar al panel de tu negocio, cambia de cuenta.
          </p>
          <Button asChild size="sm" variant="outline">
            <Link to="/?login=1">
              <ArrowLeftRight className="size-3.5" aria-hidden="true" />
              Cambiar de cuenta
            </Link>
          </Button>
        </div>
      </div>

      <nav
        aria-label="Navegación principal"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-card/95 backdrop-blur md:left-1/2 md:max-w-[560px] md:-translate-x-1/2 md:rounded-t-3xl md:border-x"
      >
        <ul className="mx-auto grid max-w-[560px] grid-cols-4 px-1 pb-[env(safe-area-inset-bottom)]">
          {NAV.map((item) => {
            const Icon = item.icon;
            const showDot = item.to === "/avisos" && unread > 0;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "relative flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground hover:text-ink",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative">
                        <Icon className={cn("size-5", isActive && "stroke-[2.2]")} aria-hidden="true" />
                        {showDot && (
                          <span className="absolute -right-1 -top-1 size-2 rounded-full bg-gold ring-2 ring-card" />
                        )}
                      </span>
                      {item.label}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
