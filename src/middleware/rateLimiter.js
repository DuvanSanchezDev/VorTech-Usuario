const rateLimit = require('express-rate-limit');

// Configuración específica según el ambiente
const isTest = process.env.NODE_ENV === 'test';

// Rate limiter para endpoints de autenticación (login/register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: isTest ? 1000 : 5, // En tests: límite alto, en producción: 5 intentos
  message: {
    error: 'Demasiados intentos',
    mensaje: 'Has excedido el límite de intentos. Por favor intenta de nuevo más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest // Saltar en ambiente de test
});

// Rate limiter general para otras operaciones
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: isTest ? 10000 : 100, // En tests: límite alto, en producción: 100 solicitudes
  message: {
    error: 'Demasiadas solicitudes',
    mensaje: 'Has excedido el límite de solicitudes. Por favor intenta de nuevo más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest // Saltar en ambiente de test
});

module.exports = { authLimiter, generalLimiter };
