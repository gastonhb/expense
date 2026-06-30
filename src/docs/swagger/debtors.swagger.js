/**
 * @swagger
 * /debtors:
 *   get:
 *     summary: Listar deudores
 *     tags: [Debtors]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de registros por página
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nombre
 *       - in: query
 *         name: lastName
 *         schema:
 *           type: string
 *         description: Filtrar por apellido
 *     responses:
 *       200:
 *         description: Lista de deudores
 *   post:
 *     summary: Crear deudor
 *     tags: [Debtors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, lastName]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del deudor
 *               lastName:
 *                 type: string
 *                 description: Apellido del deudor
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: ID de usuario si es un usuario del sistema
 *     responses:
 *       201:
 *         description: Deudor creado
 * /debtors/{id}:
 *   get:
 *     summary: Obtener deudor
 *     tags: [Debtors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Deudor encontrado
 *   patch:
 *     summary: Actualizar deudor
 *     tags: [Debtors]
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
 *               name:
 *                 type: string
 *               lastName:
 *                 type: string
 *               userId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Deudor actualizado
 *   delete:
 *     summary: Eliminar deudor
 *     tags: [Debtors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Deudor eliminado
 * /debtors/{id}/balance:
 *   get:
 *     summary: Obtener balance deudor (debts - payments + unpaidInstallments)
 *     tags: [Debtors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Balance del deudor con detalles
 */
