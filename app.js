import express from 'express'
import heroController from './controllers/heroController.js'
import petController from './controllers/petController.js'
import activityController from './controllers/activityController.js'
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express()

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Superhéroes',
      version: '1.0.0',
      description: 'Documentación de la API de superhéroes'
    },
  },
  apis: ['./controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json())
app.use('/api', heroController)
app.use('/api', petController)
app.use('/api', activityController)

const PORT = 3001
app.listen(PORT, _ => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})
