# Vaku 💚 - Gestor de Gastos para Paraguay

Una app moderna para administrar gastos personales en guaraní. Construida con React + Node.js, con UI/UX hermosa y totalmente funcional.

## 📁 Estructura del Proyecto

```
vaku/
├── 📂 data/                    # Datos y constantes
│   ├── constants.js            # Temas, categorías, presupuestos
│   ├── initialData.js          # Datos iniciales demo
│
├── 📂 utils/                   # Funciones helper
│   ├── formatters.js           # fmt(), fmtDate(), etc.
│   ├── detectors.js            # detectAmount(), detectCategory(), etc.
│   ├── validators.js           # validateAmount(), validateBudget(), etc.
│
├── 📂 components/              # Componentes React reutilizables
│   ├── ThemeToggle.jsx         # Toggle dark/light
│   ├── ArcRing.jsx             # Anillo SVG de progreso
│   ├── WeekChart.jsx           # Gráfico de barras de semana
│   ├── AIChat.jsx              # Modal chatbot (Vaku IA)
│   ├── AddExpenseModal.jsx      # Modal para agregar gasto
│   ├── BudgetEditDrawer.jsx    # Drawer para editar presupuesto
│   ├── BudgetsScreen.jsx       # Pantalla de presupuestos
│
├── 📂 server/                  # Backend Node.js
│   ├── server.js               # Express server + API proxy
│   ├── package.json            # Dependencias
│   ├── .env                    # Variables de entorno (NO COMPARTIR)
│   ├── .env.example            # Template .env
│   ├── README.md               # Docs del backend
│
├── vaku-app.jsx                # App principal (componente raíz)
├── index.jsx                   # Entry point (React)
├── package.json                # Dependencias frontend
├── README.md                   # Este archivo
```

## 🚀 Quick Start

### Frontend

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar dev server
npm run dev

# Abre http://localhost:5173 (Vite)
```

### Backend

```bash
# 1. Navega a la carpeta servidor
cd server

# 2. Instalar dependencias
npm install

# 3. Configura .env con tu API key
cp .env.example .env
# Edita .env y agrega: ANTHROPIC_API_KEY=sk-ant-xxxxx

# 4. Inicia el servidor
npm run dev
# Corre en http://localhost:3001
```

## ✨ Características

### Core
- ✅ **Agregar gastos** - Modo texto libre o manual
- ✅ **Presupuestos** - Límites por categoría
- ✅ **Alertas** - Excedido o cercano al límite
- ✅ **Gráficos** - Semana, distribución por categoría
- ✅ **Chatbot IA** - Claude AI asistente financiero

### Mejoras implementadas
- ✅ **Persistencia** - localStorage (datos se guardan)
- ✅ **Validación** - Inputs validados en cliente + servidor
- ✅ **Seguridad** - API key en backend, CORS, rate limiting
- ✅ **Dark/Light** - Temas implementados
- ✅ **Refactorizado** - Código modular y mantenible

## 📋 Validaciones

### Cliente (React)
- Descripción: 1-150 caracteres
- Monto: Número entero > 0
- Presupuesto: Número entero ≥ 0

### Servidor
- Rate limiting: 10 requests/minuto
- Validación de inputs
- Error handling robusto

## 🔐 Seguridad

| Aspecto | Estado | Detalles |
|---------|--------|----------|
| API Key | ✅ Segura | En backend, NOT en cliente |
| CORS | ✅ Configurado | Solo localhost en dev |
| Rate Limit | ✅ Activo | 10 req/min por IP |
| Inputs | ✅ Validados | Cliente + servidor |
| localStorage | ✅ Seguro | Sin datos sensibles |

## 📊 Estado de datos

```
Datos que persisten (localStorage):
├── expenses    → Listado de gastos
├── budgets     → Presupuestos por categoría
└── dark        → Preferencia de tema

Datos que NO persisten (RAM):
├── UI state (tab activo, modales abiertos)
└── Chat messages (se pierden al refrescar)
```

## 🎨 Colores & Temas

### Dark Mode (por defecto)
```
bg:      #060606 (fondo)
surface: #0E0E0E (tarjetas)
accent:  #00E5A0 (verde)
accentB: #00B4D8 (azul)
danger:  #FF6B6B (rojo)
warn:    #FFB347 (naranja)
```

### Light Mode
```
bg:      #F4F4EF (fondo)
surface: #FFFFFF (blanco)
accent:  #007A52 (verde oscuro)
accentB: #006688 (azul oscuro)
danger:  #CC3333
warn:    #AA6600
```

## 📱 Responsive

- Optimizado para mobile (480px max-width)
- Funciona en tablet y desktop
- Touch-friendly (no mouse required)

## 🐛 Bugs corregidos

| Bug | Severity | Fix |
|-----|----------|-----|
| API key expuesta | 🔴 CRÍTICA | Movida a backend |
| Sin persistencia | 🟠 ALTA | Implementado localStorage |
| Sin validación | 🟠 ALTA | Validadores en utils/ |
| Mes hardcodeado | 🟡 MEDIA | Función getCurrentMonth() |
| Recálculos inútiles | 🟡 MEDIA | useMemo() en vaku-app.jsx |

## 🚀 Próximos pasos (Future)

### Corto plazo
- [ ] Exportar a CSV
- [ ] Filtro por mes/año
- [ ] Búsqueda de gastos
- [ ] Confirmación antes de eliminar

### Mediano plazo
- [ ] Base de datos (Supabase/Firebase)
- [ ] Autenticación (Google/Email)
- [ ] Sincronización multi-dispositivo
- [ ] App nativa (React Native)

### Largo plazo
- [ ] Notificaciones en tiempo real
- [ ] Metas de ahorro
- [ ] Análisis predictivo
- [ ] Compartir presupuestos

## 📚 Stack Técnico

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool
- **CSS-in-JS** - Estilos inline

### Backend
- **Express** - Framework web
- **Node.js** - Runtime
- **Anthropic SDK** - Claude API client
- **dotenv** - Variables de entorno

## 📖 Guías

### Agregar nueva categoría

1. En `data/constants.js`:
```javascript
export const CATEGORIES = [
  // ...
  { id: "sports", label: "Deportes", emoji: "⚽", colorD: "#FF00FF", colorL: "#CC00CC" }
];
```

2. En `data/constants.js` (presupuestos):
```javascript
export const BUDGETS_DEFAULT = {
  // ...
  sports: 300000
};
```

### Cambiar API model

En `server/server.js`:
```javascript
// Línea ~90
model: 'claude-opus-4-1-20250805', // Cambia aquí
```

### Deploying

**Frontend (Vercel/Netlify)**:
```bash
npm run build
# Sube la carpeta 'dist'
```

**Backend (Heroku/Railway/Render)**:
```bash
git push heroku main
# O configura env vars en el dashboard
```

## 🤝 Contribuir

Para mejorar Vaku:

1. Fork el repo
2. Crea feature branch (`git checkout -b feature/amazing`)
3. Commit cambios (`git commit -am 'Add amazing feature'`)
4. Push a branch (`git push origin feature/amazing`)
5. Abre Pull Request

## 📄 Licencia

MIT - Libre para usar y modificar

## 💬 Soporte

- Issues: Reporta bugs abiendo un issue
- Requests: Sugiere features en discussions
- Docs: Lee el README en `server/` para backend

---

**Hecho con ❤️ para Paraguay** 🇵🇾
