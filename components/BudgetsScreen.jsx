import { CATEGORIES, catC } from "../data/constants";
import { fmt } from "../utils/formatters";
import ArcRing from "./ArcRing";
import BudgetEditDrawer from "./BudgetEditDrawer";

export default function BudgetsScreen({ budgets, setBudgets, monthExpenses, total, totalBudget, editBudget, setEditBudget, t, dark }) {
  const totalPct = totalBudget > 0 ? Math.round((total / totalBudget) * 100) : 0;
  const overCats = CATEGORIES.filter(c => monthExpenses.filter(e=>e.category===c.id).reduce((s,e)=>s+e.amount,0) > budgets[c.id]);
  const nearCats = CATEGORIES.filter(c => {
    const s=monthExpenses.filter(e=>e.category===c.id).reduce((x,e)=>x+e.amount,0);
    const p=budgets[c.id]>0?(s/budgets[c.id])*100:0;
    return p>=80&&p<100;
  });
  const activeEdit = editBudget ? CATEGORIES.find(c=>c.id===editBudget) : null;
  const card = { background: t.surface, borderRadius: 20, padding: 18, border: `1px solid ${t.border}` };

  return (
    <div style={{ padding: "52px 20px 0", animation: "fadeIn .35s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: `linear-gradient(135deg,${t.accent},${t.accentB})` }} />
            <span style={{ fontSize: 10, color: t.textMuted, letterSpacing: 2, textTransform: "uppercase" }}>Mensual</span>
          </div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.15, color: t.text }}>
            Poné límites.<br /><span style={{ color: t.accent }}>Mantente al día.</span>
          </div>
        </div>
      </div>

      {/* Hero ring card */}
      <div style={{ ...card, marginBottom: 12, display: "flex", alignItems: "center", gap: 18, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, borderRadius: "50%", background: (total>totalBudget?t.danger:t.accent)+"14", filter: "blur(28px)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <ArcRing pct={totalPct} color={total>totalBudget?t.danger:t.accent} ringBg={t.ring} size={84} stroke={7} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 800, color: total>totalBudget?t.danger:t.accent }}>{totalPct}%</span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: t.textMuted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Presupuesto total</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: t.text }}>{fmt(totalBudget)}</div>
          <div style={{ marginTop: 8, display: "flex", gap: 14 }}>
            <div>
              <div style={{ fontSize: 9, color: t.textFaint, textTransform: "uppercase", letterSpacing: 1 }}>Gastado</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: t.textSub, marginTop: 1 }}>{fmt(total)}</div>
            </div>
            <div style={{ width: 1, background: t.border }} />
            <div>
              <div style={{ fontSize: 9, color: t.textFaint, textTransform: "uppercase", letterSpacing: 1 }}>Libre</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: total>totalBudget?t.danger:t.accent, marginTop: 1 }}>
                {total>totalBudget?"−":""}{fmt(Math.abs(totalBudget-total))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert banners */}
      {overCats.length>0 && (
        <div style={{ background: dark?"#FF333310":"#FFF0F0", border: `1px solid ${t.danger}33`, borderRadius: 14, padding: "11px 14px", marginBottom: 8, display: "flex", gap: 10 }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.danger, marginBottom: 2 }}>Límite superado</div>
            <div style={{ fontSize: 11, color: t.textMuted }}>{overCats.map(c=>c.label).join(", ")} excedieron su presupuesto.</div>
          </div>
        </div>
      )}
      {nearCats.length>0 && overCats.length===0 && (
        <div style={{ background: dark?"#FFB34710":"#FFF7EE", border: `1px solid ${t.warn}33`, borderRadius: 14, padding: "11px 14px", marginBottom: 8, display: "flex", gap: 10 }}>
          <span style={{ fontSize: 16 }}>🔔</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.warn, marginBottom: 2 }}>Cerca del límite</div>
            <div style={{ fontSize: 11, color: t.textMuted }}>{nearCats.map(c=>c.label).join(", ")} {nearCats.length===1?"está":"están"} al 80%+.</div>
          </div>
        </div>
      )}

      <div style={{ fontSize: 10, color: t.textFaint, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10, marginTop: 4 }}>Por categoría</div>

      {CATEGORIES.map((cat, idx) => {
        const spent = monthExpenses.filter(e=>e.category===cat.id).reduce((s,e)=>s+e.amount,0);
        const budget = budgets[cat.id];
        const pct = budget>0 ? (spent/budget)*100 : 0;
        const remaining = budget - spent;
        const isOver = spent>budget, isNear = pct>=80&&!isOver;
        const sc = isOver ? t.danger : isNear ? t.warn : pct>0 ? t.accent : t.textFaint;
        const cc = catC(cat, dark);

        return (
          <div key={cat.id} className="row-in" onClick={()=>setEditBudget(cat.id)}
            style={{ background: t.surface, borderRadius: 20, padding: 18, border: `1px solid ${t.border}`, marginBottom: 8, cursor: "pointer", animationDelay: `${idx*.04}s`,
              borderColor: isOver ? t.danger+"33" : isNear ? t.warn+"33" : t.border,
              transition: "border-color .2s, transform .15s, box-shadow .15s"
            }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow=`0 4px 16px ${t.shadow}`; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <ArcRing pct={pct} color={cc} ringBg={t.ring} size={48} stroke={4} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{cat.emoji}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: t.text }}>{cat.label}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: isOver?t.danger:t.textSub }}>{fmt(spent)}</div>
                </div>
                <div style={{ background: t.surface3, borderRadius: 4, height: 4, overflow: "hidden" }}>
                  <div style={{ height: 4, borderRadius: 4, width: `${Math.min(pct,100)}%`, background: isOver?t.danger:isNear?t.warn:cc, transition: "width .7s cubic-bezier(.34,1.56,.64,1)" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <div style={{ fontSize: 9, color: sc, fontWeight: 600 }}>
                    {isOver ? `+${fmt(Math.abs(remaining))} excedido` : isNear ? `${Math.round(pct)}% — casi al límite` : pct>0 ? `${fmt(remaining)} restante` : "Sin gastos aún"}
                  </div>
                  <div style={{ fontSize: 9, color: t.textFaint }}>límite {fmt(budget)}</div>
                </div>
              </div>
              <div style={{ color: t.surface3, fontSize: 14, flexShrink: 0 }}>›</div>
            </div>
          </div>
        );
      })}

      <div style={{ height: 12 }} />

      {activeEdit && (
        <BudgetEditDrawer cat={activeEdit} currentBudget={budgets[activeEdit.id]}
          spent={monthExpenses.filter(e=>e.category===activeEdit.id).reduce((s,e)=>s+e.amount,0)}
          onSave={v=>setBudgets(prev=>({...prev,[activeEdit.id]:v}))}
          onClose={()=>setEditBudget(null)} t={t} dark={dark} />
      )}
    </div>
  );
}
