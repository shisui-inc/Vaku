export const DARK = {
  bg:        "#060606",
  surface:   "#0E0E0E",
  surface2:  "#141414",
  surface3:  "#1E1E1E",
  border:    "#1A1A1A",
  border2:   "#222",
  text:      "#FFFFFF",
  textSub:   "#C0C0C0",
  textMuted: "#555",
  textFaint: "#333",
  navBg:     "#080808",
  navBorder: "#111",
  accent:    "#00E5A0",
  accentB:   "#00B4D8",
  accentText:"#000",
  ring:      "#161616",
  danger:    "#FF6B6B",
  warn:      "#FFB347",
  shadow:    "rgba(0,0,0,0.5)",
};

export const LIGHT = {
  bg:        "#F4F4EF",
  surface:   "#FFFFFF",
  surface2:  "#F0F0EB",
  surface3:  "#E6E6E0",
  border:    "#E2E2DC",
  border2:   "#D4D4CE",
  text:      "#0A0A0A",
  textSub:   "#2A2A2A",
  textMuted: "#888",
  textFaint: "#BBBBB5",
  navBg:     "#FFFFFF",
  navBorder: "#E2E2DC",
  accent:    "#007A52",
  accentB:   "#006688",
  accentText:"#FFFFFF",
  ring:      "#E2E2DC",
  danger:    "#CC3333",
  warn:      "#AA6600",
  shadow:    "rgba(0,0,0,0.07)",
};

export const CATEGORIES = [
  { id: "food",          label: "Comida",      emoji: "🍔", colorD: "#FF6B6B", colorL: "#D94040" },
  { id: "transport",     label: "Transporte",  emoji: "🚗", colorD: "#4ECDC4", colorL: "#1A9990" },
  { id: "shopping",      label: "Compras",     emoji: "🛍️", colorD: "#F0C040", colorL: "#B08000" },
  { id: "health",        label: "Salud",       emoji: "💊", colorD: "#5CC87A", colorL: "#2A8A50" },
  { id: "entertainment", label: "Ocio",        emoji: "🎮", colorD: "#9B8FFF", colorL: "#5544CC" },
  { id: "home",          label: "Hogar",       emoji: "🏠", colorD: "#FFB347", colorL: "#C07000" },
  { id: "education",     label: "Educación",   emoji: "📚", colorD: "#60B8E8", colorL: "#1A7AAA" },
  { id: "other",         label: "Otro",        emoji: "✨", colorD: "#888888", colorL: "#666666" },
];

export const catC = (cat, dark) => dark ? cat.colorD : cat.colorL;

export const BUDGETS_DEFAULT = {
  food: 500000, transport: 200000, shopping: 400000, health: 150000,
  entertainment: 250000, home: 700000, education: 200000, other: 100000,
};
