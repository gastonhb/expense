const rateLimit = require('express-rate-limit');
const config = require('../config/environment');
const logger = require('../config/logger');

// Rate limiter general para la API
const apiLimiter = rateLimit({
  windowMs: config.rateLimiting.windowMs,
  max: config.rateLimiting.maxRequests,
  message: {
    status: 'error',
    message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
    retryAfter: Math.ceil(config.rateLimiting.windowMs / 1000 / 60)
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit excedido', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl
    });

    res.status(429).json({
      status: 'error',
      message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
      retryAfter: Math.ceil(config.rateLimiting.windowMs / 1000 / 60),
      timestamp: new Date().toISOString()
    });
  }
});

// Rate limiter más estricto para operaciones sensibles
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Solo 5 intentos por ventana
  message: {
    status: 'error',
    message: 'Demasiados intentos, intenta de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    logger.warn('Rate limit estricto excedido', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl
    });

    res.status(429).json({
      status: 'error',
      message: 'Demasiados intentos, intenta de nuevo en 15 minutos.',
      retryAfter: 15,
      timestamp: new Date().toISOString()
    });
  }
});

// Rate limiter para creación de recursos
const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // 10 creaciones por minuto
  message: {
    status: 'error',
    message: 'Demasiadas creaciones, intenta de nuevo en un minuto.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit de creación excedido', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl
    });

    res.status(429).json({
      status: 'error',
      message: 'Demasiadas creaciones, intenta de nuevo en un minuto.',
      retryAfter: 1,
      timestamp: new Date().toISOString()
    });
  }
});

// Rate limiter agresivo para prevenir ataques
const aggressiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requests por ventana de 15 minutos
  message: {
    status: 'error',
    message: 'Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit agresivo excedido', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl
    });

    res.status(429).json({
      status: 'error',
      message: 'Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos.',
      retryAfter: 15 * 60,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = {
  apiLimiter,
  strictLimiter,
  createLimiter,
  aggressiveLimiter
};
