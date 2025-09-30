# Express Plug-and-Play Template

Production-grade Express.js template with modular, toggleable features. Enable only what you need via environment flags.

## Features

- Auth (JWT guard, sample routes)
- Logging (Winston) + HTTP request logging (Morgan)
- Centralized error handling
- Localization (i18next)
- S3 integration (AWS SDK v2, optional v3 client)
- Redis client and BullMQ queues
- Database: SQL (TypeORM) and NoSQL (Mongoose)
- Strapi API client
- Email service (interface + Nodemailer implementation)
- Notification service (interface + log implementation)
- Linting: ESLint + Prettier

## Project Structure

```
src/
  server.js                 # Entry point
  setup/
    app.js                  # Express app factory, middlewares, routes
    logger.js               # Winston logger
  config/
    features.js             # FEATURE_* toggles
  controllers/
    auth.controller.js
    health.controller.js
  routes/
    auth.js
    health.js
  middlewares/
    error.js
    i18n.js
    requestLogger.js
  security/
    jwtGuard.js
    index.js
  clients/
    s3Client.js
    redisClient.js
    strapiClient.js
  queues/
    bullmq.js
  db/
    typeorm.js
    mongoose.js
    migrations/
      1700000000000-CreateUsers.js
  services/
    email/
      index.js
      nodemailerEmailService.js
    notifications/
      index.js
```

## Getting Started

1. Copy environment file and configure:
   - `cp .env.example .env`
2. Install dependencies:
   - `npm install`
3. Start local databases with Docker (optional):
   - `npm run docker:up`
4. Initialize database and run migrations (if using TypeORM):
   - `npm run db:setup`
   - Or manually: `npm run db:init` then `npm run typeorm:migrate`
5. Start server:
   - `npm run dev`

## Environment Flags (Feature Toggles)

- FEATURE_AUTH=true|false
- FEATURE_LOGGING=true|false
- FEATURE_I18N=true|false
- FEATURE_S3=true|false
- FEATURE_REDIS=true|false
- FEATURE_BULLMQ=true|false
- FEATURE_EMAIL=true|false
- FEATURE_NOTIFICATIONS=true|false
- FEATURE_TYPEORM=true|false
- FEATURE_MONGOOSE=true|false
- FEATURE_STRAPI=true|false

## Key Environment Variables

- PORT, NODE_ENV
- JWT_SECRET, JWT_EXPIRES_IN
- DB\_\* for TypeORM (DB_TYPE, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE)
- MONGO_URI for Mongoose
- REDIS_URL
- AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM
- STRAPI_URL, STRAPI_TOKEN

## Scripts

- `npm run dev` - start with Nodemon and `.env`
- `npm run start` - start without env file
- `npm run db:init` - create database if it doesn't exist
- `npm run db:setup` - initialize DB and run all migrations
- `npm run typeorm:create <MigrationName>` - create new migration
- `npm run typeorm:migrate` / `npm run typeorm:revert` - run/revert migrations
- `npm run docker:up` / `npm run docker:down`
- `npm run lint` / `npm run lint:fix`
- `npm run format`

## Git Hooks (Husky)

- **pre-commit**: Runs Prettier and ESLint on staged files via `lint-staged`
- **pre-push**: Runs full lint check to ensure code quality before push

## Operational Notes

- Request correlation: every request gets an `X-Request-Id`, logged by the HTTP logger.
- Graceful shutdown: `SIGINT`/`SIGTERM` closes HTTP and connected resources (Redis/SQL/Mongo).
- Configure Nodemon in `nodemon.json`.

## Swagger/OpenAPI

Add your OpenAPI spec with `swagger-jsdoc` and mount with `swagger-ui-express`.

## Extending

- Controllers: add new controller modules in `src/controllers/` and mount in `src/routes/`.
- Services: implement the interfaces in `src/services/` and swap implementations via DI or factory.
- Databases: add TypeORM entities, Mongoose models, and wire in `src/loaders/index.js`.
  - TypeORM migrations: place files under `src/db/migrations/` and run scripts.

## Security Notes

- Change `JWT_SECRET` before production.
- Set CORS and Helmet policies per your deployment.

## License

MIT
