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
  | "activo"
  | "finalizado"
  | "reembolsado"
  | "en_cesion";

export type ReleaseType = "completa" | "escalonada";

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
  label: string;
  start: string;
  end: string;
  priceBob: number;
  status: CupoStatus;
  participant?: Participant;
  mine?: boolean;
  paidAt?: string;
  escrowUsdc?: number;
  lockedRate?: number;
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

export type WalletTxKind = "liberacion" | "retiro" | "pago_qr";

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
