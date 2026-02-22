export const INITIAL_EXPENSES = [
  { id: 1, description: "Almuerzo en el trabajo", amount: 25000,  category: "food",          date: new Date().toISOString().split("T")[0] },
  { id: 2, description: "Taxi al centro",          amount: 15000,  category: "transport",     date: new Date().toISOString().split("T")[0] },
  { id: 3, description: "Netflix",                  amount: 75000,  category: "entertainment", date: new Date(Date.now()-86400000).toISOString().split("T")[0] },
  { id: 4, description: "Supermercado",             amount: 180000, category: "food",          date: new Date(Date.now()-86400000).toISOString().split("T")[0] },
  { id: 5, description: "Farmacia Santa Marta",     amount: 45000,  category: "health",        date: new Date(Date.now()-2*86400000).toISOString().split("T")[0] },
];
