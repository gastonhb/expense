/**
 * @swagger
 * /budgets:
 *   get:
 *     summary: Listar presupuestos
 *     tags: [Budgets]
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
 *       - in: query
 *         name: monthlyBudgetId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de presupuestos
 *   post:
 *     summary: Crear presupuesto
 *     tags: [Budgets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [date, amount, monthlyBudgetId, description]
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               amount:
 *                 type: number
 *               monthlyBudgetId:
 *                 type: string
 *                 format: uuid
 *               description:
 *                 type: string
 *               typeId:
 *                 type: string
 *                 format: uuid
 *               subtypeId:
 *                 type: string
 *                 format: uuid
 *               paid:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Presupuesto creado
 * /budgets/{id}:
 *   get:
 *     summary: Obtener presupuesto
 *     tags: [Budgets]
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
 *     summary: Actualizar presupuesto
 *     tags: [Budgets]
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
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               paid:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Presupuesto actualizado
 *   delete:
 *     summary: Eliminar presupuesto
 *     tags: [Budgets]
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
 * /budgets/{id}/paid:
 *   post:
 *     summary: Registrar pago de presupuesto
 *     tags: [Budgets]
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
 *               amount:
 *                 type: number
 *               typeId:
 *                 type: string
 *                 format: uuid
 *               subtypeId:
 *                 type: string
 *                 format: uuid
 *               paymentMethodId:
 *                 type: string
 *                 format: uuid
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Presupuesto pagado y gasto registrado
 */
