import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Superhéroes',
            version: '1.0.0',
            description: 'API REST para gestionar superhéroes con Clean Architecture',
            contact: {
                name: 'API Support',
                email: 'support@superheroes.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3001/api',
                description: 'Servidor de desarrollo'
            }
        ],
        components: {
            schemas: {
                Hero: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único del héroe'
                        },
                        name: {
                            type: 'string',
                            description: 'Nombre real del héroe'
                        },
                        alias: {
                            type: 'string',
                            description: 'Nombre de superhéroe'
                        },
                        city: {
                            type: 'string',
                            description: 'Ciudad donde opera el héroe'
                        },
                        team: {
                            type: 'string',
                            description: 'Equipo al que pertenece'
                        }
                    },
                    required: ['name', 'alias']
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Mensaje de error'
                        }
                    }
                }
            }
        }
    },
    apis: ['./controllers/*.js']
};

export const specs = swaggerJsdoc(options); 