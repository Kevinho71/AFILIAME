import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  ArrowLeftRight,
  BadgeCheck,
  BarChart3,
  CircleDollarSign,
  LayoutDashboard,
  LogOut,
  QrCode,
  ScanLine,
  Settings,
  Tag,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { BUSINESS } from "@/lib/data";
import { bob, usdc } from "@/lib/format";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/panel", label: "Panel", icon: LayoutDashboard, end: true },
  { to: "/panel/ofertas", label: "Ofertas", icon: Tag },
  { to: "/panel/billetera", label: "Billetera", icon: Wallet },
  { to: "/panel/validar", label: "Validar acceso", icon: ScanLine },
  { to: "/panel/reportes", label: "Reportes", icon: BarChart3 },
  { to: "/panel/configuracion", label: "Configuración", icon: Settings },
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
        <div className="flex items-center gap-2.5 px-1">
          <span className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <CircleDollarSign className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-[14px] font-bold leading-tight tracking-[0.16em]">
              AFÍLIAME
            </p>
            <p className="text-[11px] text-white/55">Panel de negocio</p>
          </div>
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

      <div className="min-w-0 flex-1 pb-24 md:pb-0">
        <header className="sticky top-0 z-30 border-b border-border/80 bg-paper/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <p className="truncate font-display text-[17px] leading-tight">{BUSINESS.name}</p>
              <p className="truncate text-[11.5px] text-muted-foreground">
                {BUSINESS.city} · NIT {BUSINESS.nit}
              </p>
            </div>
            <Badge variant="soft" className="ml-auto hidden shrink-0 sm:inline-flex">
              <Wallet className="size-3.5" aria-hidden="true" />
              {usdc(walletUsdc)}
            </Badge>
            <Button asChild size="sm" variant="outline" className="shrink-0 md:hidden">
              <NavLink to="/panel/billetera">
                <Wallet className="size-4" aria-hidden="true" />
                Billetera
              </NavLink>
            </Button>
          </div>
          <nav
            aria-label="Menú del comercio (móvil)"
            className="scrollbar-thin flex gap-1 overflow-x-auto border-t border-border/70 px-3 py-2 md:hidden"
          >
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/70 text-muted-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="mx-auto max-w-[1200px] px-4 py-5 sm:px-6 sm:py-7">
          <Outlet />
        </main>
      </div>

      <div className="fixed bottom-4 right-4 z-30 md:hidden">
        <Button asChild size="sm" variant="outline" className="shadow-lg">
          <NavLink to="/panel/validar">
            <QrCode className="size-4" aria-hidden="true" />
            Validar
          </NavLink>
        </Button>
      </div>
    </div>
  );
}
