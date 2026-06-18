"use client";

import { CalculatorData } from "@/types/calculator";
import { fmt } from "@/lib/formatters";

const PCT_MIN = 10;
const PCT_MAX = 50;
const QUICK_PCTS = [10, 20, 30, 40];

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

export default function Step2DownPayment({ data, onChange, onBack, onNext }: Props) {
  const downPayment = Math.round(data.propertyValue * (data.downPaymentPct / 100));
  const toFinance = data.propertyValue - downPayment;
  const entradaPct = data.downPaymentPct;
  const financePct = 100 - entradaPct;

  return (
    <div className="space-y-4">
      <div
        className="rounded-lg overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border-strong)" }}
      >
        {/* Slider de porcentaje */}
        <div className="p-6 space-y-5">
          <p className="text-xs font-medium" style={{ color: "var(--text-3)" }}>
            ¿Cuánto tienes de cuota inicial?
          </p>

          {/* Número grande */}
          <div className="text-center py-2">
            <span className="text-7xl font-bold" style={{ color: "var(--navy)" }}>
              {data.downPaymentPct}
            </span>
            <span className="text-3xl font-bold" style={{ color: "var(--blue-mid)" }}>%</span>
            <p className="text-sm mt-1" style={{ color: "var(--text-3)" }}>de cuota inicial</p>
          </div>

          {/* Quick pcts */}
          <div className="flex gap-2">
            {QUICK_PCTS.map((p) => (
              <button
                key={p}
                onClick={() => onChange({ downPaymentPct: p })}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                style={data.downPaymentPct === p ? PILL_ACTIVE : PILL_INACTIVE}
              >
                {p}%
              </button>
            ))}
          </div>

          <div>
            <input
              type="range"
              min={PCT_MIN}
              max={PCT_MAX}
              step={1}
              value={data.downPaymentPct}
              onChange={(e) => onChange({ downPaymentPct: Number(e.target.value) })}
              style={{ background: sliderBg(data.downPaymentPct, PCT_MIN, PCT_MAX) }}
            />
            <div className="flex justify-between text-xs mt-1.5" style={{ color: "var(--text-3)" }}>
              <span>10%</span><span>20%</span><span>30%</span><span>40%</span><span>50%</span>
            </div>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: 0 }} />

        {/* Barra visual entrada vs financiado */}
        <div className="p-6 space-y-4">
          <p className="text-xs font-medium" style={{ color: "var(--text-3)" }}>
            Así se divide tu compra
          </p>

          {/* Barra */}
          <div className="h-4 rounded overflow-hidden flex">
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${entradaPct}%`, background: "var(--navy)" }}
            />
            <div className="h-full flex-1" style={{ background: "var(--surface-3)" }} />
          </div>

          {/* Leyenda */}
          <div className="flex justify-between gap-4">
            <div className="flex items-start gap-2">
              <div className="w-3 h-3 rounded-sm mt-0.5 flex-shrink-0" style={{ background: "var(--navy)" }} />
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--text-2)" }}>
                  Tu entrada ({entradaPct}%)
                </p>
                <p className="text-xl font-bold" style={{ color: "var(--navy)" }}>
                  {fmt(downPayment)}
                </p>
                <p className="text-xs" style={{ color: "var(--text-3)" }}>
                  Necesitas tener este dinero disponible
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-right">
              <div className="flex-1">
                <p className="text-xs font-medium" style={{ color: "var(--text-2)" }}>
                  A financiar ({financePct}%)
                </p>
                <p className="text-xl font-bold" style={{ color: "var(--blue-mid)" }}>
                  {fmt(toFinance)}
                </p>
                <p className="text-xs" style={{ color: "var(--text-3)" }}>
                  Lo que pedirás al banco
                </p>
              </div>
              <div className="w-3 h-3 rounded-sm mt-0.5 flex-shrink-0" style={{ background: "var(--surface-3)", border: "1.5px solid var(--border-strong)" }} />
            </div>
          </div>

          {/* LTV */}
          <div
            className="rounded-lg px-4 py-3 flex justify-between items-center"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
          >
            <div>
              <p className="text-xs font-medium" style={{ color: "var(--text-3)" }}>LTV (Loan-to-Value)</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
                Relación entre el crédito y el valor del inmueble
              </p>
            </div>
            <span
              className="text-2xl font-bold"
              style={{ color: financePct <= 70 ? "var(--success)" : financePct <= 80 ? "var(--blue-mid)" : "var(--navy)" }}
            >
              {financePct}%
            </span>
          </div>

          {data.firstHome && data.downPaymentPct >= 10 && data.downPaymentPct < 20 && (
            <div
              className="rounded-lg px-4 py-2.5 flex gap-2"
              style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
            >
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5" style={{ background: "#16a34a" }} />
              <p className="text-xs" style={{ color: "#166534" }}>
                Con primera vivienda puedes aplicar con el 10% de entrada en algunos programas.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3.5 rounded-lg font-medium text-sm transition-all hover:opacity-70"
          style={{ background: "var(--surface)", color: "var(--text-2)", border: "1px solid var(--border-strong)" }}
        >
          ← Atrás
        </button>
        <button
          onClick={onNext}
          className="btn-primary flex-[2] py-3.5 rounded-lg font-semibold text-white text-sm"
          style={{ background: "var(--navy)" }}
        >
          Continuar →
        </button>
      </div>
    </div>
  );
}
