import { AmortizationRow, YearlyRow } from "@/types/calculator";

export function calcMaxLoan(
  monthlyPayment: number,
  annualRate: number,
  years: number
): number {
  if (monthlyPayment <= 0 || years <= 0) return 0;
  if (annualRate === 0) return monthlyPayment * years * 12;
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return monthlyPayment * (1 - Math.pow(1 + r, -n)) / r;
}

export function calcMonthlyPayment(
  principal: number,
  annualRate: number,
  years: number
): number {
  if (principal <= 0 || years <= 0) return 0;
  if (annualRate === 0) return principal / (years * 12);
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function calcAmortizationSchedule(
  principal: number,
  annualRate: number,
  years: number
): AmortizationRow[] {
  if (principal <= 0 || years <= 0) return [];
  const r = annualRate / 100 / 12;
  const n = years * 12;
  const payment = calcMonthlyPayment(principal, annualRate, years);

  let balance = principal;
  const schedule: AmortizationRow[] = [];

  for (let month = 1; month <= n; month++) {
    const interest = balance * r;
    const capital = payment - interest;
    balance = Math.max(0, balance - capital);
    schedule.push({
      month,
      year: Math.ceil(month / 12),
      payment,
      capital,
      interest,
      balance,
    });
  }

  return schedule;
}

export function calcYearlyAmortization(
  principal: number,
  annualRate: number,
  years: number
): YearlyRow[] {
  const schedule = calcAmortizationSchedule(principal, annualRate, years);
  const yearly: YearlyRow[] = [];
  let runningInterest = 0;

  for (let y = 1; y <= years; y++) {
    const months = schedule.filter((r) => r.year === y);
    const capital = months.reduce((s, r) => s + r.capital, 0);
    const interest = months.reduce((s, r) => s + r.interest, 0);
    runningInterest += interest;
    yearly.push({
      year: y,
      label: `Año ${y}`,
      capital,
      interest,
      balance: months[months.length - 1]?.balance ?? 0,
      acumInterest: runningInterest,
    });
  }

  return yearly;
}
