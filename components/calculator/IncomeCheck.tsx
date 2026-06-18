"use client";

import { useState } from "react";
import { fmtDec, fmt } from "@/lib/formatters";

interface Props {
  monthlyPayment: number;
}

function getRating(ratio: number) {
  if (ratio < 28) return { label: "Excelente", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", text: "Tu cuota está dentro de los parámetros óptimos. Tienes margen financiero cómodo." };
  if (ratio < 36) return { label: "Moderado", color: "#d97706", bg: "#fffbeb", border: "#fde68a", text: "Estás en el límite recomendado. Asegúrate de no tener otras deudas significativas." };
  return { label: "Riesgo alto", color: "#dc2626", bg: "#fef2f2", border: "#fecaca", text: "La cuota supera el 36% de tus ingresos. Considera aumentar la entrada o bajar el monto." };
}

export default function IncomeCheck({ monthlyPayment }: Props) {
  const [income, setIncome] = useState<number | "">("");
  const [raw, setRaw] = useState("");

  const ratio = income !== "" && income > 0 ? (monthlyPayment / income) * 100 : null;
  const rating = ratio !== null ? getRating(ratio) : null;
  const barWidth = ratio !== null ? Math.min(ratio, 50) / 50 * 100 : 0;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}
    >
      <div className="px-5 py-3" style={{ background: "var(--surface-2)" }}>
        <p className="text-xs font-bold tracking-widest" style={{ color: "var(--text-3)" }}>
          ¿PUEDO PAGAR ESTO?
        </p>
      </div>

      <div className="p-5 space-y-4">
        <p className="text-sm" style={{ color: "var(--text-2)" }}>
          Ingresa tu ingreso mensual bruto (antes de impuestos) para saber si calificas según el estándar bancario del 28-36%.
        </p>

        {/* Input ingresos */}
        <div
          className="flex items-center rounded-xl px-4 py-3 gap-2"
          style={{ background: "var(--surface-2)", border: `1.5px solid ${rating ? rating.border : "var(--border-strong)"}` }}
        >
          <span className="font-bold text-sm" style={{ color: "var(--text-3)" }}>$</span>
          <input
            type="text"
            placeholder="Ej: 5,000"
            value={raw}
            onChange={(e) => {
              const digits = e.target.value.replace(/[^0-9]/g, "");
              const n = parseInt(digits, 10);
              if (digits === "") { setRaw(""); setIncome(""); return; }
              if (!isNaN(n)) {
                setRaw(n.toLocaleString("en-US"));
                setIncome(n);
              }
            }}
            className="bg-transparent outline-none flex-1 text-xl font-black"
            style={{ color: "var(--navy)" }}
          />
          <span className="text-sm font-bold" style={{ color: "var(--text-3)" }}>/mes</span>
        </div>

        {ratio !== null && rating && (
          <div className="space-y-3">
            {/* Barra de ratio */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span style={{ color: "var(--text-3)" }}>Cuota / Ingreso</span>
                <span className="font-black" style={{ color: rating.color }}>
                  {ratio.toFixed(1)}%
                </span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--surface-3)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${barWidth}%`, background: rating.color }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-3)" }}>
                <span>0%</span>
                <span className="text-green-600 font-semibold">28%</span>
                <span className="text-amber-500 font-semibold">36%</span>
                <span className="text-red-500 font-semibold">50%+</span>
              </div>
            </div>

            {/* Resultado */}
            <div
              className="rounded-xl p-4"
              style={{ background: rating.bg, border: `1px solid ${rating.border}` }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="text-xs font-black px-2 py-0.5 rounded-full"
                  style={{ background: rating.color, color: "white" }}
                >
                  {rating.label}
                </span>
                <span className="text-xs font-bold" style={{ color: rating.color }}>
                  {fmtDec(monthlyPayment)} de {fmt(income as number)} ingresos brutos
                </span>
              </div>
              <p className="text-xs" style={{ color: rating.color }}>
                {rating.text}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
