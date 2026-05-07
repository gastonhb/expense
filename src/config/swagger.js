const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('./environment');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Expense API',
      version: '1.0.0',
      description: 'Api para gestionar gastos',
      contact: {
        name: 'Gastón Herrera Barón'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: `${config.url}:${config.port}/v1`,
        description: 'Development server'
      },
      {
        url: 'https://api.example.com/v1',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token para autenticación'
        }
      },
      responses: {
        Success: {
        },
        Error: {
          description: 'Error en la operación',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'error'
                  },
                  message: {
                    type: 'string',
                    example: 'Descripción del error'
                  },
                  errors: {
                    type: 'array',
                    items: {
                      type: 'object'
                    }
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            }
          }
        },
        ValidationError: {
          description: 'Error de validación',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'error'
                  },
                  message: {
                    type: 'string',
                    example: 'Error de validación'
                  },
                  errors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        code: {
                          type: 'string',
                          example: '400'
                        },
                        name: {
                          type: 'string',
                          example: 'field_name'
                        },
                        message: {
                          type: 'string',
                          example: 'string.empty'
                        }
                      }
                    }
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            }
          }
        },
        NotFound: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'error'
                  },
                  message: {
                    type: 'string',
                    example: 'Recurso no encontrado'
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            }
          }
        },
        Unauthorized: {
          description: 'No autorizado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'error'
                  },
                  message: {
                    type: 'string',
                    example: 'No autorizado'
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            }
          }
        },
        RateLimit: {
          description: 'Demasiadas peticiones',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'error'
                  },
                  message: {
                    type: 'string',
                    example: 'Demasiadas peticiones, intenta más tarde'
                  },
                  retryAfter: {
                    type: 'number',
                    example: 15
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Expenses',
        description: 'Operaciones relacionadas con gastos'
      },
      {
        name: 'PaymentMethods',
        description: 'Operaciones relacionadas con metodos de pago'
      },
      {
        name: 'Types',
        description: 'Operaciones relacionadas con tipos de gastos'
      },
      {
        name: 'Subtypes',
        description: 'Operaciones relacionadas con subtipos de gastos'
      },
      {
        name: 'Health',
        description: 'Endpoints de salud del sistema'
      }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/models/*.js',
    './src/docs/swagger/*.js'
  ]
};

const specs = swaggerJsdoc(options);

// Configuración personalizada de Swagger UI
const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #3b82f6 }
  `,
  customSiteTitle: 'API Template Documentation',
  customfavIcon: '/favicon.ico'
};

module.exports = {
  specs,
  swaggerUi,
  swaggerUiOptions
};
