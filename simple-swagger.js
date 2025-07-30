import express from 'express';
import swaggerUi from 'swagger-ui-express';

const app = express();

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API Superhéroes',
    version: '1.0.0',
    description: 'API de prueba'
  },
  paths: {
    '/test': {
      get: {
        summary: 'Test endpoint',
        responses: {
          200: {
            description: 'OK'
          }
        }
      }
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/test', (req, res) => {
  res.json({ message: 'Test OK' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Servidor funcionando' });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Test server en puerto ${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
}); 