export default function ThemeToggle({ dark, onToggle, t }) {
  return (
    <button onClick={onToggle} title={dark ? "Modo claro" : "Modo oscuro"} style={{
      width: 50, height: 27, borderRadius: 14,
      border: `1.5px solid ${t.border2}`,
      background: dark ? t.surface3 : "#DDE8E0",
      cursor: "pointer", position: "relative", padding: 0,
      transition: "background .3s, border-color .3s", flexShrink: 0
    }}>
      <div style={{
        width: 21, height: 21, borderRadius: "50%",
        background: dark ? "#D0D0D0" : t.accent,
        position: "absolute", top: 2,
        left: dark ? 2 : 25,
        transition: "left .3s cubic-bezier(.34,1.56,.64,1), background .3s",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11
      }}>{dark ? "🌙" : "☀️"}</div>
    </button>
  );
}
