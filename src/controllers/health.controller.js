const catchAsync = require('../utils/catchAsync');
const Database = require('../config/database');
const logger = require('../config/logger');
const config = require('../config/environment');

class HealthController {
  /**
   * @swagger
   * /health:
   *   get:
   *     summary: Verificar el estado de salud del sistema
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Sistema saludable
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: Sistema saludable
   *                 data:
   *                   type: object
   *                   properties:
   *                     system:
   *                       type: object
   *                     database:
   *                       type: object
   *                     memory:
   *                       type: object
   *                     uptime:
   *                       type: number
   *       503:
   *         $ref: '#/components/responses/Error'
   */
  healthCheck = catchAsync(async (req, res) => {
    const startTime = Date.now();

    // Verificar salud de la base de datos
    const dbHealth = await Database.healthCheck();

    // Información del sistema
    const systemInfo = {
      environment: config.env,
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      responseTime: `${Date.now() - startTime}ms`
    };

    // Información de memoria
    const memoryUsage = process.memoryUsage();
    const memoryInfo = {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`
    };

    // Determinar estado general
    const isHealthy = dbHealth.status === 'healthy';
    const statusCode = isHealthy ? 200 : 503;
    const message = isHealthy ? 'Sistema saludable' : 'Sistema con problemas';

    const healthData = {
      system: systemInfo,
      database: dbHealth,
      memory: memoryInfo,
      services: {
        api: 'healthy',
        logging: 'healthy'
      }
    };

    logger.info('Health check realizado', {
      status: isHealthy ? 'healthy' : 'unhealthy',
      responseTime: systemInfo.responseTime,
      dbStatus: dbHealth.status
    });

    return res.status(statusCode).json({
      status: isHealthy ? 'success' : 'error',
      message,
      data: healthData,
      timestamp: new Date().toISOString()
    });
  });

  /**
   * @swagger
   * /health/ready:
   *   get:
   *     summary: Verificar si el sistema está listo para recibir tráfico
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Sistema listo
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: Sistema listo
   *       503:
   *         $ref: '#/components/responses/Error'
   */
  readinessCheck = catchAsync(async (req, res) => {
    const checks = [];

    // Verificar base de datos
    const dbHealth = await Database.healthCheck();
    checks.push({
      name: 'database',
      status: dbHealth.status === 'healthy' ? 'ready' : 'not_ready',
      details: dbHealth.details
    });

    // Verificar otras dependencias aquí
    // checks.push({
    //   name: 'redis',
    //   status: 'ready'
    // });

    const allReady = checks.every(check => check.status === 'ready');
    const statusCode = allReady ? 200 : 503;
    const message = allReady ? 'Sistema listo' : 'Sistema no está listo';

    return res.status(statusCode).json({
      status: allReady ? 'success' : 'error',
      message,
      data: {
        ready: allReady,
        checks
      },
      timestamp: new Date().toISOString()
    });
  });

  /**
   * @swagger
   * /health/live:
   *   get:
   *     summary: Verificar si el sistema está vivo (liveness probe)
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Sistema vivo
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: Sistema vivo
   */
  livenessCheck = catchAsync(async (req, res) => {
    // Check básico - si llegamos aquí, el sistema está vivo
    return res.status(200).json({
      status: 'success',
      message: 'Sistema vivo',
      data: {
        alive: true,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }
    });
  });
}

module.exports = new HealthController();
