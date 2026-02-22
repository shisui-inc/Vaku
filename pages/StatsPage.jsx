import ThemeToggle from "../components/ThemeToggle";
import { fmt } from "../utils/formatters";
import { catC } from "../data/constants";

export default function StatsPage({ dark, setDark, t, monthExpenses, total, byCategory }) {

    const filteredCats = byCategory.filter(c => c.spent > 0).sort((a, b) => b.spent - a.spent);

    return (
        <div className="page-in" style={{ padding: "52px 20px 0" }}>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: -0.8, color: t.text }}>
                    Estadísticas
                </div>
                <ThemeToggle dark={dark} onToggle={() => setDark(!dark)} t={t} />
            </div>
            <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 22 }}>Distribución de gastos este mes</div>

            {/* Summary hero card */}
            <div style={{
                borderRadius: 24, padding: "22px 22px", marginBottom: 16,
                background: dark
                    ? `linear-gradient(135deg, rgba(0,229,160,0.08) 0%, rgba(0,180,216,0.06) 100%)`
                    : `linear-gradient(135deg, rgba(0,122,82,0.07) 0%, rgba(0,102,136,0.05) 100%)`,
                border: `1px solid ${dark ? "rgba(0,229,160,0.15)" : "rgba(0,122,82,0.12)"}`,
                boxShadow: dark ? "0 4px 32px rgba(0,229,160,0.06)" : "0 4px 32px rgba(0,0,0,0.05)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
                <div>
                    <div style={{ fontSize: 10, color: t.textFaint, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6, fontWeight: 600 }}>Total gastado</div>
                    <div style={{
                        fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: -1,
                        background: `linear-gradient(135deg,${t.accent},${t.accentB})`,
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}>{fmt(total)}</div>
                </div>
                <div style={{ width: 1, background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", height: 48 }} />
                <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: t.textFaint, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6, fontWeight: 600 }}>Transacciones</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: t.text }}>{monthExpenses.length}</div>
                </div>
                <div style={{ width: 1, background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", height: 48 }} />
                <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: t.textFaint, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6, fontWeight: 600 }}>Categ.</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: t.text }}>{filteredCats.length}</div>
                </div>
            </div>

            {/* Category cards */}
            {filteredCats.map((cat, idx) => {
                const pct = Math.min((cat.spent / cat.budget) * 100, 100);
                const isOver = cat.spent > cat.budget;
                const cc = catC(cat, dark);
                const barColor = isOver ? t.danger : cc;

                return (
                    <div
                        key={cat.id}
                        className="row-in category-card"
                        style={{
                            borderRadius: 20, padding: "16px 16px 14px",
                            background: t.surface, border: `1px solid ${t.border}`,
                            marginBottom: 10, animationDelay: `${idx * 0.05}s`,
                            boxShadow: dark ? "0 2px 16px rgba(0,0,0,0.2)" : "0 2px 16px rgba(0,0,0,0.04)",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                            {/* Emoji icon */}
                            <div style={{
                                width: 42, height: 42, borderRadius: 14,
                                background: cc + "1E", display: "flex", alignItems: "center",
                                justifyContent: "center", fontSize: 20, flexShrink: 0,
                                border: `1px solid ${cc}22`,
                            }}>{cat.emoji}</div>

                            {/* Name + count */}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: 14, color: t.text }}>{cat.label}</div>
                                <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>
                                    {monthExpenses.filter(e => e.category === cat.id).length} transacciones
                                </div>
                            </div>

                            {/* Amount + % badge */}
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, color: isOver ? t.danger : t.text }}>
                                    {fmt(cat.spent)}
                                </div>
                                {/* Percentage badge */}
                                <div style={{
                                    display: "inline-block", marginTop: 3,
                                    background: (isOver ? t.danger : cc) + "20",
                                    border: `1px solid ${(isOver ? t.danger : cc)}33`,
                                    borderRadius: 20, padding: "1px 8px",
                                }}>
                                    <span style={{ fontSize: 10, color: isOver ? t.danger : cc, fontWeight: 700 }}>
                                        {Math.round(pct)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div style={{ background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", borderRadius: 6, height: 6, overflow: "hidden" }}>
                            <div style={{
                                background: barColor, borderRadius: 6, height: "100%",
                                width: `${pct}%`, transition: "width .8s cubic-bezier(.34,1.56,.64,1)",
                                boxShadow: `0 0 8px ${barColor}66`,
                            }} />
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                            <span style={{ fontSize: 10, color: isOver ? t.danger : t.textFaint, fontWeight: isOver ? 700 : 400 }}>
                                {isOver ? `+${fmt(cat.spent - cat.budget)} excedido` : `${fmt(cat.budget - cat.spent)} restante`}
                            </span>
                            <span style={{ fontSize: 10, color: t.textFaint }}>límite {fmt(cat.budget)}</span>
                        </div>
                    </div>
                );
            })}

            {filteredCats.length === 0 && (
                <div style={{
                    textAlign: "center", padding: "56px 24px",
                    background: t.surface, borderRadius: 24, border: `1px solid ${t.border}`,
                }}>
                    <div style={{ fontSize: 52, marginBottom: 14 }}>📊</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 700, color: t.textSub, marginBottom: 8 }}>
                        Sin datos este mes
                    </div>
                    <div style={{ fontSize: 13, color: t.textFaint }}>Agregá gastos para ver tus estadísticas</div>
                </div>
            )}
        </div>
    );
}
