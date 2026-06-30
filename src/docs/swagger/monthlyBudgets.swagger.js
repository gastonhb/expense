/**
 * @swagger
 * /monthly-budgets:
 *   get:
 *     summary: Listar presupuestos mensuales
 *     tags: [Monthly Budgets]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Lista de presupuestos mensuales
 *   post:
 *     summary: Crear presupuesto mensual
 *     tags: [Monthly Budgets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [date]
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Presupuesto mensual creado
 * /monthly-budgets/{id}:
 *   get:
 *     summary: Obtener presupuesto mensual
 *     tags: [Monthly Budgets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Presupuesto encontrado
 *   patch:
 *     summary: Actualizar presupuesto mensual
 *     tags: [Monthly Budgets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Presupuesto actualizado
 *   delete:
 *     summary: Eliminar presupuesto mensual
 *     tags: [Monthly Budgets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Presupuesto eliminado
 * /monthly-budgets/{id}/copy-last-month:
 *   post:
 *     summary: Copiar presupuesto del mes anterior
 *     tags: [Monthly Budgets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Presupuesto copiado con cuotas vinculadas
 */
