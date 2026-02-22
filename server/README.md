# Vaku Backend 🚀

Backend server para la app Vaku que actúa como proxy seguro para la API de Anthropic.

## ¿Por qué un backend?

- **Seguridad**: La API key de Anthropic **NUNCA** se expone al cliente
- **Rate limiting**: Prevenir abuso de la API
- **Validación**: Validar datos antes de procesarlos
- **Escalabilidad**: Futuro: base de datos, autenticación, etc.

## Instalación

```bash
cd server
npm install
```

## Configuración

1. Copia `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Edita `.env` y agrega tu API key de Anthropic:
```env
ANTHROPIC_API_KEY=sk-ant-xxxxx...
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

⚠️ **IMPORTANTE**: Nunca commits `.env` a Git. Usa `.env.example` como template.

## Ejecución

**Desarrollo (con hot reload)**:
```bash
npm run dev
```

**Producción**:
```bash
npm start
```

El servidor correrá en `http://localhost:3001`

## Endpoints

### `GET /`
Health check
```bash
curl http://localhost:3001
```

### `POST /api/chat`
Proxy para Claude API (seguro)

**Request**:
```json
{
  "message": "¿En qué gasté más?",
  "context": "Total mes: ₲500.000. Por categoría: food=₲200.000..."
}
```

**Response**:
```json
{
  "response": "Gastaste más en comida este mes...",
  "usage": {
    "input_tokens": 150,
    "output_tokens": 45
  }
}
```

### `POST /api/validate-expense`
Valida un gasto (existe pero frontend lo maneja localmente)

**Request**:
```json
{
  "description": "Almuerzo",
  "amount": 25000,
  "category": "food"
}
```

**Response**:
```json
{ "valid": true }
```

## Rate Limiting

- **Máximo**: 10 requests por minuto por IP
- **Respuesta**: 429 Too Many Requests

## Deployment

### Heroku
```bash
heroku create vaku-backend
heroku config:set ANTHROPIC_API_KEY=sk-ant-xxxxx
git push heroku main
```

### Replit
1. Crea un nuevo proyecto
2. Importa este código
3. Agrega secrets (`.env`)
4. Click "Run"

### Railway / Render / Vercel
Sigue sus guías de Node.js. Recuerda setear las variables de entorno.

## Seguridad en Producción

- [ ] Usar HTTPS siempre
- [ ] Configurar CORS correctamente (específico dominio)
- [ ] Setear `NODE_ENV=production`
- [ ] Aumentar rate limiting según necesidad
- [ ] Agregar logging/monitoring
- [ ] Validar y sanitizar todos los inputs
- [ ] Nunca exponer `.env` o detalles internos

## Monitoreo

En producción, adiciona logging:
```javascript
// O usa: Sentry, LogRocket, Datadog, etc.
console.error(`Error: ${error.message}`);
```

## Troubleshooting

**"ANTHROPIC_API_KEY is not defined"**
- Verifica que `.env` exista en el directorio `server/`
- Recarga el servidor

**Error 429 (Too Many Requests)**
- Esperá 1 minuto
- Sube el rate limit en `server.js` si es necesario

**CORS error**
- Verifica `CORS_ORIGIN` en `.env`
- Frontend debe llamar a `http://localhost:3001` en desarrollo

## Próximos pasos

- [ ] Agregar autenticación (usuarios)
- [ ] Base de datos (guardar gastos)
- [ ] WebSockets (sync en tiempo real)
- [ ] Testing (Jest)
- [ ] CI/CD (GitHub Actions)
