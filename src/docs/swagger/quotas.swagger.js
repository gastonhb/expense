/**
 * @swagger
 * /quotas:
 *   get:
 *     summary: Listar cuotas de compras a plazo
 *     tags: [Quotas]
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
 *         name: shoppingId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: number
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de cuotas
 *   post:
 *     summary: Crear cuota de compra
 *     tags: [Quotas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [date, amount, number, shoppingId]
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               amount:
 *                 type: number
 *               number:
 *                 type: string
 *               shoppingId:
 *                 type: string
 *                 format: uuid
 *               expenseId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Cuota creada
 * /quotas/{id}:
 *   get:
 *     summary: Obtener cuota
 *     tags: [Quotas]
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
 *     tags: [Quotas]
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
 *     tags: [Quotas]
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
 * /quotas/{id}/paid:
 *   post:
 *     summary: Registrar pago de cuota
 *     tags: [Quotas]
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
 *         description: Cuota pagada y gasto registrado
 */
