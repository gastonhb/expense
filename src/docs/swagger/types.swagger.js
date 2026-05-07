/**
 * @swagger
 * /types:
 *   get:
 *     summary: Obtener lista de tipos de gastos
 *     tags: [Types]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Filtrar por codigo exacto
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nombre exacto
 *       - in: query
 *         name: _page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numero de pagina
 *       - in: query
 *         name: _limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Cantidad de elementos por pagina
 *       - in: query
 *         name: _order
 *         schema:
 *           type: string
 *           example: "name,-createdAt"
 *         description: Ordenamiento
 *     responses:
 *       200:
 *         description: Lista de tipos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TypeList'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *   post:
 *     summary: Crear nuevo tipo
 *     tags: [Types]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TypeBody'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Success'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /types/{id}:
 *   get:
 *     summary: Obtener tipo por ID
 *     tags: [Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tipo
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Actualizar tipo
 *     tags: [Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tipo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TypeBody'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *   delete:
 *     summary: Eliminar tipo
 *     tags: [Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tipo
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
