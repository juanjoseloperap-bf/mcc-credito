"use client";

import { useState } from "react";
import { CalculatorData } from "@/types/calculator";
import { calcMonthlyPayment } from "@/lib/calculations";
import { fmtDec, fmt } from "@/lib/formatters";

interface CostField {
  key: keyof CalculatorData;
  label: string;
  sublabel: string;
  max: number;
}

const FIELDS: CostField[] = [
  { key: "predial", label: "Impuesto predial", sublabel: "Anual", max: 20_000 },
  { key: "seguroHogar", label: "Seguro de hogar", sublabel: "Anual", max: 10_000 },
  { key: "hoa", label: "Cuota de administración", sublabel: "Mensual", max: 2_000 },
  { key: "pmi", label: "Seguro hipotecario", sublabel: "Mensual", max: 1_000 },
];

interface Props {
  data: CalculatorData;
  onChange: (partial: Partial<CalculatorData>) => void;
  onBack: () => void;
  onNext: () => void;
}

function sliderBg(value: number, max: number) {
  const p = Math.round((value / max) * 100);
  return `linear-gradient(to right, #4dbde8 0%, #1b2360 ${p}%, #e2eef8 ${p}%)`;
}

export default function Step2Costs({ data, onChange, onBack, onNext }: Props) {
  const [active, setActive] = useState<Set<string>>(
    () => new Set(FIELDS.filter((f) => (data[f.key] as number) > 0).map((f) => f.key))
  );

  const toggle = (key: string) => {
    if (active.has(key)) {
      onChange({ [key]: 0 });
      setActive((prev) => { const n = new Set(prev); n.delete(key); return n; });
    } else {
      setActive((prev) => { const n = new Set(prev); n.add(key); return n; });
    }
  };

  const baseMonthly = calcMonthlyPayment(data.amount, data.rate, data.years);
  const extras =
    (data.predial || 0) / 12 +
    (data.seguroHogar || 0) / 12 +
    (data.hoa || 0) +
    (data.pmi || 0);
  const totalMonthly = baseMonthly + extras;

  return (
    <div className="space-y-5">
      <p className="text-sm text-center" style={{ color: "var(--text-2)" }}>
        Estos costos son opcionales — actívalos solo si aplican a tu caso.
      </p>

      <div className="space-y-3">
        {FIELDS.map((field) => {
          const isOn = active.has(field.key);
          const value = (data[field.key] as number) || 0;

          return (
            <div
              key={field.key}
              className="rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                background: "var(--surface)",
                boxShadow: isOn ? "0 0 0 2px var(--blue-light), var(--shadow-sm)" : "var(--shadow-sm)",
              }}
            >
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer"
                onClick={() => toggle(field.key)}
              >
                <div>
                  <p className="font-bold text-sm" style={{ color: "var(--text-1)" }}>{field.label}</p>
                  <p className="text-xs" style={{ color: "var(--text-3)" }}>{field.sublabel}</p>
                </div>
                <div className="flex items-center gap-3">
                  {isOn && (
                    <span className="text-sm font-black" style={{ color: "var(--navy)" }}>
                      {fmt(value)}
                    </span>
                  )}
                  <div
                    className="w-11 h-6 rounded-full relative transition-all duration-300 flex-shrink-0"
                    style={{ background: isOn ? "var(--gradient)" : "var(--surface-3)" }}
                  >
                    <div
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
                      style={{ left: isOn ? "calc(100% - 20px)" : "4px" }}
                    />
                  </div>
                </div>
              </div>

              {isOn && (
                <div className="px-5 pb-5 space-y-3" style={{ borderTop: "1px solid var(--border)" }}>
                  <div
                    className="flex items-center rounded-xl px-4 py-2.5 mt-4"
                    style={{ background: "var(--surface-2)", border: "1.5px solid var(--border-strong)" }}
                  >
                    <span className="mr-2 font-bold" style={{ color: "var(--text-3)" }}>$</span>
                    <input
                      type="number"
                      min={0}
                      max={field.max}
                      value={value || ""}
                      onChange={(e) =>
                        onChange({ [field.key]: Math.max(0, Math.min(field.max, Number(e.target.value))) })
                      }
                      placeholder="0"
                      className="bg-transparent outline-none flex-1 font-black text-base"
                      style={{ color: "var(--navy)" }}
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={field.max}
                    step={Math.max(1, field.max / 200)}
                    value={value}
                    onChange={(e) => onChange({ [field.key]: Number(e.target.value) })}
                    style={{ background: sliderBg(value, field.max) }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {extras > 0 && (
        <div
          className="rounded-2xl p-4 flex justify-between items-center"
          style={{ background: "var(--surface-2)", border: "1.5px solid var(--border-strong)" }}
        >
          <span className="text-sm font-semibold" style={{ color: "var(--text-2)" }}>
            Total mensual estimado
          </span>
          <span className="text-2xl font-black" style={{ color: "var(--navy)" }}>
            {fmtDec(totalMonthly)}
          </span>
        </div>
      )}

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
          Ver mi resultado →
        </button>
      </div>

      <button
        onClick={onNext}
        className="w-full text-center text-sm transition-all hover:opacity-70"
        style={{ color: "var(--text-3)" }}
      >
        Saltar este paso
      </button>
    </div>
  );
}
