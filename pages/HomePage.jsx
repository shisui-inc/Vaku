import ThemeToggle from "../components/ThemeToggle";
import WeekChart from "../components/WeekChart";
import { fmt, fmtDate, getCurrentMonth } from "../utils/formatters";
import { CATEGORIES, catC } from "../data/constants";

export default function HomePage({
    dark, setDark, t, total, totalBudget, weekData, sortedDates, grouped, deleteExpense
}) {
    const card = { background: t.surface, borderRadius: 20, padding: 18, border: `1px solid ${t.border}` };

    return (
        <div style={{ animation: "fadeIn .3s ease" }}>
            <div style={{ padding: "52px 20px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: `linear-gradient(135deg,${t.accent},${t.accentB})` }} />
                            <span style={{ fontSize: 11, color: t.textMuted, letterSpacing: 2, textTransform: "uppercase" }}>{getCurrentMonth()} · Este mes</span>
                        </div>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 38, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1, color: t.text }}>
                            {fmt(total)}
                        </div>
                        <div style={{ fontSize: 12, color: t.textFaint, marginTop: 6 }}>de {fmt(totalBudget)} presupuestado</div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                        <ThemeToggle dark={dark} onToggle={() => setDark(!dark)} t={t} />
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: (total > totalBudget ? t.danger : t.accent) + "18", border: `1px solid ${total > totalBudget ? t.danger : t.accent}44`, borderRadius: 20, padding: "5px 12px" }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: total > totalBudget ? t.danger : t.accent }} />
                            <span style={{ fontSize: 11, color: total > totalBudget ? t.danger : t.accent, fontWeight: 600 }}>
                                {total > totalBudget ? "Excedido" : `${fmt(totalBudget - total)} libre`}
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: 16, background: t.surface3, borderRadius: 6, height: 5, overflow: "hidden" }}>
                    <div style={{ height: 5, borderRadius: 6, width: `${Math.min((total / totalBudget) * 100, 100)}%`, background: total > totalBudget ? t.danger : `linear-gradient(90deg,${t.accent},${t.accentB})`, transition: "width .8s cubic-bezier(.34,1.56,.64,1)" }} />
                </div>

                <div style={{ ...card, marginTop: 20 }}>
                    <div style={{ fontSize: 10, color: t.textFaint, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Últimos 7 días</div>
                    <WeekChart data={weekData} t={t} />
                </div>
            </div>

            <div style={{ padding: "24px 20px 0" }}>
                <div style={{ fontSize: 10, color: t.textFaint, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Transacciones</div>
                {sortedDates.length === 0 && (
                    <div style={{ textAlign: "center", color: t.textFaint, padding: "48px 0", fontSize: 14 }}>
                        <div style={{ fontSize: 32, marginBottom: 10 }}>₲</div>Sin gastos aún. Toca + para empezar.
                    </div>
                )}
                {sortedDates.map(date => (
                    <div key={date} style={{ marginBottom: 18 }}>
                        <div style={{ fontSize: 10, color: t.textFaint, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{fmtDate(date)}</div>
                        <div style={{ ...card, padding: 0, overflow: "hidden" }}>
                            {grouped[date].map((expense, i) => {
                                const cat = CATEGORIES.find(c => c.id === expense.category);
                                const cc = catC(cat, dark);
                                return (
                                    <div key={expense.id} className="row-in" style={{
                                        display: "flex", alignItems: "center", padding: "13px 15px", gap: 12,
                                        borderBottom: i < grouped[date].length - 1 ? `1px solid ${t.border}` : "none"
                                    }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 13, background: cc + "1A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>{cat.emoji}</div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 13, fontWeight: 500, color: t.textSub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{expense.description}</div>
                                            <div style={{ fontSize: 10, color: t.textFaint, marginTop: 2 }}>{cat.label}</div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: t.text }}>−{fmt(expense.amount)}</div>
                                            <button onClick={() => deleteExpense(expense.id)}
                                                style={{ background: "none", border: "none", color: t.surface3, cursor: "pointer", fontSize: 15, padding: 4, lineHeight: 1, transition: "color .15s" }}
                                                onMouseEnter={e => e.currentTarget.style.color = t.danger}
                                                onMouseLeave={e => e.currentTarget.style.color = t.surface3}>✕</button>
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
