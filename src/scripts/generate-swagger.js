import swaggerJSDoc from 'swagger-jsdoc';
import { writeFileSync } from 'fs';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.js', './src/modules/**/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));
console.log('swagger.json generated!');