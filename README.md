# API Superhéroes - Juego de Mascotas

## Descripción
API REST para un juego de superhéroes que pueden adoptar y cuidar mascotas. Los superhéroes pueden realizar actividades con sus mascotas como jugar, alimentar, dormir y curar.

## Tecnologías
- Node.js
- Express.js
- MongoDB
- JWT para autenticación

## Estructura del Proyecto
```
api-superheroes/
├── controllers/          # Controladores de la API
├── services/            # Lógica de negocio
├── models/              # Modelos de datos
├── repositories/        # Acceso a datos
├── middleware/          # Middleware de autenticación
├── scripts/            # Scripts de utilidad
└── app.js              # Archivo principal
```

## Endpoints Principales

### Autenticación
- `POST /api/login` - Login de superhéroes

### Héroes
- `GET /api/heroes` - Obtener todos los héroes
- `POST /api/heroes` - Crear nuevo héroe
- `PUT /api/heroes/{id}` - Actualizar héroe
- `DELETE /api/heroes/{id}` - Eliminar héroe

### Mascotas
- `GET /api/pets` - Obtener todas las mascotas
- `POST /api/pets` - Crear nueva mascota
- `POST /api/pets/{id}/adopt` - Adoptar mascota
- `GET /api/pets/{id}` - Obtener mascota por ID
- `DELETE /api/pets/{id}` - Eliminar mascota

### Actividades con Mascotas
- `POST /api/pets/{id}/play` - Jugar con mascota
- `POST /api/pets/{id}/feed` - Alimentar mascota
- `POST /api/pets/{id}/sleep` - Dormir mascota
- `POST /api/pets/{id}/cure` - Curar mascota

## Instalación
```bash
npm install
```

## Ejecución
```bash
npm start
```

## Base de Datos
El proyecto utiliza MongoDB para almacenar héroes y mascotas. 