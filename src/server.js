import 'dotenv/config';
import http from 'http';

import { createApp } from './setup/app.js';
import { logger } from './setup/logger.js';
import { load } from './loaders/index.js';

const port = Number(process.env.PORT || 3000);

async function main() {
	const resources = await load();
	const app = await createApp();
	const server = http.createServer(app);

	server.listen(port, () => {
		logger.info({ port }, 'Server listening');
	});

	const shutdown = async (signal) => {
		logger.info({ signal }, 'Shutting down');
		server.close(() => logger.info('HTTP server closed'));
		try {
			if (resources.redis) await resources.redis.quit();
			if (resources.sql) await resources.sql.destroy();
			if (resources.mongo) await resources.mongo.connection.close(false);
		} catch (e) {
			logger.error('Error during shutdown', { err: e });
		} finally {
			process.exit(0);
		}
	};

	process.on('SIGINT', () => shutdown('SIGINT'));
	process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});


