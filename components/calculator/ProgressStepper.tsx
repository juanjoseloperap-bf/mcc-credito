"use client";

export interface StepDef { n: number; label: string; }

interface Props { steps: StepDef[]; current: number; }

export default function ProgressStepper({ steps, current }: Props) {
  return (
    <div className="flex items-center w-full max-w-lg mx-auto">
      {steps.map((step, i) => {
        const done = current > step.n;
        const active = current === step.n;
        return (
          <div key={step.n} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200"
                style={{
                  background: done ? "var(--navy)" : active ? "var(--navy)" : "var(--surface-3)",
                  color: done || active ? "#fff" : "var(--text-3)",
                  border: active ? "2px solid var(--navy)" : "none",
                }}
              >
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : step.n}
              </div>
              <span
                className="text-xs whitespace-nowrap"
                style={{
                  color: active ? "var(--navy)" : done ? "var(--text-2)" : "var(--text-3)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="flex-1 h-px mx-2 mb-5 transition-all duration-300"
                style={{ background: done ? "var(--navy)" : "var(--border-strong)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
