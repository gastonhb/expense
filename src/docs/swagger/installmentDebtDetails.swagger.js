/**
 * @swagger
 * /installment-debt-details:
 *   get:
 *     summary: Listar cuotas de deudas
 *     tags: [Installment Debt Details]
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
 *         name: number
 *         schema:
 *           type: string
 *       - in: query
 *         name: installmentDebtId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Lista de cuotas
 *   post:
 *     summary: Crear cuota manualmente
 *     tags: [Installment Debt Details]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [date, amount, number, installmentDebtId, debtorId]
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               amount:
 *                 type: number
 *               number:
 *                 type: string
 *               installmentDebtId:
 *                 type: string
 *                 format: uuid
 *               debtorId:
 *                 type: string
 *                 format: uuid
 *               debtPaymentId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Cuota creada
 * /installment-debt-details/{id}:
 *   get:
 *     summary: Obtener cuota
 *     tags: [Installment Debt Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Cuota encontrada
 *   patch:
 *     summary: Actualizar cuota
 *     tags: [Installment Debt Details]
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
 *               number:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cuota actualizada
 *   delete:
 *     summary: Eliminar cuota
 *     tags: [Installment Debt Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Cuota eliminada
 * /installment-debt-details/{id}/paid:
 *   post:
 *     summary: Registrar pago de cuota
 *     tags: [Installment Debt Details]
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
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cuota pagada
 */
