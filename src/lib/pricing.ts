import type { Offer } from "./types";
import { compareBob, cupoPrice } from "./selectors";

/** Lo que costaría pagar mes a mes durante los meses del cupo. */
export const normalPrice = (offer: Offer) => compareBob(offer);

/** Ahorro absoluto del cupo frente a la tarifa mensual (en bolivianos). */
export const savingsBob = (offer: Offer) => Math.max(0, Math.round(compareBob(offer) - cupoPrice(offer)));
