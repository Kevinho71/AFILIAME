import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Apple,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Camera,
  CheckCircle2,
  CreditCard,
  Landmark,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Store,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export type LoginMode = "user" | "merchant";

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C36.9 40.4 44 35 44 24c0-1.3-.1-2.6-.4-3.9z"
      />
    </svg>
  );
}

const BUSINESS_STEPS = ["Tu negocio", "Identidad", "Cuenta de cobro"];

export function LoginDialog({
  open,
  onOpenChange,
  mode: initialMode = "user",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: LoginMode;
}) {
  const navigate = useNavigate();
  const setRole = useAppStore((state) => state.setRole);

  const [mode, setMode] = useState<LoginMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    business: "",
    nit: "",
    city: "Tarija",
    address: "",
    owner: "",
    ci: "",
    bank: "Fassil",
    accountType: "Ahorro",
    account: "",
  });
  const [document, setDocument] = useState(false);
  const [selfie, setSelfie] = useState(false);
  const [terms, setTerms] = useState(false);

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setStep(0);
      setLoading(false);
    }
  }, [open, initialMode]);

  const signInAsUser = (provider: string) => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setRole("user");
      onOpenChange(false);
      toast.success(`Bienvenida, Lucía`, { description: `Ingresaste con ${provider}.` });
      navigate("/explorar");
    }, 900);
  };

  const submitBusiness = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setRole("merchant");
      onOpenChange(false);
      toast.success("Solicitud enviada", {
        description: "Verificamos la identidad del negocio y la cuenta de cobro en 24 a 48 horas.",
      });
      navigate("/panel/verificacion");
    }, 1100);
  };

  const businessStepValid =
    step === 0
      ? profile.business.trim().length > 2 && profile.nit.trim().length >= 6
      : step === 1
        ? profile.owner.trim().length > 3 && profile.ci.trim().length >= 5 && document && selfie
        : profile.account.trim().length >= 4 && terms;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-[22px]">
            {mode === "user" ? "Entra a Afíliame" : "Registra tu negocio"}
          </DialogTitle>
          <DialogDescription>
            {mode === "user"
              ? "Crea tu cuenta, elige un cupo y paga tu parte por QR en bolivianos."
              : "Verificamos la identidad del dueño, el NIT y la cuenta donde quieres cobrar."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-1 rounded-xl bg-secondary/80 p-1">
          {[
            { value: "user" as LoginMode, label: "Soy cliente", icon: User },
            { value: "merchant" as LoginMode, label: "Soy negocio", icon: Store },
          ].map((option) => {
            const Icon = option.icon;
            const active = mode === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setMode(option.value);
                  setStep(0);
                }}
                aria-pressed={active}
                className={cn(
                  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                  active ? "bg-card text-ink shadow-[0_1px_2px_rgba(0,0,0,0.35)]" : "text-muted-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {option.label}
              </button>
            );
          })}
        </div>

        {mode === "user" ? (
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-center"
              disabled={loading}
              onClick={() => signInAsUser("Google")}
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <GoogleMark className="size-4" />
              )}
              Continuar con Google
            </Button>
            <Button
              variant="outline"
              className="w-full justify-center"
              disabled={loading}
              onClick={() => signInAsUser("Apple")}
            >
              <Apple className="size-4" aria-hidden="true" />
              Continuar con Apple
            </Button>

            <div className="flex items-center gap-3 py-1">
              <span className="h-px flex-1 bg-border" />
              <span className="text-[11px] text-muted-foreground">o con tu teléfono</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="flex gap-2">
              <span className="flex h-11 items-center gap-1.5 rounded-xl border border-input bg-secondary/60 px-3 text-[14px] text-muted-foreground">
                <Phone className="size-3.5" aria-hidden="true" />
                +591
              </span>
              <Input id="login-phone" inputMode="tel" placeholder="712 34567" />
            </div>

            <Button
              className="w-full"
              disabled={loading}
              onClick={() => {
                onOpenChange(false);
                navigate("/registro");
              }}
            >
              <Mail className="size-4" aria-hidden="true" />
              Verificar mi identidad paso a paso
            </Button>

            <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
              <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              No necesitas billetera ni claves: pagas en bolivianos por el QR de tu banco.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Progress value={((step + 1) / BUSINESS_STEPS.length) * 100} className="h-1.5" />
              <span className="num shrink-0 text-[11px] text-muted-foreground">
                {step + 1}/{BUSINESS_STEPS.length}
              </span>
            </div>
            <p className="flex items-center gap-2 text-[12px] font-medium text-brand">
              {step === 0 ? (
                <Building2 className="size-3.5" aria-hidden="true" />
              ) : step === 1 ? (
                <CreditCard className="size-3.5" aria-hidden="true" />
              ) : (
                <Landmark className="size-3.5" aria-hidden="true" />
              )}
              {BUSINESS_STEPS[step]}
            </p>

            {step === 0 && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="biz">Nombre del negocio</Label>
                  <Input
                    id="biz"
                    placeholder="Ej. Gimnasio PowerFit"
                    value={profile.business}
                    onChange={(event) => setProfile({ ...profile, business: event.target.value })}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nit">NIT</Label>
                    <Input
                      id="nit"
                      placeholder="4587123-011"
                      value={profile.nit}
                      onChange={(event) => setProfile({ ...profile, nit: event.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      value={profile.city}
                      onChange={(event) => setProfile({ ...profile, city: event.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección del local</Label>
                  <Input
                    id="address"
                    placeholder="Av. Las Américas 235"
                    value={profile.address}
                    onChange={(event) => setProfile({ ...profile, address: event.target.value })}
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="owner">Nombre del dueño</Label>
                    <Input
                      id="owner"
                      placeholder="Marcos Quiroga"
                      value={profile.owner}
                      onChange={(event) => setProfile({ ...profile, owner: event.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ci">Carnet de identidad</Label>
                    <Input
                      id="ci"
                      placeholder="1234567"
                      value={profile.ci}
                      onChange={(event) => setProfile({ ...profile, ci: event.target.value })}
                    />
                  </div>
                </div>

                {[
                  {
                    done: document,
                    icon: CreditCard,
                    title: "Foto del carnet",
                    body: "Anverso y reverso",
                    onSelect: () => setDocument(true),
                  },
                  {
                    done: selfie,
                    icon: Camera,
                    title: "Selfie de verificación",
                    body: "Para comparar con tu documento",
                    onSelect: () => setSelfie(true),
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={item.onSelect}
                      className={cn(
                        "flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors",
                        item.done
                          ? "border-success/30 bg-success-soft/60"
                          : "border-dashed border-border bg-card hover:bg-secondary/50",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-lg",
                          item.done ? "bg-success text-primary-foreground" : "bg-secondary text-muted-foreground",
                        )}
                      >
                        {item.done ? (
                          <CheckCircle2 className="size-4.5" aria-hidden="true" />
                        ) : (
                          <Icon className="size-4.5" aria-hidden="true" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13px] font-medium text-ink">{item.title}</span>
                        <span className="block text-[11.5px] text-muted-foreground">
                          {item.done ? "Cargado · listo para revisar" : item.body}
                        </span>
                      </span>
                      {!item.done && (
                        <Badge variant="muted" className="ml-auto shrink-0">
                          Cargar
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bank">Banco de cobro</Label>
                    <select
                      id="bank"
                      value={profile.bank}
                      onChange={(event) => setProfile({ ...profile, bank: event.target.value })}
                      className="h-11 w-full rounded-xl border border-input bg-card px-3 text-[15px]"
                    >
                      <option value="Fassil">Banco Fassil</option>
                      <option value="BNB">Banco Nacional de Bolivia</option>
                      <option value="Union">Banco Unión</option>
                      <option value="Mercantil">Banco Mercantil Santa Cruz</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="acc-type">Tipo de cuenta</Label>
                    <select
                      id="acc-type"
                      value={profile.accountType}
                      onChange={(event) => setProfile({ ...profile, accountType: event.target.value })}
                      className="h-11 w-full rounded-xl border border-input bg-card px-3 text-[15px]"
                    >
                      <option value="Ahorro">Cuenta de ahorro</option>
                      <option value="Corriente">Cuenta corriente</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acc">Número de cuenta</Label>
                  <Input
                    id="acc"
                    placeholder="0000 0000 4417"
                    value={profile.account}
                    onChange={(event) => setProfile({ ...profile, account: event.target.value })}
                  />
                </div>

                <div className="flex items-start justify-between gap-3 rounded-xl border border-border/80 px-3.5 py-3">
                  <p className="text-[11.5px] leading-relaxed text-muted-foreground">
                    Acepto las reglas del modelo: comisión de plataforma sobre la oferta liberada,
                    registro nominal de beneficiarios y reembolso automático si el grupo no se completa.
                  </p>
                  <Switch checked={terms} onCheckedChange={setTerms} aria-label="Aceptar reglas" />
                </div>

                <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
                  <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                  Los datos del negocio y la cuenta de cobro pasan por verificación documental antes de
                  publicar ofertas.
                </p>
              </div>
            )}

            <div className="flex items-center gap-2">
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep((value) => value - 1)} disabled={loading}>
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Atrás
                </Button>
              )}
              <Button
                className="ml-auto"
                disabled={!businessStepValid || loading}
                onClick={() => {
                  if (step < BUSINESS_STEPS.length - 1) {
                    setStep((value) => value + 1);
                    return;
                  }
                  submitBusiness();
                }}
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : step === BUSINESS_STEPS.length - 1 ? (
                  <BadgeCheck className="size-4" aria-hidden="true" />
                ) : null}
                {step === BUSINESS_STEPS.length - 1 ? "Enviar solicitud" : "Continuar"}
                {step < BUSINESS_STEPS.length - 1 && <ArrowRight className="size-4" aria-hidden="true" />}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
