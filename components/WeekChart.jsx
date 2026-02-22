export default function WeekChart({ data, t }) {
  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 72 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
          <div style={{
            width: "100%", borderRadius: "5px 5px 0 0",
            height: `${Math.max((d.value / max) * 60, d.value > 0 ? 5 : 3)}px`,
            background: d.highlight ? `linear-gradient(180deg,${t.accent},${t.accentB})` : t.surface3,
            transition: "height .6s cubic-bezier(.34,1.56,.64,1)"
          }} />
          <span style={{ fontSize: 9, color: d.highlight ? t.accent : t.textFaint, fontWeight: d.highlight ? 700 : 400 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}
