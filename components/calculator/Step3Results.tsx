"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { CalculatorData } from "@/types/calculator";
import { calcMonthlyPayment, calcYearlyAmortization } from "@/lib/calculations";
import { fmt, fmtDec } from "@/lib/formatters";
import BreakdownDonut from "./charts/BreakdownDonut";
import BalanceChart from "./charts/BalanceChart";
import AmortizationTable from "./AmortizationTable";
import IncomeCheck from "./IncomeCheck";
import LeadCTA from "./LeadCTA";
import PrintReport from "@/components/PrintReport";

interface Props {
  data: CalculatorData;
  onBack: () => void;
  showPropertySummary?: boolean;
}


function StatCard({ label, value, sub }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div
      className="rounded-lg p-4 flex flex-col gap-1"
      style={{ background: "var(--surface)", border: "1px solid var(--border-strong)" }}
    >
      <p className="text-xs font-medium" style={{ color: "var(--text-3)" }}>{label}</p>
      <p className="text-base font-semibold" style={{ color: "var(--navy)" }}>{value}</p>
      {sub && <p className="text-xs" style={{ color: "var(--text-3)" }}>{sub}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border-strong)" }}>
      <div className="px-5 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
        <p className="text-xs font-medium" style={{ color: "var(--text-3)" }}>{title}</p>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

const PROP_LABEL: Record<string, string> = {
  casa: "Casa",
  apartamento: "Apartamento",
  lote: "Lote",
};

export default function Step3Results({ data, onBack, showPropertySummary = true }: Props) {
  const baseMonthly = calcMonthlyPayment(data.amount, data.rate, data.years);
  const extras =
    (data.predial || 0) / 12 +
    (data.seguroHogar || 0) / 12 +
    (data.hoa || 0) +
    (data.pmi || 0);
  const totalMonthly = baseMonthly + extras;

  const loanPaid = baseMonthly * data.years * 12;
  const totalInterest = loanPaid - data.amount;
  const totalExtras = extras * data.years * 12;
  const totalPaid = loanPaid + totalExtras;
  const interestRatio = ((totalInterest / data.amount) * 100).toFixed(0);
  const downPayment = Math.round(data.propertyValue * (data.downPaymentPct / 100));
  const ltv = 100 - data.downPaymentPct;

  const yearly = useMemo(
    () => calcYearlyAmortization(data.amount, data.rate, data.years),
    [data.amount, data.rate, data.years]
  );
  const hasExtras = extras > 0;

  return (
    <div className="space-y-5">

      {/* ── Resumen del inmueble (solo modo completo) ── */}
      {showPropertySummary && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border-strong)" }}
        >
          <div className="px-5 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <span className="text-xs font-medium" style={{ color: "var(--text-3)" }}>
              Resumen del inmueble
            </span>
          </div>
          <div className="grid grid-cols-3 divide-x" style={{ borderColor: "var(--border)" }}>
            {[
              { label: "Valor total", value: fmt(data.propertyValue), sub: PROP_LABEL[data.propertyType] || "" },
              { label: `Entrada ${data.downPaymentPct}%`, value: fmt(downPayment), sub: "Dinero propio" },
              { label: `Crédito (LTV ${ltv}%)`, value: fmt(data.amount), sub: data.firstHome ? "Primera vivienda" : "Segunda vivienda" },
            ].map((item) => (
              <div key={item.label} className="p-4">
                <p className="text-xs mb-1" style={{ color: "var(--text-3)" }}>{item.label}</p>
                <p className="text-base font-semibold" style={{ color: "var(--navy)" }}>{item.value}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Cuota mensual ── */}
      <motion.div
        className="rounded-lg p-5"
        style={{ background: "var(--surface)", border: "1px solid var(--border-strong)", borderLeft: "3px solid var(--navy)" }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        <p className="text-xs font-medium mb-2" style={{ color: "var(--text-3)" }}>
          {hasExtras ? "Cuota mensual total estimada" : "Cuota mensual estimada"}
        </p>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-bold" style={{ color: "var(--navy)" }}>
            {fmtDec(totalMonthly)}
          </span>
          <span className="text-sm" style={{ color: "var(--text-3)" }}>/mes</span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: "var(--text-3)" }}>
          <span>{fmt(data.amount)} · {data.years} años · {data.rate}% anual</span>
          {hasExtras && <span>Capital + interés: {fmtDec(baseMonthly)}</span>}
        </div>
      </motion.div>

      {/* ── Validación de capacidad de pago ── */}
      <IncomeCheck monthlyPayment={totalMonthly} />

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total intereses", value: fmt(totalInterest), sub: `${interestRatio}% del capital` },
          { label: "Costo total", value: fmt(totalPaid), sub: hasExtras ? `Incluye costos adicionales · ${data.years} años` : `En ${data.years} años` },
          {
            label: showPropertySummary ? "Cuota inicial" : "Capital",
            value: showPropertySummary ? fmt(downPayment) : fmt(data.amount),
            sub: showPropertySummary ? `${data.downPaymentPct}% del valor` : `A ${data.years} años`,
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26, delay: 0.08 + i * 0.07 }}
            whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(27,35,96,0.10)" }}
            style={{ borderRadius: 8 }}
          >
            <StatCard label={s.label} value={s.value} sub={s.sub} />
          </motion.div>
        ))}
      </div>

      {/* ── Desglose ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26, delay: 0.28 }}
      >
        <Section title="¿Qué estás pagando realmente?">
          <BreakdownDonut capital={data.amount} interest={totalInterest} />
        </Section>
      </motion.div>

      {/* ── Balance chart ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26, delay: 0.36 }}
      >
        <Section title="Progreso e hitos del crédito">
          <BalanceChart data={yearly} />
        </Section>
      </motion.div>

      {/* ── CTA de conversión ── */}
      <LeadCTA amount={data.amount} monthly={totalMonthly} years={data.years} />

      {/* ── Table ── */}
      <Section title="Tabla de amortización anual">
        <AmortizationTable rows={yearly} />
      </Section>

      {/* ── Actions ── */}
      <div className="flex gap-3 pb-6 no-print">
        <button
          onClick={onBack}
          className="flex-1 py-3.5 rounded-xl font-medium text-sm transition-all hover:opacity-70"
          style={{ background: "var(--surface-2)", color: "var(--text-2)", border: "1px solid var(--border-strong)" }}
        >
          ← Calcular de nuevo
        </button>
        <button
          onClick={() => window.print()}
          className="btn-primary flex-1 py-3.5 rounded-xl font-semibold text-white text-sm"
          style={{ background: "var(--navy)" }}
        >
          Descargar informe
        </button>
      </div>

      {/* ── Print report (solo visible al imprimir) ── */}
      <PrintReport
        data={data}
        totalMonthly={totalMonthly}
        baseMonthly={baseMonthly}
        totalInterest={totalInterest}
        totalPaid={totalPaid}
        yearly={yearly}
        showPropertySummary={showPropertySummary}
      />
    </div>
  );
}
