import { useState } from "react";
import { CATEGORIES, catC } from "../data/constants";
import { detectAmount, detectDate, detectCategory } from "../utils/detectors";
import { validateDescription, validateAmount } from "../utils/validators";
import { fmt, fmtDate } from "../utils/formatters";

export default function AddExpenseModal({ onAdd, onClose, t, dark }) {
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState(null);
  const [manualAmt, setManualAmt] = useState("");
  const [manualCat, setManualCat] = useState("food");
  const [mode, setMode] = useState("natural");
  const [error, setError] = useState("");

  const onTextChange = val => {
    setText(val);
    setError("");

    // Validar descripción
    const descVal = validateDescription(val);
    if (!descVal.valid && val.trim()) {
      setError(descVal.error);
      setParsed(null);
      return;
    }

    const amount = detectAmount(val);
    if (amount !== null) {
      // Validar monto detectado
      const amountVal = validateAmount(amount);
      if (!amountVal.valid) {
        setError(amountVal.error);
        setParsed(null);
        return;
      }

      setParsed({ amount, category: detectCategory(val), date: detectDate(val), description: val });
    } else {
      setParsed(null);
    }
  };

  const handleAdd = () => {
    if (mode === "natural" && parsed) {
      onAdd(parsed);
    } else if (mode === "manual") {
      const descVal = validateDescription(text);
      const amountVal = validateAmount(parseFloat(manualAmt));

      if (!descVal.valid) {
        setError(descVal.error);
        return;
      }
      if (!amountVal.valid) {
        setError(amountVal.error);
        return;
      }

      onAdd({
        amount: parseFloat(manualAmt),
        category: manualCat,
        date: new Date().toISOString().split("T")[0],
        description: text
      });
    }
    onClose();
  };

  const canAdd = mode === "natural" ? !!parsed : (!!text && !!manualAmt && !error);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: t.surface, borderRadius: "28px 28px 0 0", width: "100%", maxWidth: 480, padding: "8px 20px 36px", border: `1px solid ${t.border}`, boxShadow: `0 -8px 40px ${t.shadow}` }}>
        <div style={{ width: 36, height: 4, background: t.surface3, borderRadius: 2, margin: "12px auto 20px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: t.text }}>Nuevo gasto</div>
          <button onClick={onClose} style={{ background: t.surface2, border: "none", color: t.textMuted, width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 18 }}>×</button>
        </div>

        {/* Mode toggle */}
        <div style={{ display: "flex", gap: 5, marginBottom: 18, background: t.surface2, borderRadius: 12, padding: 4 }}>
          {[{id:"natural",label:"✍️ Texto libre"},{id:"manual",label:"🔢 Manual"}].map(m => (
            <button key={m.id} onClick={()=>{setMode(m.id); setError("");}} style={{
              flex: 1, padding: "9px 0", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all .2s",
              background: mode===m.id ? t.surface : "transparent",
              color: mode===m.id ? t.text : t.textMuted,
              boxShadow: mode===m.id ? `0 1px 4px ${t.shadow}` : "none"
            }}>{m.label}</button>
          ))}
        </div>

        {/* Natural mode */}
        {mode==="natural" ? (
          <>
            <textarea value={text} onChange={e=>onTextChange(e.target.value)} autoFocus
              placeholder={`"almuerzo 25.000" · "nafta ayer 80 mil" · "ropa 150000"`}
              style={{ width: "100%", background: t.surface2, border: `1px solid ${t.border}`, borderRadius: 16, padding: "14px 16px", color: t.text, fontSize: 14, minHeight: 88, resize: "none", outline: "none", boxSizing: "border-box", lineHeight: 1.6, fontFamily: "inherit" }} />

            {error && (
              <div style={{ marginTop: 10, background: dark?"#FF333315":"#FFF0F0", border: `1px solid ${t.danger}44`, borderRadius: 14, padding: "12px 16px", color: t.danger, fontSize: 12 }}>
                ⚠️ {error}
              </div>
            )}

            {parsed && !error && (
              <div style={{ marginTop: 10, background: dark?"#001A0E":"#EBF8F2", border: `1px solid ${t.accent}44`, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>{CATEGORIES.find(c=>c.id===parsed.category)?.emoji}</span>
                <div>
                  <div style={{ color: t.accent, fontWeight: 800, fontSize: 17, fontFamily: "'Syne',sans-serif" }}>{fmt(parsed.amount)}</div>
                  <div style={{ color: t.textMuted, fontSize: 11, marginTop: 2 }}>{CATEGORIES.find(c=>c.id===parsed.category)?.label} · {fmtDate(parsed.date)}</div>
                </div>
                <div style={{ marginLeft: "auto", width: 26, height: 26, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", color: t.accentText, fontSize: 13, fontWeight: 700 }}>✓</div>
              </div>
            )}
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input value={text} onChange={e=>{setText(e.target.value); setError("");}} placeholder="Descripción del gasto"
              style={{ background: t.surface2, border: `1px solid ${t.border}`, borderRadius: 12, padding: "12px 14px", color: t.text, fontSize: 14, outline: "none", fontFamily: "inherit" }} />

            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: t.textMuted, fontSize: 14 }}>₲</span>
              <input value={manualAmt} onChange={e=>{setManualAmt(e.target.value); setError("");}} placeholder="0" type="number"
                style={{ width: "100%", background: t.surface2, border: `1px solid ${t.border}`, borderRadius: 12, padding: "12px 14px 12px 30px", color: t.text, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
            </div>

            {error && (
              <div style={{ background: dark?"#FF333315":"#FFF0F0", border: `1px solid ${t.danger}44`, borderRadius: 14, padding: "12px 16px", color: t.danger, fontSize: 12 }}>
                ⚠️ {error}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 7 }}>
              {CATEGORIES.map(c => {
                const cc = catC(c, dark);
                return (
                  <button key={c.id} onClick={()=>setManualCat(c.id)} style={{
                    padding: "10px 4px", borderRadius: 12,
                    border: `2px solid ${manualCat===c.id ? cc : "transparent"}`,
                    background: manualCat===c.id ? cc+"22" : t.surface2,
                    cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, transition: "all .15s"
                  }}>
                    <span style={{ fontSize: 19 }}>{c.emoji}</span>
                    <span style={{ color: manualCat===c.id ? cc : t.textMuted, fontSize: 9, fontWeight: 600 }}>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button onClick={handleAdd} disabled={!canAdd} style={{
          width: "100%", marginTop: 16, padding: "15px 0", borderRadius: 16, border: "none", cursor: canAdd?"pointer":"default",
          background: canAdd ? `linear-gradient(135deg,${t.accent},${t.accentB})` : t.surface2,
          color: canAdd ? t.accentText : t.textFaint, fontWeight: 800, fontSize: 15,
          fontFamily: "'Syne',sans-serif", transition: "all .2s"
        }}>Agregar gasto</button>
      </div>
    </div>
  );
}
