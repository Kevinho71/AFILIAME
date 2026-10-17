import { Lock, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { InfoNote, PageHeader, SectionTitle } from "@/components/shared/pieces";

export function Yield() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Rendimiento (Próximamente)"
        subtitle="Una idea futura, opcional y de terceros para quienes quieran que su saldo en dólares digitales genere algo más."
        action={
          <Badge variant="muted">
            <Lock className="size-3.5" aria-hidden="true" />
            Deshabilitado
          </Badge>
        }
      />

      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <Lock className="size-7" aria-hidden="true" />
            </span>
            <h2 className="font-display text-[21px]">Todavía no está disponible</h2>
            <p className="max-w-xl text-pretty text-[13px] leading-relaxed text-muted-foreground">
              Esta pantalla existe para dejar claro que cualquier rendimiento sobre el saldo queda
              fuera del alcance del producto actual. No mostramos cifras, proyecciones ni promesas
              porque ninguna está validada.
            </p>
            <Button
              variant="outline"
              onClick={() => toast.info("Función no disponible en esta versión")}
            >
              <Sparkles className="size-4" aria-hidden="true" />
              Activar rendimiento
            </Button>
            <div className="flex items-center gap-2 text-[11.5px] text-muted-foreground">
              <Switch disabled aria-label="Rendimiento deshabilitado" />
              Disponible en una próxima versión
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <SectionTitle>Cómo se plantearía</SectionTitle>
            <ul className="space-y-2 text-[12.5px] leading-relaxed text-muted-foreground">
              <li>• Como un producto separado, opcional y ofrecido por un tercero autorizado.</li>
              <li>• Nunca con el dinero en garantía de los clientes: esos fondos son intocables.</li>
              <li>• Solo con el saldo disponible del negocio y con su consentimiento explícito.</li>
              <li>• Con la tasa, las condiciones y los riesgos visibles antes de aceptar.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <SectionTitle>Riesgos que habría que explicar</SectionTitle>
            <ul className="space-y-2 text-[12.5px] leading-relaxed text-muted-foreground">
              <li>• El capital podría no estar disponible de inmediato cuando el negocio lo necesite.</li>
              <li>• Existe riesgo de contraparte con quien ofrece el producto.</li>
              <li>• Los rendimientos futuros no están garantizados y pueden ser negativos.</li>
              <li>• Requiere validación legal, tributaria y regulatoria en Bolivia antes de existir.</li>
            </ul>
            <InfoNote tone="warn" className="mt-3" icon={ShieldAlert}>
              Requiere validación legal. No ofrecemos ningún producto financiero con este saldo.
            </InfoNote>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-brand-soft text-brand-deep">
            <TrendingUp className="size-4.5" aria-hidden="true" />
          </span>
          <p className="min-w-0 flex-1 text-[12.5px] leading-relaxed text-muted-foreground">
            Mientras tanto, tu saldo se mantiene en dólares digitales estables, sin rendimiento y sin
            riesgo de mercado. Puedes retirarlo a tu banco o pagar a un QR cuando quieras.
          </p>
          <Button size="sm" variant="outline" onClick={() => toast.info("Vuelve a la billetera desde el menú")}>
            Cómo mantener mi saldo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
