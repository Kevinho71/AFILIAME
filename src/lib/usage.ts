import { shortDate } from "./format";
import type { Cupo, CupoUsage, Offer } from "./types";

export const USAGE_LABEL: Record<CupoUsage, string> = {
  compartido: "Uso compartido, sin fecha fija",
  franja: "Franja horaria fija",
  exclusivo: "Periodo exclusivo",
};

export const USAGE_SHORT: Record<CupoUsage, string> = {
  compartido: "Sin fecha fija",
  franja: "Por franja horaria",
  exclusivo: "Por periodo",
};

/**
 * Cuándo puede usarse un cupo.
 * - compartido: el servicio admite varias personas a la vez => no hay fechas.
 * - franja: la franja vale todo el ciclo => no hay fechas de calendario.
 * - exclusivo: recurso no compartible en simultáneo => periodo.
 */
export function cupoWhen(offer: Offer, cupo: Cupo) {
  if (offer.usage === "exclusivo" && cupo.start && cupo.end) {
    return `Del ${shortDate(cupo.start)} al ${shortDate(cupo.end)}`;
  }
  if (offer.usage === "franja") return "Todo el ciclo, dentro de tu franja";
  return "Cuando lo necesites, dentro del horario";
}

/** Vigencia de la anualidad completa. */
export const validityText = (offer: Offer) =>
  `Del ${shortDate(offer.validFrom)} al ${shortDate(offer.validTo)}`;

/** ¿Este cupo tiene fechas de uso propias? */
export const hasPeriod = (offer: Offer, cupo: Cupo) =>
  offer.usage === "exclusivo" && Boolean(cupo.start && cupo.end);
