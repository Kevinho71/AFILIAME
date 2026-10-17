const nf = (value: number, decimals: number) => {
  const fixed = Math.abs(value).toFixed(decimals);
  const [int, dec] = fixed.split(".");
  const withDots = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return dec ? `${withDots},${dec}` : withDots;
};

/** Monto en bolivianos, formato boliviano: Bs 1.800 / Bs 1.728,54 */
export function bob(value: number, forceDecimals = false) {
  const decimals = forceDecimals || Math.abs(value % 1) > 0.004 ? 2 : 0;
  return `Bs ${nf(value, decimals)}`;
}

/** Monto en dólares digitales: 60 USDC / 174,60 USDC */
export function usdc(value: number, forceDecimals = false) {
  const decimals = forceDecimals || Math.abs(value % 1) > 0.004 ? 2 : 0;
  return `${nf(value, decimals)} USDC`;
}

export function num(value: number, decimals = 0) {
  return nf(value, decimals);
}

export function pct(value: number, decimals = 0) {
  return `${nf(value, decimals)}%`;
}

/** "Bs 1.800" para montos enteros, sin símbolo */
export function amount(value: number) {
  return nf(value, Math.abs(value % 1) > 0.004 ? 2 : 0);
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function daysLeft(iso: string, from = new Date("2026-10-17T09:00:00")) {
  const target = new Date(`${iso}T09:00:00`);
  return Math.max(0, Math.ceil((target.getTime() - from.getTime()) / 86_400_000));
}

export function shortDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export const TODAY = "17/10/2026";
