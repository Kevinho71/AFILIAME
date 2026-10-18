import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BadgePlus,
  Clock,
  Coins,
  Percent,
  RotateCcw,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DemoNote, PageHeader, SectionTitle, StatCard } from "@/components/shared/pieces";
import { OfferStatusPill } from "@/components/shared/status";
import { useAppStore } from "@/store/useAppStore";
import { bob, num, pct, usdc } from "@/lib/format";
import { available, merchantOffers, paidCount } from "@/lib/selectors";

const INCOME = [
  { mes: "Mar", liberado: 900 },
  { mes: "Abr", liberado: 1800 },
  { mes: "May", liberado: 1800 },
  { mes: "Jun", liberado: 1200 },
  { mes: "Jul", liberado: 600 },
  { mes: "Ago", liberado: 600 },
  { mes: "Sep", liberado: 1746 },
  { mes: "Oct", liberado: 1200 },
];

const CLIENTS = [
  { name: "Clientes nuevos", value: 64 },
  { name: "Clientes habituales", value: 36 },
];

const COLORS = ["#34e39b", "#ffc861"];

export function Reports() {
  const offers = useAppStore((state) => state.offers);
  const rate = useAppStore((state) => state.rate);
  const mine = merchantOffers(offers);

  const fillData = mine.map((offer) => ({
    name: offer.title.length > 22 ? `${offer.title.slice(0, 20)}…` : offer.title,
    llenos: paidCount(offer),
    libres: available(offer),
  }));

  const revenue = INCOME.reduce((total, row) => total + row.liberado, 0);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reportes"
        subtitle="Cómo se están llenando tus ofertas, cuánto cobraste por adelantado y cuántos clientes nuevos llegaron."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Ingresos anticipados"
          value={bob(revenue)}
          hint={`≈ ${usdc(revenue / rate)} liberados en el periodo`}
          icon={Coins}
          tone="brand"
        />
        <StatCard
          label="Tiempo promedio de llenado"
          value="6,4 días"
          hint="Desde la publicación hasta el último cupo pagado"
          icon={Clock}
        />
        <StatCard
          label="Clientes nuevos"
          value={pct(64)}
          hint="Del total de cupos pagados en el mes"
          icon={Users}
        />
        <StatCard
          label="Tasa de reembolso"
          value={pct(11)}
          hint="Ofertas que vencieron sin completar el grupo"
          icon={RotateCcw}
          tone="gold"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardContent className="p-4">
            <SectionTitle hint="Cupos llenos y libres por oferta">Llenado por oferta</SectionTitle>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fillData} margin={{ top: 6, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#22302b" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} stroke="#90a49a" />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="#90a49a" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #22302b", fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#90a49a" }} />
                  <Bar dataKey="llenos" name="Cupos pagados" stackId="a" fill="#34e39b" radius={[0, 0, 0, 0]} maxBarSize={38} />
                  <Bar dataKey="libres" name="Cupos libres" stackId="a" fill="#25352f" radius={[6, 6, 0, 0]} maxBarSize={38} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <SectionTitle hint="Cupos pagados del mes">Nuevos vs. existentes</SectionTitle>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CLIENTS}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={52}
                    outerRadius={82}
                    paddingAngle={3}
                  >
                    {CLIENTS.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 12, color: "#90a49a" }} />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Participación"]}
                    contentStyle={{ borderRadius: 12, border: "1px solid #22302b", fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11.5px] leading-relaxed text-muted-foreground">
              La mayoría de los cupos llegan de personas que no comprarían la anualidad completa: es
              el argumento central frente al negocio.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <SectionTitle hint="Liberado por mes (Bs)">Ingresos anticipados</SectionTitle>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={INCOME} margin={{ top: 6, right: 8, bottom: 0, left: -18 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#22302b" vertical={false} />
                <XAxis dataKey="mes" tickLine={false} axisLine={false} fontSize={11} stroke="#90a49a" />
                <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="#90a49a" />
                <Tooltip
                  formatter={(value: number) => [bob(value), "Liberado"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid #22302b", fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="liberado"
                  stroke="#34e39b"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#0f5c4a" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div>
        <SectionTitle hint="Detalle de cada oferta">Rendimiento por oferta</SectionTitle>
        <Card className="hidden md:block">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Oferta</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Llenado</TableHead>
                  <TableHead className="text-right">En garantía</TableHead>
                  <TableHead className="text-right">Liberado</TableHead>
                  <TableHead className="text-right">Comisión</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mine.map((offer) => {
                  const escrow = offer.cupos.reduce((sum, cupo) => sum + (cupo.escrowUsdc ?? 0), 0);
                  return (
                    <TableRow key={offer.id}>
                      <TableCell>
                        <p className="text-[13px] font-medium text-ink">{offer.title}</p>
                        <p className="text-[11.5px] text-muted-foreground">{offer.business}</p>
                      </TableCell>
                      <TableCell>
                        <OfferStatusPill status={offer.status} />
                      </TableCell>
                      <TableCell className="num text-right text-[12.5px]">
                        {paidCount(offer)}/{offer.cupos.length}
                      </TableCell>
                      <TableCell className="num text-right text-[12.5px]">
                        {usdc(Math.round(escrow * 100) / 100)}
                      </TableCell>
                      <TableCell className="num text-right text-[12.5px]">
                        {offer.netUsdc ? usdc(offer.netUsdc) : "—"}
                      </TableCell>
                      <TableCell className="num text-right text-[12.5px] text-muted-foreground">
                        {offer.feeUsdc ? usdc(offer.feeUsdc) : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Móvil: tarjetas */}
        <div className="space-y-2.5 md:hidden">
          {mine.map((offer) => {
            const escrow = offer.cupos.reduce((sum, cupo) => sum + (cupo.escrowUsdc ?? 0), 0);
            return (
              <Card key={offer.id}>
                <CardContent className="p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-ink">{offer.title}</p>
                      <p className="mt-0.5 text-[11.5px] text-muted-foreground">{offer.business}</p>
                    </div>
                    <OfferStatusPill status={offer.status} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
                    <div className="rounded-lg bg-secondary/60 px-2.5 py-2">
                      <p className="text-[10.5px] uppercase tracking-wide text-muted-foreground">Llenado</p>
                      <p className="num mt-0.5 font-medium text-ink">{paidCount(offer)}/{offer.cupos.length}</p>
                    </div>
                    <div className="rounded-lg bg-secondary/60 px-2.5 py-2">
                      <p className="text-[10.5px] uppercase tracking-wide text-muted-foreground">En garantía</p>
                      <p className="num mt-0.5 font-medium text-ink">{usdc(Math.round(escrow * 100) / 100)}</p>
                    </div>
                    <div className="rounded-lg bg-secondary/60 px-2.5 py-2">
                      <p className="text-[10.5px] uppercase tracking-wide text-muted-foreground">Liberado</p>
                      <p className="num mt-0.5 font-medium text-ink">{offer.netUsdc ? usdc(offer.netUsdc) : "—"}</p>
                    </div>
                    <div className="rounded-lg bg-secondary/60 px-2.5 py-2">
                      <p className="text-[10.5px] uppercase tracking-wide text-muted-foreground">Comisión</p>
                      <p className="num mt-0.5 font-medium text-muted-foreground">{offer.feeUsdc ? usdc(offer.feeUsdc) : "—"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: TrendingUp, title: "Capacidad ociosa", body: "Los cupos por franja llenan horas valle sin bajar el precio a tus clientes actuales." },
          { icon: BadgePlus, title: "Cobro adelantado", body: `Cada liberación equivale a ${num(3)} mensualidades juntas, sin cobrar mes a mes.` },
          { icon: Percent, title: "Comisión clara", body: "La comisión del 3% se descuenta solo al liberar. El cliente nunca paga extra." },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title}>
              <CardContent className="p-4">
                <Icon className="size-4 text-brand/70" aria-hidden="true" />
                <p className="mt-2 text-[13px] font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-pretty text-[12px] leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <DemoNote>
        Los reportes se actualizan con cada cupo pagado y cada liberación de tus ofertas.
      </DemoNote>
    </div>
  );
}
