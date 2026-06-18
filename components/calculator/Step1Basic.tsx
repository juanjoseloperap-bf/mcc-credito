"use client";

import { useState, useCallback } from "react";
import { CalculatorData } from "@/types/calculator";
import { calcMonthlyPayment } from "@/lib/calculations";
import { fmtDec, fmt, fmtCompact } from "@/lib/formatters";

const QUICK_AMOUNTS = [100_000, 200_000, 350_000, 500_000, 750_000];
const YEAR_OPTIONS = [10, 15, 20, 25, 30];
const AMOUNT_MIN = 50_000;
const AMOUNT_MAX = 1_000_000;
const RATE_MIN = 0.5;
const RATE_MAX = 15;

interface Props {
  data: CalculatorData;
  onChange: (partial: Partial<CalculatorData>) => void;
  onNext: () => void;
}

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

export default function Step1Basic({ data, onChange, onNext }: Props) {
  const [amountText, setAmountText] = useState(data.amount.toLocaleString("en-US"));

  const monthly = calcMonthlyPayment(data.amount, data.rate, data.years);

  const setAmount = useCallback(
    (val: number) => {
      const clamped = Math.min(AMOUNT_MAX, Math.max(AMOUNT_MIN, val));
      onChange({ amount: clamped });
      setAmountText(clamped.toLocaleString("en-US"));
    },
    [onChange]
  );

  const handleAmountBlur = () => {
    const num = parseInt(amountText.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(num) && num > 0) setAmount(num);
    else setAmountText(data.amount.toLocaleString("en-US"));
  };

  return (
    <div className="space-y-4">

      {/* ── Form card ── */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border-strong)" }}
      >
        {/* Monto */}
        <div className="p-6 space-y-4">
          <p className="text-xs font-medium" style={{ color: "var(--text-3)" }}>
            Monto del crédito
          </p>

          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={data.amount === amt ? PILL_ACTIVE : PILL_INACTIVE}
              >
                {fmtCompact(amt)}
              </button>
            ))}
          </div>

          <div
            className="flex items-center rounded-lg px-4 py-3"
            style={{ background: "var(--surface-2)", border: "1.5px solid var(--border-strong)" }}
          >
            <span className="mr-2 text-base font-medium" style={{ color: "var(--text-3)" }}>$</span>
            <input
              type="text"
              value={amountText}
              onChange={(e) => setAmountText(e.target.value)}
              onFocus={() => setAmountText(data.amount.toString())}
              onBlur={handleAmountBlur}
              className="bg-transparent outline-none flex-1 text-xl font-semibold"
              style={{ color: "var(--navy)" }}
              placeholder="200,000"
            />
          </div>

          <div>
            <input
              type="range"
              min={AMOUNT_MIN}
              max={AMOUNT_MAX}
              step={5_000}
              value={Math.min(data.amount, AMOUNT_MAX)}
              onChange={(e) => setAmount(Number(e.target.value))}
              style={{ background: sliderBg(Math.min(data.amount, AMOUNT_MAX), AMOUNT_MIN, AMOUNT_MAX) }}
            />
            <div className="flex justify-between text-xs mt-1.5" style={{ color: "var(--text-3)" }}>
              {["$50k", "$250k", "$500k", "$750k", "$1M"].map((l) => <span key={l}>{l}</span>)}
            </div>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: 0 }} />

        {/* Plazo */}
        <div className="p-6 space-y-3">
          <p className="text-xs font-medium" style={{ color: "var(--text-3)" }}>Plazo</p>
          <div className="flex gap-2">
            {YEAR_OPTIONS.map((y) => (
              <button
                key={y}
                onClick={() => onChange({ years: y })}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 flex flex-col items-center gap-0.5"
                style={data.years === y ? PILL_ACTIVE : PILL_INACTIVE}
              >
                <span className="font-semibold">{y}</span>
                <span className="text-xs opacity-70">años</span>
              </button>
            ))}
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: 0 }} />

        {/* Tasa */}
        <div className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-xs font-medium" style={{ color: "var(--text-3)" }}>Tasa anual</p>
            <span className="text-2xl font-bold" style={{ color: "var(--navy)" }}>
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

      {/* ── Cuota estimada ── */}
      <div
        className="rounded-lg p-5"
        style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", borderLeft: "3px solid var(--navy)" }}
      >
        <p className="text-xs font-medium mb-2" style={{ color: "var(--text-3)" }}>
          Cuota mensual estimada
        </p>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-4xl font-bold" style={{ color: "var(--navy)" }}>{fmtDec(monthly)}</span>
          <span className="text-sm" style={{ color: "var(--text-3)" }}>/mes</span>
        </div>
        <p className="text-xs" style={{ color: "var(--text-3)" }}>
          Tasa fija · {data.years} años · Capital + Interés · {fmt(data.amount)} prestados
        </p>
      </div>

      {/* ── CTA ── */}
      <button
        onClick={onNext}
        className="btn-primary w-full py-3.5 rounded-lg font-semibold text-white text-sm"
        style={{ background: "var(--navy)" }}
      >
        Ver desglose completo →
      </button>
    </div>
  );
}
