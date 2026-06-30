/**
 * @swagger
 * /income-types:
 *   get:
 *     summary: Listar tipos de ingreso
 *     tags: [Income Types]
 *     responses:
 *       200:
 *         description: Lista de tipos de ingreso
 *   post:
 *     summary: Crear tipo de ingreso
 *     tags: [Income Types]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, name]
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tipo de ingreso creado
 * /income-types/{id}:
 *   get:
 *     summary: Obtener tipo de ingreso
 *     tags: [Income Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Tipo encontrado
 *   patch:
 *     summary: Actualizar tipo de ingreso
 *     tags: [Income Types]
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
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tipo actualizado
 *   delete:
 *     summary: Eliminar tipo de ingreso
 *     tags: [Income Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Tipo eliminado
 */
