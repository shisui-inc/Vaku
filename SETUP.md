# 🚀 Guía de Setup - Vaku

Sigue estos pasos para tener Vaku funcionando en tu máquina.

## 1️⃣ Clonar / Descargar el proyecto

```bash
# Si usas git
git clone <tu-repo>
cd vaku

# Si descargaste como ZIP
# Solo extrae en tu carpeta
cd vaku
```

## 2️⃣ Obtener API Key de Anthropic

1. Ve a [console.anthropic.com](https://console.anthropic.com)
2. Sign in con tu cuenta (o crea una)
3. Ve a "API Keys" en el sidebar
4. Click "Create Key"
5. Copia la key (empieza com `sk-ant-`)
6. **Guárdala en lugar seguro** (la usarás en el paso siguiente)

⚠️ **NO la compartas ni la pushees a Git**

## 3️⃣ Configurar Backend

```bash
# Navega a la carpeta del servidor
cd server

# Instala dependencias
npm install

# Copia el template de .env
cp .env.example .env

# Edita .env y agrega tu API key
# Abre server/.env en tu editor y reemplaza:
# ANTHROPIC_API_KEY=sk-ant-xxxxx
#
# Quedará algo así:
# ANTHROPIC_API_KEY=sk-ant-vlE5eW8mI0hE7W8e9xE9eW8e9xE9eW8e9xE9eW8
# PORT=3001
# CORS_ORIGIN=http://localhost:3000

# ¡Listo! Ahora inicia el servidor
npm run dev
```

Deberías ver:
```
╔════════════════════════════════════════╗
║        🎉 Vaku Backend Running        ║
╠════════════════════════════════════════╣
║ Server: http://localhost:3001
║ Chat API: POST /api/chat
║ Status: http://localhost:3001/
╚════════════════════════════════════════╝
```

## 4️⃣ Configurar Frontend

**Abre OTRA terminal** (sin cerrar la del servidor):

```bash
# Vuelve a la carpeta raíz
cd ..

# Instala dependencias frontend
npm install

# Inicia el dev server
npm run dev
```

Deberías ver algo como:
```
VITE v4.0.0  ready in 234 ms

➜  Local:   http://localhost:5173/
```

## 5️⃣ Abrir en el navegador

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

✅ La app debería estar funcionando completamente:
- Agregar gastos
- Ver estadísticas
- Editar presupuestos
- **Chatbot IA** (sin exposición de API key) 🔐

## ✅ Validación del Setup

### Test 1: Frontend carga
```
✓ Abre http://localhost:5173
✓ Ves la app con "Inicio", "Stats", "Presup.", "Vaku IA"
```

### Test 2: Persistencia funciona
```
✓ Agrega un gasto
✓ Recarga la página (F5)
✓ El gasto sigue ahí ✅
```

### Test 3: Backend funciona
```
✓ Abre Vaku IA (tab de chat)
✓ Entra cualquier pregunta
✓ Recibe respuesta de Claude ✅
```

### Test 4: API Key está segura
```
✓ Abre DevTools (F12)
✓ Ve a Network > Tab Chat
✓ NO ves "ANTHROPIC_API_KEY" en los headers ✅
```

## 🔧 Troubleshooting

### "ANTHROPIC_API_KEY is not defined"

```bash
# Verifica que server/.env exista
cat server/.env

# Debe tener:
ANTHROPIC_API_KEY=sk-ant-xxxxx
PORT=3001

# Si no, crear o editar:
cd server
cp .env.example .env
# Edita el archivo y agrega tu key
```

Luego reinicia el servidor (Ctrl+C, `npm run dev`).

### "Cannot POST /api/chat (403 CORS error)"

Probablemente el backend no está corriendo. Verifica:

```bash
# Terminal 2 debe mostrar:
# ✓ Server running on http://localhost:3001

# Si no, inicia backend:
cd server
npm run dev
```

### Frontend no carga

```bash
# Verifica que puerto 5173 no esté ocupado
# Si usas otro puerto, actualiza en ChatBot URL

# O usa puerto diferente:
npm run dev -- --port 3000
```

### "Module not found" en server

```bash
# Reinstala dependencias
cd server
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📁 Estructura después del setup

```
vaku/
├── node_modules/        ← Instalado - NO editar
├── dist/                ← Build (ignorar)
├── data/
├── utils/
├── components/
├── server/
│   ├── node_modules/    ← Instalado - NO editar
│   ├── .env             ← Tu API key (SECRETO)
│   ├── server.js
│   └── package.json
├── vaku-app.jsx
├── index.jsx
├── package.json
├── .gitignore
└── README.md
```

## 🌐 Deployar (Opcional)

### Frontend → Vercel

```bash
npm run build
# Sube la carpeta 'dist' a Vercel
```

### Backend → Railway / Heroku / Render

```bash
# En el dashboard del servicio, configura:
ANTHROPIC_API_KEY=sk-ant-xxxxx
PORT=3001
CORS_ORIGIN=https://tu-dominio.vercel.app

# Luego deploy
git push heroku main  # o tu branch
```

## 💡 Tips

- **Guardar en .env.example sin key**: Comparte esto en Git
- **Dev vs Prod**: En `server/.env` usa localhost; en producción usa tu dominio
- **Rate limiting**: Máx 10 req/min en `/api/chat` (modificable en code)
- **localStorage**: Limpieza manual (`F12 > Application > Clear All`)

## ❓ ¿Tienes dudas?

1. Revisa **README.md** (documentación completa)
2. Revisa **server/README.md** (docs del backend)
3. Revisa **CHANGELOG.md** (qué cambió)

---

**¡Listo para empezar!** 🚀

Si todo funciona, tienes Vaku completamente seguro, validado y persistente.
