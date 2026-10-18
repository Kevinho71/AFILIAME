import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Bell,
  CircleHelp,
  Landmark,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InfoNote, PageHeader, SectionTitle } from "@/components/shared/pieces";
import { useAppStore } from "@/store/useAppStore";
import { USER } from "@/lib/data";
import { initials } from "@/lib/format";

const FAQ = [
  {
    q: "¿Qué pasa si el grupo no se completa?",
    a: "Si el plazo termina y faltan cupos, cada pago vuelve automáticamente a su cuenta o QR de origen, en la misma moneda, entre 24 y 72 horas hábiles y sin comisión para ti.",
  },
  {
    q: "¿Necesito una billetera o saber de criptomonedas?",
    a: "No. Tú pagas en bolivianos por QR bancario y tus precios están en bolivianos. La parte técnica de la garantía queda del lado de la plataforma y aparece solo si quieres revisarla en «Ver garantía».",
  },
  {
    q: "¿Puedo ceder mi cupo si ya no lo puedo usar?",
    a: "Sí, una vez liberada la garantía. Publicas el cupo con un precio igual o menor al original, el negocio aprueba la cesión y quien cede paga una comisión del 2% al 3%.",
  },
  {
    q: "¿La plataforma cobra algo al usuario?",
    a: "No. La comisión de plataforma (3% en este ejemplo) se descuenta al negocio en la liberación. Tú pagas exactamente el precio del cupo y el reembolso tampoco tiene costo.",
  },
  {
    q: "¿El saldo del negocio genera intereses?",
    a: "No. El saldo del negocio no genera rendimiento. Cualquier producto de rendimiento sería futuro, opcional y de terceros, con validación legal previa.",
  },
];

export function Profile() {
  const navigate = useNavigate();
  const offers = useAppStore((state) => state.offers);
  const unread = useAppStore((state) => state.notifications.filter((item) => !item.read).length);
  const [openDispute, setOpenDispute] = useState(false);
  const [disputeOffer, setDisputeOffer] = useState("powerfit");
  const [disputeText, setDisputeText] = useState("");

  const myOffers = offers.filter((offer) => offer.cupos.some((cupo) => cupo.mine));

  return (
    <div className="space-y-5">
      <PageHeader title="Perfil" subtitle="Tus datos, tus métodos de pago, avisos y ayuda." />

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarFallback className="text-[15px]">{initials(USER.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-ink">{USER.name}</p>
              <p className="text-[12px] text-muted-foreground">Beneficiaria · {USER.city}</p>
            </div>
            <Badge variant="success" className="ml-auto">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
              Verificada
            </Badge>
          </div>

          <Separator className="my-4" />

          <div className="grid gap-2.5 text-[12.5px]">
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="size-3.5 shrink-0" aria-hidden="true" />
              {USER.phone}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-3.5 shrink-0" aria-hidden="true" />
              {USER.email}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
              {USER.city}, Bolivia
            </p>
          </div>

          <Button variant="outline" size="sm" className="mt-4" asChild>
            <Link to="/registro">
              <UserRound className="size-3.5" aria-hidden="true" />
              Ver pantalla de registro e identidad
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div>
        <SectionTitle hint="Aquí te devolvemos el dinero">Cuenta de devolución</SectionTitle>
        <div className="space-y-2">
          <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-3.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand-soft text-brand">
              <Landmark className="size-4.5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[13.5px] font-medium text-ink">{USER.bankAccount}</p>
              <p className="text-[11.5px] text-muted-foreground">A tu nombre · los reembolsos vuelven aquí</p>
            </div>
            <Badge variant="soft" className="ml-auto">
              Predeterminada
            </Badge>
          </div>
          <p className="text-pretty text-[11.5px] leading-relaxed text-muted-foreground">
            Si el grupo no se completa o retiras tu pago, el dinero vuelve a esta cuenta en 24 a 72
            horas hábiles. No es un QR: es tu cuenta bancaria.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info("Cuenta actualizada")}
          >
            <Plus className="size-4" aria-hidden="true" />
            Cambiar cuenta de devolución
          </Button>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Link
          to="/avisos"
          className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-3.5 transition-colors hover:border-brand/35"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-info-soft text-info">
            <Bell className="size-4.5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[13.5px] font-medium text-ink">Centro de notificaciones</p>
            <p className="text-[11.5px] text-muted-foreground">{unread} avisos sin leer</p>
          </div>
          <ArrowRight className="ml-auto size-4 text-muted-foreground" aria-hidden="true" />
        </Link>

        <button
          type="button"
          onClick={() => setOpenDispute(true)}
          className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border/80 bg-card p-3.5 text-left transition-colors hover:border-brand/35"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-danger-soft text-danger">
            <TriangleAlert className="size-4.5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[13.5px] font-medium text-ink">Reportar un problema</p>
            <p className="text-[11.5px] text-muted-foreground">Abrir una disputa con el negocio</p>
          </div>
          <ArrowRight className="ml-auto size-4 text-muted-foreground" aria-hidden="true" />
        </button>
      </div>

      <div>
        <SectionTitle>Preguntas frecuentes</SectionTitle>
        <Card>
          <CardContent className="p-4">
            <Accordion type="single" collapsible>
              {FAQ.map((item, index) => (
                <AccordionItem key={item.q} value={`faq-${index}`}>
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <CircleHelp className="size-4 text-brand/70 shrink-0" aria-hidden="true" />
                      {item.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <InfoNote tone="neutral" icon={ShieldCheck}>
        Custodia de fondos, conversión de moneda y tratamiento de criptoactivos: pendiente de
        validación legal y regulatoria en Bolivia. Las condiciones validadas se publicarán antes del lanzamiento.
      </InfoNote>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="outline" asChild>
          <Link to="/bienvenida">
            <Banknote className="size-4" aria-hidden="true" />
            Ver la propuesta inicial
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="sm:ml-auto"
          onClick={() => {
            navigate("/");
            toast.info("Sesión cerrada");
          }}
        >
          <LogOut className="size-4" aria-hidden="true" />
          Cerrar sesión
        </Button>
      </div>

      <Dialog open={openDispute} onOpenChange={setOpenDispute}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reportar un problema</DialogTitle>
            <DialogDescription>
              Cuéntanos qué pasó. La plataforma revisa la disputa, puede reembolsar los periodos no
              prestados y retener la liberación de los periodos pendientes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dispute-offer">Cupo afectado</Label>
              <select
                id="dispute-offer"
                value={disputeOffer}
                onChange={(event) => setDisputeOffer(event.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-card px-3 text-[15px]"
              >
                {myOffers.map((offer) => (
                  <option key={offer.id} value={offer.id}>
                    {offer.business} · {offer.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dispute-text">Descripción</Label>
              <Textarea
                id="dispute-text"
                placeholder="Ej. El negocio no abrió el periodo acordado."
                value={disputeText}
                onChange={(event) => setDisputeText(event.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenDispute(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setOpenDispute(false);
                setDisputeText("");
                toast.success("Disputa enviada", {
                  description: "La plataforma revisa el caso en 24 horas hábiles.",
                });
              }}
            >
              Enviar disputa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
