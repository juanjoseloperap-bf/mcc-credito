"use client";

import { useState } from "react";
import { YearlyRow } from "@/types/calculator";
import { fmt } from "@/lib/formatters";

interface Props {
  rows: YearlyRow[];
}

export default function AmortizationTable({ rows }: Props) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? rows : rows.slice(0, 5);

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl" style={{ border: "1.5px solid var(--border-strong)" }}>
        <table className="w-full min-w-[520px]">
          <thead>
            <tr style={{ background: "var(--gradient)" }}>
              {["Año", "Pago anual", "Capital", "Intereses", "Saldo"].map((h, i) => (
                <th
                  key={h}
                  className={`py-3 px-4 text-xs font-bold tracking-wide uppercase text-white/80 ${i === 0 ? "text-left" : "text-right"}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <tr
                key={row.year}
                style={{ background: i % 2 === 0 ? "var(--surface)" : "var(--surface-2)" }}
              >
                <td className="py-3 px-4 text-left font-bold text-sm" style={{ color: "var(--text-1)" }}>
                  {row.year}
                </td>
                <td className="py-3 px-4 text-right text-sm" style={{ color: "var(--text-1)" }}>
                  {fmt(row.capital + row.interest)}
                </td>
                <td className="py-3 px-4 text-right text-sm font-semibold" style={{ color: "var(--navy)" }}>
                  {fmt(row.capital)}
                </td>
                <td className="py-3 px-4 text-right text-sm font-semibold" style={{ color: "var(--blue-light)" }}>
                  {fmt(row.interest)}
                </td>
                <td className="py-3 px-4 text-right text-sm" style={{ color: "var(--text-2)" }}>
                  {fmt(row.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length > 5 && (
        <button
          onClick={() => setExpanded((p) => !p)}
          className="w-full mt-3 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-80"
          style={{ background: "var(--surface)", color: "var(--navy)", boxShadow: "var(--shadow-sm)" }}
        >
          {expanded ? "▲ Ver menos" : `▼ Ver los ${rows.length - 5} años restantes`}
        </button>
      )}
    </div>
  );
}
