import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  ArrowLeftRight,
  BadgeCheck,
  BarChart3,
  LayoutDashboard,
  LogOut,
  ScanLine,
  Settings,
  Tag,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { useAppStore } from "@/store/useAppStore";
import { BUSINESS } from "@/lib/data";
import { bob, usdc } from "@/lib/format";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/panel", label: "Panel", icon: LayoutDashboard, end: true },
  { to: "/panel/ofertas", label: "Ofertas", icon: Tag },
  { to: "/panel/billetera", label: "Billetera", icon: Wallet },
  { to: "/panel/validar", label: "Activar cupo", icon: ScanLine },
  { to: "/panel/reportes", label: "Reportes", icon: BarChart3 },
  { to: "/panel/configuracion", label: "Configuración", icon: Settings },
];

// Navegación inferior (móvil): solo las pestañas más importantes, estilo Takenos.
const MOBILE_NAV = [
  { to: "/panel", label: "Panel", icon: LayoutDashboard, end: true },
  { to: "/panel/ofertas", label: "Ofertas", icon: Tag },
  { to: "/panel/validar", label: "Activar", icon: ScanLine, primary: true },
  { to: "/panel/billetera", label: "Billetera", icon: Wallet },
  { to: "/panel/reportes", label: "Reportes", icon: BarChart3 },
];

export function MerchantShell() {
  const setRole = useAppStore((state) => state.setRole);
  const walletUsdc = useAppStore((state) => state.walletUsdc);
  const rate = useAppStore((state) => state.rate);
  const location = useLocation();

  useEffect(() => {
    setRole("merchant");
  }, [setRole]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="min-h-dvh bg-paper-deep md:flex">
      <aside className="hidden w-[264px] shrink-0 flex-col bg-sidebar px-4 py-5 text-sidebar-foreground md:flex">
        <div className="px-1">
          <BrandLogo className="h-9 w-auto" />
          <p className="mt-1 text-[11px] text-white/55">Panel de negocio</p>
        </div>

        <nav aria-label="Menú del comercio" className="mt-7 flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-white/65 hover:bg-sidebar-accent/60 hover:text-white",
                  )
                }
              >
                <Icon className="size-4.5" aria-hidden="true" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-6 rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-3.5">
          <p className="text-[11px] uppercase tracking-wide text-white/50">Saldo disponible</p>
          <p className="num mt-1.5 font-display text-xl">{usdc(walletUsdc)}</p>
          <p className="text-[11.5px] text-white/60">≈ {bob(walletUsdc * rate)}</p>
          <Button asChild variant="gold" size="sm" className="mt-3 w-full">
            <NavLink to="/panel/billetera">Ver billetera</NavLink>
          </Button>
        </div>

        <div className="mt-4 flex items-center gap-2 px-1 text-[11.5px] text-white/60">
          <BadgeCheck className="size-3.5 text-sidebar-primary" aria-hidden="true" />
          {BUSINESS.owner} · negocio verificado
        </div>

        <div className="mt-3 flex flex-col gap-1.5">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full justify-center border-sidebar-border bg-sidebar-accent/60 text-white/80 hover:bg-sidebar-accent hover:text-white"
          >
            <NavLink to="/?login=1">
              <ArrowLeftRight className="size-3.5" aria-hidden="true" />
              Cambiar de cuenta
            </NavLink>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="w-full justify-center text-white/70 hover:bg-sidebar-accent/60 hover:text-white"
          >
            <NavLink to="/">
              <LogOut className="size-3.5" aria-hidden="true" />
              Salir
            </NavLink>
          </Button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 pb-28 md:pb-0">
        <header className="sticky top-0 z-30 border-b border-border/80 bg-paper/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1200px] items-center gap-2 px-4 py-2.5 sm:gap-3 sm:px-6 sm:py-3">
            <div className="min-w-0">
              <p className="truncate font-display text-[16px] leading-tight sm:text-[17px]">
                {BUSINESS.name}
              </p>
              <p className="truncate text-[11px] text-muted-foreground sm:text-[11.5px]">
                {BUSINESS.city} · NIT {BUSINESS.nit}
              </p>
            </div>
            <Badge variant="soft" className="ml-auto hidden shrink-0 sm:inline-flex">
              <Wallet className="size-3.5" aria-hidden="true" />
              {usdc(walletUsdc)}
            </Badge>
            <Button
              asChild
              size="icon-sm"
              variant="outline"
              className="shrink-0 md:hidden"
              aria-label="Cambiar de cuenta"
            >
              <NavLink to="/?login=1">
                <ArrowLeftRight className="size-4" aria-hidden="true" />
              </NavLink>
            </Button>
            <Button
              asChild
              size="icon-sm"
              variant="outline"
              className="shrink-0 md:hidden"
              aria-label="Configuración"
            >
              <NavLink to="/panel/configuracion">
                <Settings className="size-4" aria-hidden="true" />
              </NavLink>
            </Button>
            <Button
              asChild
              size="icon-sm"
              variant="ghost"
              className="shrink-0 text-danger hover:bg-danger-soft md:hidden"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <NavLink to="/">
                <LogOut className="size-4" aria-hidden="true" />
              </NavLink>
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6 sm:py-7">
          <Outlet />
        </main>
      </div>

      <nav
        aria-label="Menú del comercio (móvil)"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-card/95 backdrop-blur md:hidden"
      >
        <ul className="mx-auto grid max-w-[560px] grid-cols-5 px-1 pb-[env(safe-area-inset-bottom)]">
          {MOBILE_NAV.map((item) => {
            const Icon = item.icon;
            if (item.primary) {
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "relative flex min-h-[64px] flex-col items-center justify-end gap-1 px-2 pb-2 text-[10.5px] font-semibold",
                        isActive ? "text-brand" : "text-muted-foreground",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={cn(
                            "absolute -top-4 flex size-14 items-center justify-center rounded-full border-4 border-card shadow-[0_8px_24px_-8px_rgba(52,227,155,0.6)] transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-ink",
                          )}
                        >
                          <Icon className="size-6" aria-hidden="true" />
                        </span>
                        {item.label}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            }
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "relative flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[10.5px] font-medium transition-colors",
                      isActive ? "text-brand" : "text-muted-foreground hover:text-ink",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={cn("size-5", isActive && "stroke-[2.2]")} aria-hidden="true" />
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
