import morgan from 'morgan';
import { logger } from '../setup/logger.js';

export function requestLogger() {
	const stream = { write: (msg) => logger.info(msg.trim()) };
	const skip = () => process.env.NODE_ENV === 'test';
	return morgan(':id :method :url :status :res[content-length] - :response-time ms', { stream, skip });
}


