import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { Anthropic } from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Validar API Key
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('❌ ERROR: ANTHROPIC_API_KEY no está definido en .env');
  console.error('Configura tu API key en .env');
  process.exit(1);
}

// ── Middleware ──
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

// ── Rate limiting ──
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // Máximo 10 requests por IP
  message: { error: 'Demasiadas solicitudes. Intenta en 1 minuto.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Inicializar cliente Anthropic ──
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// ── Rutas ──

/**
 * GET /
 * Health check - verifica que el servidor está funcionando
 */
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Vaku Backend is running' });
});

/**
 * POST /api/chat
 * Proxy para Claude API - seguro (API key en servidor)
 *
 * Body:
 * {
 *   "message": "¿En qué gasté más?",
 *   "context": "Total mes: ₲..."
 * }
 */
app.post('/api/chat', chatLimiter, async (req, res) => {
  try {
    const { message, context } = req.body;

    // Validación
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'El campo "message" es requerido y debe ser texto'
      });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({
        error: 'El mensaje no puede estar vacío'
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        error: 'El mensaje es demasiado largo (máx 2000 caracteres)'
      });
    }

    // Construir sistema prompt
    const systemPrompt = `Eres Vaku IA, asistente financiero para paraguayos.
Responde en español, usando guaraníes (₲) como moneda.
Sé amigable, conciso y útil.
${context ? `Contexto actual: ${context}` : ''}
Limita tu respuesta a 2-3 oraciones.`;

    // Llamar a Claude
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: message }
      ]
    });

    // Extraer texto de la respuesta
    const responseText = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('');

    res.json({
      response: responseText || 'Sin respuesta.',
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens
      }
    });

  } catch (error) {
    console.error('❌ Error en /api/chat:', error.message);

    // No exponer detalles internos al cliente
    if (error.status === 401) {
      return res.status(500).json({
        error: 'Error de autenticación con API. Verifica tu clave.'
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        error: 'Límite de API alcanzado. Intenta más tarde.'
      });
    }

    res.status(500).json({
      error: 'Error del servidor. Intenta de nuevo.'
    });
  }
});

/**
 * POST /api/validate-expense
 * Valida un gasto antes de guardarlo
 *
 * Body:
 * {
 *   "description": "Almuerzo",
 *   "amount": 25000,
 *   "category": "food"
 * }
 */
app.post('/api/validate-expense', (req, res) => {
  try {
    const { description, amount, category } = req.body;
    const errors = [];

    // Validar descripción
    if (!description || typeof description !== 'string') {
      errors.push('Descripción es requerida');
    } else if (description.trim().length === 0) {
      errors.push('Descripción no puede estar vacía');
    } else if (description.length > 150) {
      errors.push('Descripción muy larga (máx 150 caracteres)');
    }

    // Validar monto
    const num = Number(amount);
    if (isNaN(num)) {
      errors.push('Monto debe ser un número válido');
    } else if (num <= 0) {
      errors.push('Monto debe ser mayor a 0');
    } else if (num > 999999999) {
      errors.push('Monto demasiado alto');
    } else if (!Number.isInteger(num)) {
      errors.push('Monto debe ser un número entero');
    }

    // Validar categoría
    const validCategories = ['food', 'transport', 'shopping', 'health', 'entertainment', 'home', 'education', 'other'];
    if (!validCategories.includes(category)) {
      errors.push('Categoría no válida');
    }

    if (errors.length > 0) {
      return res.status(400).json({ valid: false, errors });
    }

    res.json({ valid: true });
  } catch (error) {
    console.error('❌ Error en /api/validate-expense:', error.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ── Error handling ──
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ── Iniciar servidor ──
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║        🎉 Vaku Backend Running        ║
╠════════════════════════════════════════╣
║ Server: http://localhost:${PORT}
║ Chat API: POST /api/chat
║ Status: http://localhost:${PORT}/
╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Servidor apagado');
  process.exit(0);
});
