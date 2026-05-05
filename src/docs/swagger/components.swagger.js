/**
 * @swagger
 * components:
 *   schemas:
 *     Test:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID unico del test
 *         name:
 *           type: string
 *           description: Nombre del test
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creacion
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de ultima actualizacion
 *       example:
 *         id: "8f5f1bf7-f0d3-46f4-9cf7-f71e47aa4f1a"
 *         name: "Test de ejemplo"
 *         createdAt: "2023-01-01T00:00:00.000Z"
 *         updatedAt: "2023-01-01T00:00:00.000Z"
 *
 *     TestBody:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del test
 *       example:
 *         name: "Test de ejemplo"
 *
 *     TestList:
 *       type: object
 *       properties:
 *         count:
 *           type: integer
 *           example: 95
 *           description: Total de registros que coinciden con los filtros
 *         results:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Test'
 *           description: Array de resultados de la pagina actual
 *         links:
 *           type: object
 *           properties:
 *             self:
 *               type: string
 *               example: "http://localhost:3000/v1/tests?_page=2&_limit=10"
 *               description: URL de la pagina actual
 *             first:
 *               type: string
 *               example: "http://localhost:3000/v1/tests?_page=1&_limit=10"
 *               description: URL de la primera pagina
 *             prev:
 *               type: string
 *               nullable: true
 *               example: "http://localhost:3000/v1/tests?_page=1&_limit=10"
 *               description: URL de la pagina anterior (si existe)
 *             next:
 *               type: string
 *               nullable: true
 *               example: "http://localhost:3000/v1/tests?_page=3&_limit=10"
 *               description: URL de la pagina siguiente (si existe)
 *             last:
 *               type: string
 *               example: "http://localhost:3000/v1/tests?_page=10&_limit=10"
 *               description: URL de la ultima pagina
 *
 *     PaginationQuery:
 *       type: object
 *       properties:
 *         _page:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           description: Numero de pagina
 *         _limit:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *           description: Elementos por pagina
 *         _order:
 *           type: string
 *           example: "name,-createdAt"
 *           description: Orden de los resultados
 */
