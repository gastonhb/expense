/**
 * @swagger
 * /shoppings:
 *   get:
 *     summary: Listar compras a plazo
 *     tags: [Shoppings]
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
 *         name: description
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de compras
 *   post:
 *     summary: Crear compra a plazo (auto-genera cuotas)
 *     tags: [Shoppings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [date, dueDate, amount, quotasCount, description]
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               dueDate:
 *                 type: string
 *                 format: date
 *               amount:
 *                 type: number
 *               quotasCount:
 *                 type: integer
 *                 minimum: 1
 *               description:
 *                 type: string
 *               typeId:
 *                 type: string
 *                 format: uuid
 *               subtypeId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Compra creada con cuotas
 * /shoppings/{id}:
 *   get:
 *     summary: Obtener compra
 *     tags: [Shoppings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Compra encontrada
 *   patch:
 *     summary: Actualizar compra
 *     tags: [Shoppings]
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Compra actualizada
 *   delete:
 *     summary: Eliminar compra
 *     tags: [Shoppings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Compra eliminada
 */
