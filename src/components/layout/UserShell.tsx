import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Bell, CircleUser, Compass, LayoutList, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/shared/BrandLogo";
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
    <div className="min-h-dvh bg-paper pb-24 md:pb-10">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] items-center gap-4 px-4 py-3 sm:px-6">
          <Link to="/explorar" className="inline-flex items-center">
            <BrandLogo className="h-8 w-auto sm:h-9" />
          </Link>

          <nav
            aria-label="Navegación principal"
            className="ml-4 hidden items-center gap-1 md:flex"
          >
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "relative inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[13.5px] font-medium transition-colors",
                      isActive
                        ? "bg-brand-soft text-brand"
                        : "text-muted-foreground hover:bg-secondary/70 hover:text-ink",
                    )
                  }
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {item.label}
                  {item.to === "/avisos" && unread > 0 && (
                    <span className="size-2 rounded-full bg-gold" aria-label="Avisos sin leer" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-2.5 sm:flex">
              <Avatar className="size-8">
                <AvatarFallback>{initials(USER.name)}</AvatarFallback>
              </Avatar>
              <div className="leading-tight">
                <p className="text-[12.5px] font-semibold text-ink">{USER.name}</p>
                <p className="text-[11px] text-muted-foreground">Cliente · {USER.city}</p>
              </div>
            </div>
            <Button asChild size="sm" variant="outline" className="hidden md:inline-flex">
              <Link to="/?login=1">Cambiar de cuenta</Link>
            </Button>
            <Button
              asChild
              size="icon-sm"
              variant="ghost"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <Link to="/">
                <LogOut className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 lg:py-8">
        <Outlet />
      </main>

      <nav
        aria-label="Navegación principal (móvil)"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-card/95 backdrop-blur md:hidden"
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
                      isActive ? "text-brand" : "text-muted-foreground hover:text-ink",
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
