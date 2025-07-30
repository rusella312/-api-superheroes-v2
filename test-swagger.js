import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Test API',
      version: '1.0.0',
      description: 'API de prueba',
    },
  },
  apis: [], // sin archivos por ahora
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => {
  res.json({ message: 'Test API funcionando' });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Test server corriendo en puerto ${PORT}`);
  console.log(`Swagger disponible en: http://localhost:${PORT}/api-docs`);
}); 