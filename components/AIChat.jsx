import { useState, useEffect, useRef } from "react";

export default function AIChat({ expenses, onClose, t }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "¡Hola! Soy Vaku IA, tu asistente financiero. Preguntame lo que quieras sobre tus gastos en guaraníes 💬" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setLoading(true);
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);

    const summary = expenses.reduce((acc, e) => { acc[e.category] = (acc[e.category]||0)+e.amount; return acc; }, {});
    const total = expenses.reduce((s, e) => s+e.amount, 0);
    const ctx = `App Vaku Paraguay. Moneda: Guaraní (₲). Total mes: ₲${total.toLocaleString("es-PY")}. Por categoría: ${Object.entries(summary).map(([k,v])=>`${k}=₲${v.toLocaleString("es-PY")}`).join(", ")}.`;

    try {
      // Llamar a backend proxy (veremos después)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, context: ctx })
      });

      if (!res.ok) throw new Error("Error en la API");
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.response || "Sin respuesta." }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { role: "assistant", text: "Error de conexión. Intentá de nuevo." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: t.surface, borderRadius: "28px 28px 0 0", width: "100%", maxWidth: 480, height: "82vh", display: "flex", flexDirection: "column", border: `1px solid ${t.border}`, boxShadow: `0 -8px 40px ${t.shadow}` }}>
        {/* Header */}
        <div style={{ padding: "18px 20px 14px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: `linear-gradient(135deg,${t.accent},${t.accentB})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: t.accentText, fontWeight: 700 }}>✦</div>
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: t.text }}>Vaku IA</div>
              <div style={{ fontSize: 11, color: t.textMuted }}>Asistente financiero</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: t.surface2, border: "none", color: t.textMuted, width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 18 }}>×</button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role==="user"?"flex-end":"flex-start" }}>
              <div style={{
                maxWidth: "82%", padding: "11px 15px",
                borderRadius: m.role==="user"?"18px 18px 4px 18px":"4px 18px 18px 18px",
                background: m.role==="user" ? `linear-gradient(135deg,${t.accent},${t.accentB})` : t.surface2,
                color: m.role==="user" ? t.accentText : t.textSub,
                fontSize: 14, lineHeight: 1.6
              }}>{m.text}</div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex" }}>
              <div style={{ background: t.surface2, padding: "12px 16px", borderRadius: "4px 18px 18px 18px" }}>
                <span style={{ color: t.textFaint, letterSpacing: 3, fontSize: 16 }}>···</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "10px 14px 24px", borderTop: `1px solid ${t.border}`, display: "flex", gap: 8 }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="¿En qué gasté más este mes?"
            style={{ flex: 1, background: t.surface2, border: `1px solid ${t.border}`, borderRadius: 14, padding: "11px 14px", color: t.text, fontSize: 14, outline: "none", fontFamily: "inherit" }} />
          <button onClick={send} disabled={loading} style={{ background: `linear-gradient(135deg,${t.accent},${t.accentB})`, border: "none", borderRadius: 14, width: 44, height: 44, cursor: "pointer", fontSize: 18, color: t.accentText, fontWeight: 700 }}>↑</button>
        </div>
      </div>
    </div>
  );
}
