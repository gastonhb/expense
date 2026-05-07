/**
 * @swagger
 * /payment-methods:
 *   get:
 *     summary: Obtener lista de metodos de pago
 *     tags: [PaymentMethods]
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
 *         description: Lista de metodos de pago
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentMethodList'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *   post:
 *     summary: Crear nuevo metodo de pago
 *     tags: [PaymentMethods]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentMethodBody'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/Success'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /payment-methods/{id}:
 *   get:
 *     summary: Obtener metodo de pago por ID
 *     tags: [PaymentMethods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del metodo de pago
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Actualizar metodo de pago
 *     tags: [PaymentMethods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del metodo de pago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentMethodBody'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *   delete:
 *     summary: Eliminar metodo de pago
 *     tags: [PaymentMethods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del metodo de pago
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
