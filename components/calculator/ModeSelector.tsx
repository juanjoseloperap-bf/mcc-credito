"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Props {
  onSelect: (mode: "fast" | "complete" | "inverse") => void;
}

const CARDS = [
  {
    mode: "inverse" as const,
    accent: "#1b2360",
    bg: "#f0f2f8",
    label: "¿Cuánto puedo comprar?",
    desc: "Dime cuánto puedes pagar al mes y te digo qué inmueble alcanzas con tu entrada y plazo.",
  },
  {
    mode: "complete" as const,
    accent: "#1e6fa8",
    bg: "#f0f5fb",
    label: "Análisis completo",
    desc: "Desde el valor del inmueble, la cuota inicial, tasas y validación de capacidad de pago.",
  },
  {
    mode: "fast" as const,
    accent: "#2a9fd6",
    bg: "#f0f8fd",
    label: "Cuota rápida",
    desc: "Ya sé cuánto quiero pedir. Solo quiero ver la cuota mensual y el desglose de costos.",
  },
];

function TiltCard({
  card,
  index,
  onSelect,
}: {
  card: (typeof CARDS)[number];
  index: number;
  onSelect: (mode: "fast" | "complete" | "inverse") => void;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 350,
    damping: 28,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 350,
    damping: 28,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.button
      onClick={() => onSelect(card.mode)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        type: "spring",
        stiffness: 280,
        damping: 22,
      }}
      whileHover={{ y: -5, boxShadow: "0 12px 32px rgba(27,35,96,0.13)" }}
      whileTap={{ scale: 0.98 }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformOrigin: "center center",
        background: "var(--surface)",
        border: "1px solid var(--border-strong)",
        borderRadius: 10,
        overflow: "hidden",
        display: "flex",
        alignItems: "stretch",
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      {/* Franja izquierda */}
      <div style={{ width: 5, background: card.accent, flexShrink: 0 }} />

      {/* Icono */}
      <div
        style={{
          width: 72,
          background: card.bg,
          borderRight: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <img
          src="/mcc-icon-only.png"
          alt=""
          style={{ width: 40, height: 40, objectFit: "contain", opacity: 0.85 }}
        />
      </div>

      {/* Texto */}
      <div style={{ flex: 1, padding: "20px 20px", minWidth: 0 }}>
        <p style={{ fontWeight: 600, fontSize: 15, color: "var(--text-1)", marginBottom: 4 }}>
          {card.label}
        </p>
        <p style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.5, margin: 0 }}>
          {card.desc}
        </p>
      </div>

      {/* Flecha */}
      <div style={{ display: "flex", alignItems: "center", paddingRight: 16, paddingLeft: 8, flexShrink: 0 }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ color: "var(--text-3)" }}>
          <path d="M7 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </motion.button>
  );
}

export default function ModeSelector({ onSelect }: Props) {
  return (
    <div className="w-full max-w-xl" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        style={{ marginBottom: 16 }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text-1)", marginBottom: 4 }}>
          ¿Por dónde quieres empezar?
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-3)" }}>
          Elige según lo que sabes hoy
        </p>
      </motion.div>

      {CARDS.map((card, i) => (
        <TiltCard key={card.mode} card={card} index={i} onSelect={onSelect} />
      ))}
    </div>
  );
}
