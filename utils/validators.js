/**
 * Valida la descripción del gasto
 * @param {string} description - Descripción del gasto
 * @returns {object} { valid: boolean, error: string }
 */
export function validateDescription(description) {
  if (!description || typeof description !== 'string') {
    return { valid: false, error: "Descripción es requerida" };
  }

  const trimmed = description.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: "Descripción no puede estar vacía" };
  }

  if (trimmed.length > 150) {
    return { valid: false, error: "Descripción muy larga (máx 150 caracteres)" };
  }

  return { valid: true };
}

/**
 * Valida el monto del gasto
 * @param {number} amount - Monto en guaraníes
 * @returns {object} { valid: boolean, error: string }
 */
export function validateAmount(amount) {
  const num = Number(amount);

  if (isNaN(num)) {
    return { valid: false, error: "Monto debe ser un número válido" };
  }

  if (num <= 0) {
    return { valid: false, error: "Monto debe ser mayor a 0" };
  }

  if (num > 999999999) {
    return { valid: false, error: "Monto demasiado alto" };
  }

  if (!Number.isInteger(num)) {
    return { valid: false, error: "Monto debe ser un número entero" };
  }

  return { valid: true };
}

/**
 * Valida el presupuesto de una categoría
 * @param {number} budget - Presupuesto en guaraníes
 * @returns {object} { valid: boolean, error: string }
 */
export function validateBudget(budget) {
  const num = Number(budget);

  if (isNaN(num)) {
    return { valid: false, error: "Presupuesto debe ser un número válido" };
  }

  if (num < 0) {
    return { valid: false, error: "Presupuesto no puede ser negativo" };
  }

  if (num > 999999999) {
    return { valid: false, error: "Presupuesto demasiado alto" };
  }

  if (!Number.isInteger(num)) {
    return { valid: false, error: "Presupuesto debe ser un número entero" };
  }

  return { valid: true };
}

/**
 * Genera un ID único para gastos
 * @returns {number} ID único
 */
export function generateId() {
  return Math.floor(Date.now() + Math.random() * 1000);
}
