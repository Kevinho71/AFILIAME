import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  MOCK_NAMES,
  SEED_NOTIFICATIONS,
  SEED_OFFERS,
  SEED_PAYMENTS,
  SEED_WALLET_TX,
  USER,
} from "@/lib/data";
import type {
  AppNotification,
  Cupo,
  Offer,
  Payment,
  Role,
  WalletTx,
} from "@/lib/types";
import { TODAY, daysLeft } from "@/lib/format";

export const PLATFORM_FEE = 0.03;
export const CONVERSION_MARGIN = 0.01;
export const WITHDRAW_PENALTY = 0.02;
export const WITHDRAW_CUTOFF_DAYS = 3;
export const RATES = [10, 11.2, 9.6];

const r2 = (value: number) => Math.round(value * 100) / 100;
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const ref = (prefix: string) => {
  const block = Math.random().toString(16).slice(2, 6).toUpperCase();
  const tail = Math.round(Math.random() * 9000 + 1000);
  return `${prefix}-${block}-${tail}`;
};

const isPaid = (cupo: Cupo) =>
  cupo.status === "en_garantia" ||
  cupo.status === "emitido" ||
  cupo.status === "activado" ||
  cupo.status === "finalizado";

export const escrowOf = (offer: Offer) =>
  r2(
    offer.cupos
      .filter((cupo) => cupo.status === "en_garantia")
      .reduce((total, cupo) => total + (cupo.escrowUsdc ?? 0), 0),
  );

export const paidCount = (offer: Offer) => offer.cupos.filter(isPaid).length;

export const availableCount = (offer: Offer) =>
  offer.cupos.filter((cupo) => cupo.status === "disponible").length;

export type WithdrawRule = "arrepentimiento" | "penalizado" | "solo_cesion" | "no_disponible";

/**
 * Reglas de retiro de un cupo pagado (mientras está en garantía, antes de liberarse):
 * - arrepentimiento: dentro de las 24 h (mock: pagado hoy), sin penalización.
 * - penalizado: después de 24 h y con más de 3 días antes del cierre, 2% de penalización.
 * - solo_cesion: últimos 3 días o ya liberado: no hay retiro, solo cesión.
 * - no_disponible: el cupo no está en garantía.
 */
export function withdrawalRule(offer: Offer, cupo: Cupo): WithdrawRule {
  if (cupo.status !== "en_garantia") return "no_disponible";
  if (["liberada", "en_curso", "finalizada"].includes(offer.status)) return "solo_cesion";
  if (cupo.paidAt === TODAY) return "arrepentimiento";
  if (daysLeft(offer.deadline) > WITHDRAW_CUTOFF_DAYS) return "penalizado";
  return "solo_cesion";
}

const releaseIfFull = (offers: Offer[]) => {
  let releasedOffer: Offer | null = null;
  const next = offers.map((offer) => {
    if (offer.cupos.some((cupo) => cupo.status === "disponible")) return offer;
    if (["liberada", "en_curso", "finalizada"].includes(offer.status)) return offer;
    const escrow = r2(
      offer.cupos.reduce((total, cupo) => total + (cupo.escrowUsdc ?? 0), 0),
    );
    const fee = r2(escrow * PLATFORM_FEE);
    const net = r2(escrow - fee);
    const released: Offer = {
      ...offer,
      status: "liberada",
      releasedAt: TODAY,
      feeUsdc: fee,
      netUsdc: net,
      cupos: offer.cupos.map((cupo) =>
        cupo.status === "en_garantia" ? { ...cupo, status: "emitido" as const } : cupo,
      ),
    };
    releasedOffer = released;
    return released;
  });
  return { offers: next, releasedOffer: releasedOffer as Offer | null };
};

interface BuyResult {
  offerId: string;
  released: boolean;
}

interface FillResult {
  cupoId: string;
  name: string;
  released: boolean;
}

interface AppState {
  role: Role;
  rate: number;
  walletUsdc: number;
  offers: Offer[];
  payments: Payment[];
  walletTx: WalletTx[];
  notifications: AppNotification[];
  activeOfferId: string;
  lastPaidCupoId?: string;
  demoOpen: boolean;

  setRole: (role: Role) => void;
  toggleRole: () => void;
  setDemoOpen: (open: boolean) => void;
  setRate: (rate: number) => void;
  cycleRate: () => number;
  setActiveOffer: (offerId: string) => void;

  buyCupo: (cupoId: string) => BuyResult | null;
  fillOneCupo: (offerId: string) => FillResult | null;
  fillAllCupos: (offerId: string) => { filled: number; released: boolean };
  advanceToDeadline: () => { expired: string[]; refundedMine: number };
  startPeriod: (offerId: string) => boolean;
  setOfferStatus: (offerId: string, status: Offer["status"]) => void;
  withdraw: (amountUsdc: number) => { bobNet: number; feeBob: number; bobGross: number } | null;
  payQr: (
    amountBob: number,
    merchant: string,
  ) => { usdc: number; feeBob: number; totalBob: number; ref: string } | null;
  deposit: (amountBob: number) => { usdc: number; ref: string } | null;
  requestTransfer: (cupoId: string, priceBob: number) => void;
  activateCupo: (cupoId: string) => boolean;
  cancelCupo: (cupoId: string) => { refundBob: number; penaltyBob: number } | null;
  markNotificationsRead: () => void;
  reset: () => void;
}

const seedState = () => ({
  role: "user" as Role,
  rate: 10,
  walletUsdc: 38.1,
  offers: clone(SEED_OFFERS),
  payments: clone(SEED_PAYMENTS),
  walletTx: clone(SEED_WALLET_TX),
  notifications: clone(SEED_NOTIFICATIONS),
  activeOfferId: "powerfit",
  lastPaidCupoId: undefined,
  demoOpen: false,
});

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...seedState(),

      setRole: (role) => set({ role }),
      toggleRole: () => set({ role: get().role === "user" ? "merchant" : "user" }),
      setDemoOpen: (demoOpen) => set({ demoOpen }),
      setRate: (rate) => set({ rate }),
      cycleRate: () => {
        const current = get().rate;
        const index = RATES.findIndex((value) => value === current);
        const next = RATES[(index + 1) % RATES.length];
        set({ rate: next });
        return next;
      },
      setActiveOffer: (activeOfferId) => set({ activeOfferId }),

      buyCupo: (cupoId) => {
        const state = get();
        const offer = state.offers.find((item) =>
          item.cupos.some((cupo) => cupo.id === cupoId),
        );
        if (!offer) return null;
        const target = offer.cupos.find((cupo) => cupo.id === cupoId);
        if (!target || target.status !== "disponible") return null;

        const rate = state.rate;
        const escrow = r2(target.priceBob / rate);
        const payment: Payment = {
          id: `pay-${cupoId}`,
          cupoId,
          offerId: offer.id,
          amountBob: target.priceBob,
          amountUsdc: escrow,
          rate,
          date: TODAY,
          status: "en_garantia",
          ref: ref("CUP"),
        };

        let offers = state.offers.map((item) =>
          item.id !== offer.id
            ? item
            : {
                ...item,
                status: item.status === "publicada" ? ("llenandose" as const) : item.status,
                cupos: item.cupos.map((cupo) =>
                  cupo.id !== cupoId
                    ? cupo
                    : {
                        ...cupo,
                        status: "en_garantia" as const,
                        participant: { name: USER.name, verified: true },
                        mine: true,
                        paidAt: TODAY,
                        escrowUsdc: escrow,
                        lockedRate: rate,
                      },
                ),
              },
        );

        const { offers: releasedOffers, releasedOffer } = releaseIfFull(offers);
        offers = releasedOffers;

        const notifications: AppNotification[] = [
          {
            id: `n-${cupoId}`,
            title: "Tu pago está en garantía",
            body: `${offer.business} · ${target.label} · Bs ${target.priceBob}. Tu dinero se libera al negocio solo si el grupo se completa.`,
            date: "Ahora",
            read: false,
            tone: "info",
            href: `/reservado/${cupoId}`,
          },
          ...state.notifications,
        ];

        if (releasedOffer) {
          notifications.unshift({
            id: `n-rel-${cupoId}`,
            title: `Grupo completo en ${releasedOffer.business}`,
            body: "La garantía se liberó y tu código de activación está listo.",
            date: "Ahora",
            read: false,
            tone: "success",
            href: `/pase/${cupoId}`,
          });
        }

        const walletTx = releasedOffer
          ? [
              {
                id: `tx-${releasedOffer.id}`,
                kind: "liberacion" as const,
                title: `Liberación · ${releasedOffer.title}`,
                subtitle: "Grupo completo · comisión de plataforma 3%",
                usdc: releasedOffer.netUsdc ?? 0,
                bob: r2((releasedOffer.netUsdc ?? 0) * rate),
                date: TODAY,
                ref: ref("LIB"),
                feeUsdc: releasedOffer.feeUsdc,
              },
              ...state.walletTx,
            ]
          : state.walletTx;

        const walletUsdc = releasedOffer
          ? r2(state.walletUsdc + (releasedOffer.netUsdc ?? 0))
          : state.walletUsdc;

        set({
          offers,
          payments: [payment, ...state.payments],
          notifications,
          walletTx,
          walletUsdc,
          activeOfferId: offer.id,
          lastPaidCupoId: cupoId,
        });

        return { offerId: offer.id, released: Boolean(releasedOffer) };
      },

      fillOneCupo: (offerId) => {
        const state = get();
        const offer = state.offers.find((item) => item.id === offerId);
        if (!offer) return null;
        const target = offer.cupos.find((cupo) => cupo.status === "disponible");
        if (!target) return null;

        const filledIndex = offer.cupos.filter(isPaid).length;
        const name = MOCK_NAMES[filledIndex % MOCK_NAMES.length];
        const escrow = r2(target.priceBob / state.rate);

        let offers = state.offers.map((item) =>
          item.id !== offer.id
            ? item
            : {
                ...item,
                status: "llenandose" as const,
                cupos: item.cupos.map((cupo) =>
                  cupo.id !== target.id
                    ? cupo
                    : {
                        ...cupo,
                        status: "en_garantia" as const,
                        participant: { name, verified: true },
                        paidAt: TODAY,
                        escrowUsdc: escrow,
                        lockedRate: state.rate,
                      },
                ),
              },
        );

        const { offers: releasedOffers, releasedOffer } = releaseIfFull(offers);
        offers = releasedOffers;

        const notifications = releasedOffer
          ? [
              {
                id: `n-rel-${releasedOffer.id}-${target.id}`,
                title: `Grupo completo en ${releasedOffer.business}`,
                body: "La garantía se liberó al negocio y los códigos de activación están listos.",
                date: "Ahora",
                read: false,
                tone: "success" as const,
                href: `/esperando/${releasedOffer.id}`,
              },
              ...state.notifications,
            ]
          : state.notifications;

        const walletTx = releasedOffer
          ? [
              {
                id: `tx-${releasedOffer.id}-${target.id}`,
                kind: "liberacion" as const,
                title: `Liberación · ${releasedOffer.title}`,
                subtitle: "Grupo completo · comisión de plataforma 3%",
                usdc: releasedOffer.netUsdc ?? 0,
                bob: r2((releasedOffer.netUsdc ?? 0) * state.rate),
                date: TODAY,
                ref: ref("LIB"),
                feeUsdc: releasedOffer.feeUsdc,
              },
              ...state.walletTx,
            ]
          : state.walletTx;

        set({
          offers,
          notifications,
          walletTx,
          walletUsdc: releasedOffer
            ? r2(state.walletUsdc + (releasedOffer.netUsdc ?? 0))
            : state.walletUsdc,
        });

        return { cupoId: target.id, name, released: Boolean(releasedOffer) };
      },

      fillAllCupos: (offerId) => {
        let filled = 0;
        let released = false;
        for (let i = 0; i < 8; i += 1) {
          const result = get().fillOneCupo(offerId);
          if (!result) break;
          filled += 1;
          released = released || result.released;
        }
        return { filled, released };
      },

      advanceToDeadline: () => {
        const state = get();
        const expired: string[] = [];
        let refundedMine = 0;
        const offers = state.offers.map((offer) => {
          if (!["publicada", "llenandose"].includes(offer.status)) return offer;
          expired.push(offer.business);
          const cupos = offer.cupos.map((cupo) => {
            if (cupo.status !== "en_garantia") return cupo;
            if (cupo.mine) refundedMine += cupo.priceBob;
            return { ...cupo, status: "reembolsado" as const };
          });
          return { ...offer, status: "reembolsada" as const, cupos };
        });
        const payments = state.payments.map((payment) =>
          payment.status === "en_garantia"
            ? { ...payment, status: "reembolsado" as const, refundedAt: TODAY }
            : payment,
        );
        const notifications = refundedMine
          ? [
              {
                id: `n-refund-${Date.now()}`,
                title: `Te devolvimos Bs ${refundedMine}`,
                body: "El plazo venció sin completar el grupo. El reembolso vuelve a tu cuenta de origen en 24 a 72 horas hábiles.",
                date: "Ahora",
                read: false,
                tone: "danger" as const,
                href: "/mis-cupos",
              },
              ...state.notifications,
            ]
          : state.notifications;
        set({ offers, payments, notifications });
        return { expired, refundedMine };
      },

      startPeriod: (offerId) => {
        const state = get();
        const offer = state.offers.find((item) => item.id === offerId);
        if (!offer || !["liberada", "completa"].includes(offer.status)) return false;
        set({
          offers: state.offers.map((item) =>
            item.id !== offerId
              ? item
              : {
                  ...item,
                  status: "en_curso" as const,
                  cupos: item.cupos.map((cupo) =>
                    cupo.status === "en_garantia" ? { ...cupo, status: "emitido" as const } : cupo,
                  ),
                },
          ),
          notifications: [
            {
              id: `n-start-${offerId}`,
              title: "Tu código de activación está listo",
              body: `${offer.business}: el ciclo arrancó. Muestra tu código de activación en recepción la primera vez que vayas.`,
              date: "Ahora",
              read: false,
              tone: "success" as const,
              href: offer.cupos.find((cupo) => cupo.mine)
                ? `/pase/${offer.cupos.find((cupo) => cupo.mine)?.id}`
                : "/mis-cupos",
            },
            ...state.notifications,
          ],
        });
        return true;
      },

      setOfferStatus: (offerId, status) =>
        set({
          offers: get().offers.map((offer) =>
            offer.id === offerId ? { ...offer, status } : offer,
          ),
        }),

      withdraw: (amountUsdc) => {
        const state = get();
        if (amountUsdc <= 0 || amountUsdc > state.walletUsdc + 0.001) return null;
        const rate = state.rate;
        const bobGross = r2(amountUsdc * rate);
        const feeBob = r2(bobGross * CONVERSION_MARGIN);
        const bobNet = r2(bobGross - feeBob);
        const tx: WalletTx = {
          id: `tx-ret-${Date.now()}`,
          kind: "retiro",
          title: "Retiro a tu banco",
          subtitle: "Banco Fassil •• 4417 · conversión 1%",
          usdc: -amountUsdc,
          bob: bobNet,
          date: TODAY,
          ref: ref("RET"),
        };
        set({
          walletUsdc: r2(state.walletUsdc - amountUsdc),
          walletTx: [tx, ...state.walletTx],
        });
        return { bobNet, feeBob, bobGross };
      },

      payQr: (amountBob, merchant) => {
        const state = get();
        const rate = state.rate;
        const base = amountBob / rate;
        const feeBob = r2(base * CONVERSION_MARGIN * rate);
        const totalBob = r2(amountBob + feeBob);
        const usdcAmount = r2(totalBob / rate);
        if (usdcAmount > state.walletUsdc + 0.001) return null;
        const tx: WalletTx = {
          id: `tx-qr-${Date.now()}`,
          kind: "pago_qr",
          title: `Pago QR · ${merchant}`,
          subtitle: "Pago a QR en bolivianos · conversión 1%",
          usdc: -usdcAmount,
          bob: -totalBob,
          date: TODAY,
          ref: ref("QR"),
        };
        set({
          walletUsdc: r2(state.walletUsdc - usdcAmount),
          walletTx: [tx, ...state.walletTx],
        });
        return { usdc: usdcAmount, feeBob, totalBob, ref: tx.ref };
      },

      deposit: (amountBob) => {
        const state = get();
        if (amountBob <= 0) return null;
        const rate = state.rate;
        const usdcAmount = r2(amountBob / rate);
        const tx: WalletTx = {
          id: `tx-dep-${Date.now()}`,
          kind: "deposito",
          title: "Depósito desde tu banco",
          subtitle: "Banco Fassil · conversión directa a USDC",
          usdc: usdcAmount,
          bob: amountBob,
          date: TODAY,
          ref: ref("DEP"),
        };
        set({
          walletUsdc: r2(state.walletUsdc + usdcAmount),
          walletTx: [tx, ...state.walletTx],
        });
        return { usdc: usdcAmount, ref: tx.ref };
      },

      requestTransfer: (cupoId, priceBob) => {
        const state = get();
        set({
          offers: state.offers.map((offer) => ({
            ...offer,
            cupos: offer.cupos.map((cupo) =>
              cupo.id !== cupoId
                ? cupo
                : cupo.status === "emitido" || cupo.status === "activado"
                  ? {
                      ...cupo,
                      status: "en_cesion" as const,
                      transfer: { priceBob, status: "en_revision" as const },
                    }
                  : cupo,
            ),
          })),
          notifications: [
            {
              id: `n-cesion-${cupoId}`,
              title: "Cesión enviada al negocio",
              body: "Tu cupo quedó publicado. El negocio debe aprobar la cesión antes de que otra persona lo compre.",
              date: "Ahora",
              read: false,
              tone: "warn" as const,
              href: "/mis-cupos",
            },
            ...state.notifications,
          ],
        });
      },

      activateCupo: (cupoId) => {
        const state = get();
        const offer = state.offers.find((item) =>
          item.cupos.some((cupo) => cupo.id === cupoId),
        );
        if (!offer) return false;
        const cupo = offer.cupos.find((item) => item.id === cupoId);
        if (!cupo || cupo.status !== "emitido") return false;
        set({
          offers: state.offers.map((item) =>
            item.id !== offer.id
              ? item
              : {
                  ...item,
                  cupos: item.cupos.map((c) =>
                    c.id !== cupoId
                      ? c
                      : { ...c, status: "activado" as const, activatedAt: TODAY },
                  ),
                },
          ),
        });
        return true;
      },

      cancelCupo: (cupoId) => {
        const state = get();
        const offer = state.offers.find((item) =>
          item.cupos.some((cupo) => cupo.id === cupoId),
        );
        if (!offer) return null;
        const cupo = offer.cupos.find((item) => item.id === cupoId);
        if (!cupo) return null;
        const rule = withdrawalRule(offer, cupo);
        if (rule === "no_disponible" || rule === "solo_cesion") return null;

        const penaltyPct = rule === "arrepentimiento" ? 0 : WITHDRAW_PENALTY;
        const penaltyBob = r2(cupo.priceBob * penaltyPct);
        const refundBob = r2(cupo.priceBob - penaltyBob);

        const offers = state.offers.map((item) =>
          item.id !== offer.id
            ? item
            : {
                ...item,
                cupos: item.cupos.map((c) =>
                  c.id !== cupoId
                    ? c
                    : {
                        ...c,
                        status: "disponible" as const,
                        participant: undefined,
                        mine: false,
                        escrowUsdc: undefined,
                        lockedRate: undefined,
                        paidAt: undefined,
                      },
                ),
              },
        );

        const payments = state.payments.map((payment) =>
          payment.cupoId === cupoId
            ? { ...payment, status: "reembolsado" as const, refundedAt: TODAY }
            : payment,
        );

        const notifications: AppNotification[] = [
          {
            id: `n-cancel-${cupoId}`,
            title: `Te devolvimos Bs ${refundBob}`,
            body:
              penaltyBob > 0
                ? `Retiraste tu pago con una penalización de Bs ${penaltyBob} (2%). El cupo volvió a quedar libre.`
                : "Retiraste tu pago dentro de las 24 horas, sin penalización. El cupo volvió a quedar libre.",
            date: "Ahora",
            read: false,
            tone: "danger" as const,
            href: "/mis-cupos",
          },
          ...state.notifications,
        ];

        set({ offers, payments, notifications });
        return { refundBob, penaltyBob };
      },

      markNotificationsRead: () =>
        set({ notifications: get().notifications.map((item) => ({ ...item, read: true })) }),

      reset: () => set({ ...seedState() }),
    }),
    {
      name: "cupos-demo-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        role: state.role,
        rate: state.rate,
        walletUsdc: state.walletUsdc,
        offers: state.offers,
        payments: state.payments,
        walletTx: state.walletTx,
        notifications: state.notifications,
        activeOfferId: state.activeOfferId,
        lastPaidCupoId: state.lastPaidCupoId,
      }),
    },
  ),
);
