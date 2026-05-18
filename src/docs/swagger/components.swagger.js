/**
 * @swagger
 * components:
 *   schemas:
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
 *
 *     Type:
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
 *           description: ID unico del tipo
 *         name:
 *           type: string
 *           description: Nombre del tipo
 *         description:
 *           type: string
 *           description: Descripcion detallada del tipo
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creacion
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de ultima actualizacion
 *       example:
 *         id: "a1b2c3d4-e5f6-4748-9a0b-1c2d3e4f5a6b"
 *         name: "Hogar"
 *         description: "Gastos relacionados con el mantenimiento y servicios de la vivienda"
 *         createdAt: "2026-05-05T14:00:00.000Z"
 *         updatedAt: "2026-05-05T14:00:00.000Z"
 *
 *     TypeBody:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del tipo
 *         description:
 *           type: string
 *           description: Descripcion detallada del tipo
 *       example:
 *         name: "Hogar"
 *         description: "Gastos relacionados con el mantenimiento y servicios de la vivienda"
 *
 *     TypeList:
 *       type: object
 *       properties:
 *         count:
 *           type: integer
 *           example: 10
 *         results:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Type'
 *         links:
 *           type: object
 *
 *     Subtype:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - typeId
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID unico del subtipo
 *         name:
 *           type: string
 *           description: Nombre del subtipo
 *         description:
 *           type: string
 *           description: Descripcion detallada del subtipo
 *         typeId:
 *           type: string
 *           format: uuid
 *           description: ID del tipo al que pertenece
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creacion
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de ultima actualizacion
 *       example:
 *         id: "b2c3d4e5-f6a7-4748-9b1c-2d3e4f5a6b7c"
 *         name: "Supermercado"
 *         description: "Compras de alimentos y productos de limpieza"
 *         typeId: "a1b2c3d4-e5f6-4748-9a0b-1c2d3e4f5a6b"
 *         createdAt: "2026-05-05T14:00:00.000Z"
 *         updatedAt: "2026-05-05T14:00:00.000Z"
 *
 *     SubtypeBody:
 *       type: object
 *       required:
 *         - name
 *         - typeId
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del subtipo
 *         description:
 *           type: string
 *           description: Descripcion detallada del subtipo
 *         typeId:
 *           type: string
 *           format: uuid
 *           description: ID del tipo al que pertenece
 *       example:
 *         name: "Supermercado"
 *         description: "Compras de alimentos y productos de limpieza"
 *         typeId: "a1b2c3d4-e5f6-4748-9a0b-1c2d3e4f5a6b"
 *
 *     SubtypeList:
 *       type: object
 *       properties:
 *         count:
 *           type: integer
 *           example: 15
 *         results:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Subtype'
 *         links:
 *           type: object
 *
 *     PaymentMethod:
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
 *           description: ID unico del metodo de pago
 *         name:
 *           type: string
 *           description: Nombre del metodo de pago
 *         description:
 *           type: string
 *           description: Descripcion del metodo de pago
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creacion
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de ultima actualizacion
 *       example:
 *         id: "c3d4e5f6-a7b8-4748-9c2d-3e4f5a6b7c8d"
 *         name: "Transferencia"
 *         description: "Transferencia bancaria directa"
 *         createdAt: "2026-05-05T14:00:00.000Z"
 *         updatedAt: "2026-05-05T14:00:00.000Z"
 *
 *     PaymentMethodBody:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del metodo de pago
 *         description:
 *           type: string
 *           description: Descripcion del metodo de pago
 *       example:
 *         name: "Transferencia"
 *         description: "Transferencia bancaria directa"
 *
 *     PaymentMethodList:
 *       type: object
 *       properties:
 *         count:
 *           type: integer
 *           example: 8
 *         results:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PaymentMethod'
 *         links:
 *           type: object
 *
 *     Expense:
 *       type: object
 *       required:
 *         - id
 *         - date
 *         - amount
 *         - description
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID unico del gasto
 *         date:
 *           type: string
 *           format: date
 *           description: Fecha del gasto
 *         amount:
 *           type: number
 *           format: float
 *           description: Monto del gasto
 *         paymentMethodId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID del metodo de pago
 *         typeId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID del tipo de gasto
 *         subtypeId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID del subtipo de gasto
 *         description:
 *           type: string
 *           description: Descripcion del gasto
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creacion
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de ultima actualizacion
 *       example:
 *         id: "11879de0-4e89-4f7a-b04a-7cbfc8459ef1"
 *         date: "2026-05-05"
 *         amount: 3200.50
 *         paymentMethodId: "c3d4e5f6-a7b8-4748-9c2d-3e4f5a6b7c8d"
 *         typeId: "a1b2c3d4-e5f6-4748-9a0b-1c2d3e4f5a6b"
 *         subtypeId: "b2c3d4e5-f6a7-4748-9b1c-2d3e4f5a6b7c"
 *         description: "Compra semanal"
 *         createdAt: "2026-05-05T14:00:00.000Z"
 *         updatedAt: "2026-05-05T14:00:00.000Z"
 *
 *     ExpenseBody:
 *       type: object
 *       required:
 *         - date
 *         - amount
 *         - description
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           description: Fecha del gasto
 *         amount:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Monto del gasto
 *         paymentMethodId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID del metodo de pago (opcional)
 *         typeId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID del tipo de gasto (opcional)
 *         subtypeId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID del subtipo de gasto (opcional, debe pertenecer al typeId si se especifica)
 *         description:
 *           type: string
 *           description: Descripcion del gasto
 *       example:
 *         date: "2026-05-05"
 *         amount: 3200.50
 *         paymentMethodId: "c3d4e5f6-a7b8-4748-9c2d-3e4f5a6b7c8d"
 *         typeId: "a1b2c3d4-e5f6-4748-9a0b-1c2d3e4f5a6b"
 *         subtypeId: "b2c3d4e5-f6a7-4748-9b1c-2d3e4f5a6b7c"
 *         description: "Compra semanal"
 *
 *     ExpenseList:
 *       type: object
 *       properties:
 *         count:
 *           type: integer
 *           example: 42
 *           description: Total de registros que coinciden con los filtros
 *         results:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Expense'
 *           description: Array de resultados de la pagina actual
 *         links:
 *           type: object
 *           properties:
 *             self:
 *               type: string
 *               example: "http://localhost:3000/v1/expenses?_page=2&_limit=10"
 *             first:
 *               type: string
 *               example: "http://localhost:3000/v1/expenses?_page=1&_limit=10"
 *             prev:
 *               type: string
 *               nullable: true
 *               example: "http://localhost:3000/v1/expenses?_page=1&_limit=10"
 *             next:
 *               type: string
 *               nullable: true
 *               example: "http://localhost:3000/v1/expenses?_page=3&_limit=10"
 *             last:
 *               type: string
 *               example: "http://localhost:3000/v1/expenses?_page=5&_limit=10"
 *
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - lastName
 *         - email
 *         - authenticationId
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID unico del usuario
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *         lastName:
 *           type: string
 *           description: Apellido del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *         authenticationId:
 *           type: string
 *           description: ID externo de autenticacion
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creacion
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de ultima actualizacion
 *       example:
 *         id: "d4e5f6a7-b8c9-4748-9d3e-4f5a6b7c8d9e"
 *         name: "Gaston"
 *         lastName: "Herrera"
 *         email: "gaston@example.com"
 *         authenticationId: "auth0|123456789"
 *         createdAt: "2026-05-05T14:00:00.000Z"
 *         updatedAt: "2026-05-05T14:00:00.000Z"
 *
 *     UserBody:
 *       type: object
 *       required:
 *         - name
 *         - lastName
 *         - email
 *         - authenticationId
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *         lastName:
 *           type: string
 *           description: Apellido del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *         authenticationId:
 *           type: string
 *           description: ID externo de autenticacion
 *       example:
 *         name: "Gaston"
 *         lastName: "Herrera"
 *         email: "gaston@example.com"
 *         authenticationId: "auth0|123456789"
 *
 *     UserList:
 *       type: object
 *       properties:
 *         count:
 *           type: integer
 *           example: 12
 *           description: Total de registros que coinciden con los filtros
 *         results:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         links:
 *           type: object
 */
