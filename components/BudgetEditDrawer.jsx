import { useState } from "react";
import { validateBudget } from "../utils/validators";
import { fmt } from "../utils/formatters";
import ArcRing from "./ArcRing";

export default function BudgetEditDrawer({ cat, currentBudget, spent, onSave, onClose, t, dark }) {
  const [val, setVal] = useState(String(currentBudget));
  const [error, setError] = useState("");
  const numeric = parseFloat(val) || 0;
  const remaining = numeric - spent;
  const pct = numeric > 0 ? Math.round((spent / numeric) * 100) : 0;
  const cc = dark ? cat.colorD : cat.colorL;
  const presets = [100000, 200000, 300000, 500000, 1000000];

  const handleSave = () => {
    const validation = validateBudget(numeric);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    setError("");
    onSave(numeric);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(14px)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: t.surface, borderRadius: "28px 28px 0 0", width: "100%", maxWidth: 480, padding: "8px 20px 36px", border: `1px solid ${t.border}`, boxShadow: `0 -8px 40px ${t.shadow}` }}>
        <div style={{ width: 36, height: 4, background: t.surface3, borderRadius: 2, margin: "12px auto 22px" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: cc+"22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{cat.emoji}</div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: t.text }}>{cat.label}</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 1 }}>Definí tu límite mensual</div>
          </div>
          <button onClick={onClose} style={{ marginLeft: "auto", background: t.surface2, border: "none", color: t.textMuted, width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 18 }}>×</button>
        </div>

        {/* Live preview */}
        <div style={{ background: t.surface2, border: `1px solid ${t.border}`, borderRadius: 18, padding: "16px 18px", marginBottom: 18, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <ArcRing pct={pct} color={cc} ringBg={t.ring} size={64} stroke={5} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 800, color: cc }}>{pct}%</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 3 }}>Gastado este mes</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: t.text }}>{fmt(spent)}</div>
            <div style={{ fontSize: 11, marginTop: 3, fontWeight: 600, color: remaining>=0?t.accent:t.danger }}>
              {remaining>=0 ? `₲ ${remaining.toLocaleString("es-PY")} disponible` : `₲ ${Math.abs(remaining).toLocaleString("es-PY")} excedido`}
            </div>
          </div>
        </div>

        {/* Input */}
        <div style={{ background: t.surface2, border: `1px solid ${t.border}`, borderRadius: 16, padding: "14px 18px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, color: t.textMuted }}>₲</span>
          <input type="number" value={val} onChange={e=>{setVal(e.target.value); setError("");}} autoFocus
            style={{ flex: 1, background: "none", border: "none", outline: "none", color: t.text, fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800 }} />
        </div>

        {error && (
          <div style={{ background: dark?"#FF333315":"#FFF0F0", border: `1px solid ${t.danger}44`, borderRadius: 14, padding: "12px 16px", color: t.danger, fontSize: 12, marginBottom: 12 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Presets */}
        <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
          {presets.map(p => (
            <button key={p} onClick={()=>{setVal(String(p)); setError("");}} style={{
              padding: "6px 13px", borderRadius: 20,
              border: `1px solid ${numeric===p ? cc : t.border}`,
              background: numeric===p ? cc+"22" : t.surface2,
              color: numeric===p ? cc : t.textMuted,
              fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all .15s", fontFamily: "'Syne',sans-serif"
            }}>
              {p>=1000000 ? `${p/1000000}M` : `${p/1000}k`}
            </button>
          ))}
        </div>

        <button onClick={handleSave} style={{
          width: "100%", padding: "15px 0", borderRadius: 16, border: "none",
          background: `linear-gradient(135deg,${t.accent},${t.accentB})`,
          color: t.accentText, fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "'Syne',sans-serif"
        }}>Guardar límite</button>
      </div>
    </div>
  );
}
