import ThemeToggle from "../components/ThemeToggle";
import { fmt } from "../utils/formatters";
import { catC } from "../data/constants";

export default function StatsPage({ dark, setDark, t, monthExpenses, total, byCategory }) {
    const card = { background: t.surface, borderRadius: 20, padding: 18, border: `1px solid ${t.border}` };

    return (
        <div style={{ padding: "52px 20px 0", animation: "fadeIn .3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: -0.5, color: t.text }}>Estadísticas</div>
                <ThemeToggle dark={dark} onToggle={() => setDark(!dark)} t={t} />
            </div>
            <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 22 }}>Distribución de gastos este mes</div>

            <div style={{ ...card, marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
                <div>
                    <div style={{ fontSize: 10, color: t.textFaint, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Total gastado</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: t.text }}>{fmt(total)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: t.textFaint, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Transacciones</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: t.text }}>{monthExpenses.length}</div>
                </div>
            </div>

            {byCategory.filter(c => c.spent > 0).sort((a, b) => b.spent - a.spent).map((cat, idx) => {
                const pct = Math.min((cat.spent / cat.budget) * 100, 100);
                const cc = catC(cat, dark);
                return (
                    <div key={cat.id} className="row-in" style={{ ...card, marginBottom: 8, animationDelay: `${idx * .04}s` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 11, background: cc + "1A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{cat.emoji}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: 13, color: t.text }}>{cat.label}</div>
                                <div style={{ fontSize: 10, color: t.textMuted, marginTop: 1 }}>{monthExpenses.filter(e => e.category === cat.id).length} transacciones</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: t.text }}>{fmt(cat.spent)}</div>
                                <div style={{ fontSize: 10, color: cat.spent > cat.budget ? t.danger : t.textMuted, marginTop: 1 }}>de {fmt(cat.budget)}</div>
                            </div>
                        </div>
                        <div style={{ background: t.surface3, borderRadius: 3, height: 3 }}>
                            <div style={{ background: cat.spent > cat.budget ? t.danger : cc, borderRadius: 3, height: 3, width: `${pct}%`, transition: "width .6s ease" }} />
                        </div>
                    </div>
                );
            })}
            {byCategory.filter(c => c.spent > 0).length === 0 && (
                <div style={{ textAlign: "center", color: t.textFaint, padding: "48px 0" }}>Sin gastos este mes aún.</div>
            )}
        </div>
    );
}
