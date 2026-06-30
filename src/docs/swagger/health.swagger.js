/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check de la API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API está funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 * /health/ready:
 *   get:
 *     summary: Readiness check (disponibilidad de recursos)
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Sistema listo para recibir solicitudes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ready
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 * /health/live:
 *   get:
 *     summary: Liveness check (continuidad del servicio)
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Sistema vivo y respondiendo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: alive
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
