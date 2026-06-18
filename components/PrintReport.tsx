"use client";

import { CalculatorData, YearlyRow } from "@/types/calculator";
import { fmt, fmtDec } from "@/lib/formatters";

interface Props {
  data: CalculatorData;
  totalMonthly: number;
  baseMonthly: number;
  totalInterest: number;
  totalPaid: number;
  yearly: YearlyRow[];
  showPropertySummary?: boolean;
}

const PROP_LABEL: Record<string, string> = {
  casa: "Casa unifamiliar",
  apartamento: "Apartamento",
  lote: "Lote / Terreno",
};

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <tr>
      <td style={{ padding: "5px 0", color: "#555", fontSize: 10, width: "50%", borderBottom: "1px solid #eee" }}>
        {label}
      </td>
      <td style={{ padding: "5px 0", textAlign: "right", fontWeight: bold ? 700 : 400, fontSize: 10, color: "#1b2360", borderBottom: "1px solid #eee" }}>
        {value}
      </td>
    </tr>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 8,
      fontWeight: 700,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      color: "#1b2360",
      borderBottom: "1.5px solid #1b2360",
      paddingBottom: 4,
      marginBottom: 10,
      marginTop: 18,
    }}>
      {children}
    </div>
  );
}

export default function PrintReport({ data, totalMonthly, baseMonthly, totalInterest, totalPaid, yearly, showPropertySummary = true }: Props) {
  const today = new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });
  const downPayment = Math.round(data.propertyValue * (data.downPaymentPct / 100));
  const ltv = 100 - data.downPaymentPct;
  const capitalPct = totalPaid > 0 ? ((data.amount / totalPaid) * 100).toFixed(1) : "0.0";
  const interestPct = totalPaid > 0 ? ((totalInterest / totalPaid) * 100).toFixed(1) : "0.0";
  const costPerDollar = data.amount > 0 ? (totalInterest / data.amount).toFixed(2) : "0.00";
  const hasExtras = totalMonthly > baseMonthly;
  const principal = data.amount;

  // Hitos
  const m25 = yearly.find((r) => r.balance <= principal * 0.75);
  const m50 = yearly.find((r) => r.balance <= principal * 0.50);
  const m75 = yearly.find((r) => r.balance <= principal * 0.25);

  const wrap: React.CSSProperties = {
    fontFamily: "-apple-system, Arial, Helvetica, sans-serif",
    color: "#111",
    fontSize: 10,
    lineHeight: 1.55,
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    WebkitPrintColorAdjust: "exact",
    printColorAdjust: "exact",
  } as React.CSSProperties;

  return (
    <div className="print-only" style={wrap}>

      {/* ════════════════════════════════════
          PÁGINA 1
      ════════════════════════════════════ */}

      {/* Header */}
      <table style={{ width: "100%", borderBottom: "2px solid #1b2360", paddingBottom: 10, marginBottom: 16, borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ verticalAlign: "top" }}>
              <img src="/logo-transformamos-vidas.png" alt="Mi Casa Crédito" style={{ height: 36, width: "auto" }} />
            </td>
            <td style={{ textAlign: "right", verticalAlign: "top" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1b2360" }}>Análisis de Crédito Hipotecario</div>
              <div style={{ fontSize: 9, color: "#888", marginTop: 2 }}>Generado el {today} · Documento estimativo</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── Datos del escenario ── */}
      <SectionTitle>1. Datos del escenario</SectionTitle>
      {showPropertySummary ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: "33%", verticalAlign: "top", paddingRight: 12 }}>
                <div style={{ fontSize: 8, color: "#888", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.8 }}>Inmueble</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1b2360" }}>{fmt(data.propertyValue)}</div>
                <div style={{ fontSize: 9, color: "#555", marginTop: 2 }}>{PROP_LABEL[data.propertyType]}</div>
                <div style={{ fontSize: 9, color: "#555" }}>{data.firstHome ? "Primera vivienda" : "Segunda vivienda"}</div>
              </td>
              <td style={{ width: 1, background: "#dde3ec", padding: 0 }} />
              <td style={{ width: "33%", verticalAlign: "top", padding: "0 12px" }}>
                <div style={{ fontSize: 8, color: "#888", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.8 }}>Cuota inicial</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1b2360" }}>{fmt(downPayment)}</div>
                <div style={{ fontSize: 9, color: "#555", marginTop: 2 }}>{data.downPaymentPct}% del valor total</div>
                <div style={{ fontSize: 9, color: "#555" }}>Dinero propio</div>
              </td>
              <td style={{ width: 1, background: "#dde3ec", padding: 0 }} />
              <td style={{ width: "33%", verticalAlign: "top", paddingLeft: 12 }}>
                <div style={{ fontSize: 8, color: "#888", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.8 }}>Monto del crédito</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1b2360" }}>{fmt(data.amount)}</div>
                <div style={{ fontSize: 9, color: "#555", marginTop: 2 }}>LTV {ltv}% · {data.years} años</div>
                <div style={{ fontSize: 9, color: "#555" }}>Tasa fija {data.rate}% anual</div>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ width: "50%", verticalAlign: "top", paddingRight: 12 }}>
                <div style={{ fontSize: 8, color: "#888", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.8 }}>Monto del crédito</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1b2360" }}>{fmt(data.amount)}</div>
                <div style={{ fontSize: 9, color: "#555", marginTop: 2 }}>Estimación rápida</div>
              </td>
              <td style={{ width: 1, background: "#dde3ec", padding: 0 }} />
              <td style={{ width: "50%", verticalAlign: "top", paddingLeft: 12 }}>
                <div style={{ fontSize: 8, color: "#888", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.8 }}>Condiciones</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1b2360" }}>{data.years} años · {data.rate}% anual</div>
                <div style={{ fontSize: 9, color: "#555", marginTop: 2 }}>Tasa fija</div>
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {/* ── Cuota mensual ── */}
      <SectionTitle>2. Cuota mensual estimada</SectionTitle>
      <div style={{ background: "#1b2360", borderRadius: 6, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.6)", letterSpacing: 1, marginBottom: 2 }}>
            {hasExtras ? "TOTAL MENSUAL (incluye costos adicionales)" : "CAPITAL + INTERÉS MENSUAL"}
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: -0.5 }}>
            {fmtDec(totalMonthly)}
          </div>
          {hasExtras && (
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
              Solo capital + interés: {fmtDec(baseMonthly)}
            </div>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.6)", letterSpacing: 1 }}>PLAZO</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{data.years} años</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>{data.years * 12} cuotas mensuales</div>
        </div>
      </div>

      {/* ── Costo real ── */}
      <SectionTitle>3. ¿Qué estás pagando realmente?</SectionTitle>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8 }}>
        <tbody>
          <Row label="Capital (monto que pediste)" value={fmt(data.amount)} />
          <Row label={`Intereses (costo del crédito en ${data.years} años)`} value={fmt(totalInterest)} />
          <Row label="Total a pagar" value={fmt(totalPaid)} bold />
        </tbody>
      </table>
      {/* Barra */}
      <div style={{ height: 10, borderRadius: 4, overflow: "hidden", display: "flex", marginBottom: 4, background: "#eee" }}>
        <div style={{ width: `${capitalPct}%`, background: "#1b2360" }} />
        <div style={{ flex: 1, background: "#2a9fd6" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: "#888", marginBottom: 8 }}>
        <span>Capital {capitalPct}%</span>
        <span>Intereses {interestPct}%</span>
      </div>
      <div style={{ background: "#f0f4f8", borderLeft: "3px solid #1b2360", padding: "6px 10px", fontSize: 9, color: "#333", borderRadius: "0 4px 4px 0" }}>
        Por cada <strong>$1</strong> prestado, pagarás <strong>${costPerDollar}</strong> adicionales en intereses al banco.
      </div>

      {/* ── Hitos ── */}
      <SectionTitle>4. Hitos clave del crédito</SectionTitle>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            {[
              m25 && { year: m25.year, text: "25% del crédito pagado", balance: m25.balance },
              m50 && { year: m50.year, text: "Deuda a la mitad", balance: m50.balance },
              m75 && { year: m75.year, text: "75% del crédito pagado", balance: m75.balance },
            ].filter(Boolean).map((m: any, i, arr) => (
              <td key={m.year} style={{ width: `${100 / arr.length}%`, verticalAlign: "top", paddingRight: i < arr.length - 1 ? 8 : 0 }}>
                <div style={{ border: "1px solid #dde3ec", borderRadius: 4, padding: "8px 10px" }}>
                  <div style={{ fontSize: 8, color: "#888", marginBottom: 2 }}>Año {m.year}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#1b2360", marginBottom: 2 }}>{m.text}</div>
                  <div style={{ fontSize: 8, color: "#888" }}>Saldo: {fmt(m.balance)}</div>
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {/* ════════════════════════════════════
          PÁGINA 2
      ════════════════════════════════════ */}
      <div className="page-break" />

      {/* Header p2 */}
      <table style={{ width: "100%", borderBottom: "2px solid #1b2360", paddingBottom: 8, marginBottom: 14, borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ fontSize: 12, fontWeight: 700, color: "#1b2360" }}>Tabla de Amortización Anual</td>
            <td style={{ textAlign: "right", fontSize: 9, color: "#888" }}>
              {fmt(data.amount)} · {data.rate}% · {data.years} años
            </td>
          </tr>
        </tbody>
      </table>

      {/* Tabla */}
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", fontSize: 9 }}>
        <colgroup>
          <col style={{ width: "7%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "13%" }} />
        </colgroup>
        <thead>
          <tr style={{ background: "#1b2360" }}>
            {["Año", "Cuota anual", "Capital", "Intereses", "Saldo restante", "% Pagado"].map((h) => (
              <th key={h} style={{ padding: "5px 6px", color: "#fff", textAlign: "left", fontWeight: 600, fontSize: 8 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {yearly.map((row, i) => {
            const cuotaAnual = row.capital + row.interest;
            const paid = ((principal - row.balance) / principal * 100).toFixed(1);
            const bg = i % 2 === 0 ? "#fff" : "#f8fafc";
            const td: React.CSSProperties = { padding: "4px 6px", borderBottom: "1px solid #edf0f5", background: bg, color: "#222" };
            return (
              <tr key={row.year}>
                <td style={td}>{row.year}</td>
                <td style={td}>{fmt(cuotaAnual)}</td>
                <td style={td}>{fmt(row.capital)}</td>
                <td style={td}>{fmt(row.interest)}</td>
                <td style={{ ...td, fontWeight: 600, color: "#1b2360" }}>{fmt(row.balance)}</td>
                <td style={td}>{paid}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Próximos pasos */}
      <div style={{ marginTop: 18, background: "#f0f4f8", borderRadius: 4, padding: "10px 14px", fontSize: 9, color: "#333" }}>
        <div style={{ fontWeight: 700, color: "#1b2360", marginBottom: 4 }}>Próximos pasos</div>
        Un asesor de Mi Casa Crédito puede verificar estas cifras con condiciones reales del mercado, acompañarte en el proceso de solicitud y asegurarse de que obtengas las mejores condiciones según tu perfil financiero.
      </div>

      {/* Footer */}
      <table style={{ width: "100%", borderTop: "1.5px solid #1b2360", marginTop: 14, paddingTop: 10, borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ verticalAlign: "bottom" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#1b2360" }}>Mi Casa Crédito — Transformamos Vidas</div>
              <div style={{ fontSize: 8, color: "#666", marginTop: 2 }}>WhatsApp: +57 300 123 4567 · www.micasacredito.com</div>
            </td>
            <td style={{ textAlign: "right", verticalAlign: "bottom", maxWidth: 260 }}>
              <div style={{ fontSize: 7, color: "#aaa", lineHeight: 1.4 }}>
                Los valores son estimativos con base en tasa fija. No incluyen gastos notariales, seguros de vida ni comisiones. Consulte con un asesor para condiciones reales.
              </div>
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  );
}
