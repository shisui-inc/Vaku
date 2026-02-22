export function fmt(n) {
  return "₲ " + new Intl.NumberFormat("es-PY", { maximumFractionDigits: 0 }).format(n);
}

export function fmtDate(s) {
  return new Date(s + "T12:00:00").toLocaleDateString("es", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}

export function getCurrentMonth() {
  return new Date().toLocaleDateString("es-es", { month: "long" }).charAt(0).toUpperCase() +
         new Date().toLocaleDateString("es-es", { month: "long" }).slice(1);
}
