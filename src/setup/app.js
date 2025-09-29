import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';

import { features } from '../config/features.js';
import { requestLogger } from '../middlewares/requestLogger.js';
import { requestId } from '../middlewares/requestId.js';
import { i18nMiddleware } from '../middlewares/i18n.js';
import { errorHandler, notFoundHandler } from '../middlewares/error.js';
import { healthRouter } from '../routes/health.js';
import { authModuleRouter } from '../modules/auth/routes/index.js';

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


