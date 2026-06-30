/**
 * @swagger
 * /installment-debts:
 *   get:
 *     summary: Listar deudas en cuotas
 *     tags: [Installment Debts]
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
 *         name: debtorId
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
 *         description: Lista de deudas en cuotas
 *   post:
 *     summary: Crear deuda en cuotas (auto-genera cuotas)
 *     tags: [Installment Debts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [date, dueDate, totalAmount, quotasCount, debtorId]
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               dueDate:
 *                 type: string
 *                 format: date
 *               totalAmount:
 *                 type: number
 *               quotasCount:
 *                 type: integer
 *                 minimum: 1
 *               description:
 *                 type: string
 *               debtorId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Deuda en cuotas creada
 * /installment-debts/{id}:
 *   get:
 *     summary: Obtener deuda en cuotas
 *     tags: [Installment Debts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Deuda en cuotas encontrada
 *   patch:
 *     summary: Actualizar deuda en cuotas
 *     tags: [Installment Debts]
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
 *               dueDate:
 *                 type: string
 *                 format: date
 *               totalAmount:
 *                 type: number
 *               quotasCount:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Deuda actualizada
 *   delete:
 *     summary: Eliminar deuda en cuotas
 *     tags: [Installment Debts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Deuda eliminada
 */
