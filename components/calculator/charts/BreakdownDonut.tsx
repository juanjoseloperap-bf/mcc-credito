"use client";

import { fmt } from "@/lib/formatters";

interface Props {
  capital: number;
  interest: number;
}

export default function BreakdownDonut({ capital, interest }: Props) {
  const total = capital + interest;
  const capitalPct = (capital / total) * 100;
  const interestPct = 100 - capitalPct;
  const costPerDollar = (interest / capital).toFixed(2);

  return (
    <div className="space-y-5">

      {/* Barra apilada única */}
      <div>
        <div className="flex h-8 rounded-lg overflow-hidden">
          <div
            className="flex items-center justify-center text-xs font-medium text-white transition-all duration-700"
            style={{ width: `${capitalPct}%`, background: "#1b2360" }}
          >
            {capitalPct.toFixed(0)}%
          </div>
          <div
            className="flex items-center justify-center text-xs font-medium text-white transition-all duration-700"
            style={{ width: `${interestPct}%`, background: "#2a9fd6" }}
          >
            {interestPct.toFixed(0)}%
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs" style={{ color: "var(--text-3)" }}>
          <span>Capital</span>
          <span>Intereses</span>
        </div>
      </div>

      {/* Filas de detalle */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg p-3" style={{ background: "var(--surface-2)", borderLeft: "3px solid #1b2360" }}>
          <p className="text-xs mb-1" style={{ color: "var(--text-3)" }}>Capital (lo que pediste)</p>
          <p className="font-semibold" style={{ color: "var(--navy)" }}>{fmt(capital)}</p>
        </div>
        <div className="rounded-lg p-3" style={{ background: "var(--surface-2)", borderLeft: "3px solid #2a9fd6" }}>
          <p className="text-xs mb-1" style={{ color: "var(--text-3)" }}>Intereses (costo del crédito)</p>
          <p className="font-semibold" style={{ color: "var(--navy)" }}>{fmt(interest)}</p>
        </div>
      </div>

      {/* Insight */}
      <div
        className="rounded-lg px-4 py-3 flex items-center gap-3"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border-strong)" }}
      >
        <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: "var(--navy)" }} />
        <p className="text-sm" style={{ color: "var(--text-2)" }}>
          Por cada <strong style={{ color: "var(--navy)" }}>$1</strong> que pediste, pagarás{" "}
          <strong style={{ color: "var(--navy)" }}>${costPerDollar}</strong> adicionales en intereses al banco.
        </p>
      </div>
    </div>
  );
}
