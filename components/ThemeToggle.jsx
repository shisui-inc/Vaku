export default function ThemeToggle({ dark, onToggle, t }) {
  return (
    <button
      onClick={onToggle}
      title={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      style={{
        width: 44, height: 26, borderRadius: 30,
        background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        border: `1px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}`,
        cursor: "pointer", display: "flex", alignItems: "center",
        padding: "3px 3px", transition: "background .35s, border-color .35s",
        position: "relative",
      }}
    >
      {/* Sun icon */}
      <span style={{
        position: "absolute", left: 6, fontSize: 11,
        opacity: dark ? 0.3 : 1, transition: "opacity .35s",
      }}>☀️</span>

      {/* Moon icon */}
      <span style={{
        position: "absolute", right: 6, fontSize: 11,
        opacity: dark ? 1 : 0.3, transition: "opacity .35s",
      }}>🌙</span>

      {/* Pill indicator */}
      <div style={{
        width: 20, height: 20, borderRadius: "50%",
        background: dark ? t.accent : "#fff",
        boxShadow: dark ? `0 0 8px ${t.accent}88` : "0 1px 4px rgba(0,0,0,0.2)",
        transform: dark ? "translateX(18px)" : "translateX(0px)",
        transition: "transform .35s cubic-bezier(.34,1.56,.64,1), background .35s",
        zIndex: 1,
      }} />
    </button>
  );
}
