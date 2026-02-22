import { useState, useMemo } from "react";
import { DARK, LIGHT, CATEGORIES, BUDGETS_DEFAULT } from "./data/constants";
import { INITIAL_EXPENSES } from "./data/initialData";
import { generateId } from "./utils/validators";
import { useLocalStorage } from "./hooks/useLocalStorage";

import AddExpenseModal from "./components/AddExpenseModal";
import BudgetsScreen from "./components/BudgetsScreen";
import AIChat from "./components/AIChat";

import HomePage from "./pages/HomePage";
import StatsPage from "./pages/StatsPage";

// ─── SVG Icon Set ───────────────────────────────────────────────────────────
const IconHome = ({ active, color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);
const IconStats = ({ active, color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="12" width="4" height="9" rx="1" />
    <rect x="10" y="7" width="4" height="14" rx="1" />
    <rect x="17" y="3" width="4" height="18" rx="1" />
  </svg>
);
const IconWallet = ({ active, color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
    <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />
    <circle cx="16" cy="13" r="1.5" fill={color} stroke="none" />
  </svg>
);
const IconSparkle = ({ active, color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" />
    <path d="M5 3l.96 2.88L8.5 7 5.96 7.88 5 11l-.96-3.12L1.5 7l2.54-.88L5 3z" opacity="0.6" />
  </svg>
);

const NAV_ITEMS = [
  { id: "home", label: "Inicio", Icon: IconHome },
  { id: "stats", label: "Stats", Icon: IconStats },
  { id: "budgets", label: "Presup.", Icon: IconWallet },
  { id: "ai", label: "Vaku IA", Icon: IconSparkle },
];

export default function VakuApp() {
  const [dark, setDark] = useLocalStorage("vaku_dark", true);
  const [expenses, setExpenses] = useLocalStorage("vaku_expenses", INITIAL_EXPENSES);
  const [budgets, setBudgets] = useLocalStorage("vaku_budgets", BUDGETS_DEFAULT);

  const [tab, setTab] = useState("home");
  const [showAdd, setShowAdd] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [editBudget, setEditBudget] = useState(null);

  const t = dark ? DARK : LIGHT;

  const addExpense = e => setExpenses(prev => [{ ...e, id: generateId() }, ...prev]);
  const deleteExpense = id => setExpenses(prev => prev.filter(e => e.id !== id));

  const currentMonth = useMemo(() => new Date().getMonth(), []);
  const monthExpenses = useMemo(() => expenses.filter(e => new Date(e.date).getMonth() === currentMonth), [expenses, currentMonth]);
  const total = useMemo(() => monthExpenses.reduce((s, e) => s + e.amount, 0), [monthExpenses]);
  const totalBudget = useMemo(() => Object.values(budgets).reduce((s, v) => s + v, 0), [budgets]);

  const byCategory = useMemo(() => CATEGORIES.map(c => ({
    ...c,
    spent: monthExpenses.filter(e => e.category === c.id).reduce((s, e) => s + e.amount, 0),
    budget: budgets[c.id],
  })), [monthExpenses, budgets]);

  const weekData = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const ds = d.toISOString().split("T")[0];
    return {
      label: d.toLocaleDateString("es", { weekday: "narrow" }),
      value: expenses.filter(e => e.date === ds).reduce((s, e) => s + e.amount, 0),
      highlight: i === 6
    };
  }), [expenses]);

  const grouped = useMemo(() => monthExpenses.reduce((acc, e) => {
    (acc[e.date] = acc[e.date] || []).push(e);
    return acc;
  }, {}), [monthExpenses]);

  const sortedDates = useMemo(() => Object.keys(grouped).sort((a, b) => b.localeCompare(a)), [grouped]);

  const navIndex = NAV_ITEMS.findIndex(i => i.id === tab);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        body { background: ${t.bg}; }
        ::-webkit-scrollbar { width: 0; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }

        @keyframes slideUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
        @keyframes scaleIn   { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }
        @keyframes pulse-ring {
          0%   { transform:translateX(-50%) scale(1);   opacity: 0.6; }
          70%  { transform:translateX(-50%) scale(1.55); opacity: 0; }
          100% { transform:translateX(-50%) scale(1.55); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes slideIndicator {
          from { opacity:0; transform: scaleX(0.5); }
          to   { opacity:1; transform: scaleX(1); }
        }

        .row-in  { animation: slideUp .28s ease both; }
        .page-in { animation: fadeIn .3s ease; }
        .scale-in{ animation: scaleIn .25s cubic-bezier(.34,1.56,.64,1); }

        .nav-btn:active { transform: scale(0.88) !important; }
        .nav-btn { transition: transform .15s; }
        .expense-card:hover .delete-btn { opacity: 1 !important; }
        .category-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px ${dark ? 'rgba(0,0,0,.5)' : 'rgba(0,0,0,.12)'} !important; }
        .category-card { transition: transform .2s, box-shadow .2s; }
      `}</style>

      {/* Background ambient gradient */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: dark
          ? `radial-gradient(ellipse 80% 40% at 50% 0%, #00e5a012 0%, transparent 70%),
             radial-gradient(ellipse 60% 30% at 100% 100%, #00b4d808 0%, transparent 60%)`
          : `radial-gradient(ellipse 80% 40% at 50% 0%, #00c48a0f 0%, transparent 70%),
             radial-gradient(ellipse 60% 30% at 0% 100%, #006688080 0%, transparent 60%)`,
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        background: "transparent", minHeight: "100vh", maxWidth: 480, margin: "0 auto",
        fontFamily: "'DM Sans',sans-serif", color: t.text, paddingBottom: 110,
        transition: "color .35s"
      }}>

        {tab === "home" && (
          <HomePage
            dark={dark} setDark={setDark} t={t} total={total} totalBudget={totalBudget}
            weekData={weekData} sortedDates={sortedDates} grouped={grouped} deleteExpense={deleteExpense}
          />
        )}

        {tab === "stats" && (
          <StatsPage
            dark={dark} setDark={setDark} t={t} monthExpenses={monthExpenses} total={total} byCategory={byCategory}
          />
        )}

        {tab === "budgets" && (
          <BudgetsScreen budgets={budgets} setBudgets={setBudgets}
            monthExpenses={monthExpenses} total={total} totalBudget={totalBudget}
            editBudget={editBudget} setEditBudget={setEditBudget} t={t} dark={dark} />
        )}

        {/* ── Floating Bottom Area ── */}
        <div style={{
          position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
          width: "calc(100% - 40px)", maxWidth: 440,
          zIndex: 50,
          display: "flex", alignItems: "center", gap: 12,
        }}>

          {/* FAB */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{
              position: "absolute", inset: -6,
              borderRadius: "50%",
              border: `2px solid ${t.accent}44`,
              animation: "pulse-ring 2.5s cubic-bezier(.455,.03,.515,.955) infinite",
              pointerEvents: "none",
            }} />
            <button
              onClick={() => setShowAdd(true)}
              style={{
                width: 52, height: 52,
                background: `linear-gradient(135deg,${t.accent},${t.accentB})`,
                border: "none", borderRadius: "50%",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 24px ${t.accent}66, 0 4px 16px ${t.shadow}`,
                color: t.accentText, transition: "transform .2s, box-shadow .2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          {/* NAV PILL */}
          <div style={{
            flex: 1,
            background: dark
              ? "rgba(12,12,12,0.88)"
              : "rgba(255,255,255,0.88)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
            borderRadius: 24,
            display: "flex", alignItems: "center",
            padding: "6px 6px",
            boxShadow: dark
              ? "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)"
              : "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
            transition: "background .35s, border-color .35s, box-shadow .35s",
          }}>
            {NAV_ITEMS.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  className="nav-btn"
                  onClick={() => item.id === "ai" ? setShowAI(true) : setTab(item.id)}
                  style={{
                    flex: 1, border: "none", cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                    padding: "8px 4px", borderRadius: 18, position: "relative",
                    background: active
                      ? (dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)")
                      : "transparent",
                    transition: "background .25s",
                  }}
                >
                  {/* Active accent top bar */}
                  {active && (
                    <div style={{
                      position: "absolute", top: 4, left: "50%",
                      transform: "translateX(-50%)",
                      width: 20, height: 3, borderRadius: 3,
                      background: `linear-gradient(90deg,${t.accent},${t.accentB})`,
                      boxShadow: `0 0 8px ${t.accent}88`,
                      animation: "scaleIn .2s cubic-bezier(.34,1.56,.64,1)",
                    }} />
                  )}
                  <div style={{ marginTop: active ? 2 : 0, transition: "margin .2s" }}>
                    <item.Icon active={active} color={active ? t.accent : t.textFaint} />
                  </div>
                  <span style={{
                    fontSize: 9, fontWeight: active ? 700 : 400,
                    color: active ? t.accent : t.textFaint,
                    letterSpacing: 0.5,
                    fontFamily: "'Syne',sans-serif",
                    transition: "color .2s",
                  }}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {showAdd && <AddExpenseModal onAdd={addExpense} onClose={() => setShowAdd(false)} t={t} dark={dark} />}
      {showAI && <AIChat expenses={monthExpenses} onClose={() => setShowAI(false)} t={t} />}
    </>
  );
}
