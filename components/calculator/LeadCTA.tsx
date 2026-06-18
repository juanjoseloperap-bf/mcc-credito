"use client";

import { useState } from "react";
import { fmtDec, fmt } from "@/lib/formatters";

// Reemplaza con el número real de WhatsApp de Mi Casa Crédito
const WA_NUMBER = "573001234567";

interface Props {
  amount: number;
  monthly: number;
  years: number;
}

type Stage = "cta" | "form" | "sent";

export default function LeadCTA({ amount, monthly, years }: Props) {
  const [stage, setStage] = useState<Stage>("cta");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  const waMessage = encodeURIComponent(
    `Hola Mi Casa Crédito. Calculé una hipoteca de ${fmt(amount)} a ${years} años con cuota estimada de ${fmtDec(monthly)}/mes. Quisiera hablar con un asesor.`
  );
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${waMessage}`;

  if (stage === "sent") {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "#dcfce7" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 className="text-lg font-black mb-1" style={{ color: "var(--navy)" }}>
          ¡Listo, {nombre}!
        </h3>
        <p className="text-sm" style={{ color: "var(--text-3)" }}>
          Un asesor de Mi Casa Crédito te contactará pronto al {telefono}.
        </p>
      </div>
    );
  }

  if (stage === "form") {
    return (
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}
      >
        <div className="px-5 py-3" style={{ background: "var(--surface-2)" }}>
          <p className="text-xs font-bold tracking-widest" style={{ color: "var(--text-3)" }}>
            SOLICITAR ASESORÍA GRATUITA
          </p>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-xl px-4 py-3 outline-none text-sm font-semibold"
              style={{ background: "var(--surface-2)", border: "1.5px solid var(--border-strong)", color: "var(--text-1)" }}
            />
            <input
              type="tel"
              placeholder="Tu teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full rounded-xl px-4 py-3 outline-none text-sm font-semibold"
              style={{ background: "var(--surface-2)", border: "1.5px solid var(--border-strong)", color: "var(--text-1)" }}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStage("cta")}
              className="flex-1 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-70"
              style={{ background: "var(--surface-2)", color: "var(--text-2)" }}
            >
              Cancelar
            </button>
            <button
              disabled={!nombre.trim() || !telefono.trim()}
              onClick={() => setStage("sent")}
              className="btn-primary flex-[2] py-3 rounded-xl text-sm font-black text-white disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "var(--gradient)" }}
            >
              Enviar solicitud
            </button>
          </div>
        </div>
      </div>
    );
  }

  // stage === "cta"
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}
    >
      <div
        className="p-6 space-y-4"
        style={{ borderLeft: "4px solid var(--blue-light)" }}
      >
        <div>
          <h3 className="text-base font-black mb-1" style={{ color: "var(--navy)" }}>
            ¿Listo para dar el siguiente paso?
          </h3>
          <p className="text-sm" style={{ color: "var(--text-3)" }}>
            Habla con un asesor de Mi Casa Crédito. Es gratis y sin compromiso.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center justify-center gap-2 py-4 rounded-xl font-black text-white text-sm"
            style={{ background: "#25d366", boxShadow: "0 4px 16px rgba(37,211,102,0.35)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chatear por WhatsApp
          </a>

          <button
            onClick={() => setStage("form")}
            className="py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-80"
            style={{ background: "var(--surface-2)", color: "var(--navy)", border: "1.5px solid var(--border-strong)" }}
          >
            Prefiero que me llamen
          </button>
        </div>
      </div>
    </div>
  );
}
