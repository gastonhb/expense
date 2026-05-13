/**
 * @swagger
 * /subtypes:
 *   get:
 *     summary: Obtener lista de subtipos de gastos
 *     tags: [Subtypes]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nombre exacto
 *       - in: query
 *         name: typeId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por ID de tipo
 *       - in: query
 *         name: _page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: _limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Cantidad de elementos por página
 *       - in: query
 *         name: _order
 *         schema:
 *           type: string
 *           example: "name,-createdAt"
 *         description: Ordenamiento
 *     responses:
 *       200:
 *         description: Lista de subtipos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubtypeList'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *   post:
 *     summary: Crear nuevo subtipo
 *     tags: [Subtypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubtypeBody'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Success'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /subtypes/{id}:
 *   get:
 *     summary: Obtener subtipo por ID
 *     tags: [Subtypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del subtipo
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Actualizar subtipo
 *     tags: [Subtypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubtypeBody'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *   delete:
 *     summary: Eliminar subtipo
 *     tags: [Subtypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
