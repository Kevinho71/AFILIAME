import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CircleAlert,
  Coins,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CuposProgress } from "@/components/shared/CuposProgress";
import { OfferStatusPill } from "@/components/shared/status";
import { DemoNote, PageHeader, SectionTitle, StatCard } from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { BUSINESS } from "@/lib/data";
import { bob, num, pct, usdc } from "@/lib/format";
import { merchantOffers, paidCount, available, totalEscrow } from "@/lib/selectors";

const INCOME = [
  { mes: "Ene", monto: 0 },
  { mes: "Feb", monto: 0 },
  { mes: "Mar", monto: 900 },
  { mes: "Abr", monto: 1800 },
  { mes: "May", monto: 1800 },
  { mes: "Jun", monto: 1200 },
  { mes: "Jul", monto: 600 },
  { mes: "Ago", monto: 600 },
  { mes: "Sep", monto: 1746 },
  { mes: "Oct", monto: 1200 },
];

export function Dashboard() {
  const offers = useAppStore((state) => state.offers);
  const walletUsdc = useAppStore((state) => state.walletUsdc);
  const rate = useAppStore((state) => state.rate);
  const mine = merchantOffers(offers);
  const active = mine.filter((offer) => !["finalizada", "reembolsada"].includes(offer.status));
  const escrow = totalEscrow(mine);
  const clients = mine.reduce((total, offer) => total + paidCount(offer), 0);

  const pending = [
    {
      id: "p1",
      title: "Aprobar cesión de cupo",
      body: "Lucía Fernández quiere ceder su cupo de noviembre en PowerFit.",
      tone: "warn" as const,
      action: "Revisar",
    },
    {
      id: "p2",
      title: "Verificar identidad",
      body: "Jorge Salinas completó su documentación para Parqueo Central.",
      tone: "info" as const,
      action: "Verificar",
    },
    {
      id: "p3",
      title: "Grupo por cerrar",
      body: "Parqueo Central cierra mañana y todavía falta 1 cupo.",
      tone: "danger" as const,
      action: "Ver oferta",
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Hola, ${BUSINESS.owner.split(" ")[0]}`}
        subtitle="Tu panel del comercio: qué entró, qué está en garantía y qué falta resolver."
        action={
          <Button asChild>
            <Link to="/panel/ofertas/nueva">
              <UserPlus className="size-4" aria-hidden="true" />
              Crear oferta
            </Link>
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Saldo disponible"
          value={usdc(walletUsdc)}
          hint={`≈ ${bob(walletUsdc * rate)} · no genera intereses`}
          icon={Wallet}
          tone="brand"
        />
        <StatCard
          label="En garantía"
          value={usdc(escrow)}
          hint={`≈ ${bob(escrow * rate)} por liberar de tus grupos`}
          icon={ShieldCheck}
          tone="gold"
        />
        <StatCard
          label="Ofertas activas"
          value={num(active.length)}
          hint={`${mine.length} ofertas en total, incluidas las cerradas`}
          icon={CalendarClock}
        />
        <StatCard
          label="Clientes del mes"
          value={num(14)}
          hint={`${clients} cupos pagados en total · ${pct(64)} son nuevos`}
          icon={TrendingUp}
        />
      </div>

      <Card className="border-gold/25 bg-gold-soft/40">
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-gold/15 text-gold">
            <CircleAlert className="size-4.5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-semibold text-warn">
              Tu negocio está verificado y habilitado
            </p>
            <p className="text-[12px] leading-relaxed text-gold/90">
              Revisa el estado del registro, la cuenta bancaria de destino y la regla de recepción.
            </p>
          </div>
          <Button asChild size="sm" variant="gold">
            <Link to="/panel/verificacion">Ver verificación</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardContent className="p-4">
            <SectionTitle hint="Ingresos anticipados por liberación (Bs)">Llenado e ingresos</SectionTitle>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={INCOME} margin={{ top: 6, right: 6, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#22302b" vertical={false} />
                  <XAxis dataKey="mes" tickLine={false} axisLine={false} fontSize={11} stroke="#90a49a" />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="#90a49a" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #22302b",
                      fontSize: 12,
                      background: "#101917", color: "#e9f1ec",
                    }}
                    formatter={(value: number) => [bob(value), "Liberado"]}
                  />
                  <Bar dataKey="monto" fill="#34e39b" radius={[6, 6, 0, 0]} maxBarSize={34} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-[11.5px] leading-relaxed text-muted-foreground">
              Cada barra muestra el monto que se liberó a tu billetera cuando un grupo se completó.
              La anualidad se cobra completa por adelantado.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <SectionTitle hint={`${pending.length} pendientes`}>Acciones por resolver</SectionTitle>
            <div className="space-y-2.5">
              {pending.map((item) => (
                <div key={item.id} className="rounded-xl border border-border/80 p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13.5px] font-medium text-ink">{item.title}</p>
                    <Badge variant={item.tone}>
                      {item.tone === "danger" ? "Urgente" : item.tone === "warn" ? "Revisar" : "Nuevo"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{item.body}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2.5"
                    onClick={() => toast.success(`${item.action}: acción registrada`)}
                  >
                    {item.action}
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <SectionTitle
          hint={`En garantía: ${usdc(escrow)}`}
          className="mb-3"
        >
          Tus ofertas en curso
        </SectionTitle>
        <div className="grid gap-3 lg:grid-cols-2">
          {mine.map((offer) => (
            <Card key={offer.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-ink">{offer.title}</p>
                    <p className="truncate text-[11.5px] text-muted-foreground">
                      {offer.business} · cierra {offer.deadline.split("-").reverse().join("/")}
                    </p>
                  </div>
                  <OfferStatusPill status={offer.status} />
                </div>
                <div className="mt-3">
                  <CuposProgress offer={offer} />
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between gap-3 text-[12px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-3.5" aria-hidden="true" />
                    {paidCount(offer)} pagados · {available(offer)} libres
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Coins className="size-3.5" aria-hidden="true" />
                    {usdc(offer.cupos.reduce((sum, cupo) => sum + (cupo.escrowUsdc ?? 0), 0))} en garantía
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/panel/ofertas/${offer.id}`}>Gestionar</Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link to={`/panel/ofertas/${offer.id}`}>Ver participantes</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <p className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
            <BadgeCheck className="size-4 text-brand/70" aria-hidden="true" />
            Resumen del modelo de ingresos
          </p>
          <ul className="mt-2 space-y-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
            <li>• Comisión de plataforma del 3% descontada en la liberación (no la paga el cliente).</li>
            <li>• Cobras la anualidad completa por adelantado, sin esperar mes a mes.</li>
            <li>• Los cupos llenan capacidad ociosa y traen clientes que no comprarían el año entero.</li>
          </ul>
          <DemoNote className="mt-3">
            Las cifras del panel se calculan con los cupos pagados y las liberaciones de tus ofertas.
          </DemoNote>
        </CardContent>
      </Card>
    </div>
  );
}
