/**
 * @swagger
 * /tests:
 *   get:
 *     summary: Obtener lista de tests con paginación y ordenamiento
 *     tags: [Tests]
 *     parameters:
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
 *           example: "name,-createdAt,updatedAt"
 *         description: |
 *           Campos de ordenamiento separados por coma.
 *           Usar prefijo '-' para orden descendente.
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nombre (búsqueda parcial case-insensitive)
 *     responses:
 *       200:
 *         description: Lista de tests con metadatos de paginación y links
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestList'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *   post:
 *     summary: Crear nuevo test
 *     tags: [Tests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestBody'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Success'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /tests/{id}:
 *   get:
 *     summary: Obtener test por ID
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del test
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Actualizar test
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del test
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestBody'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *   delete:
 *     summary: Eliminar test
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del test
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
