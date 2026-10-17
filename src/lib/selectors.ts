import type { Cupo, Offer } from "./types";
import { escrowOf, paidCount, availableCount } from "@/store/useAppStore";

export const offerById = (offers: Offer[], id?: string) =>
  offers.find((offer) => offer.id === id);

export const cupoById = (offers: Offer[], cupoId?: string) => {
  for (const offer of offers) {
    const cupo = offer.cupos.find((item) => item.id === cupoId);
    if (cupo) return { offer, cupo };
  }
  return null;
};

export const publicOffers = (offers: Offer[]) =>
  offers.filter((offer) => offer.public && !["pausada", "finalizada"].includes(offer.status));

/** Ofertas del comerciante de la demo (Marcos: PowerFit y Parqueo Central). */
export const merchantOffers = (offers: Offer[]) =>
  offers.filter((offer) => ["powerfit", "central"].includes(offer.businessId));

export const myCupos = (offers: Offer[]) =>
  offers.flatMap((offer) =>
    offer.cupos
      .filter((cupo) => cupo.mine)
      .map((cupo) => ({ offer, cupo })),
  );

export const progressPct = (offer: Offer) =>
  Math.round((paidCount(offer) / offer.cupos.length) * 100);

export const offerEscrow = escrowOf;

export const totalEscrow = (offers: Offer[]) =>
  Math.round(
    offers
      .filter((offer) => ["publicada", "llenandose", "completa"].includes(offer.status))
      .reduce((total, offer) => total + escrowOf(offer), 0) * 100,
  ) / 100;

export const cupoPrice = (offer: Offer) => offer.cupos[0]?.priceBob ?? 0;

export const compareBob = (offer: Offer) => offer.monthlyBob * offer.compareMonths;

export const savingsPct = (offer: Offer) => {
  const compare = compareBob(offer);
  const price = cupoPrice(offer);
  if (compare <= price) return 0;
  return Math.round(((compare - price) / compare) * 100);
};

export const available = availableCount;
export { paidCount, availableCount };

export const releaseLabel = (offer: Offer) =>
  offer.releaseType === "escalonada" ? "Pago Protegido" : "Liberación completa";

export const cupoMonthSpan = (cupo: Cupo) => {
  const start = new Date(cupo.start);
  const end = new Date(cupo.end);
  return (
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1
  );
};
