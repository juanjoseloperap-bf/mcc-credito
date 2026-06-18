"use client";

import { useState } from "react";
import { calcMaxLoan } from "@/lib/calculations";
import { fmt, fmtDec } from "@/lib/formatters";
import { CalculatorData } from "@/types/calculator";

const QUICK_PAYMENTS = [800, 1_200, 1_500, 2_000, 2_500];
const YEAR_OPTIONS = [10, 15, 20, 25, 30];
const PCT_OPTIONS = [10, 15, 20, 25, 30];
const RATE_MIN = 0.5;
const RATE_MAX = 15;

function sliderBg(value: number, min: number, max: number) {
  const p = Math.round(((value - min) / (max - min)) * 100);
  return `linear-gradient(to right, #1b2360 ${p}%, #e4eaf1 ${p}%)`;
}

interface Props {
  data: CalculatorData;
  onChange: (partial: Partial<CalculatorData>) => void;
  onNext: (computed: Partial<CalculatorData>) => void;
}

export default function StepInverse({ data, onChange, onNext }: Props) {
  const [targetPayment, setTargetPayment] = useState(1_500);
  const [raw, setRaw] = useState("1,500");

  const maxLoan = Math.round(calcMaxLoan(targetPayment, data.rate, data.years));
  const maxProperty = data.downPaymentPct < 100
    ? Math.round(maxLoan / (1 - data.downPaymentPct / 100))
    : maxLoan;
  const downPaymentNeeded = maxProperty - maxLoan;

  const pill = (active: boolean) =>
    active
      ? { background: "var(--navy)", color: "#fff", border: "1px solid var(--navy)" }
      : { background: "var(--surface-2)", color: "var(--text-2)", border: "1px solid var(--border-strong)" };

  const handleNext = () => {
    onNext({
      amount: maxLoan,
      propertyValue: maxProperty,
      downPaymentPct: data.downPaymentPct,
      years: data.years,
      rate: data.rate,
    });
  };

  return (
    <div className="space-y-4">

      {/* Cuota objetivo */}
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border-strong)" }}>
        <div className="p-6 space-y-5">
          <p className="text-xs font-medium" style={{ color: "var(--text-3)" }}>
            ¿Cuánto puedes pagar al mes?
          </p>

          {/* Input grande */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold" style={{ color: "var(--text-3)" }}>$</span>
            <input
              type="text"
              value={raw}
              onChange={(e) => {
                const digits = e.target.value.replace(/[^0-9]/g, "");
                const n = parseInt(digits, 10);
                if (digits === "") { setRaw(""); setTargetPayment(0); return; }
                if (!isNaN(n)) { setRaw(n.toLocaleString("en-US")); setTargetPayment(n); }
              }}
              className="bg-transparent outline-none text-5xl font-bold w-full"
              style={{ color: "var(--navy)" }}
              placeholder="0"
            />
            <span className="text-lg mb-1" style={{ color: "var(--text-3)" }}>/mes</span>
          </div>

          {/* Quick pills */}
          <div className="flex gap-2 flex-wrap">
            {QUICK_PAYMENTS.map((p) => (
              <button
                key={p}
                onClick={() => { setTargetPayment(p); setRaw(p.toLocaleString("en-US")); }}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={pill(targetPayment === p)}
              >
                {fmtDec(p)}
              </button>
            ))}
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

        {/* Plazo */}
        <div className="p-5 space-y-3">
          <p className="text-xs font-medium" style={{ color: "var(--text-3)" }}>Plazo</p>
          <div className="flex gap-2">
            {YEAR_OPTIONS.map((y) => (
              <button
                key={y}
                onClick={() => onChange({ years: y })}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-0"
                style={pill(data.years === y)}
              >
                <span className="font-bold">{y}</span>
                <span className="text-xs opacity-70">años</span>
              </button>
            ))}
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

        {/* Tasa */}
        <div className="p-5 space-y-2">
          <div className="flex justify-between">
            <p className="text-xs font-medium" style={{ color: "var(--text-3)" }}>Tasa anual</p>
            <span className="text-sm font-semibold" style={{ color: "var(--navy)" }}>{data.rate.toFixed(2)}%</span>
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
            <span>0.5%</span><span>15%</span>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />

        {/* Cuota inicial */}
        <div className="p-5 space-y-3">
          <p className="text-xs font-medium" style={{ color: "var(--text-3)" }}>Cuota inicial</p>
          <div className="flex gap-2">
            {PCT_OPTIONS.map((p) => (
              <button
                key={p}
                onClick={() => onChange({ downPaymentPct: p })}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                style={pill(data.downPaymentPct === p)}
              >
                {p}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resultado en vivo */}
      {targetPayment > 0 && maxProperty > 0 && (
        <div
          className="rounded-lg overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", borderLeft: "3px solid var(--navy)" }}
        >
          <div className="p-5">
            <p className="text-xs font-medium mb-2" style={{ color: "var(--text-3)" }}>
              Con {fmtDec(targetPayment)}/mes puedes comprar hasta
            </p>
            <p className="text-3xl font-bold mb-4" style={{ color: "var(--navy)" }}>
              {fmt(maxProperty)}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg p-3" style={{ background: "var(--surface-2)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--text-3)" }}>Crédito máximo</p>
                <p className="font-semibold" style={{ color: "var(--navy)" }}>{fmt(maxLoan)}</p>
              </div>
              <div className="rounded-lg p-3" style={{ background: "var(--surface-2)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--text-3)" }}>Entrada necesaria ({data.downPaymentPct}%)</p>
                <p className="font-semibold" style={{ color: "var(--navy)" }}>{fmt(downPaymentNeeded)}</p>
              </div>
            </div>

            {/* Barra visual */}
            <div className="mt-4 space-y-1.5">
              <div className="h-2 rounded-full overflow-hidden flex" style={{ background: "var(--surface-3)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${data.downPaymentPct}%`, background: "var(--navy)" }}
                />
                <div
                  className="h-full flex-1"
                  style={{ background: "var(--blue-light)", opacity: 0.4 }}
                />
              </div>
              <div className="flex justify-between text-xs" style={{ color: "var(--text-3)" }}>
                <span>Entrada {data.downPaymentPct}%</span>
                <span>Crédito {100 - data.downPaymentPct}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={!maxProperty}
        className="btn-primary w-full py-4 rounded-xl font-semibold text-white text-sm disabled:opacity-40"
        style={{ background: "var(--navy)" }}
      >
        Ver análisis completo →
      </button>
    </div>
  );
}
