import { useState } from "react";
import ThemeToggle from "../components/ThemeToggle";
import WeekChart from "../components/WeekChart";
import { fmt, fmtDate, getCurrentMonth } from "../utils/formatters";
import { CATEGORIES, catC } from "../data/constants";

export default function HomePage({
    dark, setDark, t, total, totalBudget, weekData, sortedDates, grouped, deleteExpense
}) {
    const [hoveredExpense, setHoveredExpense] = useState(null);
    const pct = totalBudget > 0 ? Math.min((total / totalBudget) * 100, 100) : 0;
    const isOver = total > totalBudget;

    return (
        <div className="page-in">
            {/* ── HERO SECTION ── */}
            <div style={{ padding: "52px 20px 0" }}>
                <div style={{
                    borderRadius: 28,
                    padding: "24px 24px 20px",
                    background: dark
                        ? `linear-gradient(135deg, rgba(14,14,14,0.9) 0%, rgba(20,20,20,0.8) 100%)`
                        : `linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(244,244,239,0.85) 100%)`,
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                    boxShadow: dark
                        ? `0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`
                        : `0 8px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)`,
                    position: "relative", overflow: "hidden",
                }}>
                    {/* Ambient glow behind card */}
                    <div style={{
                        position: "absolute", top: -30, right: -30, width: 160, height: 160,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${isOver ? t.danger : t.accent}22 0%, transparent 70%)`,
                        pointerEvents: "none",
                    }} />

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                                <div style={{
                                    width: 7, height: 7, borderRadius: "50%",
                                    background: `linear-gradient(135deg,${t.accent},${t.accentB})`,
                                    boxShadow: `0 0 8px ${t.accent}88`,
                                }} />
                                <span style={{ fontSize: 11, color: t.textMuted, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 500 }}>
                                    {getCurrentMonth()} · Este mes
                                </span>
                            </div>

                            <div style={{
                                fontFamily: "'Syne',sans-serif", fontSize: 42, fontWeight: 800,
                                letterSpacing: -2, lineHeight: 1.05, color: t.text,
                                textShadow: dark ? "0 2px 20px rgba(0,229,160,0.1)" : "none",
                            }}>
                                {fmt(total)}
                            </div>
                            <div style={{ fontSize: 12, color: t.textFaint, marginTop: 6, fontWeight: 400 }}>
                                de {fmt(totalBudget)} presupuestado
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                            <ThemeToggle dark={dark} onToggle={() => setDark(!dark)} t={t} />
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: 6,
                                background: (isOver ? t.danger : t.accent) + "20",
                                border: `1px solid ${(isOver ? t.danger : t.accent)}44`,
                                borderRadius: 30, padding: "6px 14px",
                                boxShadow: `0 2px 12px ${(isOver ? t.danger : t.accent)}22`,
                            }}>
                                <div style={{
                                    width: 6, height: 6, borderRadius: "50%",
                                    background: isOver ? t.danger : t.accent,
                                    boxShadow: `0 0 6px ${isOver ? t.danger : t.accent}`,
                                }} />
                                <span style={{ fontSize: 12, color: isOver ? t.danger : t.accent, fontWeight: 700 }}>
                                    {isOver ? "Excedido" : `${fmt(totalBudget - total)} libre`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ marginTop: 18, background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)", borderRadius: 8, height: 7, overflow: "hidden" }}>
                        <div style={{
                            height: "100%", borderRadius: 8,
                            width: `${pct}%`,
                            background: isOver
                                ? t.danger
                                : `linear-gradient(90deg,${t.accent},${t.accentB})`,
                            transition: "width 1s cubic-bezier(.34,1.56,.64,1)",
                            boxShadow: `0 0 10px ${isOver ? t.danger : t.accent}66`,
                        }} />
                    </div>

                    {/* Mini stats row */}
                    <div style={{ display: "flex", gap: 20, marginTop: 14 }}>
                        <div>
                            <div style={{ fontSize: 9, color: t.textFaint, textTransform: "uppercase", letterSpacing: 1.5 }}>Usado</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: isOver ? t.danger : t.accent, marginTop: 2 }}>{Math.round(pct)}%</div>
                        </div>
                        <div style={{ width: 1, background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)" }} />
                        <div>
                            <div style={{ fontSize: 9, color: t.textFaint, textTransform: "uppercase", letterSpacing: 1.5 }}>Trans.</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: t.textSub, marginTop: 2 }}>{sortedDates.reduce((n, d) => n + grouped[d].length, 0)}</div>
                        </div>
                    </div>
                </div>

                {/* Week chart card */}
                <div style={{
                    marginTop: 16, borderRadius: 24, padding: "18px 18px 14px",
                    background: t.surface, border: `1px solid ${t.border}`,
                    boxShadow: dark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(0,0,0,0.06)",
                }}>
                    <div style={{ fontSize: 9, color: t.textFaint, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>Últimos 7 días</div>
                    <WeekChart data={weekData} t={t} dark={dark} />
                </div>
            </div>

            {/* ── TRANSACTIONS ── */}
            <div style={{ padding: "24px 20px 0" }}>
                <div style={{ fontSize: 9, color: t.textFaint, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>Transacciones</div>

                {sortedDates.length === 0 && (
                    <div style={{
                        textAlign: "center", color: t.textFaint, padding: "56px 24px",
                        background: t.surface, borderRadius: 24, border: `1px solid ${t.border}`,
                    }}>
                        <div style={{ fontSize: 56, marginBottom: 14, filter: "grayscale(0.3)" }}>💸</div>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 700, color: t.textSub, marginBottom: 8 }}>Sin gastos este mes</div>
                        <div style={{ fontSize: 13, color: t.textFaint, lineHeight: 1.6 }}>Tocá el <strong style={{ color: t.accent }}>+</strong> para registrar<br />tu primer gasto del mes</div>
                    </div>
                )}

                {sortedDates.map(date => (
                    <div key={date} style={{ marginBottom: 20 }}>
                        <div style={{
                            fontSize: 9, color: t.textFaint, textTransform: "uppercase",
                            letterSpacing: 1.5, marginBottom: 8, fontWeight: 600, paddingLeft: 4,
                        }}>{fmtDate(date)}</div>
                        <div style={{
                            borderRadius: 20, overflow: "hidden",
                            background: t.surface, border: `1px solid ${t.border}`,
                            boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.25)" : "0 4px 20px rgba(0,0,0,0.05)",
                        }}>
                            {grouped[date].map((expense, i) => {
                                const cat = CATEGORIES.find(c => c.id === expense.category);
                                const cc = catC(cat, dark);
                                const isHovered = hoveredExpense === expense.id;
                                return (
                                    <div
                                        key={expense.id}
                                        className="row-in expense-card"
                                        style={{
                                            display: "flex", alignItems: "center", padding: "13px 15px", gap: 12,
                                            borderBottom: i < grouped[date].length - 1 ? `1px solid ${t.border}` : "none",
                                            background: isHovered ? (dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)") : "transparent",
                                            transition: "background .15s",
                                        }}
                                        onMouseEnter={() => setHoveredExpense(expense.id)}
                                        onMouseLeave={() => setHoveredExpense(null)}
                                        style2={{ animationDelay: `${i * 0.04}s` }}
                                    >
                                        {/* Category icon */}
                                        <div style={{
                                            width: 42, height: 42, borderRadius: 14,
                                            background: cc + "1E",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 20, flexShrink: 0,
                                            border: `1px solid ${cc}22`,
                                        }}>{cat.emoji}</div>

                                        {/* Info */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 13.5, fontWeight: 500, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {expense.description}
                                            </div>
                                            {/* Category pill */}
                                            <div style={{
                                                display: "inline-flex", alignItems: "center", gap: 4, marginTop: 3,
                                                background: cc + "18", borderRadius: 20, padding: "2px 8px",
                                            }}>
                                                <div style={{ width: 4, height: 4, borderRadius: "50%", background: cc }} />
                                                <span style={{ fontSize: 10, color: cc, fontWeight: 600 }}>{cat.label}</span>
                                            </div>
                                        </div>

                                        {/* Amount + delete */}
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, color: t.text }}>
                                                −{fmt(expense.amount)}
                                            </div>
                                            <button
                                                className="delete-btn"
                                                onClick={() => deleteExpense(expense.id)}
                                                style={{
                                                    background: t.surface3 + "88", border: "none",
                                                    color: t.textFaint, cursor: "pointer",
                                                    width: 26, height: 26, borderRadius: 8,
                                                    fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center",
                                                    opacity: isHovered ? 1 : 0,
                                                    transition: "color .15s, background .15s, opacity .15s",
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.background = t.danger + "22"; e.currentTarget.style.color = t.danger; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = t.surface3 + "88"; e.currentTarget.style.color = t.textFaint; }}
                                            >✕</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
