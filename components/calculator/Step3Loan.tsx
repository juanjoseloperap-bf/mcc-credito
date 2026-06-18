"use client";

import { motion } from "framer-motion";
import { CalculatorData } from "@/types/calculator";
import { calcMonthlyPayment } from "@/lib/calculations";
import { fmt, fmtDec } from "@/lib/formatters";

const YEAR_OPTIONS = [10, 15, 20, 25, 30];
const RATE_MIN = 0.5;
const RATE_MAX = 15;

function sliderBg(value: number, min: number, max: number) {
  const p = Math.round(((value - min) / (max - min)) * 100);
  return `linear-gradient(to right, #1b2360 ${p}%, #e2eef8 ${p}%)`;
}

const PILL_ACTIVE = {
  background: "var(--navy)",
  color: "#fff",
  border: "1.5px solid var(--navy)",
};
const PILL_INACTIVE = {
  background: "var(--surface)",
  color: "var(--text-2)",
  border: "1.5px solid var(--border-strong)",
};

interface Props {
  data: CalculatorData;
  onChange: (partial: Partial<CalculatorData>) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function Step3Loan({ data, onChange, onBack, onNext }: Props) {
  const monthly = calcMonthlyPayment(data.amount, data.rate, data.years);

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border-strong)" }}
      >
        {/* Monto a financiar — solo lectura */}
        <div className="p-6">
          <p className="text-xs font-medium mb-3" style={{ color: "var(--text-3)" }}>
            MONTO A FINANCIAR
          </p>
          <div
            className="rounded-xl px-5 py-4 flex justify-between items-center"
            style={{ background: "var(--surface-2)", border: "1.5px solid var(--border-strong)" }}
          >
            <div>
              <p className="text-3xl font-bold" style={{ color: "var(--navy)" }}>
                {fmt(data.amount)}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>
                {fmt(data.propertyValue)} − {data.downPaymentPct}% de entrada
              </p>
            </div>
            <div
              className="px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{ background: "var(--gradient-soft)", color: "var(--navy)" }}
            >
              LTV {100 - data.downPaymentPct}%
            </div>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: 0 }} />

        {/* Plazo */}
        <div className="p-6 space-y-3">
          <p className="text-xs font-medium" style={{ color: "var(--text-3)" }}>PLAZO</p>
          <div className="flex gap-2">
            {YEAR_OPTIONS.map((y) => (
              <button
                key={y}
                onClick={() => onChange({ years: y })}
                className="flex-1 py-3 rounded-xl font-bold transition-all duration-200 flex flex-col items-center gap-0.5"
                style={data.years === y ? PILL_ACTIVE : PILL_INACTIVE}
              >
                <span className="text-lg font-black">{y}</span>
                <span className="text-xs opacity-80">años</span>
              </button>
            ))}
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: 0 }} />

        {/* Tasa */}
        <div className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-xs font-medium" style={{ color: "var(--text-3)" }}>TASA ANUAL</p>
            <span className="text-3xl font-bold" style={{ color: "var(--navy)" }}>
              {data.rate.toFixed(2)}%
            </span>
          </div>
          <input
            type="range"
            min={RATE_MIN}
            max={RATE_MAX}
            step={0.25}
            value={data.rate}
            onChange={(e) => onChange({ rate: Number(e.target.value) })}
            style={{ background: sliderBg(data.rate, RATE_MIN, RATE_MAX) }}
          />
          <div className="flex justify-between text-xs" style={{ color: "var(--text-3)" }}>
            {["0.5%", "5%", "10%", "15%"].map((l) => <span key={l}>{l}</span>)}
          </div>
        </div>
      </div>

      {/* Preview en vivo */}
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--surface)", border: "1px solid var(--border-strong)" }}
      >
        <p className="text-xs mb-2" style={{ color: "var(--text-3)" }}>Cuota mensual estimada</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold" style={{ color: "var(--navy)" }}>{fmtDec(monthly)}</span>
          <span className="text-sm" style={{ color: "var(--text-3)" }}>/mes</span>
        </div>
        <p className="text-xs mt-1.5" style={{ color: "var(--text-3)" }}>
          Tasa fija · {data.years} años · Capital + Interés
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3.5 rounded-xl font-medium text-sm transition-all hover:opacity-70"
          style={{ background: "var(--surface-2)", color: "var(--text-2)", border: "1px solid var(--border-strong)" }}
        >
          ← Atrás
        </button>
        <button
          onClick={onNext}
          className="btn-primary flex-[2] py-3.5 rounded-lg font-semibold text-white text-sm"
          style={{ background: "var(--navy)" }}
        >
          Ver costos adicionales →
        </button>
      </div>
    </div>
  );
}
