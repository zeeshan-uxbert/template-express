# Claude Code Configuration

This project is a Node.js Express application with TypeORM, Redis, MongoDB, and various AWS integrations.

## Commands

### Development
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Database
- `npm run typeorm:migrate` - Run TypeORM migrations up
- `npm run typeorm:revert` - Revert TypeORM migrations

### Docker
- `npm run docker:up` - Start Docker containers
- `npm run docker:down` - Stop Docker containers and remove volumes

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

## Architecture

The application follows a modular architecture:

- `src/modules/` - Feature modules (auth, users, etc.)
- `src/config/` - Configuration files
- `src/middlewares/` - Express middlewares
- `src/services/` - Business logic services
- `src/db/` - Database configuration and migrations
- `src/routes/` - Route definitions
- `src/security/` - Authentication and authorization
- `src/clients/` - External service clients (Redis, S3, Strapi)

## Key Technologies

- Express.js (v5.1.0) with ES modules
- TypeORM for database operations
- Mongoose for MongoDB
- Redis for caching
- AWS S3 for file storage
- JWT for authentication
- Swagger for API documentation
- BullMQ for job queues
- Winston/Pino for logging
- Zod for validation

## Environment

The application uses `.env` file for environment variables and includes Docker support for local development.