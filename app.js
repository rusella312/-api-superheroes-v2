import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { specs } from './swagger.js'
import heroController from './controllers/heroController.js'

const app = express()

app.use(express.json())

// Configuración de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API de Superhéroes - Documentación"
}))

app.use('/api', heroController)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
    console.log(`API disponible en: http://localhost:${PORT}/api`)
    console.log(`Documentación Swagger en: http://localhost:${PORT}/api-docs`)
})
