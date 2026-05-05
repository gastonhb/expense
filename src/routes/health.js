const express = require('express');
const router = express.Router();
const healthController = require('../controllers/health.controller');
const { apiLimiter } = require('../middlewares/rateLimiter');

// Aplicar rate limiting a las rutas de health
router.use(apiLimiter);

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Endpoints para verificar el estado del sistema
 */

router.get('/', healthController.healthCheck);
router.get('/ready', healthController.readinessCheck);
router.get('/live', healthController.livenessCheck);

module.exports = router;
