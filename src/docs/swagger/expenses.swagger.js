/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Obtener lista de gastos con paginación y filtros
 *     tags: [Expenses]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar por fecha exacta (YYYY-MM-DD)
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha desde (inclusive)
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha hasta (inclusive)
 *       - in: query
 *         name: paymentMethodId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por ID de metodo de pago
 *       - in: query
 *         name: typeId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por ID de tipo
 *       - in: query
 *         name: subtypeId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por ID de subtipo (opcional, debe pertenecer al typeId si se especifica)
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Buscar por descripción (búsqueda exacta)
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
 *           example: "-createdAt,id"
 *         description: |
 *           Campos de ordenamiento separados por coma.
 *           Usar prefijo '-' para orden descendente.
 *     responses:
 *       200:
 *         description: Lista de gastos con metadatos de paginación y links
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExpenseList'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *   post:
 *     summary: Crear nuevo gasto
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExpenseBody'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Success'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /expenses/{id}:
 *   get:
 *     summary: Obtener gasto por ID
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del gasto
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Actualizar gasto
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del gasto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExpenseBody'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *   delete:
 *     summary: Eliminar gasto
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del gasto
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
