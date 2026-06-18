export type PropertyType = "casa" | "apartamento" | "lote";

export interface CalculatorData {
  // Paso 1 — Inmueble
  propertyValue: number;
  propertyType: PropertyType;
  firstHome: boolean;
  // Paso 2 — Entrada
  downPaymentPct: number;
  // Paso 3 — Crédito (amount derivado: propertyValue × (1 − downPaymentPct/100))
  amount: number;
  years: number;
  rate: number;
  // Paso 4 — Costos adicionales
  predial: number;
  seguroHogar: number;
  hoa: number;
  pmi: number;
}

export interface AmortizationRow {
  month: number;
  year: number;
  payment: number;
  capital: number;
  interest: number;
  balance: number;
}

export interface YearlyRow {
  year: number;
  label: string;
  capital: number;
  interest: number;
  balance: number;
  acumInterest: number;
}
