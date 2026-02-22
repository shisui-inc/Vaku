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

export default function VakuApp() {
  // ✅ PERSISTENCIA: Usar el custom hook abstracto
  const [dark, setDark] = useLocalStorage("vaku_dark", true);
  const [expenses, setExpenses] = useLocalStorage("vaku_expenses", INITIAL_EXPENSES);
  const [budgets, setBudgets] = useLocalStorage("vaku_budgets", BUDGETS_DEFAULT);

  // Estado de UI
  const [tab, setTab] = useState("home");
  const [showAdd, setShowAdd] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [editBudget, setEditBudget] = useState(null);

  const t = dark ? DARK : LIGHT;

  // ✅ VALIDACIÓN: Agregar gasto con validación
  const addExpense = e => {
    const id = generateId();
    setExpenses(prev => [{ ...e, id }, ...prev]);
  };

  const deleteExpense = id => setExpenses(prev => prev.filter(e => e.id !== id));

  // ✅ MEMOIZACIÓN: Evitar cálculos innecesarios
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${t.bg}; }
        ::-webkit-scrollbar { width: 0; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        @keyframes slideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        .row-in { animation: slideUp .25s ease both; }
      `}</style>

      <div style={{ background: t.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", fontFamily: "'DM Sans',sans-serif", color: t.text, paddingBottom: 90, transition: "background .35s, color .35s" }}>

        {/* ── CONTENEDOR DE PÁGINAS ── */}
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

        {/* ── BOTÓN FLOTANTE ── */}
        <button onClick={() => setShowAdd(true)} style={{
          position: "fixed", bottom: 86, left: "50%", transform: "translateX(-50%)", width: 54, height: 54,
          background: `linear-gradient(135deg,${t.accent},${t.accentB})`, border: "none", borderRadius: "50%",
          fontSize: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 28px ${t.accent}55, 0 4px 16px ${t.shadow}`, zIndex: 50, color: t.accentText,
          transition: "transform .2s"
        }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateX(-50%) scale(1.08)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateX(-50%) scale(1)"}>+</button>

        {/* ── NAVEGACIÓN INFERIOR ── */}
        <div style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 480, background: t.navBg,
          borderTop: `1px solid ${t.navBorder}`, display: "flex", padding: "10px 0 22px", zIndex: 50,
          transition: "background .35s, border-color .35s"
        }}>
          {[
            { id: "home", icon: "◉", label: "Inicio" },
            { id: "stats", icon: "◫", label: "Stats" },
            { id: "budgets", icon: "◎", label: "Presup." },
            { id: "ai", icon: "✦", label: "Vaku IA" },
          ].map(item => {
            const active = tab === item.id;
            return (
              <button key={item.id} onClick={() => item.id === "ai" ? setShowAI(true) : setTab(item.id)}
                style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: item.id === "ai" ? 13 : 18, color: active ? t.accent : t.textFaint, transition: "color .2s" }}>{item.icon}</span>
                <span style={{ fontSize: 9, fontWeight: active ? 700 : 400, color: active ? t.accent : t.textFaint, letterSpacing: 0.5, fontFamily: "'Syne',sans-serif", transition: "color .2s" }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {showAdd && <AddExpenseModal onAdd={addExpense} onClose={() => setShowAdd(false)} t={t} dark={dark} />}
      {showAI && <AIChat expenses={monthExpenses} onClose={() => setShowAI(false)} t={t} />}
    </>
  );
}
