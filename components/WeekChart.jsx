import { useState } from "react";

export default function WeekChart({ data, t, dark }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const max = Math.max(...data.map(d => d.value), 1);

  const fmt = n => {
    if (n >= 1000000) return `₲${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `₲${(n / 1000).toFixed(0)}K`;
    return `₲${n}`;
  };

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 80, position: "relative" }}>
      {data.map((d, i) => {
        const heightPct = (d.value / max) * 100;
        const isHovered = hoveredIdx === i;
        const barColor = d.highlight
          ? (isHovered ? t.accentB : t.accent)
          : (dark ? (isHovered ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)") : (isHovered ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.08)"));

        return (
          <div
            key={i}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative", cursor: d.value > 0 ? "pointer" : "default" }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Tooltip */}
            {isHovered && d.value > 0 && (
              <div style={{
                position: "absolute", bottom: "100%", marginBottom: 6,
                background: dark ? "rgba(20,20,20,0.95)" : "rgba(255,255,255,0.95)",
                border: `1px solid ${t.border}`,
                borderRadius: 10, padding: "5px 9px",
                fontSize: 11, fontWeight: 700, color: t.text,
                whiteSpace: "nowrap",
                boxShadow: `0 4px 16px ${dark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)"}`,
                zIndex: 10, pointerEvents: "none",
                animation: "scaleIn .15s cubic-bezier(.34,1.56,.64,1)",
              }}>
                {fmt(d.value)}
                {/* Arrow */}
                <div style={{
                  position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
                  width: 0, height: 0,
                  borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
                  borderTop: `5px solid ${t.border}`,
                }} />
              </div>
            )}

            {/* Bar */}
            <div style={{
              width: "100%", borderRadius: "6px 6px 4px 4px",
              minHeight: 4,
              height: `${Math.max(heightPct, d.value > 0 ? 4 : 0)}%`,
              background: barColor,
              transition: "height .6s cubic-bezier(.34,1.56,.64,1), background .2s",
              boxShadow: d.highlight && d.value > 0 ? `0 0 10px ${t.accent}55` : "none",
            }} />

            {/* Today dot */}
            {d.highlight && (
              <div style={{
                width: 4, height: 4, borderRadius: "50%",
                background: t.accent,
                boxShadow: `0 0 6px ${t.accent}`,
              }} />
            )}

            {/* Day label */}
            {!d.highlight && (
              <div style={{ fontSize: 9, color: t.textFaint, fontWeight: 500, letterSpacing: 0.5 }}>
                {d.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
