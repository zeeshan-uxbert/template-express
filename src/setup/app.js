import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { features } from '../config/features.js';
import { errorHandler, notFoundHandler } from '../middlewares/error.js';
import { i18nMiddleware } from '../middlewares/i18n.js';
import { requestId } from '../middlewares/requestId.js';
import { requestLogger } from '../middlewares/requestLogger.js';
import { authModuleRouter } from '../modules/auth/routes/index.js';
import { healthRouter } from '../routes/health.js';

export async function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(requestId());

  if (features.logging) {
    app.use(requestLogger());
  }

  if (features.i18n) {
    app.use(await i18nMiddleware());
  }

  app.use('/health', healthRouter());

  if (features.auth) app.use('/auth', authModuleRouter());

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
