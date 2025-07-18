import express from 'express'
import cors from 'cors'
import heroController from './controllers/heroController.js'
import petController from './controllers/petController.js'
import activityController from './controllers/activityController.js'
import authController from './controllers/authController.js'
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express()

app.use(cors());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Superhéroes',
      version: '1.0.0',
      description: 'Documentación de la API de superhéroes'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Pet: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            type: { type: 'string' },
            superPower: { type: 'string' },
            ownerId: { type: 'string' },
            felicidad: { type: 'integer' },
            hambre: { type: 'integer' },
            energia: { type: 'integer' },
            limpieza: { type: 'integer' },
            salud: { type: 'string' },
            actividades: {
              type: 'array',
              items: { type: 'object' }
            },
            owner: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                alias: { type: 'string' }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json())
app.use('/api', heroController)
app.use('/api', petController)
app.use('/api', activityController)
app.use('/api', authController)

const PORT = process.env.PORT || 3001
app.listen(PORT, _ => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})
