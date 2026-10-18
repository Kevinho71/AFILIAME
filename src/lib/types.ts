export type Role = "user" | "merchant";

export type Category = "gimnasio" | "coworking" | "club" | "academia" | "parqueo" | "otros";

export type OfferStatus =
  | "publicada"
  | "llenandose"
  | "completa"
  | "liberada"
  | "en_curso"
  | "finalizada"
  | "vencida"
  | "pausada"
  | "reembolsada";

export type CupoStatus =
  | "disponible"
  | "reservado"
  | "en_garantia"
  | "emitido"
  | "activado"
  | "finalizado"
  | "reembolsado"
  | "en_cesion";

export type ReleaseType = "completa" | "escalonada";

/**
 * Cómo se usa un cupo dentro de la oferta:
 * - "compartido": el servicio admite varias personas a la vez (gimnasio, piscina,
 *   parqueo rotativo, clases). El cupo es una parte del precio, SIN fechas: cada
 *   beneficiario usa el servicio cuando quiere, dentro de las reglas del negocio.
 * - "franja": uso exclusivo por franja horaria (mañana/tarde/noche), sin fechas
 *   de calendario: la franja vale todo el ciclo.
 * - "exclusivo": el recurso solo puede ser de una persona a la vez (escritorio
 *   fijo, lugar asignado, habitación). El cupo lleva periodo de uso.
 */
export type CupoUsage = "compartido" | "franja" | "exclusivo";

export interface Participant {
  name: string;
  verified: boolean;
}

export interface Transfer {
  priceBob: number;
  status: "en_revision" | "publicado" | "aprobado";
}

export interface Cupo {
  id: string;
  offerId: string;
  index: number;
  /** Nombre del cupo: "Cupo 1", "Franja mañana · 07:00 a 10:00" o "01 nov – 28 feb". */
  label: string;
  /** Solo en cupos de uso exclusivo (recurso no compartible en simultáneo). */
  start?: string;
  end?: string;
  priceBob: number;
  status: CupoStatus;
  participant?: Participant;
  mine?: boolean;
  paidAt?: string;
  escrowUsdc?: number;
  lockedRate?: number;
  /** Fecha en que el negocio escaneó y confirmó el código de activación (un solo uso). */
  activatedAt?: string;
  transfer?: Transfer;
}

export interface Offer {
  id: string;
  businessId: string;
  business: string;
  category: Category;
  title: string;
  tagline: string;
  description: string;
  annualBob: number;
  monthlyBob: number;
  compareMonths: number;
  /** Cómo se usa cada cupo: define si lleva fechas o no. */
  usage: CupoUsage;
  /** Frase corta que explica al cliente cómo usa su cupo. */
  usageNote: string;
  /** Qué representa un cupo, en palabras del negocio. */
  cupoUnit: string;
  /** Vigencia de la anualidad (el ciclo completo que se reparte). */
  validFrom: string;
  validTo: string;
  city: string;
  address: string;
  hours: string;
  deadline: string;
  releaseType: ReleaseType;
  status: OfferStatus;
  rating: number;
  reviews: number;
  includes: string[];
  rules: string[];
  theme: string;
  createdAt: string;
  releasedAt?: string;
  feeUsdc?: number;
  netUsdc?: number;
  public: boolean;
  cupos: Cupo[];
}

export interface Payment {
  id: string;
  cupoId: string;
  offerId: string;
  amountBob: number;
  amountUsdc: number;
  rate: number;
  date: string;
  status: "en_garantia" | "liberado" | "reembolsado";
  ref: string;
  refundedAt?: string;
}

export type WalletTxKind = "liberacion" | "retiro" | "pago_qr" | "deposito";

export interface WalletTx {
  id: string;
  kind: WalletTxKind;
  title: string;
  subtitle: string;
  usdc: number;
  bob: number;
  date: string;
  ref: string;
  feeUsdc?: number;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  tone: "info" | "success" | "warn" | "danger";
  href?: string;
}

export interface ToastPayload {
  kind: "success" | "info" | "warn" | "danger";
  message: string;
}
