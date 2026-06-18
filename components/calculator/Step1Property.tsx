"use client";

import React from "react";
import { CalculatorData, PropertyType } from "@/types/calculator";
import { fmt, fmtCompact } from "@/lib/formatters";

const PROPERTY_TYPES: { id: PropertyType; label: string; svg: React.ReactNode; desc: string }[] = [
  {
    id: "casa", label: "Casa", desc: "Unifamiliar",
    svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>,
  },
  {
    id: "apartamento", label: "Apartamento", desc: "En conjunto",
    svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="2" width="18" height="20" rx="1"/><line x1="9" y1="2" x2="9" y2="22"/><line x1="3" y1="8" x2="9" y2="8"/><line x1="3" y1="14" x2="9" y2="14"/><line x1="14" y1="8" x2="20" y2="8"/><line x1="14" y1="14" x2="20" y2="14"/></svg>,
  },
  {
    id: "lote", label: "Lote", desc: "Terreno",
    svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20"/><path d="M5 20V12"/><path d="M19 20V12"/><path d="M2 12l5-5 5 3 5-6 5 8"/></svg>,
  },
];

const QUICK_VALUES = [150_000, 250_000, 350_000, 500_000, 750_000];
const VALUE_MIN = 50_000;
const VALUE_MAX = 2_000_000;

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
  onNext: () => void;
}

export default function Step1Property({ data, onChange, onNext }: Props) {
  return (
    <div className="space-y-4">
      <div
        className="rounded-lg overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border-strong)" }}
      >
        {/* Tipo de propiedad */}
        <div className="p-6 space-y-3">
          <p className="text-xs font-medium" style={{ color: "var(--text-3)" }}>
            ¿Qué vas a comprar?
          </p>
          <div className="grid grid-cols-3 gap-3">
            {PROPERTY_TYPES.map((pt) => {
              const active = data.propertyType === pt.id;
              return (
                <button
                  key={pt.id}
                  onClick={() => onChange({ propertyType: pt.id })}
                  className="py-4 rounded-xl flex flex-col items-center gap-1.5 transition-all duration-200"
                  style={active ? { ...PILL_ACTIVE, borderRadius: "12px" } : { ...PILL_INACTIVE, borderRadius: "12px" }}
                >
                  <span className="opacity-80">{pt.svg}</span>
                  <span className="text-sm font-bold">{pt.label}</span>
                  <span className="text-xs opacity-70">{pt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: 0 }} />

        {/* Valor del inmueble */}
        <div className="p-6 space-y-4">
          <p className="text-xs font-medium" style={{ color: "var(--text-3)" }}>
            Valor total del inmueble
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_VALUES.map((v) => (
              <button
                key={v}
                onClick={() => onChange({ propertyValue: v })}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200"
                style={data.propertyValue === v ? PILL_ACTIVE : PILL_INACTIVE}
              >
                {fmtCompact(v)}
              </button>
            ))}
          </div>
          <div
            className="flex items-center rounded-xl px-4 py-3"
            style={{ background: "var(--surface-2)", border: "1.5px solid var(--border-strong)" }}
          >
            <span className="mr-2 font-bold" style={{ color: "var(--text-3)" }}>$</span>
            <input
              type="text"
              value={data.propertyValue.toLocaleString("en-US")}
              onChange={(e) => {
                const n = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
                if (!isNaN(n)) onChange({ propertyValue: Math.min(VALUE_MAX, Math.max(VALUE_MIN, n)) });
              }}
              className="bg-transparent outline-none flex-1 text-xl font-semibold"
              style={{ color: "var(--navy)" }}
            />
          </div>
          <div>
            <input
              type="range"
              min={VALUE_MIN}
              max={VALUE_MAX}
              step={10_000}
              value={data.propertyValue}
              onChange={(e) => onChange({ propertyValue: Number(e.target.value) })}
              style={{ background: sliderBg(data.propertyValue, VALUE_MIN, VALUE_MAX) }}
            />
            <div className="flex justify-between text-xs mt-1.5" style={{ color: "var(--text-3)" }}>
              {["$50k", "$500k", "$1M", "$2M"].map((l) => <span key={l}>{l}</span>)}
            </div>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: 0 }} />

        {/* Primera vivienda */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--text-1)" }}>
                ¿Es tu primera vivienda?
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
                Puede aplicar condiciones especiales de financiamiento
              </p>
            </div>
            <button
              onClick={() => onChange({ firstHome: !data.firstHome })}
              className="w-14 h-7 rounded-full relative transition-all duration-300 flex-shrink-0"
              style={{ background: data.firstHome ? "var(--gradient)" : "var(--surface-3)" }}
            >
              <div
                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all duration-300"
                style={{ left: data.firstHome ? "calc(100% - 24px)" : "4px" }}
              />
            </button>
          </div>
          {data.firstHome && (
            <div
              className="mt-3 rounded-xl px-4 py-2.5 flex items-center gap-2"
              style={{ background: "var(--surface-2)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--blue-light)" }} />
              <p className="text-xs" style={{ color: "var(--text-2)" }}>
                Primera vivienda: podrías acceder a tasas preferenciales y menor cuota inicial.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Resumen rápido */}
      <div
        className="rounded-lg px-5 py-3 flex justify-between items-center"
        style={{ background: "var(--surface)", border: "1px solid var(--border-strong)" }}
      >
        <div>
          <p className="text-xs font-medium mb-0.5" style={{ color: "var(--text-3)" }}>
            Valor del inmueble
          </p>
          <p className="text-2xl font-bold" style={{ color: "var(--navy)" }}>
            {fmt(data.propertyValue)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs" style={{ color: "var(--text-3)" }}>
            {data.propertyType === "casa" ? "Casa" : data.propertyType === "apartamento" ? "Apartamento" : "Lote"}
          </p>
          <p className="text-xs mt-1" style={{ color: data.firstHome ? "var(--blue-mid)" : "var(--text-3)" }}>
            {data.firstHome ? "Primera vivienda" : "No primera vivienda"}
          </p>
        </div>
      </div>

      <button
        onClick={onNext}
        className="btn-primary w-full py-3.5 rounded-lg font-semibold text-white text-sm"
        style={{ background: "var(--navy)" }}
      >
        Continuar →
      </button>
    </div>
  );
}
