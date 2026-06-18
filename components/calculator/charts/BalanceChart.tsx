"use client";

import { YearlyRow } from "@/types/calculator";
import { fmt } from "@/lib/formatters";

interface Props {
  data: YearlyRow[];
}

function findYearWhenBelow(data: YearlyRow[], pct: number, principal: number): YearlyRow | null {
  return data.find((r) => r.balance <= principal * pct) ?? null;
}

function MilestoneCard({
  year,
  label,
  balance,
  principal,
  accent,
}: {
  year: number;
  label: string;
  balance: number;
  principal: number;
  accent: string;
}) {
  const paid = principal - balance;
  const paidPct = Math.round((paid / principal) * 100);

  return (
    <div
      className="rounded-lg p-4 flex flex-col gap-2"
      style={{ background: "var(--surface-2)", borderTop: `3px solid ${accent}` }}
    >
      <p className="text-xs font-medium" style={{ color: accent }}>Año {year}</p>
      <p className="text-sm font-semibold" style={{ color: "var(--navy)" }}>{label}</p>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-3)" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${paidPct}%`, background: accent }}
        />
      </div>
      <div className="flex justify-between text-xs" style={{ color: "var(--text-3)" }}>
        <span>Pagado: {fmt(paid)}</span>
        <span>Deuda: {fmt(balance)}</span>
      </div>
    </div>
  );
}

export default function BalanceChart({ data }: Props) {
  if (!data.length) return null;

  const principal = data[0].balance + data[0].capital;
  const total = data.length;

  const m25 = findYearWhenBelow(data, 0.75, principal);
  const m50 = findYearWhenBelow(data, 0.50, principal);
  const m75 = findYearWhenBelow(data, 0.25, principal);
  const last = data[data.length - 1];

  const milestones = [
    m25 && { year: m25.year, label: "25% del crédito pagado", balance: m25.balance, accent: "#2a9fd6" },
    m50 && { year: m50.year, label: "Deuda a la mitad", balance: m50.balance, accent: "#1e6fa8" },
    m75 && { year: m75.year, label: "75% del crédito pagado", balance: m75.balance, accent: "#1b2360" },
  ].filter(Boolean) as { year: number; label: string; balance: number; accent: string }[];

  // Punto de cruce: cuando los intereses acumulados superan el capital
  const crossYear = data.find((r) => r.acumInterest >= principal);

  return (
    <div className="space-y-4">

      {/* Progreso visual año a año */}
      <div>
        <p className="text-xs mb-2" style={{ color: "var(--text-3)" }}>Saldo año a año</p>
        <div className="space-y-1">
          {data.filter((_, i) => i % Math.ceil(total / 8) === 0 || i === total - 1).map((row) => {
            const remaining = Math.round((row.balance / principal) * 100);
            return (
              <div key={row.year} className="flex items-center gap-3">
                <span className="text-xs w-10 flex-shrink-0" style={{ color: "var(--text-3)" }}>
                  Año {row.year}
                </span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-3)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${remaining}%`, background: "var(--navy)", opacity: 0.2 + (remaining / 100) * 0.8 }}
                  />
                </div>
                <span className="text-xs w-16 text-right flex-shrink-0" style={{ color: "var(--text-3)" }}>
                  {fmt(row.balance)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hitos */}
      <p className="text-xs font-medium" style={{ color: "var(--text-3)" }}>Hitos del crédito</p>
      <div className="grid grid-cols-3 gap-2">
        {milestones.map((m) => (
          <MilestoneCard key={m.year} {...m} principal={principal} />
        ))}
      </div>

      {/* Punto de cruce */}
      {crossYear && (
        <div
          className="rounded-lg px-4 py-3 flex items-start gap-3"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border-strong)" }}
        >
          <div className="w-1 h-8 rounded-full flex-shrink-0 mt-0.5" style={{ background: "#1e6fa8" }} />
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            En el <strong style={{ color: "var(--navy)" }}>año {crossYear.year}</strong> habrás pagado más en intereses que el monto original del crédito. A partir de ahí, cada cuota trabaja más a tu favor.
          </p>
        </div>
      )}
    </div>
  );
}
