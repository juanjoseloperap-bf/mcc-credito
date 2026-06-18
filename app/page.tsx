"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CalculatorData } from "@/types/calculator";
import { StepDef } from "@/components/calculator/ProgressStepper";
import ProgressStepper from "@/components/calculator/ProgressStepper";
import ModeSelector from "@/components/calculator/ModeSelector";
import Step1Property from "@/components/calculator/Step1Property";
import Step2DownPayment from "@/components/calculator/Step2DownPayment";
import Step3Loan from "@/components/calculator/Step3Loan";
import Step4Costs from "@/components/calculator/Step2Costs";
import Step5Results from "@/components/calculator/Step3Results";
import Step1Basic from "@/components/calculator/Step1Basic";
import StepInverse from "@/components/calculator/StepInverse";

const DEFAULT: CalculatorData = {
  propertyValue: 300_000,
  propertyType: "apartamento",
  firstHome: true,
  downPaymentPct: 20,
  amount: 240_000,
  years: 20,
  rate: 7.5,
  predial: 0,
  seguroHogar: 0,
  hoa: 0,
  pmi: 0,
};

const STEPS: Record<string, StepDef[]> = {
  fast: [
    { n: 1, label: "Tu crédito" },
    { n: 2, label: "Resultado" },
  ],
  complete: [
    { n: 1, label: "Inmueble" },
    { n: 2, label: "Entrada" },
    { n: 3, label: "Crédito" },
    { n: 4, label: "Extras" },
    { n: 5, label: "Resultado" },
  ],
  inverse: [
    { n: 1, label: "Tu cuota" },
    { n: 2, label: "Resultado" },
  ],
};

const MODE_LABEL: Record<string, string> = {
  fast: "Cuota Rápida",
  complete: "Análisis Completo",
  inverse: "¿Cuánto puedo comprar?",
};

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? "55%" : "-55%", opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? "55%" : "-55%", opacity: 0 }),
};

type Mode = "fast" | "complete" | "inverse" | null;

export default function Home() {
  const [mode, setMode] = useState<Mode>(null);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<CalculatorData>(DEFAULT);

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const selectMode = (m: NonNullable<Mode>) => {
    setMode(m);
    setStep(1);
    setData(DEFAULT);
  };

  const resetMode = () => {
    setMode(null);
    setStep(1);
    setData(DEFAULT);
  };

  const update = (partial: Partial<CalculatorData>) => {
    setData((prev) => {
      const next = { ...prev, ...partial };
      if ("propertyValue" in partial || "downPaymentPct" in partial) {
        next.amount = Math.round(next.propertyValue * (1 - next.downPaymentPct / 100));
      }
      return next;
    });
  };

  // Called by StepInverse when the user clicks "Ver análisis completo"
  const applyInverseResult = (computed: Partial<CalculatorData>) => {
    setData((prev) => ({ ...prev, ...computed }));
    setDirection(1);
    setStep(2);
  };

  const steps = mode ? STEPS[mode] : [];

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4" style={{ background: "var(--bg)" }}>

      {/* Header */}
      <motion.div
        className="text-center mb-7"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <div className="flex justify-center mb-3">
          <Image
            src="/logo-transformamos-vidas.png"
            alt="Mi Casa Crédito"
            width={280}
            height={78}
            className="object-contain"
            priority
          />
        </div>
        <p className="text-sm" style={{ color: "var(--text-3)" }}>
          Calculadora de Hipoteca
        </p>
      </motion.div>

      {mode === null ? (
        <ModeSelector onSelect={selectMode} />
      ) : (
        <>
          <div className="flex items-center gap-3 mb-5 w-full max-w-lg">
            <button
              onClick={resetMode}
              className="text-xs transition-all hover:opacity-60 flex items-center gap-1"
              style={{ color: "var(--text-3)" }}
            >
              ← Inicio
            </button>
            <span style={{ color: "var(--border-strong)" }}>·</span>
            <span className="text-xs" style={{ color: "var(--text-3)" }}>{MODE_LABEL[mode]}</span>
          </div>

          <ProgressStepper steps={steps} current={step} />

          <div className="w-full max-w-2xl mt-4 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`${mode}-${step}`}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
              >
                {/* INVERSE */}
                {mode === "inverse" && step === 1 && (
                  <StepInverse data={data} onChange={update} onNext={applyInverseResult} />
                )}
                {mode === "inverse" && step === 2 && (
                  <Step5Results data={data} showPropertySummary={false} onBack={() => goTo(1)} />
                )}

                {/* FAST */}
                {mode === "fast" && step === 1 && (
                  <Step1Basic data={data} onChange={update} onNext={() => goTo(2)} />
                )}
                {mode === "fast" && step === 2 && (
                  <Step5Results data={data} showPropertySummary={false} onBack={resetMode} />
                )}

                {/* COMPLETE */}
                {mode === "complete" && step === 1 && (
                  <Step1Property data={data} onChange={update} onNext={() => goTo(2)} />
                )}
                {mode === "complete" && step === 2 && (
                  <Step2DownPayment data={data} onChange={update} onBack={() => goTo(1)} onNext={() => goTo(3)} />
                )}
                {mode === "complete" && step === 3 && (
                  <Step3Loan data={data} onChange={update} onBack={() => goTo(2)} onNext={() => goTo(4)} />
                )}
                {mode === "complete" && step === 4 && (
                  <Step4Costs data={data} onChange={update} onBack={() => goTo(3)} onNext={() => goTo(5)} />
                )}
                {mode === "complete" && step === 5 && (
                  <Step5Results data={data} showPropertySummary onBack={resetMode} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}

      <p className="mt-10 text-xs text-center max-w-sm" style={{ color: "var(--text-3)" }}>
        Valores estimativos. No constituyen asesoría financiera.
      </p>
    </div>
  );
}
