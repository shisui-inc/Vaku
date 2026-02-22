export function detectCategory(text) {
  const l = text.toLowerCase();
  if (/comida|almuerzo|cena|desayuno|café|cafe|restaurante|pizza|burger|sushi|super|mercado|chipa|sopa|mbeju/.test(l)) return "food";
  if (/taxi|uber|bus|gasolina|nafta|estacionamiento|peaje|metro|tren|transporte|moto/.test(l)) return "transport";
  if (/ropa|zapatos|tienda|compra|amazon|mall|centro|mercadería|shopping/.test(l)) return "shopping";
  if (/farmacia|médico|medico|doctor|gym|gimnasio|salud|medicina|clínica/.test(l)) return "health";
  if (/netflix|cine|juego|game|spotify|música|musica|teatro|concierto|streaming/.test(l)) return "entertainment";
  if (/alquiler|luz|agua|gas|internet|limpieza|mueble|ande|essap|copaco/.test(l)) return "home";
  if (/curso|libro|colegio|universidad|clase|institute/.test(l)) return "education";
  return "other";
}

export function detectAmount(text) {
  const mil = text.match(/(\d+(?:[.,]\d+)?)\s*(?:mil|k)\b/i);
  if (mil) return parseFloat(mil[1].replace(",", ".")) * 1000;
  const big = text.match(/(\d{1,3}(?:[.,]\d{3})+)/);
  if (big) return parseFloat(big[1].replace(/[.,]/g, ""));
  const plain = text.match(/₲?\s*(\d+)/);
  if (plain) return parseFloat(plain[1]);
  return null;
}

export function detectDate(text) {
  if (/ayer/.test(text)) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  }
  return new Date().toISOString().split("T")[0];
}
