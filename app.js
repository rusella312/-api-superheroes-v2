import express from 'express'
import cors from 'cors'
import heroController from './controllers/heroController.js'
import petController from './controllers/petController.js'
import activityController from './controllers/activityController.js'
import authController from './controllers/authController.js'
import swaggerUi from 'swagger-ui-express';

const app = express()

app.use(cors());
app.use(express.json())

// URL del servidor dinámica
const serverUrl = process.env.NODE_ENV === 'production' 
  ? 'https://api-superheroes-v2-1.onrender.com'
  : 'http://localhost:3001';

// Documentación completa de la API
const apiDocs = {
  openapi: '3.0.0',
  info: {
    title: 'API Superhéroes - Juego de Mascotas',
    version: '1.0.0',
    description: 'API REST para un juego de superhéroes que pueden adoptar y cuidar mascotas'
  },
  servers: [
    {
      url: serverUrl,
      description: process.env.NODE_ENV === 'production' ? 'Servidor de producción' : 'Servidor de desarrollo'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtenido del login'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  paths: {
    '/api/login': {
      post: {
        tags: ['Autenticación'],
        summary: 'Login de superhéroe',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login exitoso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/heroes': {
      get: {
        tags: ['Héroes'],
        summary: 'Obtener todos los héroes',
        responses: {
          200: {
            description: 'Lista de héroes'
          }
        }
      },
      post: {
        tags: ['Héroes'],
        summary: 'Crear nuevo héroe',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  alias: { type: 'string' },
                  city: { type: 'string' },
                  team: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Héroe creado'
          }
        }
      }
    },
    '/api/heroes/{id}': {
      put: {
        tags: ['Héroes'],
        summary: 'Actualizar héroe',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  alias: { type: 'string' },
                  city: { type: 'string' },
                  team: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Héroe actualizado'
          }
        }
      },
      delete: {
        tags: ['Héroes'],
        summary: 'Eliminar héroe',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Héroe eliminado'
          }
        }
      }
    },
    '/api/pets': {
      get: {
        tags: ['Mascotas'],
        summary: 'Obtener todas las mascotas',
        responses: {
          200: {
            description: 'Lista de mascotas'
          }
        }
      },
      post: {
        tags: ['Mascotas'],
        summary: 'Crear nueva mascota',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string' },
                  superPower: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Mascota creada'
          }
        }
      }
    },
    '/api/pets/{id}': {
      get: {
        tags: ['Mascotas'],
        summary: 'Obtener mascota por ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Mascota encontrada'
          }
        }
      },
      delete: {
        tags: ['Mascotas'],
        summary: 'Eliminar mascota',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Mascota eliminada'
          }
        }
      }
    },
    '/api/pets/{id}/adopt': {
      post: {
        tags: ['Mascotas'],
        summary: 'Adoptar mascota',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Mascota adoptada'
          }
        }
      }
    },
    '/api/pets/by-owner/{name}': {
      get: {
        tags: ['Mascotas'],
        summary: 'Obtener mascotas por dueño',
        parameters: [
          {
            name: 'name',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Lista de mascotas del dueño'
          }
        }
      }
    },
    '/api/pets/{id}/items': {
      post: {
        tags: ['Mascotas'],
        summary: 'Agregar item a mascota',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Item agregado'
          }
        }
      }
    },
    '/api/pets/{id}/play': {
      post: {
        tags: ['Actividades'],
        summary: 'Jugar con mascota',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Actividad completada'
          }
        }
      }
    },
    '/api/pets/{id}/feed': {
      post: {
        tags: ['Actividades'],
        summary: 'Alimentar mascota',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Mascota alimentada'
          }
        }
      }
    },
    '/api/pets/{id}/sleep': {
      post: {
        tags: ['Actividades'],
        summary: 'Dormir mascota',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Mascota durmió'
          }
        }
      }
    },
    '/api/pets/{id}/cure': {
      post: {
        tags: ['Actividades'],
        summary: 'Curar mascota',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Mascota curada'
          }
        }
      }
    }
  }
};

// Rutas de la API
app.use('/api', heroController)
app.use('/api', petController)
app.use('/api', activityController)
app.use('/api', authController)

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocs));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Superhéroes funcionando correctamente',
    endpoints: {
      auth: 'POST /api/login',
      heroes: 'GET,POST,PUT,DELETE /api/heroes',
      pets: 'GET,POST /api/pets',
      activities: 'POST /api/pets/{id}/play,feed,sleep,cure'
    }
  });
});

const PORT = process.env.PORT || 3001
app.listen(PORT, _ => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
    console.log(`Documentación Swagger disponible en: ${serverUrl}/api-docs`)
})
