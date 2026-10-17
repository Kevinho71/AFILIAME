import { useState } from "react";
import { BadgeCheck, Clock, FileText, Landmark, ShieldCheck, Upload } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemoTip, InfoNote, PageHeader, SectionTitle } from "@/components/shared/pieces";
import { BUSINESS } from "@/lib/data";

export function Verification() {
  const [state, setState] = useState<"revision" | "aprobado">("aprobado");

  return (
    <div className="space-y-5">
      <PageHeader
        title="Registro y verificación"
        subtitle="Datos del negocio, del dueño y cuenta bancaria de destino. La verificación es obligatoria antes de publicar ofertas."
        action={
          <Badge variant={state === "aprobado" ? "success" : "warn"}>
            {state === "aprobado" ? (
              <BadgeCheck className="size-3.5" aria-hidden="true" />
            ) : (
              <Clock className="size-3.5" aria-hidden="true" />
            )}
            {state === "aprobado" ? "Aprobado" : "En revisión"}
          </Badge>
        }
      />

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-ink">Estado del registro</p>
              <p className="text-[12px] text-muted-foreground">
                Estado del proceso de verificación.
              </p>
            </div>
            <Tabs value={state} onValueChange={(value) => setState(value as "revision" | "aprobado")}>
              <TabsList>
                <TabsTrigger value="revision">En revisión</TabsTrigger>
                <TabsTrigger value="aprobado">Aprobado</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Separator className="my-4" />

          {state === "aprobado" ? (
            <div className="flex items-start gap-3 rounded-xl border border-success/25 bg-success-soft/60 p-3.5">
              <ShieldCheck className="mt-0.5 size-4.5 shrink-0 text-success" aria-hidden="true" />
              <div>
                <p className="text-[13.5px] font-medium text-success">
                  Negocio verificado · puedes publicar y recibir pagos
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                  Revisamos la identidad del dueño, el NIT y la cuenta bancaria de destino. Los fondos
                  liberados se envían a esa cuenta cuando retiras.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-xl border border-gold/25 bg-warn-soft p-3.5">
              <Clock className="mt-0.5 size-4.5 shrink-0 text-warn" aria-hidden="true" />
              <div>
                <p className="text-[13.5px] font-medium text-warn">
                  Estamos revisando tu documentación
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                  El tiempo estimado es de 24 a 48 horas hábiles. Mientras tanto puedes preparar tus
                  ofertas, pero no se publican ni reciben pagos.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <SectionTitle>Datos del negocio</SectionTitle>
            <div className="grid gap-3">
              <div className="space-y-2">
                <Label htmlFor="biz-name">Nombre del negocio</Label>
                <Input id="biz-name" defaultValue={BUSINESS.name} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="biz-nit">NIT</Label>
                  <Input id="biz-nit" defaultValue={BUSINESS.nit} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biz-city">Ciudad</Label>
                  <Input id="biz-city" defaultValue={BUSINESS.city} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="biz-owner">Nombre del dueño</Label>
                <Input id="biz-owner" defaultValue={BUSINESS.owner} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="biz-address">Dirección del local</Label>
                <Input id="biz-address" defaultValue="Av. Las Américas 235, entre Colón y Bolívar" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <SectionTitle>Cuenta bancaria de destino</SectionTitle>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="bank">Banco</Label>
                  <select
                    id="bank"
                    defaultValue="Fassil"
                    className="h-11 w-full rounded-xl border border-input bg-card px-3 text-[15px]"
                  >
                    <option value="Fassil">Banco Fassil</option>
                    <option value="BNB">Banco Nacional de Bolivia</option>
                    <option value="Union">Banco Unión</option>
                    <option value="Mercantil">Banco Mercantil Santa Cruz</option>
                  </select>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="acc-type">Tipo de cuenta</Label>
                    <select
                      id="acc-type"
                      defaultValue="Ahorro"
                      className="h-11 w-full rounded-xl border border-input bg-card px-3 text-[15px]"
                    >
                      <option value="Ahorro">Cuenta de ahorro</option>
                      <option value="Corriente">Cuenta corriente</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="acc-number">Número de cuenta</Label>
                    <Input id="acc-number" defaultValue="•••• 4417" />
                  </div>
                </div>
                <InfoNote tone="neutral" icon={Landmark}>
                  Es la única cuenta donde pueden llegar tus retiros. Los cambios requieren
                  reverificación.
                </InfoNote>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <SectionTitle>Documentos</SectionTitle>
              <div className="space-y-2">
                {[
                  { icon: FileText, title: "Carnet del dueño", body: "Anverso y reverso · cargado" },
                  { icon: Upload, title: "Fotos del local", body: "3 fotos del servicio · cargadas" },
                  { icon: FileText, title: "NIT o registro", body: "Documento tributario · cargado" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex items-center gap-3 rounded-xl border border-border/80 px-3.5 py-3"
                    >
                      <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                        <Icon className="size-4.5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-ink">{item.title}</p>
                        <p className="text-[11.5px] text-muted-foreground">{item.body}</p>
                      </div>
                      <Badge variant="success" className="ml-auto">
                        OK
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <SectionTitle>Términos y condiciones</SectionTitle>
          <div className="space-y-3">
            {[
              "Acepto las reglas de todo o nada y la política de reembolso al usuario.",
              "Acepto la comisión de plataforma del 3% descontada en la liberación.",
              "Confirmo que los datos del negocio y la cuenta bancaria son correctos.",
            ].map((label, index) => (
              <div key={label} className="flex items-start justify-between gap-3 rounded-xl border border-border/80 px-3.5 py-3">
                <p className="text-[12.5px] leading-relaxed text-muted-foreground">{label}</p>
                <Switch defaultChecked={index < 2} aria-label={label} />
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={() =>
                toast.success("Datos guardados", {
                  description: "Tu documentación quedó registrada para la revisión.",
                })
              }
            >
              Guardar cambios
            </Button>
            <Button variant="outline" onClick={() => toast.info("Se pidió una nueva revisión")}>
              Pedir nueva revisión
            </Button>
          </div>
        </CardContent>
      </Card>

      <DemoTip>
        La verificación incluye la identidad del dueño, el NIT y la cuenta bancaria de destino.
      </DemoTip>
    </div>
  );
}
